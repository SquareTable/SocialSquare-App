import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { CredentialsContext } from '../../components/CredentialsContext';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    StyledButton,
    ButtonText,
    SettingsItemImage,
    SettingsItemText,
    SettingsPageItemTouchableOpacity
} from '../screenStylings/styling.js'
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext';
import { ServerUrlContext } from '../../components/ServerUrlContext';
import usePostReducer from '../../hooks/usePostReducer';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePost from '../../components/Posts/ImagePost';
import ThreadPost from '../../components/Posts/ThreadPost';
import PollPost from '../../components/Posts/PollPost';
import ThreeDotMenuActionSheet from '../../components/Posts/ThreeDotMenuActionSheet';
import SocialSquareLogo_B64_png from '../../assets/SocialSquareLogo_Base64_png';

const PostUpvoteDownvoteActivity = ({navigation, route}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {colors, indexNum} = useTheme()
    const {postFormat, voteType} = route.params;
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [feed, dispatch] = usePostReducer();
    const [errorFetching, setErrorFetching] = useState(null)

    //any image honestly
    async function getImage(imageKey) {
        return await axios.get((serverUrl + '/getImageOnServer/' + imageKey))
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            console.error(error);
            return SocialSquareLogo_B64_png;
        })
    }

    const loadPosts = () => {
        dispatch({type: 'startLoad'})
        setErrorFetching(null)
        
        const url = serverUrl + '/tempRoute/getUserActivity';
        const toSend = {
            skip: feed.posts.length,
            voteType: voteType === 'Upvote' ? 'up' : 'down',
            postFormat
        }

        axios.post(url, toSend).then(result => {
            const response = result.data;
            const {data} = response;

            if (data.length === 0) {
                dispatch({type: 'addPosts', posts: data})
                return 
            }

            const posts = []

            data.forEach((item, index, dataArray) => {
                async function loadImages() {
                    const post = dataArray[index];

                    const creatorPfpB64 = post.creatorPfpKey ? await getImage(post.creatorPfpKey) : SocialSquareLogo_B64_png;

                    if (postFormat === "Image") {
                        const imageB64 = await getImage(post.imageKey)

                        posts.push({...post, imageB64, creatorPfpB64})
                    } else if (postFormat === "Poll") {
                        posts.push({...post, pfpB64: creatorPfpB64})
                    } else if (postFormat === "Thread") {
                        const imageInThreadB64 = post.threadImageKey ? await getImage(post.threadImageKey) : null;

                        posts.push({...post, imageInThreadB64, creatorImageB64: creatorPfpB64})
                    } else {
                        console.error('Invalid post format')
                    }

                    
                    if (posts.length === data.length) {
                        dispatch({type: 'addPosts', posts})
                    }
                }
                loadImages()
            })
        }).catch(error => {
            console.error(error)
            setErrorFetching(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection and try again.')
            dispatch({type: 'stopLoad'})
        })
    }

    useEffect(() => {
        loadPosts();
    }, [])

    return (
        <>
            <ThreeDotMenuActionSheet dispatch={dispatch} threeDotsMenu={feed.threeDotsMenu}/>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{postFormat} Post {voteType}s</TestText>
            </ChatScreen_Title>
            {
                feed.posts.length !== 0 ?
                    <FlatList
                        data={feed.posts}
                        keyExtractor={item => item._id}
                        renderItem={({item, index}) => {
                            if (postFormat === 'Image') {
                                return <ImagePost post={item} index={index} dispatch={dispatch} colors={colors} colorsIndexNum={indexNum}/>
                            }

                            if (postFormat === 'Thread') {
                                return <ThreadPost post={item} index={index} dispatch={dispatch} colors={colors} colorsIndexNum={indexNum}/>
                            }

                            return <PollPost post={item} index={index} dispatch={dispatch} colors={colors} colorsIndexNum={indexNum}/>
                        }}
                        ListFooterComponent={
                            <>
                                {
                                    errorFetching ?
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
                                            <Text style={{color: colors.errorColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                                            <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginVertical: 20}}>{errorFetching}</Text>
                                            <TouchableOpacity onPress={loadPosts}>
                                                <Ionicons name="reload" size={50} color={colors.errorColor} />
                                            </TouchableOpacity>
                                        </View>
                                    : feed.loadingFeed ?
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                            <ActivityIndicator size="large" color={colors.brand} />
                                        </View>
                                    : null
                                }
                            </>
                        }
                        onEndReachedThreshold={3}
                        onEndReached = {({distanceFromEnd})=>{
                            if (distanceFromEnd > 0) {
                                console.log('End of the feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                if (feed.loadingFeed == false) {
                                    loadPosts()
                                }
                            }
                        }}
                        ItemSeparatorComponent={<View style={{height: 10}}/>}
                    />
                : errorFetching ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
                        <Text style={{color: colors.errorColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                        <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginVertical: 20}}>{errorFetching}</Text>
                        <TouchableOpacity onPress={loadPosts}>
                            <Ionicons name="reload" size={50} color={colors.errorColor} />
                        </TouchableOpacity>
                    </View>
                : feed.loadingFeed ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={colors.brand} />
                    </View>
                :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginHorizontal: 10}}>You haven't {voteType.toLowerCase()}d any {postFormat.toLowerCase()} posts.</Text>
                    </View>
            }
        </>
    )
}

export default PostUpvoteDownvoteActivity;

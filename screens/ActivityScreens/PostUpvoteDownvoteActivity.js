import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { CredentialsContext } from '../../components/CredentialsContext';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext';
import { ServerUrlContext } from '../../components/ServerUrlContext';
import usePostReducer from '../../hooks/usePostReducer';
import axios, { CanceledError } from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePost from '../../components/Posts/ImagePost';
import ThreadPost from '../../components/Posts/ThreadPost';
import PollPost from '../../components/Posts/PollPost';
import ThreeDotMenuActionSheet from '../../components/Posts/ThreeDotMenuActionSheet';
import SocialSquareLogo_B64_png from '../../assets/SocialSquareLogo_Base64_png';
import ParseErrorMessage from '../../components/ParseErrorMessage';
import TopNavBar from '../../components/TopNavBar.js';

const PostUpvoteDownvoteActivity = ({navigation, route}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {colors, indexNum} = useTheme()
    const {postFormat, voteType} = route.params;
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [feed, dispatch] = usePostReducer();
    const [errorFetching, setErrorFetching] = useState(null)
    const lastItemIdRef = useRef(null)
    const abortController = useRef(new AbortController())

    //any image honestly
    async function getImage(imageKey) {
        return await axios.get((serverUrl + '/getImageOnServer/' + imageKey), {signal: abortController.current.signal})
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            if (!(error instanceof CanceledError)) {
                //The request has not been intentionally canceled
                console.error(error);
                return SocialSquareLogo_B64_png;
            }
        })
    }

    const loadPosts = () => {
        if (!feed.noMorePosts) {
            dispatch({type: 'startLoad'})
            setErrorFetching(null)
            
            const url = serverUrl + '/tempRoute/getUserActivity';
            const toSend = {
                skip: lastItemIdRef.current || undefined,
                voteType: voteType === 'Upvote' ? 'up' : 'down',
                postFormat
            }

            axios.post(url, toSend, {signal: abortController.current.signal}).then(result => {
                const response = result.data;
                const {data} = response;
                const {items, lastItemId, noMoreItems} = data;

                if (items.length === 0) {
                    dispatch({type: 'noMorePosts'})
                }

                lastItemIdRef.current = lastItemId

                const processedPosts = []

                items.forEach((item, index, dataArray) => {
                    async function loadImages() {
                        const post = dataArray[index];

                        const creatorPfpB64 = post.creatorPfpKey ? await getImage(post.creatorPfpKey) : SocialSquareLogo_B64_png;

                        if (postFormat === "Image") {
                            const imageB64 = await getImage(post.imageKey)

                            processedPosts.push({...post, imageB64, creatorPfpB64})
                        } else if (postFormat === "Poll") {
                            processedPosts.push({...post, pfpB64: creatorPfpB64})
                        } else if (postFormat === "Thread") {
                            const imageInThreadB64 = post.threadImageKey ? await getImage(post.threadImageKey) : null;

                            processedPosts.push({...post, imageInThreadB64, creatorImageB64: creatorPfpB64})
                        } else {
                            console.error('Invalid post format')
                        }

                        
                        if (processedPosts.length === items.length) {
                            dispatch({type: 'addPosts', posts: processedPosts})
                            if (noMoreItems) {
                                dispatch({type: 'noMorePosts'})
                            }
                        }
                    }
                    loadImages()
                })
            }).catch(error => {
                if (!(error instanceof CanceledError)) {
                    console.error(error)
                    setErrorFetching(ParseErrorMessage(error))
                    dispatch({type: 'stopLoad'})
                }
            })
        }
    }

    useEffect(() => {
        loadPosts();

        return () => {
            console.warn('Aborting PostUpvoteDownvoteActivity.js network requests')
            abortController.current.abort();
        }
    }, [])

    return (
        <>
            <ThreeDotMenuActionSheet dispatch={dispatch} threeDotsMenu={feed.threeDotsMenu}/>
            <TopNavBar screenName={postFormat + " Post " + voteType + 's'}/>
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
                                    : feed.noMorePosts ?
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
                                            <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>No more posts to show</Text>
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

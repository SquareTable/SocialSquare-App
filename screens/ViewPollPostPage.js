import React, {useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling';
import { Image, ScrollView } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import PollWithVotes from '../components/Posts/PollWithVotes';
import usePostReducer from '../hooks/usePostReducer';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';
import Comments from '../components/Comments/Comments';


const ViewPollPostPage = ({route, navigation}) => {
    const [postReducer, dispatch] = usePostReducer();
    const [deleted, setDeleted] = useState(false)
    const {colors, dark, colorsIndexNum} = useTheme();
    const { post, isOwner } = route.params;
    const StatusBarHeight = useContext(StatusBarHeightContext);

    useEffect(() => {
        dispatch({type: 'addPosts', posts: [post]})
    }, [])

    const isFocused = useIsFocused();

    const onDeleteCallback = () => {
        if (isFocused) {
            navigation.goBack();
        } else {
            setDeleted(true)
        }
    }

    useEffect(() => {
        if (isFocused && deleted) navigation.goBack();
    }, [isFocused])

    return(
        <>
            <ThreeDotMenuActionSheet dispatch={dispatch} threeDotsMenu={postReducer.threeDotsMenu}/>
            <StatusBar style={colors.StatusBarColor}/>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{(post.creatorDisplayName ? post.creatorDisplayName : post.creatorName) || 'ERROR'}'s poll</TestText>
            </ChatScreen_Title>
            {postReducer.posts.length > 0 ? 
                <ScrollView>
                    <PollWithVotes colors={colors} dispatch={dispatch} index={0} post={postReducer.posts[0]} isOwner={isOwner} colorsIndexNum={colorsIndexNum} onDeleteCallback={onDeleteCallback}/>
                    <Comments postId={postReducer.posts[0]._id} postFormat="Poll"/>
                </ScrollView>
            : null}
        </>
    );
}

export default ViewPollPostPage;
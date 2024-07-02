import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused, useTheme } from '@react-navigation/native';
import PollWithVotes from '../components/Posts/PollWithVotes';
import usePostReducer from '../hooks/usePostReducer';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';
import Comments from '../components/Comments/Comments';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';
import TopNavBar from '../components/TopNavBar.js';


const ViewPollPostPage = ({route, navigation}) => {
    const [postReducer, dispatch] = usePostReducer();
    const [deleted, setDeleted] = useState(false)
    const {colors, dark, colorsIndexNum} = useTheme();
    const { post, isOwner } = route.params;

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
            <TopNavBar screenName={((post.creatorDisplayName ? post.creatorDisplayName : post.creatorName) || 'ERROR') + "'s poll"}/>
            {postReducer.posts.length > 0 ? 
                <KeyboardAvoidingScrollView>
                    <PollWithVotes colors={colors} dispatch={dispatch} index={0} post={postReducer.posts[0]} isOwner={isOwner} colorsIndexNum={colorsIndexNum} onDeleteCallback={onDeleteCallback}/>
                    <Comments postId={postReducer.posts[0]._id} postFormat="Poll"/>
                </KeyboardAvoidingScrollView>
            : null}
        </>
    );
}

export default ViewPollPostPage;
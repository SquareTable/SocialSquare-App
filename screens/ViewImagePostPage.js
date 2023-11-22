import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused, useTheme } from '@react-navigation/native';
import usePostReducer from '../hooks/usePostReducer';
import ImagePost from '../components/Posts/ImagePost';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';
import Comments from '../components/Comments/Comments';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';
import TopNavBar from '../components/TopNavBar.js';


const ViewImagePostPage = ({route, navigation}) => {
    const [postState, dispatchPost] = usePostReducer()
    const {post, isOwner} = route.params;
    const [deleted, setDeleted] = useState(false)

    useEffect(() => {
        dispatchPost({type: 'addPosts', posts: [post]})
    }, [])

    const {colors, indexNum} = useTheme()

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
            <ThreeDotMenuActionSheet dispatch={dispatchPost} threeDotsMenu={postState.threeDotsMenu}/>
            <StatusBar style={colors.StatusBarColor}/>
            <TopNavBar screenName={(post.creatorDisplayName ? post.creatorDisplayName : post.creatorName) + "'s post"}/>
            {postState.posts.length > 0 ? 
                <KeyboardAvoidingScrollView>
                    <ImagePost post={postState.posts[0]} index={0} isOwner={isOwner} colors={colors} dispatch={dispatchPost} colorsIndexNum={indexNum} onDeleteCallback={onDeleteCallback}/>
                    <Comments postFormat="Image" postId={postState.posts[0]._id}/>
                </KeyboardAvoidingScrollView>
            : null}
        </>
    );
}

export default ViewImagePostPage;
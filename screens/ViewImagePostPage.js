import React, {useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling';
import { Image } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import usePostReducer from '../hooks/usePostReducer';
import ImagePost from '../components/Posts/ImagePost';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';
import Comments from '../components/Comments/Comments';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';


const ViewImagePostPage = ({route, navigation}) => {
    const [postState, dispatchPost] = usePostReducer()
    const {post, isOwner} = route.params;
    const [deleted, setDeleted] = useState(false)
    const StatusBarHeight = useContext(StatusBarHeightContext);

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
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{post.creatorDisplayName ? post.creatorDisplayName : post.creatorName}'s post</TestText>
            </ChatScreen_Title>
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
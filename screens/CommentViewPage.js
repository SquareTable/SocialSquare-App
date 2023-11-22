import { useContext, useState, useEffect } from 'react';
import useCommentReducer from '../hooks/useCommentReducer';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import Comment from '../components/Comments/CommentItem';
import Comments from '../components/Comments/Comments';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling';
import { Image } from 'react-native';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';

const CommentViewPage = ({navigation, route}) => {
    const {comment} = route.params || {};
    const [commentReducer, commentDispatch] = useCommentReducer();
    const {colors} = useTheme();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [deleted, setDeleted] = useState(false);
    const isFocused = useIsFocused();

    const onDeleteCallback = (data) => {
        if (data.parentDeleted) {
            if (isFocused) {
                navigation.goBack()
            } else {
                setDeleted(true)
            }
        }
    }

    useEffect(() => {
        commentDispatch({type: 'addComments', comments: [comment]})
    }, [])

    useEffect(() => {
        if (deleted && isFocused) {
            navigation.goBack()
        }
    }, [isFocused])

    return (
        <>
            <ThreeDotMenuActionSheet dispatch={commentDispatch} threeDotsMenu={commentReducer.threeDotsMenu}/>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{comment.deleted ? 'Deleted' : ((comment.commenterDisplayName || comment.commenterName || 'Error occurred') + "'s")} comment</TestText>
            </ChatScreen_Title>
            <KeyboardAvoidingScrollView>
                {commentReducer.comments.length > 0 ?
                    <>
                        <Comment comment={commentReducer.comments[0]} index={0} onDeleteCallback={onDeleteCallback} dispatch={commentDispatch}/>
                        <Comments postId={commentReducer.comments[0]._id} postFormat="Comment" onDeleteCallback={onDeleteCallback}/>
                    </>
                : null}
            </KeyboardAvoidingScrollView>
        </>
    )
}

export default CommentViewPage;
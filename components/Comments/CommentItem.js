import { Component, useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import {
    CommentsContainer,
    CommentsHorizontalView,
    CommentsVerticalView,
    CommenterIcon,
    CommentIcons,
    VoteText,
    CommenterName,
    CommentText
} from '../../screens/screenStylings/styling.js'
import { getTimeFromUTCMS } from '../../libraries/Time.js'
import { useNavigation, useTheme } from '@react-navigation/native'
import { CredentialsContext } from '../CredentialsContext.js'

class CommentClass extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const upvotesAreSame = nextProps.comment.commentUpVotes === this.props.comment.commentUpVotes;
        const changingVoteIsSame = nextProps.comment.changingVote === this.props.comment.changingVote;
        const deletingIsSame = nextProps.comment.deleting === this.props.comment.deleting;
        const commentIdIsSame = nextProps.comment.commentId === this.props.comment.commentId;
        const userIdIsSame = nextProps.userId === this.props.userId;

        if (colorsAreSame && upvotesAreSame && changingVoteIsSame && deletingIsSame && commentIdIsSame && userIdIsSame) return true;

        return false;
    }

    runIfAuthenticated = (func) => {
        return () => {
            if (this.props.userId === 'SSGUEST' || !this.props.userId) {
                this.props.navigation.navigate('ModalLoginScreen', {modal: true})
            } else {
                func()
            }
        }
    }

    openThreeDotsMenu = this.runIfAuthenticated(() => {
        if (this.props.comment.isOwner !== true && this.props.comment.isOwner !== false) {
            alert("isOwner is not true or false. An error has occured.")
            return
        }

        this.props.dispatch({
            type: 'showMenu',
            postId: this.props.comment._id,
            postFormat: 'Comment',
            isOwner: this.props.comment.isOwner,
            postIndex: this.props.index,
            onDeleteCallback: this.props.onDeleteCallback
        })
    })

    render() {
        return (
            <CommentsContainer>
                <CommentsHorizontalView>
                    <CommentsVerticalView alongLeft={true}>
                        <TouchableOpacity>
                            <CommenterIcon source={{uri: this.props.comment.commenterImageB64}}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <CommentIcons style={{tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <VoteText style={{color: this.props.colors.tertiary}}>
                                {this.props.comment.commentUpVotes}
                            </VoteText>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <CommentIcons style={{tintColor: this.props.colors.tertiary}} downVoteButton={true} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                        </TouchableOpacity>
                    </CommentsVerticalView>
                    <CommentsVerticalView>
                        <TouchableOpacity>
                            <CommenterName style={{color: this.props.colors.tertiary}} displayName={true}>{this.props.comment.commenterDisplayName}</CommenterName>
                            <CommenterName>@{this.props.comment.commenterName}</CommenterName>
                        </TouchableOpacity>
                        <CommentText style={{color: this.props.colors.tertiary}}>{this.props.comment.commentsText}</CommentText>
                    </CommentsVerticalView>
                </CommentsHorizontalView>
                <CommentsHorizontalView bottomIcons={true}>
                    <CommentsVerticalView alongLeft={true}>
                        <TouchableOpacity onPress={this.openThreeDotsMenu}>
                            <CommentIcons style={{tintColor: this.props.colors.tertiary}} source={require('../../assets/img/ThreeDots.png')}/>
                        </TouchableOpacity>
                    </CommentsVerticalView>
                    <CommentsVerticalView datePosted={true}>
                        <VoteText style={{color: this.props.colors.tertiary}}>
                            {getTimeFromUTCMS(this.props.comment.datePosted)}
                        </VoteText>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate("CommentViewPage", {commentId: this.props.comment.commentId, postId: this.props.postId, postFormat: this.props.postFormat})}}>
                            <VoteText style={{color: this.props.colors.brand}}>
                                {this.props.comment.commentReplies} replies
                            </VoteText>
                        </TouchableOpacity>
                    </CommentsVerticalView>
                    <CommentsVerticalView alongLeft={true}>
                        <TouchableOpacity>
                            <CommentIcons style={{tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/107-reply.png')}/>
                        </TouchableOpacity>
                    </CommentsVerticalView>
                </CommentsHorizontalView>
            </CommentsContainer>
        )
    }
}

const Comment = (props) => {
    const {colors, colorsIndexNum} = useTheme();
    const navigation = useNavigation();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {_id} = storedCredentials;

    const commentProps = {
        comment: props.comment,
        postId: props.postId,
        postFormat: props.postFormat,
        colors,
        colorsIndexNum,
        navigation,
        index: props.index,
        onDeleteCallback: typeof props.onDeleteCallback === 'function' ? props.onDeleteCallback : () => {},
        userId: _id
    }

    return <CommentClass {...commentProps}/>
}

export default Comment;
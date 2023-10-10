import { Component } from 'react'
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
import { useTheme } from '@react-navigation/native'

class CommentClass extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <CommentsContainer>
                <CommentsHorizontalView>
                    <CommentsVerticalView alongLeft={true}>
                        <TouchableOpacity>
                            <CommenterIcon source={{uri: this.props.comment.commenterImageB64}}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <CommentIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <VoteText style={{color: this.props.colors.tertiary}}>
                                {this.props.comment.commentUpVotes}
                            </VoteText>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <CommentIcons downVoteButton={true} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
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
                        <TouchableOpacity>
                            <CommentIcons source={require('../../assets/img/ThreeDots.png')}/>
                        </TouchableOpacity>
                    </CommentsVerticalView>
                    <CommentsVerticalView datePosted={true}>
                        <VoteText style={{color: this.props.colors.tertiary}}>
                            {getTimeFromUTCMS(this.props.comment.datePosted)}
                        </VoteText>
                        <TouchableOpacity onPress={() => {navigation.navigate("CommentViewPage", {commentId: this.props.comment.commentId, postId: this.props.postId, postFormat: this.props.postFormat})}}>
                            <VoteText style={{color: this.props.colors.brand}}>
                                {this.props.comment.commentReplies} replies
                            </VoteText>
                        </TouchableOpacity>
                    </CommentsVerticalView>
                    <CommentsVerticalView alongLeft={true}>
                        <TouchableOpacity>
                            <CommentIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/107-reply.png')}/>
                        </TouchableOpacity>
                    </CommentsVerticalView>
                </CommentsHorizontalView>
            </CommentsContainer>
        )
    }
}

const Comment = (props) => {
    const {colors, colorsIndexNum} = useTheme()

    const commentProps = {
        comment: props.comment,
        postId: props.postId,
        postFormat: props.postFormat,
        colors,
        colorsIndexNum
    }

    return <CommentClass {...commentProps}/>
}

export default Comment;
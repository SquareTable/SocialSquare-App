import { Component, useContext } from 'react'
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native'
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
import { ServerUrlContext } from '../ServerUrlContext.js'
import ParseErrorMessage from '../ParseErrorMessage.js'
import axios from 'axios'

class CommentClass extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const votesAreSame = nextProps.comment.votes === this.props.comment.votes;
        const changingVoteIsSame = nextProps.comment.changingVote === this.props.comment.changingVote;
        const deletingIsSame = nextProps.comment.deleting === this.props.comment.deleting;
        const commentIdIsSame = nextProps.comment._id === this.props.comment._id;
        const userIdIsSame = nextProps.userId === this.props.userId;
        const deletedIsSame = nextProps.comment.deleted === this.props.comment.deleted;

        if (colorsAreSame && votesAreSame && changingVoteIsSame && deletingIsSame && commentIdIsSame && userIdIsSame && deletedIsSame) return false;

        return true;
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
            commentIndex: this.props.index,
            onDeleteCallback: this.props.onDeleteCallback
        })
    })

    neutralVote = this.runIfAuthenticated(() => {
        if (!this.props.comment.changingVote) {
            this.props.dispatch({type: 'startChangingVote', commentIndex: this.props.index})

            const voteToRemove = this.props.comment.upvoted ? 'Up' : 'Down';

            const url = `${this.props.serverUrl}/tempRoute/removevoteoncomment`
            const toSend = {
                commentId: this.props.comment._id,
                voteType: voteToRemove
            }

            axios.post(url, toSend).then(() => {
                this.props.dispatch({type: 'neutralVote', commentIndex: this.props.index})
            }).catch(error => {
                console.error(error)
                this.props.dispatch({type: 'stopChangingVote', commentIndex: this.props.index})
                alert('An error occurred while removing vote: ' + ParseErrorMessage(error))
            })
        }
    })

    upvote = this.runIfAuthenticated(() => {
        if (!this.props.comment.changingVote) {
            this.props.dispatch({type: 'startChangingVote', commentIndex: this.props.index})

            const url = `${this.props.serverUrl}/tempRoute/voteoncomment`
            const toSend = {
                commentId: this.props.comment._id,
                voteType: "Up"
            }

            axios.post(url, toSend).then(() => {
                this.props.dispatch({type: 'upVote', commentIndex: this.props.index})
            }).catch(error => {
                console.error(error)
                this.props.dispatch({type: 'stopChangingVote', commentIndex: this.props.index})
                alert('An error occurred while upvoting comment: ' + ParseErrorMessage(error))
            })
        }
    })

    downvote = this.runIfAuthenticated(() => {
        if (!this.props.comment.changingVote) {
            this.props.dispatch({type: 'startChangingVote', commentIndex: this.props.index})

            const url = `${this.props.serverUrl}/tempRoute/voteoncomment`
            const toSend = {
                commentId: this.props.comment._id,
                voteType: "Down"
            }

            axios.post(url, toSend).then(() => {
                this.props.dispatch({type: 'downVote', commentIndex: this.props.index})
            }).catch(error => {
                console.error(error)
                this.props.dispatch({type: 'stopChangingVote', commentIndex: this.props.index})
                alert('An error occurred while downvoting comment: ' + ParseErrorMessage(error))
            })
        }
    })

    navigateToCommentViewPage = () => {
        this.props.navigation.navigate("CommentViewPage", {comment: this.props.comment})
    }

    render() {
        return (
            <>
                {this.props.comment.deleted ?
                    <CommentsContainer style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
                        <Text style={{color: this.props.colors.tertiary, fontSize: 20}}>[Deleted]</Text>
                        <Text style={{color: this.props.colors.tertiary, fontSize: 14}}>Posted {getTimeFromUTCMS(this.props.comment.datePosted)}</Text>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate("CommentViewPage", {comment: this.props.comment})}}>
                            <VoteText style={{color: this.props.colors.brand}}>
                                {this.props.comment.replies} {this.props.comment.replies === 1 ? 'reply' : 'replies'}
                            </VoteText>
                        </TouchableOpacity>
                    </CommentsContainer>
                :
                    <>
                        {this.props.comment.deleting ?
                            <View style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 15}}>
                                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>Deleting...</Text>
                                <ActivityIndicator color='#FFFFFF' size="large"/>
                            </View>
                        : null}
                        <CommentsContainer>
                            <CommentsHorizontalView>
                                <CommentsVerticalView alongLeft={true}>
                                    <TouchableOpacity>
                                        <CommenterIcon source={{uri: this.props.comment.commenterImageB64}}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.comment.upvoted ? this.neutralVote() : this.upvote()}>
                                        <CommentIcons style={{tintColor: this.props.comment.upvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                    </TouchableOpacity>
                                    {this.props.comment.changingVote ?
                                        <ActivityIndicator color={this.props.colors.brand} size="small"/>
                                    :
                                        <VoteText style={{color: this.props.colors.tertiary}}>
                                            {this.props.comment.votes}
                                        </VoteText>
                                    }
                                    <TouchableOpacity onPress={() => this.props.comment.downvoted ? this.neutralVote() : this.downvote()}>
                                        <CommentIcons style={{tintColor: this.props.comment.downvoted ? this.props.colors.brand : this.props.colors.tertiary}} downVoteButton={true} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                    </TouchableOpacity>
                                </CommentsVerticalView>
                                <CommentsVerticalView>
                                    <TouchableOpacity>
                                        <CommenterName style={{color: this.props.colors.tertiary}} displayName={true}>{this.props.comment.commenterDisplayName}</CommenterName>
                                        <CommenterName>@{this.props.comment.commenterName}</CommenterName>
                                    </TouchableOpacity>
                                    <CommentText style={{color: this.props.colors.tertiary}}>{this.props.comment.text}</CommentText>
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
                                    <TouchableOpacity onPress={this.navigateToCommentViewPage}>
                                        <VoteText style={{color: this.props.colors.brand}}>
                                            {this.props.comment.replies} {this.props.comment.replies === 1 ? 'reply' : 'replies'}
                                        </VoteText>
                                    </TouchableOpacity>
                                </CommentsVerticalView>
                                <CommentsVerticalView alongLeft={true}>
                                    <TouchableOpacity onPress={this.navigateToCommentViewPage}>
                                        <CommentIcons style={{tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/107-reply.png')}/>
                                    </TouchableOpacity>
                                </CommentsVerticalView>
                            </CommentsHorizontalView>
                        </CommentsContainer>
                    </>
                }
            </>
        )
    }
}

const Comment = (props) => {
    const {colors, colorsIndexNum} = useTheme();
    const navigation = useNavigation();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {_id} = storedCredentials;
    const {serverUrl} = useContext(ServerUrlContext);

    const commentProps = {
        comment: props.comment,
        colors,
        colorsIndexNum,
        navigation,
        index: props.index,
        onDeleteCallback: typeof props.onDeleteCallback === 'function' ? props.onDeleteCallback : () => {},
        userId: _id,
        dispatch: props.dispatch,
        serverUrl
    }

    return <CommentClass {...commentProps}/>
}

export default Comment;
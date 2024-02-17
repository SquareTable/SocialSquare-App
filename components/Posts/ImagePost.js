import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { Component, useContext } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Image, Text } from 'react-native';
import {
    PostsHorizontalView,
    PostsVerticalView,
    PostsIconFrame,
    PostsIcons,
    PostCreatorIcon,
    SubTitle,
    MultiMediaPostFrame,
    PostHorizontalView,
    ImagePostTextFrame
} from '../../screens/screenStylings/styling.js'
import { CredentialsContext } from '../CredentialsContext.js';
import { ServerUrlContext } from '../ServerUrlContext.js';
import { getTimeFromUTCMS } from '../../libraries/Time.js';

class ImagePost extends Component {
    constructor(props) {
        super(props);
        console.log('Comments - Logged from ImagePost component:', this.props.post.comments)

        if (props.useRawImages && typeof props.post.imageKey !== 'string') {
            console.warn('this.props.post.imageKey for ImagePost is not a string yet useRawImages is set to true - Falling back on base64 encoded image')
        }

        if (props.useRawImages && typeof props.post.creatorPfpKey !== 'string') {
            console.warn('this.props.post.creatorPfpKey for ImagePost is not a string yet useRawImsges is set to true - Falling back on base64 encoded image')
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const upvoteIsSame = nextProps.post.upvoted === this.props.post.upvoted;
        const downvoteIsSame = nextProps.post.downvoted === this.props.post.downvoted;
        const changingVoteIsSame = nextProps.post.changingVote === this.props.post.changingVote;
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const imageKeyIsSame = nextProps.post.imageKey === this.props.post.imageKey;
        const deletingIsSame = nextProps.post.deleting === this.props.post.deleting;
        const profilePictureIsSame = nextProps.post.creatorPfpB64 === this.props.post.creatorPfpB64;
        const userIdIsSame = nextProps.userId === this.props.userId;

        if (upvoteIsSame && downvoteIsSame && changingVoteIsSame && colorsAreSame && imageKeyIsSame && deletingIsSame && profilePictureIsSame && userIdIsSame) return false;

        return true;
    }

    handleStartVoteChange = () => {
        this.props.dispatch({
            type: 'startChangingVote',
            postIndex: this.props.index
        })
    }

    handleStopVoteChange = () => {
        this.props.dispatch({
            type: 'stopChangingVote',
            postIndex: this.props.index
        })
    }

    runIfAuthenticated = (func) => {
        return (...args) => {
            if (this.props.userId === 'SSGUEST' || !this.props.userId) {
                this.props.navigation.navigate('ModalLoginScreen', {modal: true})
            } else {
                func(...args)
            }
        }
    }

    upvote = this.runIfAuthenticated(() => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange()
            const url = this.props.serverUrl + '/tempRoute/voteonpost';
            const toSend = {postId: this.props.post._id, postFormat: "Image", voteType: "Up"}

            axios.post(url, toSend).then(() => {
                this.props.dispatch({
                    type: 'upVote',
                    postIndex: this.props.index
                })
            }).catch(error => {
                this.handleStopVoteChange()
                console.error(error)
            })
        }
    })

    downvote = this.runIfAuthenticated(() => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange()
            const url = this.props.serverUrl + '/tempRoute/voteonpost';
            const toSend = {postId: this.props.post._id, postFormat: "Image", voteType: "Down"}

            axios.post(url, toSend).then(() => {
                this.props.dispatch({
                    type: 'downVote',
                    postIndex: this.props.index
                })
            }).catch(error => {
                this.handleStopVoteChange()
                console.error(error)
            })
        }
    })

    removeVote = this.runIfAuthenticated((voteType) => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange();
            const url = this.props.serverUrl + '/tempRoute/removevoteonpost';
            const toSend = {postId: this.props.post._id, postFormat: "Image", voteType}

            axios.post(url, toSend).then(() => {
                this.props.dispatch({
                    type: 'neutralVote',
                    postIndex: this.props.index
                })
            }).catch(error => {
                this.handleStopVoteChange()
                console.error(error)
            })
        }
    })

    navigateToFullscreen = () => {
        this.props.navigation.navigate("ViewImagePostPage", {
            post: this.props.post,
            isOwner: this.props.isOwner
        })
    }

    openThreeDotsMenu = this.runIfAuthenticated(() => {
        if (this.props.post.isOwner !== true && this.props.post.isOwner !== false) {
            alert("isOwner is not true or false. An error has occured.")
            return
        }

        this.props.dispatch({
            type: 'showMenu',
            postId: this.props.post._id,
            postFormat: 'Image',
            isOwner: this.props.post.isOwner,
            postIndex: this.props.index,
            onDeleteCallback: this.props.onDeleteCallback
        })
    })

    navigateToProfileScreen = () => {
        this.props.navigation.push('ProfilePages', {pubId: this.props.post.creatorPublicId})
    }

    navigateToVotesViewPage = () => {
        this.props.navigation.navigate('VotesViewPage', {postId: this.props.post._id, postFormat: 'Image'})
    }

    render() {
        return (
            <>
                {this.props.post.deleting &&
                    <View style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 15}}>
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>Deleting...</Text>
                        <ActivityIndicator color='#FFFFFF' size="large"/>
                    </View>
                }
                <View style={{backgroundColor: this.props.colors.borderColor, borderRadius: 15}}>
                    <PostsHorizontalView style={{marginLeft: '5%', borderBottomWidth: 3, borderColor: this.props.colors.darkLight, width: '90%', paddingBottom: 5, marginRight: '5%'}}>
                        <PostsVerticalView style={{marginRight: 5}}>
                            <TouchableOpacity onPress={this.navigateToProfileScreen}>
                                <PostCreatorIcon style={{borderColor: this.props.colors.tertiary, borderWidth: 3}} source={{uri: this.props.useRawImages && typeof this.props.post.creatorPfpKey === 'string' ? (this.props.serverUrl + `/getRawImageOnServer/${this.props.post.creatorPfpKey}`) : this.props.post.creatorPfpB64}}/>
                            </TouchableOpacity>
                        </PostsVerticalView>
                        <PostsVerticalView style={{marginTop: 9}}>
                            <TouchableOpacity onPress={this.navigateToProfileScreen}>
                                <SubTitle style={{fontSize: 20, color: this.props.colors.brand, marginBottom: 0}}>{this.props.post.creatorDisplayName}</SubTitle>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.navigateToProfileScreen}>
                                <SubTitle style={{fontSize: 12, marginBottom: 0, color: this.props.colors.tertiary}}>@{this.props.post.creatorName}</SubTitle>
                            </TouchableOpacity>
                        </PostsVerticalView>
                    </PostsHorizontalView>
                    <PostsHorizontalView style={{alignItems: 'center', justifyContent: 'center'}}>
                        <MultiMediaPostFrame postOnProfile={true} style={{ aspectRatio: 1/1, backgroundColor: this.props.colors.primary }}>
                            <Image style={{width: '100%', height: '100%', resizeMode : 'cover', borderRadius: 20}} source={{uri: this.props.useRawImages && typeof this.props.post.imageKey === 'string' ? `${this.props.serverUrl}/getRawImageOnServer/${this.props.post.imageKey}` : this.props.post.imageB64}}/>
                        </MultiMediaPostFrame>
                    </PostsHorizontalView>
                    {(this.props.post.imageTitle == '' && this.props.post.imageDescription == '') ? null :
                        <ImagePostTextFrame style={{textAlign: 'center'}}>
                            {this.props.post.imageTitle !== '' ? <SubTitle style={{fontSize: 20, color: this.props.colors.tertiary, marginBottom: 0}}>{this.props.post.imageTitle}</SubTitle> : null}
                            {this.props.post.imageDescription !== '' ? <SubTitle style={{fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{this.props.post.imageDescription}</SubTitle> : null}
                        </ImagePostTextFrame>
                    }
                    <PostHorizontalView style={{marginLeft: '5%', width: '90%', paddingVertical: 10, flex: 1, flexDirection: 'row'}}>
                        
                        <PostsIconFrame onPress={() => this.props.post.upvoted ? this.removeVote("Up") : this.upvote()}>
                            {!this.props.post.changingVote && <PostsIcons style={{flex: 1, tintColor: this.props.post.upvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>}
                        </PostsIconFrame>

                        <PostsIconFrame disabled={this.props.post.changingVote} onPress={this.navigateToVotesViewPage}>
                            {this.props.post.changingVote ?
                                <ActivityIndicator size="small" color={this.props.colors.brand} />  
                            :
                                <SubTitle style={{alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{this.props.post.votes}</SubTitle>
                            }
                        </PostsIconFrame>
                        
                        <PostsIconFrame onPress={() => this.props.post.downvoted ? this.removeVote("Down") : this.downvote()}>
                            {!this.props.post.changingVote && <PostsIcons style={{flex: 1, tintColor: this.props.post.downvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>}
                        </PostsIconFrame>

                        <PostsIconFrame></PostsIconFrame>

                        <PostsIconFrame onPress={this.navigateToFullscreen}>
                            <PostsIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png')}/>
                        </PostsIconFrame>
                        <PostsIconFrame>
                            <PostsIcons style={{flex: 1, height: 30, width: 30, tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/387-share2.png')}/>
                        </PostsIconFrame>
                        <PostsIconFrame onPress={this.openThreeDotsMenu}>
                            <PostsIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('../../assets/img/ThreeDots.png')}/>
                        </PostsIconFrame>
                    </PostHorizontalView>
                    <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{getTimeFromUTCMS(this.props.post.datePosted)}</SubTitle>
                    <TouchableOpacity onPress={this.navigateToFullscreen}>
                        <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{this.props.post.comments} {this.props.post.comments === 1 ? "comment" : "comments"}</SubTitle>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

export default function(props) {
    const navigation = useNavigation()
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    const postProps = {
        post: props.post,
        colors: props.colors,
        colorsIndexNum: props.colorsIndexNum,
        navigation,
        dispatch: props.dispatch,
        index: props.index,
        serverUrl,
        userId: storedCredentials?._id || 'SSGUEST',
        onDeleteCallback: typeof props.onDeleteCallback === 'function' ? props.onDeleteCallback :  function() {},
        useRawImages: props.useRawImages
    }

    return <ImagePost {...postProps}/>
}
import React, { Component, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../../assets/SocialSquareLogo_Base64_png';
import { ActivityIndicator, View, TouchableOpacity, Image, Text } from 'react-native';
import {
    PostsIconFrame,
    PostsHorizontalView,
    PostsVerticalView,
    SubTitle,
    PostCreatorIcon,
    ImagePostTextFrame,
    PostHorizontalView,
    PostsIcons
} from '../../screens/screenStylings/styling';
import axios from 'axios';
import { ServerUrlContext } from '../ServerUrlContext';
import { getTimeFromUTCMS } from '../../libraries/Time';

class Thread extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        const upvoteIsSame = nextProps.post.upvoted === this.props.post.upvoted;
        const downvoteIsSame = nextProps.post.downvoted === this.props.post.downvoted;
        const changingVoteIsSame = nextProps.post.changingVote === this.props.post.changingVote;
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const threadIdIsSame = nextProps.post.threadId === this.props.post.threadId;
        const deletingIsSame = nextProps.post.deleting === this.props.post.deleting;
        const profilePictureIsSame = nextProps.post.creatorImageB64 === this.props.post.creatorImageB64;


        if (upvoteIsSame && downvoteIsSame && changingVoteIsSame && colorsAreSame && threadIdIsSame && deletingIsSame && profilePictureIsSame) return false;

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

    upvote = () => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange()

            const url = this.props.serverUrl + '/tempRoute/upvotethread';

            var toSend = {threadId: this.props.post._id}

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
            
                if (status !== 'SUCCESS') {
                    this.handleStopVoteChange()
                    console.error('Error upvoting thread. Message:', message, '   |   Status:', status)
                } else {
                    if (message == "Thread UpVoted") {
                        this.props.dispatch({
                            type: 'upVote',
                            postIndex: this.props.index
                        })
                    } else {
                        this.props.dispatch({
                            type: 'neutralVote',
                            postIndex: this.props.index
                        })
                    }
                }
            }).catch(error => {
                this.handleStopVoteChange()
                console.error('An error occured while upvoting thread post:', error)
            })
        }
    }

    downvote = () => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange()

            const url = this.props.serverUrl + '/tempRoute/downvotethread';

            var toSend = {threadId: this.props.post._id}

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
            
                if (status !== 'SUCCESS') {
                    this.handleStopVoteChange()
                    console.error('Error downvoting thread. Message:', message, '   |   Status:', status)
                } else {
                    if (message == "Thread DownVoted") {
                        this.props.dispatch({
                            type: 'downVote',
                            postIndex: this.props.index
                        })
                    } else {
                        this.props.dispatch({
                            type: 'neutralVote',
                            postIndex: this.props.index
                        })
                    }
                }
            }).catch(error => {
                this.handleStopVoteChange()
                console.error('An error occured while downvoting thread post:', error)
            })
        }
    }

    navigateToFullScreen = () => {
        this.props.navigation.navigate("ThreadViewPage", { threadId: this.props.post._id })
    }

    openThreeDotsMenu = () => {
        if (this.props.post.isOwner !== true && this.props.post.isOwner !== false) {
            alert("isOwner is not true or false. An error has occured.")
            return
        }

        this.props.dispatch({
            type: 'showMenu',
            postId: this.props.post._id,
            postFormat: 'Thread',
            isOwner: this.props.post.isOwner,
            postIndex: this.props.index
        })
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
                <View style={{ backgroundColor: this.props.colors.primary, borderRadius: 15, borderColor: this.props.colors.borderColor, borderWidth: 3 }} onPress={this.navigateToFullScreen}>
                    {this.props.post.threadNSFW === true && (
                        <SubTitle style={{ fontSize: 10, color: this.props.colors.red, marginBottom: 0 }}>(NSFW)</SubTitle>
                    )}
                    {this.props.post.threadNSFL === true && (
                        <SubTitle style={{ fontSize: 10, color: this.props.colors.red, marginBottom: 0 }}>(NSFL)</SubTitle>
                    )}
                    <View style={{ paddingHorizontal: '50%' }}></View>
                    <PostsHorizontalView style={{ marginLeft: '5%', borderColor: this.props.colors.borderColor, width: '90%', paddingBottom: 5, marginRight: '5%' }}>
                        <TouchableOpacity style={{ width: '100%', height: 60 }}>
                            <PostsHorizontalView>
                                <PostsVerticalView>
                                    <PostCreatorIcon source={{uri: this.props.useRawImages && this.props.post.creatorPfpKey ? `${this.props.serverUrl}/getRawImageOnServer/${this.props.post.creatorPfpKey}` : (this.props.post.creatorImageB64 || SocialSquareLogo_B64_png)}} />
                                </PostsVerticalView>
                                <PostsVerticalView style={{ marginTop: 9 }}>
                                    <SubTitle style={{ color: this.props.colors.brand, fontSize: 20, marginBottom: 0 }}>{this.props.post.creatorDisplayName || this.props.post.creatorName}</SubTitle>
                                    <SubTitle style={{ fontSize: 12, color: this.props.colors.brand, marginBottom: 0 }}>@{this.props.post.creatorName}</SubTitle>
                                </PostsVerticalView>
                            </PostsHorizontalView>
                        </TouchableOpacity>
                    </PostsHorizontalView>
                    <TouchableOpacity onPress={this.navigateToFullScreen}>
                        <ImagePostTextFrame style={{ textAlign: 'left', alignItems: 'baseline' }}>
                            <TouchableOpacity>
                                <SubTitle style={{ fontSize: 10, color: this.props.colors.brand, marginBottom: 0 }}>Category: {this.props.post.threadCategory}</SubTitle>
                            </TouchableOpacity>
                            <SubTitle style={{ fontSize: 20, color: this.props.colors.tertiary, marginBottom: 0 }}>{this.props.post.threadTitle}</SubTitle>
                            {this.props.post.threadSubtitle !== "" && (
                                <SubTitle style={{ fontSize: 18, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.threadSubtitle}</SubTitle>
                            )}
                            {this.props.post.threadTags !== "" && (
                                <TouchableOpacity>
                                    <SubTitle style={{ fontSize: 10, color: this.props.colors.brand, marginBottom: 10 }}>{this.props.post.threadTags}</SubTitle>
                                </TouchableOpacity>
                            )}
                            {this.props.post.threadType == "Text" && (
                                <SubTitle style={{ fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.threadBody}</SubTitle>
                            )}
                            <View style={{ textAlign: 'left', alignItems: 'baseline', marginLeft: '5%', marginRight: '5%', width: '90%' }}>
                                {this.props.post.threadType == "Images" && (
                                    <View>
                                        <View style={{ height: 200, width: 200 }}>
                                            <Image style={{ height: '100%', width: 'auto', resizeMode: 'contain' }} source={{ uri: this.props.useRawImages && this.props.post.threadImageKey ? `${this.props.serverUrl}/getRawImageOnServer/${this.props.post.threadImageKey}` : this.props.post.imageInThreadB64 }} />
                                        </View>
                                        <SubTitle style={{ fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.threadImageDescription}</SubTitle>
                                    </View>
                                )}
                            </View>
                        </ImagePostTextFrame>
                    </TouchableOpacity>

                    <PostHorizontalView style={{ marginLeft: '5%', width: '90%', paddingVertical: 10, flex: 1, flexDirection: 'row' }}>

                        {this.props.post.changingVote == true && (
                            <View style={{flexDirection: 'row', flex: 3}}>
                                <PostsIconFrame/>
                                <PostsIconFrame>
                                    <ActivityIndicator size="small" color={this.props.colors.brand}/>
                                </PostsIconFrame>
                                <PostsIconFrame/>
                            </View>
                        )}

                        {this.props.post.changingVote == false && (
                            <View style={{flexDirection: 'row', flex: 3}}>

                                <PostsIconFrame onPress={this.upvote}>
                                    <PostsIcons style={{ flex: 1, tintColor: this.props.post.upvoted ? this.props.colors.brand : this.props.colors.tertiary }} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')} />
                                </PostsIconFrame>

                                <PostsIconFrame>
                                    <SubTitle style={{ alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.votes}</SubTitle>
                                </PostsIconFrame>

                                <PostsIconFrame onPress={this.downvote}>
                                    <PostsIcons style={{ flex: 1, tintColor: this.props.post.downvoted ? this.props.colors.brand : this.props.colors.tertiary }} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')} />
                                </PostsIconFrame>

                            </View>
                        )}

                        <PostsIconFrame>
                        </PostsIconFrame>
                        <PostsIconFrame onPress={this.navigateToFullScreen}>
                            <PostsIcons style={{ flex: 1, tintColor: this.props.colors.tertiary }} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png')} />
                        </PostsIconFrame>
                        <PostsIconFrame>
                            <PostsIcons style={{ flex: 1, height: 30, width: 30, tintColor: this.props.colors.tertiary }} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/387-share2.png')} />
                        </PostsIconFrame>
                        <PostsIconFrame onPress={this.openThreeDotsMenu}>
                            <PostsIcons style={{ flex: 1, tintColor: this.props.colors.tertiary }} source={require('../../assets/img/ThreeDots.png')} />
                        </PostsIconFrame>
                    </PostHorizontalView>
                    <SubTitle style={{ flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{getTimeFromUTCMS(this.props.post.datePosted)}</SubTitle>
                    <TouchableOpacity onPress={this.navigateToFullScreen}>
                        <SubTitle style={{ flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this?.props?.post?.threadComments?.length} comments</SubTitle>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

export default function(props) {
    const navigation = useNavigation()
    const {serverUrl} = useContext(ServerUrlContext)

    const postProps = {
        navigation,
        post: props.post,
        colors: props.colors,
        colorsIndexNum: props.colorsIndexNum,
        dispatch: props.dispatch,
        index: props.index,
        serverUrl,
        useRawImages: props.useRawImages
    }

    return <Thread {...postProps}/>
}
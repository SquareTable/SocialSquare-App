import React, { Component, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../../assets/SocialSquareLogo_Base64_png';
import { View, ActivityIndicator, Text } from 'react-native';
import {
    PollPostFrame,
    PostsHorizontalView,
    PostsVerticalView,
    PostCreatorIcon,
    SubTitle,
    PollPostTitle,
    PollPostSubTitle,
    AboveBarPollPostHorizontalView,
    PollBarOutline,
    PollBarItem,
    PollPostHorizontalView,
    PollKeyViewOne,
    PollKeyViewTwo,
    PollKeyViewThree,
    PollKeyViewFour,
    PollKeyViewFive,
    PollKeyViewSix,
    PollKeysCircle,
    PostHorizontalView,
    PostsIconFrame,
    PostsIcons
} from '../../screens/screenStylings/styling.js';
import { ServerUrlContext } from '../ServerUrlContext.js';
import axios from 'axios';
import { getTimeFromUTCMS } from '../../libraries/Time';
import { CredentialsContext } from '../CredentialsContext';
import { TouchableOpacity } from 'react-native';

class Poll extends Component {
    constructor(props) {
        super(props);

        if (props.useRawImages && typeof this.props.post.creatorPfpKey !== 'string') {
            console.warn('this.props.post.creatorPfpKey is not a string for Poll component but useRawImages is set to true - Falling back on base64 encoded image')
        }
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

            var toSend = {postId: this.props.post._id, postFormat: "Poll", voteType: "Up"}

            axios.post(url, toSend).then(() => {
                this.props.dispatch({
                    type: 'upVote',
                    postIndex: this.props.index
                })
            }).catch(error => {
                this.handleStopVoteChange()
                console.error('An error occured while upvoting poll post:', error)
            })
        }
    })

    downvote = this.runIfAuthenticated(() => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange();

            const url = this.props.serverUrl + '/tempRoute/voteonpost';

            const toSend = {postId: this.props.post.pollId, postFormat: "Poll", voteType: "Down"}

            axios.post(url, toSend).then(() => {
                this.props.dispatch({
                    type: 'downVote',
                    postIndex: this.props.index
                })
            }).catch(error => {
                this.handleStopVoteChange()
                console.error('An error occured while downvoting poll post:', error)
            })
        }
    })

    removeVote = this.runIfAuthenticated((voteType) => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange();
            const url = this.props.serverUrl + '/tempRoute/removevoteonpost';
            const toSend = {postId: this.props.post._id, postFormat: "Poll", voteType}

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

    shouldComponentUpdate(nextProps, nextState) {
        const upvoteIsSame = nextProps.post.upvoted === this.props.post.upvoted;
        const downvoteIsSame = nextProps.post.downvoted === this.props.post.downvoted;
        const changingVoteIsSame = nextProps.post.changingVote === this.props.post.changingVote;
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const pollIdIsSame = nextProps.post.pollId === this.props.post.pollId;
        const deletingIsSame = nextProps.post.deleting === this.props.post.deleting;
        const profilePictureIsSame = nextProps.post.pfpB64 === this.props.post.pfpB64;
        const userIdIsSame = nextProps.userId === this.props.userId;


        if (upvoteIsSame && downvoteIsSame && changingVoteIsSame && colorsAreSame && pollIdIsSame && deletingIsSame && profilePictureIsSame && userIdIsSame) return false;

        return true;
    }

    navigateToFullScreen = () => {
        this.props.navigation.navigate("ViewPollPostPage", {
            post: this.props.post,
            isOwner: this.props.post.isOwner
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
            postFormat: 'Poll',
            isOwner: this.props.post.isOwner,
            postIndex: this.props.index,
            onDeleteCallback: this.props.onDeleteCallback
        })
    })

    navigateToProfileScreen = () => {
        this.props.navigation.navigate('ProfilePages', {pubId: this.props.post.creatorPublicId})
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
                <PollPostFrame style={{marginLeft: 0, marginRight: 0, width: '100%'}} onPress={this.navigateToFullScreen}>
                    <PostsHorizontalView style={{ marginLeft: '5%', borderBottomWidth: 3, borderColor: this.props.colors.borderColor, width: '90%', paddingBottom: 5, marginRight: '5%' }}>
                        <PostsVerticalView>
                            <TouchableOpacity onPress={this.navigateToProfileScreen}>
                                <PostCreatorIcon source={this.props.useRawImages && typeof this.props.post.creatorPfpKey === 'string' ? {uri: `${this.props.serverUrl}/getRawImageOnServer/${this.props.post.creatorPfpKey}`} : this.props.post.pfpB64 ? { uri: this.props.post.pfpB64 } : {uri: SocialSquareLogo_B64_png}} />
                            </TouchableOpacity>
                        </PostsVerticalView>
                        <PostsVerticalView style={{ marginTop: 9 }}>
                            <TouchableOpacity onPress={this.navigateToProfileScreen}>
                                <SubTitle style={{ color: this.props.colors.brand, fontSize: 20, marginBottom: 0 }}>{this.props.post.creatorDisplayName !== "" ? this.props.post.creatorDisplayName : this.props.post.creatorName}</SubTitle>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.navigateToProfileScreen}>
                                <SubTitle style={{ fontSize: 12, marginBottom: 0, color: this.props.colors.tertiary }}>@{this.props.post.creatorName}</SubTitle>
                            </TouchableOpacity>
                        </PostsVerticalView>
                    </PostsHorizontalView>
                    <PollPostTitle style={{ width: '95%', color: this.props.colors.brand }}>
                        {this.props.post.pollTitle}
                    </PollPostTitle>
                    <PollPostSubTitle style={{ width: '95%', color: this.props.colors.tertiary }}>
                        {this.props.post.pollSubTitle}
                    </PollPostSubTitle>
                    <AboveBarPollPostHorizontalView>
                        <PollPostSubTitle style={{ width: this.props.post.optionOnesBarLength + '%', color: this.props.colors.tertiary }}>
                            1
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{ width: this.props.post.optionTwosBarLength + '%', color: this.props.colors.tertiary }}>
                            2
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{ width: this.props.post.optionThreesBarLength + '%', color: this.props.colors.tertiary }}>
                            3
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{ width: this.props.post.optionFoursBarLength + '%', color: this.props.colors.tertiary }}>
                            4
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{ width: this.props.post.optionFivesBarLength + '%', color: this.props.colors.tertiary }}>
                            5
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{ width: this.props.post.optionSixesBarLength + '%', color: this.props.colors.tertiary }}>
                            6
                        </PollPostSubTitle>
                    </AboveBarPollPostHorizontalView>
                    <PollBarOutline>
                        <PollBarItem borderChange={this.props.post.optionOnesBarLength} style={{ width: this.props.post.optionOnesBarLength + '%', backgroundColor: this.props.post.optionOnesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionOnesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionTwosBarLength} style={{ width: this.props.post.optionTwosBarLength + '%', backgroundColor: this.props.post.optionTwosColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionTwosColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionThreesBarLength} style={{ width: this.props.post.optionThreesBarLength + '%', backgroundColor: this.props.post.optionThreesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionThreesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionFoursBarLength} style={{ width: this.props.post.optionFoursBarLength + '%', backgroundColor: this.props.post.optionFoursColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionFoursColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionFivesBarLength} style={{ width: this.props.post.optionFivesBarLength + '%', backgroundColor: this.props.post.optionFivesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionFivesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionSixesBarLength} style={{ width: this.props.post.optionSixesBarLength + '%', backgroundColor: this.props.post.optionSixesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionSixesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    </PollBarOutline>
                    <PollPostHorizontalView>
                        <PollKeyViewOne pollOptions={this.props.post.totalNumberOfOptions} onPress={this.navigateToFullScreen}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                1. {this.props.post.optionOne}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionOnesColor}></PollKeysCircle>
                        </PollKeyViewOne>
                        <PollKeyViewTwo pollOptions={this.props.post.totalNumberOfOptions} onPress={this.navigateToFullScreen}>
                            <PollKeysCircle circleColor={this.props.post.optionTwosColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                2. {this.props.post.optionTwo}
                            </PollPostSubTitle>
                        </PollKeyViewTwo>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewThree pollOptions={this.props.post.totalNumberOfOptions} onPress={this.navigateToFullScreen}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                3. {this.props.post.optionThree}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionThreesColor}></PollKeysCircle>
                        </PollKeyViewThree>
                        <PollKeyViewFour pollOptions={this.props.post.totalNumberOfOptions} onPress={this.navigateToFullScreen}>
                            <PollKeysCircle circleColor={this.props.post.optionFoursColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                4. {this.props.post.optionFour}
                            </PollPostSubTitle>
                        </PollKeyViewFour>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewFive pollOptions={this.props.post.totalNumberOfOptions} onPress={this.navigateToFullScreen}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                5. {this.props.post.optionFive}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionFivesColor}></PollKeysCircle>
                        </PollKeyViewFive>
                        <PollKeyViewSix pollOptions={this.props.post.totalNumberOfOptions} onPress={this.navigateToFullScreen}>
                            <PollKeysCircle circleColor={this.props.post.optionSixesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                6. {this.props.post.optionSix}
                            </PollPostSubTitle>
                        </PollKeyViewSix>
                    </PollPostHorizontalView>
                    <PostHorizontalView style={{ marginLeft: '5%', width: '90%', paddingVertical: 10, flex: 1, flexDirection: 'row', borderTopWidth: 3, borderColor: this.props.colors.darkest }}>
                        {this.props.post.changingVote == true && (<View style={{flexDirection: 'row', flex: 3}}>
                            <PostsIconFrame/>
                                <ActivityIndicator size="small" color={this.props.colors.brand} />
                            <PostsIconFrame/>
                        </View>)}

                        {this.props.post.changingVote == false && (
                            <View style={{flexDirection: 'row', flex: 3}}>

                                <PostsIconFrame onPress={() => this.props.post.upvoted ? this.removeVote("Up") : this.upvote()}>
                                    <PostsIcons style={{ flex: 1, tintColor: this.props.post.upvoted ? this.props.colors.brand : this.props.colors.tertiary }} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')} />
                                </PostsIconFrame>

                                <PostsIconFrame>
                                    <SubTitle style={{ alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.votes}</SubTitle>
                                </PostsIconFrame>

                                <PostsIconFrame onPress={() => this.props.post.downvoted ? this.removeVote("Down") : this.downvote()}>
                                    <PostsIcons style={{ flex: 1, tintColor: this.props.post.downvoted ? this.props.colors.brand : this.props.colors.tertiary }} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')} />
                                </PostsIconFrame>

                            </View>      
                        )}

                        <PostsIconFrame/>

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
                    <SubTitle style={{ flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.comments} {this.props.post.comments === 1 ? "comment" : "comments"}</SubTitle>
                </PollPostFrame>
            </>
        )
    }
}

export const PollClass = Poll;

export default function(props) {
    const navigation = useNavigation();
    const {serverUrl} = useContext(ServerUrlContext);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    const postProps = {
        navigation,
        post: props.post,
        colors: props.colors,
        colorsIndexNum: props.colorsIndexNum,
        dispatch: props.dispatch,
        serverUrl,
        index: props.index,
        useRawImages: props.useRawImages,
        userId: storedCredentials?._id || 'SSGUEST',
        onDeleteCallback: typeof props.onDeleteCallback === 'function' ? props.onDeleteCallback :  function() {},
    }

    return <Poll {...postProps}/>
};
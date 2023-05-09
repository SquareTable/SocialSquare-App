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

class Poll extends Component {
    constructor(props) {
        super(props);
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

            const url = this.props.serverUrl + '/tempRoute/upvotepoll';

            var toSend = {pollId: this.props.post._id}

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
            
                if (status !== 'SUCCESS') {
                    this.handleStopVoteChange()
                    console.error('Error upvoting poll. Message:', message, '   |   Status:', status)
                } else {
                    console.log(message)
                    if (message == "Post UpVoted") {
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
                console.error('An error occured while upvoting poll post:', error)
            })
        }
    }

    downvote = () => {
        if (!this.props.post.changingVote) {
            this.handleStartVoteChange();

            const url = this.props.serverUrl + '/tempRoute/downvotepoll';

            const toSend = {pollId: this.props.post.pollId}

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== "SUCCESS") {
                    this.handleStopVoteChange()
                    console.error('Error downvoting poll. Message:', message, '   |    Status:', status)
                } else {
                    if (message == "Post DownVoted") {
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
                console.error('An error occured while downvoting poll post:', error)
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const upvoteIsSame = nextProps.post.upvoted === this.props.post.upvoted;
        const downvoteIsSame = nextProps.post.downvoted === this.props.post.downvoted;
        const changingVoteIsSame = nextProps.post.changingVote === this.props.post.changingVote;
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const pollIdIsSame = nextProps.post.pollId === this.props.post.pollId;
        const deletingIsSame = nextProps.post.deleting === this.props.post.deleting;
        const profilePictureIsSame = nextProps.post.pfpB64 === this.props.post.pfpB64;


        if (upvoteIsSame && downvoteIsSame && changingVoteIsSame && colorsAreSame && pollIdIsSame && deletingIsSame && profilePictureIsSame) return false;

        return true;
    }

    navigateToFullScreen = () => {
        this.props.navigation.navigate("ViewPollPostPage", {
            pollTitle: this.props.post.pollTitle,
            pollSubTitle: this.props.post.pollSubTitle,
            optionOne: this.props.post.optionOne,
            optionOnesColor: this.props.post.optionOnesColor,
            optionOnesVotes: this.props.post.optionOnesVotes,
            optionOnesBarLength: this.props.post.optionOnesBarLength,
            optionTwo: this.props.post.optionTwo,
            optionTwosColor: this.props.post.optionTwosColor,
            optionTwosVotes: this.props.post.optionTwosCotes,
            optionTwosBarLength: this.props.post.optionTwosBarLength,
            optionThree: this.props.post.optionThree,
            optionThreesColor: this.props.post.optionThreesColor,
            optionThreesVotes: this.props.post.optionThreesVotes,
            optionThreesBarLength: this.props.post.optionThreesBarLength,
            optionFour: this.props.post.optionFour,
            optionFoursColor: this.props.post.optionFoursColor,
            optionFoursVotes: this.props.post.optionFoursVotes,
            optionFoursBarLength: this.props.post.optionFoursBarLength,
            optionFive: this.props.post.optionFive,
            optionFivesColor: this.props.post.optionFivesColor,
            optionFivesVotes: this.props.post.optionFivesVotes,
            optionFivesBarLength: this.props.post.optionFivesBarLength,
            optionSix: this.props.post.optionSix,
            optionSixesColor: this.props.post.optionSixesColor,
            optionSixesVotes: this.props.post.optionSixesVotes,
            optionSixesBarLength: this.props.post.optionSixesBarLength,
            totalNumberOfOptions: this.props.post.totalNumberOfOptions,
            pollId: this.props.post.pollId,
            creatorPfpB64: this.props.post.pfpB64,
            creatorName: this.props.post.creatorName,
            creatorDisplayName: this.props.post.creatorDisplayName,
            datePosted: this.props.post.datePosted,
            votedFor: this.props.post.votedFor
        })
    }

    openThreeDotsMenu = () => {
        if (this.props.post.isOwner !== true && this.props.post.isOwner !== false) {
            alert("isOwner is not true or false. An error has occured.")
            return
        }

        this.props.dispatch({
            type: 'showMenu',
            postId: this.props.post._id,
            postFormat: 'Poll',
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
                <PollPostFrame style={{marginLeft: 0, marginRight: 0, width: '100%'}} onPress={this.navigateToFullScreen}>
                    <PostsHorizontalView style={{ marginLeft: '5%', borderBottomWidth: 3, borderColor: this.props.colors.borderColor, width: '90%', paddingBottom: 5, marginRight: '5%' }}>
                        <PostsVerticalView>
                            <PostCreatorIcon source={this.props.post.pfpB64 ? { uri: this.props.post.pfpB64 } : {uri: SocialSquareLogo_B64_png}} />
                        </PostsVerticalView>
                        <PostsVerticalView style={{ marginTop: 9 }}>
                            {this.props.post.creatorDisplayName !== "" ? (
                                <SubTitle style={{ color: this.props.colors.brand, fontSize: 20, marginBottom: 0 }}>{this.props.post.creatorDisplayName}</SubTitle>
                            ) : (null)}
                            {this.props.post.creatorDisplayName == "" ? (
                                <SubTitle style={{ color: this.props.colors.brand, fontSize: 20, marginBottom: 0 }}>{this.props.post.creatorName}</SubTitle>
                            ) : (null)}
                            <SubTitle style={{ fontSize: 12, marginBottom: 0, color: this.props.colors.tertiary }}>@{this.props.post.creatorName}</SubTitle>
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
                        <PollBarItem borderChange={this.props.post.optionOnesBarLength} style={{ width: this.props.post.optionOnesBarLength + '%', backgroundColor: this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionTwosBarLength} style={{ width: this.props.post.optionTwosBarLength + '%', backgroundColor: this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionThreesBarLength} style={{ width: this.props.post.optionThreesBarLength + '%', backgroundColor: this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionFoursBarLength} style={{ width: this.props.post.optionFoursBarLength + '%', backgroundColor: this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionFivesBarLength} style={{ width: this.props.post.optionFivesBarLength + '%', backgroundColor: this.props.colors.brand }}></PollBarItem>
                        <PollBarItem borderChange={this.props.post.optionSixesBarLength} style={{ width: this.props.post.optionSixesBarLength + '%', backgroundColor: this.props.colors.brand }}></PollBarItem>
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
                    {this.props.post.pollComments && (
                        <SubTitle style={{ flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.comments} comments</SubTitle>
                    )}
                </PollPostFrame>
            </>
        )
    }
}

export default function(props) {
    const navigation = useNavigation();
    const {serverUrl} = useContext(ServerUrlContext);

    const postProps = {
        navigation,
        post: props.post,
        colors: props.colors,
        colorsIndexNum: props.colorsIndexNum,
        dispatch: props.dispatch,
        serverUrl,
        index: props.index
    }

    return <Poll {...postProps}/>
};
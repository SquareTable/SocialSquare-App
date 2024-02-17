import React, { useContext } from 'react';
import { PollClass } from './PollPost';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { 
    PostsIconFrame,
    ViewScreenPollPostFrame,
    PostsHorizontalView,
    PostsVerticalView,
    SubTitle,
    PostCreatorIcon,
    PollPostSubTitle,
    ProfIcons,
    PollPostHorizontalView,
    AboveBarPollPostHorizontalView,
    PollPostTitle,
    PollKeysCircle,
    PollKeyViewOne,
    PollKeyViewTwo,
    PollKeyViewThree,
    PollKeyViewFour,
    PollKeyViewFive,
    PollKeyViewSix,
    PostsIcons,
    PollBarOutline,
    PollBarItem,
    PollHorizontalViewItem,
    PollHorizontalViewItemCenter,
    PostHorizontalView
} from '../../screens/screenStylings/styling';
import { getTimeFromUTCMS } from '../../libraries/Time';
import { useNavigation } from '@react-navigation/native';
import { ServerUrlContext } from '../ServerUrlContext';
import { CredentialsContext } from '../CredentialsContext';
import ParseErrorMessage from '../ParseErrorMessage';
import Octicons from 'react-native-vector-icons/Octicons';
import axios from 'axios';

class PollWithVotes extends PollClass {
    constructor(props) {
        super(props);
    }

    openOptionOne = () => {
        this.props.dispatch({type: 'openPollVoteMenu', openPollVoteMenu: "One", postIndex: this.props.index})
    }

    openOptionTwo = () => {
        this.props.dispatch({type: 'openPollVoteMenu', openPollVoteMenu: "Two", postIndex: this.props.index})
    }

    openOptionThree = () => {
        this.props.dispatch({type: 'openPollVoteMenu', openPollVoteMenu: "Three", postIndex: this.props.index})
    }

    openOptionFour = () => {
        this.props.dispatch({type: 'openPollVoteMenu', openPollVoteMenu: "Four", postIndex: this.props.index})
    }

    openOptionFive = () => {
        this.props.dispatch({type: 'openPollVoteMenu', openPollVoteMenu: "Five", postIndex: this.props.index})
    }

    openOptionSix = () => {
        this.props.dispatch({type: 'openPollVoteMenu', openPollVoteMenu: "Six", postIndex: this.props.index})
    }

    runIfAuthenticated = (func) => {
        return (...params) => {
            if (this.props.userId === 'SSGUEST' || !this.props.userId) {
                this.props.navigation.navigate('ModalLoginScreen', {modal: true})
            } else {
                func(...params)
            }
        }
    }

    handleVoteOnPoll = this.runIfAuthenticated((voteNumber) => {
        this.props.dispatch({type: 'startPollVoteChange', postIndex: this.props.index})
        const url = this.props.serverUrl + "/tempRoute/voteonpoll";

        const toSend = {optionSelected: voteNumber, pollId: this.props.post._id}

        console.log(toSend)

        axios.post(url, toSend).then(() => {
            this.props.dispatch({type: 'voteOnPoll', vote: voteNumber, postIndex: this.props.index})
        }).catch(error => {
            this.props.dispatch({type: 'stopPollVoteChange', postIndex: this.props.index})
            console.error(error);
            alert(ParseErrorMessage(error));
        })
    })

    handleRemoveVoteOnPoll = this.runIfAuthenticated(() => {
        this.props.dispatch({type: 'startPollVoteChange', postIndex: this.props.index})
        const url = this.props.serverUrl + "/tempRoute/removevoteonpoll"
        const toSend = {pollId: this.props.post._id}

        console.log(toSend)

        axios.post(url, toSend).then(() => {
            this.props.dispatch({type: 'removeVoteOnPoll', postIndex: this.props.index})
        }).catch(error => {
            this.props.dispatch({type: 'stopPollVoteChange', postIndex: this.props.index})
            console.error(error)
            alert(ParseErrorMessage(error))
        })
    })

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

    shouldComponentUpdate(nextProps, nextState) {
        const upvoteIsSame = nextProps.post.upvoted === this.props.post.upvoted;
        const downvoteIsSame = nextProps.post.downvoted === this.props.post.downvoted;
        const changingVoteIsSame = nextProps.post.changingVote === this.props.post.changingVote;
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const pollIdIsSame = nextProps.post.pollId === this.props.post.pollId;
        const deletingIsSame = nextProps.post.deleting === this.props.post.deleting;
        const profilePictureIsSame = nextProps.post.pfpB64 === this.props.post.pfpB64;
        const changingPollVoteIsSame = nextProps.post.pollVoteChanging === this.props.post.pollVoteChanging;
        const votedForIsSame = nextProps.post.votedFor === this.props.post.votedFor;
        const openPollVoteMenuSame = nextProps.post.openPollVoteMenu === this.props.post.openPollVoteMenu;
        const userIdIsSame = nextProps.userId === this.props.userId;


        if (upvoteIsSame && downvoteIsSame && changingVoteIsSame && colorsAreSame && pollIdIsSame && deletingIsSame && profilePictureIsSame && changingPollVoteIsSame && votedForIsSame && openPollVoteMenuSame && userIdIsSame) return false;

        return true;
    }

    voteTextToNumberObject = {
        'Two': 2,
        'Three': 3,
        'Four': 4,
        'Five': 5,
        'Six': 6
    }

    numberOfOptions = this.voteTextToNumberObject[this.props.post.totalNumberOfOptions]

    calculateZeroVoteLength = (optionNumber) => {
        if (optionNumber <= this.numberOfOptions) return 100 / this.numberOfOptions
        return 0
    }

    navigateToProfileScreen = () => {
        this.props.navigation.push('ProfilePages', {pubId: this.props.post.creatorPublicId})
    }

    navigateToVotesViewPage = () => {
        this.props.navigation.navigate('VotesViewPage', {postId: this.props.post._id, postFormat: 'Poll'})
    }

    navigateToPollVotesViewPage = (pollOption) => {
        this.props.navigation.navigate('PollVoteViewPage', {pollId: this.props.post._id, pollOption})
    }

    render() {
        this.votes = this.props.post.optionOnesVotes + this.props.post.optionTwosVotes + this.props.post.optionThreesVotes + this.props.post.optionFoursVotes + this.props.post.optionFivesVotes + this.props.post.optionSixesVotes;
        this.optionOnesBarLength = this.votes === 0 ? this.calculateZeroVoteLength(1) : this.props.post.optionOnesVotes / this.votes * 100
        this.optionTwosBarLength = this.votes === 0 ? this.calculateZeroVoteLength(2) : this.props.post.optionTwosVotes / this.votes * 100
        this.optionThreesBarLength = this.votes === 0 ? this.calculateZeroVoteLength(3) : this.props.post.optionThreesVotes / this.votes * 100
        this.optionFoursBarLength = this.votes === 0 ? this.calculateZeroVoteLength(4) : this.props.post.optionFoursVotes / this.votes * 100
        this.optionFivesBarLength = this.votes === 0 ? this.calculateZeroVoteLength(5) : this.props.post.optionFivesVotes / this.votes * 100
        this.optionSixesBarLength = this.votes === 0 ? this.calculateZeroVoteLength(6) : this.props.post.optionSixesVotes / this.votes * 100

        return (
            <>
                {this.props.post.deleting &&
                    <View style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 15}}>
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>Deleting...</Text>
                        <ActivityIndicator color='#FFFFFF' size="large"/>
                    </View>
                }
                <ViewScreenPollPostFrame style={{width: '100%', alignSelf: 'center'}}>
                    <PostsHorizontalView style={{borderBottomWidth: 3, borderColor: this.props.colors.darkLight, width: '100%', paddingBottom: 5}}>
                        <PostsVerticalView>
                            <TouchableOpacity onPress={this.navigateToProfileScreen}>
                                <PostCreatorIcon source={{uri: this.props.post.pfpB64}}/>
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
                    <PollPostTitle viewPage={true}>
                        {this.props.post.pollTitle || "Couldn't recieve poll title"}
                    </PollPostTitle>
                    <PollPostSubTitle style={{color: this.props.colors.tertiary}} viewPage={true}>
                        {this.props.post.pollSubTitle || "Couldn't recieve poll subtitle"}
                    </PollPostSubTitle>
                    <AboveBarPollPostHorizontalView viewPage={true}>
                        <PollPostSubTitle style={{width: this.optionOnesBarLength+'%', color: this.props.colors.tertiary}}>
                            1
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.optionTwosBarLength+'%', color: this.props.colors.tertiary }}>
                            2
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.optionThreesBarLength+'%', color: this.props.colors.tertiary }}>
                            3
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.optionFoursBarLength+'%', color: this.props.colors.tertiary }}>
                            4
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.optionFivesBarLength+'%', color: this.props.colors.tertiary }}>
                            5
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.optionSixesBarLength+'%', color: this.props.colors.tertiary }}>
                            6
                        </PollPostSubTitle>
                    </AboveBarPollPostHorizontalView>
                    <PollBarOutline>
                    <PollBarItem borderChange={this.optionOnesBarLength} style={{ width: this.optionOnesBarLength+'%', backgroundColor: this.props.post.optionOnesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionOnesColor.toLowerCase()] || this.props.colors.brand}}></PollBarItem>
                    <PollBarItem borderChange={this.optionTwosBarLength} style={{ width: this.optionTwosBarLength+'%', backgroundColor: this.props.post.optionTwosColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionTwosColor.toLowerCase()] || this.props.colors.brand}}></PollBarItem>
                    <PollBarItem borderChange={this.optionThreesBarLength} style={{ width: this.optionThreesBarLength+'%', backgroundColor: this.props.post.optionThreesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionThreesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.optionFoursBarLength} style={{ width: this.optionFoursBarLength+'%', backgroundColor: this.props.post.optionFoursColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionFoursColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.optionFivesBarLength} style={{ width: this.optionFivesBarLength+'%', backgroundColor: this.props.post.optionFivesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionFivesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.optionSixesBarLength} style={{ width: this.optionSixesBarLength+'%', backgroundColor: this.props.post.optionSixesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionSixesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    </PollBarOutline>
                    <PollPostHorizontalView>
                        <PollKeyViewOne pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={this.openOptionOne}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionOnesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                1. {this.props.post.optionOne || "Couldn't load option one"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionOnesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewOne>
                    </PollPostHorizontalView>
                    
                    <PollPostHorizontalView visible={this.props.post.openPollVoteMenu === "One"}>
                        <PollHorizontalViewItem>
                            <TouchableOpacity onPress={() => this.navigateToPollVotesViewPage("One")} style={{width: '100%', alignItems: 'center'}}>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionOnesVotes} </PollPostSubTitle>
                            </TouchableOpacity>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "One" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("One")}} disabled={this.props.post.pollVoteChanging}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option One </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            {this.props.post.pollVoteChanging ?
                                <ActivityIndicator color={this.props.colors.brand} size="small"/>
                            :
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}>{this.props.post.votedFor === "One" ? "Voted" : "Vote"}</PollPostSubTitle>
                            }
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.optionOnesBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>



                    <PollPostHorizontalView>
                        <PollKeyViewTwo pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={this.openOptionTwo}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionTwosColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                2. {this.props.post.optionTwo || "Couldn't load option two"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionTwosColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewTwo>
                    </PollPostHorizontalView>
                    
                    <PollPostHorizontalView visible={this.props.post.openPollVoteMenu === "Two"}>
                        <PollHorizontalViewItem>
                            <TouchableOpacity onPress={() => this.navigateToPollVotesViewPage("Two")} style={{width: '100%', alignItems: 'center'}}>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionTwosVotes} </PollPostSubTitle>
                            </TouchableOpacity>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Two" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("Two")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Two </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            {this.props.post.pollVoteChanging ?
                                <ActivityIndicator color={this.props.colors.brand} size="small"/>
                            :
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}>{this.props.post.votedFor === "Two" ? "Voted" : "Vote"}</PollPostSubTitle>
                            }
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.optionTwosBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewThree pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={this.openOptionThree}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionThreesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                3. {this.props.post.optionThree || "Couldn't load option three"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionThreesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewThree>
                    </PollPostHorizontalView>
                    
                    <PollPostHorizontalView visible={this.props.post.openPollVoteMenu === "Three"}>
                        <PollHorizontalViewItem>
                            <TouchableOpacity onPress={() => this.navigateToPollVotesViewPage("Three")} style={{width: '100%', alignItems: 'center'}}>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionThreesVotes} </PollPostSubTitle>
                            </TouchableOpacity>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Three" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("Three")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Three </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            {this.props.post.pollVoteChanging ?
                                <ActivityIndicator color={this.props.colors.brand} size="small"/>
                            :
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}>{this.props.post.votedFor === "Three" ? "Voted" : "Vote"}</PollPostSubTitle>
                            }
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.optionThreesBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewFour pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={this.openOptionFour}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionFoursColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                4. {this.props.post.optionFour || "Couldn't load option four"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionFoursColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewFour>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView visible={this.props.post.openPollVoteMenu === "Four"}>
                        <PollHorizontalViewItem>
                            <TouchableOpacity onPress={() => this.navigateToPollVotesViewPage("Four")} style={{width: '100%', alignItems: 'center'}}>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFoursVotes} </PollPostSubTitle>
                            </TouchableOpacity>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Four" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("Four")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Four </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            {this.props.post.pollVoteChanging ?
                                <ActivityIndicator color={this.props.colors.brand} size="small"/>
                            :
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}>{this.props.post.votedFor === "Four" ? "Voted" : "Vote"}</PollPostSubTitle>
                            }
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.optionFoursBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewFive pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={this.openOptionFive}>
                        <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionFivesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                5. {this.props.post.optionFive || "Couldn't load option five"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionFivesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewFive>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView visible={this.props.post.openPollVoteMenu === "Five"}>
                        <PollHorizontalViewItem>
                            <TouchableOpacity onPress={() => this.navigateToPollVotesViewPage("Five")} style={{width: '100%', alignItems: 'center'}}>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFivesVotes} </PollPostSubTitle>
                            </TouchableOpacity>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Five" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("Five")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Five </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            {this.props.post.pollVoteChanging ?
                                <ActivityIndicator color={this.props.colors.brand} size="small"/>
                            :
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}>{this.props.post.votedFor === "Five" ? "Voted" : "Vote"}</PollPostSubTitle>
                            }
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.optionFivesBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewSix pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={this.openOptionSix}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionSixesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                6. {this.props.post.optionSix || "Couldn't load option six"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionSixesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewSix>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView visible={this.props.post.openPollVoteMenu === "Six"}>
                        <PollHorizontalViewItem>
                            <TouchableOpacity onPress={() => this.navigateToPollVotesViewPage("Six")} style={{width: '100%', alignItems: 'center'}}>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionSixesVotes} </PollPostSubTitle>
                            </TouchableOpacity>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Six" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("Six")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Six </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            {this.props.post.pollVoteChanging ?
                                <ActivityIndicator color={this.props.colors.brand} size="small"/>
                            :
                                <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}>{this.props.post.votedFor === "Six" ? "Voted" : "Vote"}</PollPostSubTitle>
                            }
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.optionSixesBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PostHorizontalView style={{marginLeft: '5%', width: '90%', paddingVertical: 10, flex: 1, flexDirection: 'row'}}>

                        {this.props.post.changingVote ?
                            <View style={{flexDirection: 'row', flex: 3}}>
                                <PostsIconFrame/>
                                    <ActivityIndicator size="small" color={this.props.colors.brand} />
                                <PostsIconFrame/>
                            </View>
                        :
                            <>
                                <PostsIconFrame onPress={() => this.props.post.upvoted ? this.removeVote("Up") : this.upvote()}>
                                    <PostsIcons style={{flex: 1, tintColor: this.props.post.upvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                </PostsIconFrame>
                                <PostsIconFrame onPress={this.navigateToVotesViewPage}>
                                    <SubTitle style={{ alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.votes}</SubTitle>
                                </PostsIconFrame>
                                <PostsIconFrame onPress={() => this.props.post.downvoted ? this.removeVote("Down") : this.downvote()}>
                                    <PostsIcons style={{flex: 1, tintColor: this.props.post.downvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                </PostsIconFrame>
                            </>
                        }

                        <PostsIconFrame/>

                        <PostsIconFrame>
                            <PostsIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png')}/>
                        </PostsIconFrame>
                        <PostsIconFrame>
                            <PostsIcons style={{flex: 1, height: 30, width: 30, tintColor: this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/387-share2.png')}/>
                        </PostsIconFrame>
                        <PostsIconFrame onPress={this.openThreeDotsMenu}>
                            <PostsIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('../../assets/img/ThreeDots.png')}/>
                        </PostsIconFrame>
                    </PostHorizontalView>
                    <PollPostSubTitle votesText={true} style={{flex: 1, color: this.props.colors.tertiary}}>
                        Total Votes: {this.votes}
                    </PollPostSubTitle>
                    <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{getTimeFromUTCMS(this.props.post.datePosted)}</SubTitle>
                    <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{this.props.post.comments?.length} {this.props.post.comments?.length === 1 ? "comment" : "comments"}</SubTitle>
                </ViewScreenPollPostFrame>
            </>
        )
    }
}

export default function(props) {
    const navigation = useNavigation();
    const {serverUrl} = useContext(ServerUrlContext)
    const {storedCredentials} = useContext(CredentialsContext)
    const {_id} = storedCredentials

    const postProps = {
        navigation,
        post: props.post,
        colors: props.colors,
        colorsIndexNum: props.colorsIndexNum,
        dispatch: props.dispatch,
        serverUrl,
        index: props.index,
        //No useRawImages support yet - Might want to add that in the future
        userId: _id,
        onDeleteCallback: typeof props.onDeleteCallback === 'function' ? props.onDeleteCallback :  function() {},
    }

    return <PollWithVotes {...postProps}/>
};
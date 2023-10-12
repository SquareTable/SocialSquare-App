import React, { useContext } from 'react';
import { PollClass } from './PollPost';
import { ActivityIndicator, View } from 'react-native';
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

    handleVoteOnPoll = (optionSelected, voteNumber) => {
        if (this.props.storedCredentials) {
            this.props.dispatch({type: 'startPollVoteChange', postIndex: this.props.index})
            console.log(optionSelected)
            const url = this.props.serverUrl + "/tempRoute/voteonpoll";

            const toSend = {optionSelected: optionSelected, pollId: this.props.post._id}

            console.log(toSend)

            axios.post(url, toSend).then(() => {
                this.props.dispatch({type: 'voteOnPoll', vote: voteNumber, postIndex: this.props.index})
            }).catch(error => {
                this.props.dispatch({type: 'stopPollVoteChange', postIndex: this.props.index})
                console.error(error);
                alert(ParseErrorMessage(error));
            })
        } else {
            this.props.navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    handleRemoveVoteOnPoll = () => {
        if (this.props.storedCredentials) {
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
        } else {
            this.props.navigation.navigate('ModalLoginScreen', {modal: true})
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
        const changingPollVoteIsSame = nextProps.post.pollVoteChanging === this.props.post.pollVoteChanging;
        const votedForIsSame = nextProps.post.votedFor === this.props.post.votedFor;
        const openPollVoteMenuSame = nextProps.post.openPollVoteMenu === this.props.post.openPollVoteMenu;
        const userIdIsSame = nextProps.userId === this.props.userId;


        if (upvoteIsSame && downvoteIsSame && changingVoteIsSame && colorsAreSame && pollIdIsSame && deletingIsSame && profilePictureIsSame && changingPollVoteIsSame && votedForIsSame && openPollVoteMenuSame && userIdIsSame) return false;

        return true;
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
                <ViewScreenPollPostFrame style={{width: '100%'}}>
                    <PostsHorizontalView style={{borderBottomWidth: 3, borderColor: this.props.colors.darkLight, width: '100%', paddingBottom: 5}}>
                        <PostsVerticalView>
                            <PostCreatorIcon source={{uri: this.props.post.pfpB64}}/>
                        </PostsVerticalView>
                        <PostsVerticalView style={{marginTop: 9}}>
                            <SubTitle style={{fontSize: 20, color: this.props.colors.brand, marginBottom: 0}}>{this.props.post.creatorDisplayName}</SubTitle>
                            <SubTitle style={{fontSize: 12, marginBottom: 0, color: this.props.colors.tertiary}}>@{this.props.post.creatorName}</SubTitle>
                        </PostsVerticalView>
                    </PostsHorizontalView>
                    <PollPostTitle viewPage={true}>
                        {this.props.post.pollTitle || "Couldn't recieve poll title"}
                    </PollPostTitle>
                    <PollPostSubTitle style={{color: this.props.colors.tertiary}} viewPage={true}>
                        {this.props.post.pollSubTitle || "Couldn't recieve poll subtitle"}
                    </PollPostSubTitle>
                    <AboveBarPollPostHorizontalView viewPage={true}>
                        <PollPostSubTitle style={{width: this.props.post.optionOnesBarLength+'%', color: this.props.colors.tertiary}}>
                            1
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.props.post.optionTwosBarLength+'%', color: this.props.colors.tertiary }}>
                            2
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.props.post.optionThreesBarLength+'%', color: this.props.colors.tertiary }}>
                            3
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.props.post.optionFoursBarLength+'%', color: this.props.colors.tertiary }}>
                            4
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.props.post.optionFivesBarLength+'%', color: this.props.colors.tertiary }}>
                            5
                        </PollPostSubTitle>
                        <PollPostSubTitle style={{width: this.props.post.optionSixesBarLength+'%', color: this.props.colors.tertiary }}>
                            6
                        </PollPostSubTitle>
                    </AboveBarPollPostHorizontalView>
                    <PollBarOutline>
                    <PollBarItem borderChange={this.props.post.optionOnesBarLength} style={{ width: this.props.post.optionOnesBarLength+'%', backgroundColor: this.props.post.optionOnesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionOnesColor.toLowerCase()] || this.props.colors.brand}}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionTwosBarLength} style={{ width: this.props.post.optionTwosBarLength+'%', backgroundColor: this.props.post.optionTwosColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionTwosColor.toLowerCase()] || this.props.colors.brand}}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionThreesBarLength} style={{ width: this.props.post.optionThreesBarLength+'%', backgroundColor: this.props.post.optionThreesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionThreesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionFoursBarLength} style={{ width: this.props.post.optionFoursBarLength+'%', backgroundColor: this.props.post.optionFoursColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionFoursColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionFivesBarLength} style={{ width: this.props.post.optionFivesBarLength+'%', backgroundColor: this.props.post.optionFivesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionFivesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionSixesBarLength} style={{ width: this.props.post.optionSixesBarLength+'%', backgroundColor: this.props.post.optionSixesColor == 'Not Specified' ? this.props.colors.brand : this.props.colors[this.props.post.optionSixesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionOnesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "One" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("optionOnesVotes", "One")}} disabled={this.props.post.pollVoteChanging}>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionOnesBarLength.toFixed(2)}% </PollPostSubTitle>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionTwosVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Two" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("optionTwosVotes", "Two")}}>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionTwosBarLength.toFixed(2)}% </PollPostSubTitle>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionThreesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Three" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("optionThreesVotes", "Three")}}>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionThreesBarLength.toFixed(2)}% </PollPostSubTitle>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFoursVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Four" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("optionFoursVotes", "Four")}}>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFoursBarLength.toFixed(2)}% </PollPostSubTitle>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFivesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Five" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("optionFivesVotes", "Five")}}>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFivesBarLength.toFixed(2)}% </PollPostSubTitle>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionSixesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {this.props.post.votedFor === "Six" ? this.handleRemoveVoteOnPoll() : this.handleVoteOnPoll("optionSixesVotes", "Six")}}>
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
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionSixesBarLength.toFixed(2)}% </PollPostSubTitle>
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
                                <PostsIconFrame onPress={this.upvote}>
                                    <PostsIcons style={{flex: 1, tintColor: this.props.post.upvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                </PostsIconFrame>
                                <PostsIconFrame>
                                    <SubTitle style={{ alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.votes}</SubTitle>
                                </PostsIconFrame>
                                <PostsIconFrame onPress={this.downvote}>
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
                        Total Votes: {this.props.post.optionOnesVotes + this.props.post.optionTwosVotes + this.props.post.optionThreesVotes + this.props.post.optionFoursVotes + this.props.post.optionFivesVotes + this.props.post.optionSixesVotes}
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

    const postProps = {
        navigation,
        post: props.post,
        colors: props.colors,
        colorsIndexNum: props.colorsIndexNum,
        dispatch: props.dispatch,
        serverUrl,
        index: props.index,
        //No useRawImages support yet - Might want to add that in the future
        storedCredentials
    }

    return <PollWithVotes {...postProps}/>
};
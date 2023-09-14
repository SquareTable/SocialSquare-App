import React from 'react';
import { PollClass } from './PollPost';
import { ActivityIndicator } from 'react-native';
import { PostsIconFrame } from '../../screens/screenStylings/styling';
import { getTimeFromUTCMS } from '../../libraries/Time';

class PollWithVotes extends PollClass {
    constructor(props) {
        super(props);
    }

    openOptionOne() {
        alert('Coming soon')
    }

    openOptionTwo() {
        alert('Coming soon')
    }

    openOptionThree() {
        alert('Coming soon')
    }

    openOptionFour() {
        alert('Coming soon')
    }

    openOptionFive() {
        alert('Coming soon')
    }

    openOptionSix() {
        alert('Coming soon')
    }

    optionOneInfoState = false; //Temporary
    optionTwoInfoState = false; //Temporary
    optionThreeInfoState = false; //Temporary
    optionFourInfoState = false; //Temporary
    optionFiveInfoState = false; //Temporary
    optionSixInfoState = false; //Temporary

    shouldComponentUpdate(nextProps, nextState) {
        const upvoteIsSame = nextProps.post.upvoted === this.props.post.upvoted;
        const downvoteIsSame = nextProps.post.downvoted === this.props.post.downvoted;
        const changingVoteIsSame = nextProps.post.changingVote === this.props.post.changingVote;
        const colorsAreSame = nextProps.colorsIndexNum === this.props.colorsIndexNum;
        const pollIdIsSame = nextProps.post.pollId === this.props.post.pollId;
        const deletingIsSame = nextProps.post.deleting === this.props.post.deleting;
        const profilePictureIsSame = nextProps.post.pfpB64 === this.props.post.pfpB64;
        const voteOneSame = nextProps.post.optionOnesVotes === this.props.post.optionOnesVotes;
        const voteTwoSame = nextProps.post.optionTwosVotes === this.props.post.optionTwosVotes;
        const voteThreeSame = nextProps.post.optionThreesVotes === this.props.post.optionThreesVotes;
        const voteFourSame = nextProps.post.optionFoursVotes === this.props.post.optionFoursVotes;
        const voteFiveSame = nextProps.post.optionFivesVotes === this.props.post.optionFivesVotes;
        const voteSixSame = nextProps.post.optionSixesVotes === this.props.post.optionSixesVotes;


        if (upvoteIsSame && downvoteIsSame && changingVoteIsSame && colorsAreSame && pollIdIsSame && deletingIsSame && profilePictureIsSame && voteOneSame && voteTwoSame && voteThreeSame && voteFourSame && voteFiveSame && voteSixSame) return false;

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
                            <PostCreatorIcon source={{uri: this.props.post.creatorPfpB64}}/>
                        </PostsVerticalView>
                        <PostsVerticalView style={{marginTop: 9}}>
                            <SubTitle style={{fontSize: 20, color: this.props.colors.brand, marginBottom: 0}}>{this.props.post.creatorDisplayName}</SubTitle>
                            <SubTitle style={{fontSize: 12, marginBottom: 0, color: this.props.colors.tertiary}}>@{this.props.post.creatorName}</SubTitle>
                        </PostsVerticalView>
                    </PostsHorizontalView>
                    <PollPostTitle viewPage={true}>
                        {this.props.post.pollTitle || "Couldn't recieve poll title"}
                    </PollPostTitle>
                    <PollPostSubTitle style={{color: colors.tertiary}} viewPage={true}>
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
                    <PollBarItem borderChange={this.props.post.optionOnesBarLength} style={{ width: this.props.post.optionOnesBarLength+'%', backgroundColor: this.props.optionOnesColor == 'Not Specified' ? colors.brand : colors[this.props.optionOnesColor.toLowerCase()] || this.props.colors.brand}}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionTwosBarLength} style={{ width: this.props.post.optionTwosBarLength+'%', backgroundColor: this.props.optionTwosColor == 'Not Specified' ? colors.brand : colors[this.props.optionTwosColor.toLowerCase()] || this.props.colors.brand}}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionThreesBarLength} style={{ width: this.props.post.optionThreesBarLength+'%', backgroundColor: this.props.optionThreesColor == 'Not Specified' ? colors.brand : colors[this.props.optionThreesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionFoursBarLength} style={{ width: this.props.post.optionFoursBarLength+'%', backgroundColor: this.props.optionFoursColor == 'Not Specified' ? colors.brand : colors[this.props.optionFoursColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionFivesBarLength} style={{ width: this.props.post.optionFivesBarLength+'%', backgroundColor: this.props.optionFivesColor == 'Not Specified' ? colors.brand : colors[this.props.optionFivesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    <PollBarItem borderChange={this.props.post.optionSixesBarLength} style={{ width: this.props.post.optionSixesBarLength+'%', backgroundColor: this.props.optionSixesColor == 'Not Specified' ? colors.brand : colors[this.props.optionSixesColor.toLowerCase()] || this.props.colors.brand }}></PollBarItem>
                    </PollBarOutline>
                    <PollPostHorizontalView>
                        <PollKeyViewOne pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={openOptionOne}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionOnesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                1. {this.props.post.optionOne || "Couldn't load option one"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionOnesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewOne>
                    </PollPostHorizontalView>
                    
                    <PollPostHorizontalView visible={this.optionOneInfoState}>
                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionOnesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionOnesVotes")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option One </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionOne} </PollPostSubTitle>
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionOnesBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>



                    <PollPostHorizontalView>
                        <PollKeyViewTwo pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={openOptionTwo}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionTwosColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                2. {this.props.post.optionTwo || "Couldn't load option two"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionTwosColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewTwo>
                    </PollPostHorizontalView>
                    
                    <PollPostHorizontalView visible={optionTwoInfoState}>
                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionTwosVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionTwosVotes")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Two </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionTwo} </PollPostSubTitle>
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionTwosBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewThree pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={openOptionThree}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionThreesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                3. {this.props.post.optionThree || "Couldn't load option three"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionThreesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewThree>
                    </PollPostHorizontalView>
                    
                    <PollPostHorizontalView visible={optionThreeInfoState}>
                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionThreesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionThreesVotes")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Three </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionThree} </PollPostSubTitle>
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionThreesBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewFour pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={openOptionFour}>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionFoursColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                4. {this.props.post.optionFour || "Couldn't load option four"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionFoursColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewFour>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView visible={optionFourInfoState}>
                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFoursVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionFoursVotes")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Four </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFour} </PollPostSubTitle>
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFoursBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewFive pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={openOptionFive}>
                        <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionFivesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                5. {this.props.post.optionFive || "Couldn't load option five"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionFivesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={this.props.colors.greyish} />
                        </PollKeyViewFive>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView visible={optionFiveInfoState}>
                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFivesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionFivesVotes")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Five </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFive} </PollPostSubTitle>
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionFivesBarLength.toFixed(2)}% </PollPostSubTitle>
                        </PollHorizontalViewItem>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView>
                        <PollKeyViewSix pollOptions={this.props.post.totalNumberOfOptions} viewPage={true} onPress={openOptionSix}>
                            <Octicons name={"chevron-down"} size={20} color={colors.greyish} />
                            <PollKeysCircle circleColor={this.props.post.optionSixesColor}></PollKeysCircle>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}}>
                                6. {this.props.post.optionSix || "Couldn't load option six"}
                            </PollPostSubTitle>
                            <PollKeysCircle circleColor={this.props.post.optionSixesColor}></PollKeysCircle>
                            <Octicons name={"chevron-down"} size={20} color={colors.greyish} />
                        </PollKeyViewSix>
                    </PollPostHorizontalView>

                    <PollPostHorizontalView visible={optionSixInfoState}>
                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionSixesVotes} </PollPostSubTitle>
                        </PollHorizontalViewItem>

                        <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionSixesVotes")}}>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Option Six </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> {this.props.post.optionSix} </PollPostSubTitle>
                        </PollHorizontalViewItemCenter>

                        <PollHorizontalViewItem>
                            <PollPostSubTitle style={{color: this.props.colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                            <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
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
                                    <PostsIcons style={{flex: 1, tintColor: this.props.upvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                </PostsIconFrame>
                                <PostsIconFrame>
                                    <SubTitle style={{ alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal' }}>{this.props.post.votes}</SubTitle>
                                </PostsIconFrame>
                                <PostsIconFrame onPress={this.downvote}>
                                    <PostsIcons style={{flex: 1, tintColor: this.props.downvoted ? this.props.colors.brand : this.props.colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                </PostsIconFrame>
                            </>
                        }

                        <PostsIconFrame/>

                        <PostsIconFrame>
                            <PostsIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png')}/>
                        </PostsIconFrame>
                        <PostsIconFrame>
                            <PostsIcons style={{flex: 1, height: 30, width: 30, tintColor: this.props.colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/387-share2.png')}/>
                        </PostsIconFrame>
                        <PostsIconFrame>
                            <PostsIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('./../assets/img/ThreeDots.png')}/>
                        </PostsIconFrame>
                    </PostHorizontalView>
                    {typeof message === 'string' || message instanceof String && (
                        <MsgBox type={messageType}>{message}</MsgBox>
                    )}
                    <PollPostSubTitle votesText={true} style={{flex: 1, color: this.props.colors.tertiary}}>
                        Total Votes: {this.props.post.optionOnesVotes + this.props.post.optionTwosVotes + this.props.post.optionThreesVotes + this.props.post.optionFoursVotes + this.props.post.optionFivesVotes + this.props.post.optionSixesVotes}
                    </PollPostSubTitle>
                    <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{getTimeFromUTCMS(this.props.post.datePosted)}</SubTitle>
                    <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: this.props.colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{this.props.post.comments} comments</SubTitle>
                </ViewScreenPollPostFrame>
            </>
        )
    }
}

export default PollWithVotes;
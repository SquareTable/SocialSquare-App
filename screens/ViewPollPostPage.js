import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import {Formik} from 'formik';

// icons
import Octicons from 'react-native-vector-icons/Octicons'

import {
    SubTitle,
    StyledButton,
    ButtonText,
    WelcomeContainer,
    ProfIcons,
    StyledInputLabel,
    StyledTextInput,
    PollPostTitle,
    PollPostSubTitle,
    PollBarOutline,
    PollBarItem,
    PollKeyViewOne,
    PollKeyViewTwo,
    PollKeyViewThree,
    PollKeyViewFour,
    PollKeyViewFive,
    PollKeyViewSix,
    PollKeysCircle,
    PollPostHorizontalView,
    AboveBarPollPostHorizontalView,
    ViewScreenPollPostFrame,
    PollHorizontalViewItem,
    PollHorizontalViewItemCenter,
    ViewScreenPollPostCommentsFrame,
    CommentsContainer,
    CommenterName,
    CommenterIcon,
    CommentsHorizontalView,
    CommentsVerticalView,
    CommentText,
    CommentIcons,
    CommentsHorizontalViewItem,
    VoteText,
    MsgBox,
    PostHorizontalView,
    PostsIconFrame,
    PostsIcons,
    PostsHorizontalView,
    PostsVerticalView,
    PostCreatorIcon,
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

import { View, ImageBackground, ScrollView, SectionList, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import ParseErrorMessage from '../components/ParseErrorMessage';
import { getTimeFromUTCMS } from '../libraries/Time';


const ViewPollPostPage = ({route, navigation}) => {
    const {colors, dark} = useTheme();
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {name } = storedCredentials} else {var {name } = {name: 'SSGUEST'}};
    const { pollTitle, pollSubTitle, optionOne, optionOnesColor, optionOnesVotes, optionOnesBarLength, optionTwo, optionTwosColor, optionTwosVotes, optionTwosBarLength, optionThree, optionThreesColor, optionThreesVotes, optionThreesBarLength, optionFour, optionFoursColor, optionFoursVotes, optionFoursBarLength, optionFive, optionFivesColor, optionFivesVotes, optionFivesBarLength, optionSix, optionSixesColor, optionSixesVotes, optionSixesBarLength, totalNumberOfOptions, pollLikes, pollId, votedFor, creatorPfpB64, creatorName, creatorDisplayName, datePosted} = route.params;
    //Titles use states
    var allDataCollected = {data: {pollTitle: pollTitle, pollSubTitle: pollSubTitle, optionOne: optionOne, optionOnesColor: optionOnesColor, optionOnesVotes: optionOnesVotes, optionOnesBarLength: optionOnesBarLength, optionTwo: optionTwo, optionTwosColor: optionTwosColor, optionTwosVotes: optionTwosVotes, optionTwosBarLength: optionTwosBarLength, optionThree: optionThree, optionThreesColor: optionThreesColor, optionThreesVotes: optionThreesVotes, optionThreesBarLength: optionThreesBarLength, optionFour: optionFour, optionFoursColor: optionFoursColor, optionFoursVotes: optionFoursVotes, optionFoursBarLength: optionFoursBarLength, optionFive: optionFive, optionFivesColor: optionFivesColor, optionFivesVotes: optionFivesVotes, optionFivesBarLength: optionFivesBarLength, optionSix: optionSix, optionSixesColor: optionSixesColor, optionSixesVotes: optionSixesVotes, optionSixesBarLength: optionSixesBarLength, totalNumberOfOptions: totalNumberOfOptions, pollLikes: pollLikes, pollId: pollId, votedFor: votedFor, creatorPfpB64: creatorPfpB64, creatorName: creatorName, creatorDisplayName: creatorName, datePosted}}
    const [objectForAllData, setObjectForAllData] = useState(allDataCollected)
    //
    const [optionOneInfoState, setOptionOneInfoState] = useState(false)
    const [optionTwoInfoState, setOptionTwoInfoState] = useState(false)
    const [optionThreeInfoState, setOptionThreeInfoState] = useState(false)
    const [optionFourInfoState, setOptionFourInfoState] = useState(false)
    const [optionFiveInfoState, setOptionFiveInfoState] = useState(false)
    const [optionSixInfoState, setOptionSixInfoState] = useState(false)
    const [optionOneVoteText, setOptionOneVoteText] = useState("Vote")
    const [optionTwoVoteText, setOptionTwoVoteText] = useState("Vote")
    const [optionThreeVoteText, setOptionThreeVoteText] = useState("Vote")
    const [optionFourVoteText, setOptionFourVoteText] = useState("Vote")
    const [optionFiveVoteText, setOptionFiveVoteText] = useState("Vote")
    const [optionSixVoteText, setOptionSixVoteText] = useState("Vote")
    const [limitVoteTextChange, setLimitVoteTextChange] = useState(false)
    const [likeSubmitting, setLikeSubmitting] = useState(false)
    //Comment stuff
    const [ifCommentText, setIfCommentText] = useState("No comments found")
    const [changeSections, setChangeSections] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [limitSearch, setLimitSearch] = useState(false)
    const [commentLoadMax, setCommentLoadMax] = useState(10)
    const [commentsLength , setCommentsLength] = useState("Loading")
    const [loadingMoreComments, setLoadingMoreComments] = useState(false)
    //change stuff
    const [pollUpOrDownVotes, setPollUpOrDownVotes] = useState("Finding")
    const [initialPollUpOrDownVotes, setInitialPollUpOrDownVotes] = useState("Finding")
    const [pollUpOrDownVoted, setPollUpOrDownVoted] = useState("Finding")
    const [initialPollUpOrDownVoted, setInitialPollUpOrDownVoted] = useState("Finding")
    const [pollVotesForOptions, setPollVotesForOptions] = useState({optionOne: "Finding", optionTwo: "Finding", optionThree: "Finding", optionFour: "Finding", optionFive: "Finding", optionSix: "Finding"})
    const [initialPollVotesForOptions, setInitialPollVotesForOptions] = useState({optionOne: "Finding", optionTwo: "Finding", optionThree: "Finding", optionFour: "Finding", optionFive: "Finding", optionSix: "Finding"})
    const [pollBarLengths, setPollBarLengths] = useState({optionOnesBarLength: 0, optionTwosBarLength: 0, optionThreesBarLength: 0, optionFoursBarLength: 0, optionFivesBarLength:0, optionSixesBarLength: 0})
    const [pollVoteOption, setPollVoteOption] = useState("Finding")
    const [pollinitialVoteOption, setPollinitialVoteOption] = useState("Finding")
    //PFP
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
    //Server stuff
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const StatusBarHeight = useContext(StatusBarHeightContext);

    //get image of post
    async function getImageInPost(imageData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageData[index].imageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }
    //profile image of creator
    async function getImageInPfp(imageData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageData[index].creatorPfpKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }
    //profile image of commenter
    async function getImageInPfpComments(commentData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${commentData[index].profileImageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }

    const layoutPollPosts = (data) => {
        console.log("here is data")
        console.log(data)
        var pollData = data.data
        console.log(pollData)
        console.log(pollData.length) 
        var optionOnesBarLength = 16.6666666667
        var optionTwosBarLength = 16.6666666667
        var optionThreesBarLength = 16.6666666667
        var optionFoursBarLength = 16.6666666667
        var optionFivesBarLength = 16.6666666667
        var optionSixesBarLength = 16.6666666667
        var totalVotes = pollData[0].optionOnesVotes+pollData[0].optionTwosVotes+pollData[0].optionThreesVotes+pollData[0].optionFoursVotes+pollData[0].optionFivesVotes+pollData[0].optionSixesVotes
        if (totalVotes !== 0) {
            optionOnesBarLength = (pollData[0].optionOnesVotes/totalVotes)*100
            console.log("O1 BL")
            console.log(optionOnesBarLength)
            optionTwosBarLength = (pollData[0].optionTwosVotes/totalVotes)*100
            console.log("O2 BL")
            console.log(optionTwosBarLength)
            optionThreesBarLength = (pollData[0].optionThreesVotes/totalVotes)*100
            console.log("O3 BL")
            console.log(optionThreesBarLength)
            optionFoursBarLength = (pollData[0].optionFoursVotes/totalVotes)*100
            console.log("O4 BL")
            console.log(optionFoursBarLength)
            optionFivesBarLength = (pollData[0].optionFivesVotes/totalVotes)*100
            console.log("O5 BL")
            console.log(optionFivesBarLength)
            optionSixesBarLength = (pollData[0].optionSixesVotes/totalVotes)*100
            console.log("O6 BL")
            console.log(optionSixesBarLength)
            if (Number.isNaN(optionOnesBarLength)) {
                optionOnesBarLength = 0
            }
            if (Number.isNaN(optionTwosBarLength)) {
                optionTwosBarLength = 0
            }
            if (Number.isNaN(optionThreesBarLength)) {
                optionThreesBarLength = 0
            }
            if (Number.isNaN(optionFoursBarLength)) {
                optionFoursBarLength = 0
            }
            if (Number.isNaN(optionFivesBarLength)) {
                optionFivesBarLength = 0
            }
            if (Number.isNaN(optionSixesBarLength)) {
                optionSixesBarLength = 0
            }
            setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
        } else {
            if (totalVotes == 0) {
                console.log("No Votes")
                if (pollData[0].totalNumberOfOptions == "Two") {
                    optionOnesBarLength = 100/2
                    optionTwosBarLength = 100/2
                    optionThreesBarLength = 0
                    optionFoursBarLength = 0
                    optionFivesBarLength = 0
                    optionSixesBarLength = 0
                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                } else if (pollData[0].totalNumberOfOptions == "Three") {
                    optionOnesBarLength = 100/3
                    optionTwosBarLength = 100/3
                    optionThreesBarLength = 100/3
                    optionFoursBarLength = 0
                    optionFivesBarLength = 0
                    optionSixesBarLength = 0
                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                } else if (pollData[0].totalNumberOfOptions == "Four") {
                    optionOnesBarLength = 100/4
                    optionTwosBarLength = 100/4
                    optionThreesBarLength = 100/4
                    optionFoursBarLength = 100/4
                    optionFivesBarLength = 0
                    optionSixesBarLength = 0
                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                } else if (pollData[0].totalNumberOfOptions == "Five") {
                    optionOnesBarLength = 100/5
                    optionTwosBarLength = 100/5
                    optionThreesBarLength = 100/5
                    optionFoursBarLength = 100/5
                    optionFivesBarLength = 100/5
                    optionSixesBarLength = 0
                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                } else if (pollData[0].totalNumberOfOptions == "Six") {
                    optionOnesBarLength = 100/6
                    optionTwosBarLength = 100/6
                    optionThreesBarLength = 100/6
                    optionFoursBarLength = 100/6
                    optionFivesBarLength = 100/6
                    optionSixesBarLength = 100/6
                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                }
            }
        }
    }

    //Change to voted
    const prepareVotedandUpVoted = () => {
        const changeVoteTexts = (data) => {
            //set initial values
            const pollData = data.data[0]
            setPollUpOrDownVoted(pollData.pollUpOrDownVoted)
            setInitialPollUpOrDownVoted(pollData.pollUpOrDownVoted)
            setPollUpOrDownVotes(pollData.pollUpOrDownVotes)
            setPollVoteOption(pollData.votedFor)
            setPollinitialVoteOption(pollData.votedFor)
            setInitialPollVotesForOptions({optionOne: pollData.optionOnesVotes, optionTwo: pollData.optionTwosVotes, optionThree: pollData.optionThreesVotes, optionFour: pollData.optionFoursVotes, optionFive: pollData.optionFivesVotes, optionSix: pollData.optionSixesVotes})
            setPollVotesForOptions({optionOne: pollData.optionOnesVotes, optionTwo: pollData.optionTwosVotes, optionThree: pollData.optionThreesVotes, optionFour: pollData.optionFoursVotes, optionFive: pollData.optionFivesVotes, optionSix: pollData.optionSixesVotes})
        }
        const url = serverUrl + "/tempRoute/searchforpollpostsbyid";
    
        var toSend = {"pollId": pollId}

        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
    
            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                changeVoteTexts({data});
                layoutPollPosts({data});
            }
            //setSubmitting(false);
        }).catch(error => {
            console.error(error);
            //setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    if (limitVoteTextChange == false) {
        setLimitVoteTextChange(true);
        prepareVotedandUpVoted();
    }

    //

    const Item = ({commentId, commenterName, commenterDisplayName, commentsText, commentUpVotes, commentReplies, datePosted, commenterImageB64}) => (
        <CommentsContainer>
            <CommentsHorizontalView>
                <CommentsVerticalView alongLeft={true}>
                    <TouchableOpacity>
                        <CommenterIcon source={{uri: commenterImageB64}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <VoteText style={{color: colors.tertiary}}>
                            {commentUpVotes}
                        </VoteText>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <CommentIcons downVoteButton={true} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                    </TouchableOpacity>
                </CommentsVerticalView>
                <CommentsVerticalView>
                    <TouchableOpacity>
                        <CommenterName style={{color: colors.tertiary}} displayName={true}>{commenterDisplayName}</CommenterName>
                        <CommenterName>@{commenterName}</CommenterName>
                    </TouchableOpacity>
                    <CommentText style={{color: colors.tertiary}}>{commentsText}</CommentText>
                </CommentsVerticalView>
            </CommentsHorizontalView>
            <CommentsHorizontalView bottomIcons={true}>
                <CommentsVerticalView alongLeft={true}>
                    <TouchableOpacity>
                        <CommentIcons source={require('./../assets/img/ThreeDots.png')}/>
                    </TouchableOpacity>
                </CommentsVerticalView>
                <CommentsVerticalView datePosted={true}>
                    <VoteText style={{color: colors.tertiary}}>
                        {datePosted}
                    </VoteText>
                    <TouchableOpacity onPress={() => {navigation.navigate("CommentViewPage", {commentId: commentId, postId: pollId, postFormat: "Poll"})}}>
                        <VoteText style={{color: colors.brand}}>
                            {commentReplies} replies
                        </VoteText>
                    </TouchableOpacity>
                </CommentsVerticalView>
                <CommentsVerticalView alongLeft={true}>
                    <TouchableOpacity>
                        <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/107-reply.png')}/>
                    </TouchableOpacity>
                </CommentsVerticalView>
            </CommentsHorizontalView>
        </CommentsContainer>
    );

    const prepareComments = () => {
        setIfCommentText("No comments found")
        const layoutPollComments = (data) => {
            setIfCommentText("Poll Comments:")
            var pollData = data.data
            var commentData = pollData
            console.log(commentData)
            setCommentsLength(commentData.length)
            setChangeSections([])
            console.log(commentData.length)
            var tempSections = []
            var itemsProcessed = 0;
            commentData.forEach(function (item, index) {
                if (index+1 <= commentLoadMax) {
                    var displayName = commentData[index].commenterDisplayName
                    if (displayName == "") {
                        displayName = commentData[index].commenterName
                    }
                    //get pfp
                    if (commentData[index].profileImageKey !== "" || data !== null) {
                        async function getImageWithAwait() {
                            const pfpB64 = await getImageInPfpComments(pollData, index)
                            var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, commentReplies: commentData[index].commentReplies, datePosted: commentData[index].datePosted, commenterImageB64: pfpB64}]}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === pollData.length) {
                                console.log(tempSections)
                                setLoadingMoreComments(false)
                                setChangeSections(tempSections) 
                            }
                        }
                        getImageWithAwait();
                    } else {
                        //add to list
                        var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, commentReplies: commentData[index].commentReplies, datePosted: commentData[index].datePosted, commenterImageB64: require("./../assets/img/Logo.png")}]}
                        tempSections.push(tempSectionsTemp)
                        itemsProcessed++;
                        if(itemsProcessed === pollData.length) {
                            console.log(tempSections)
                            setLoadingMoreComments(false)
                            setChangeSections(tempSections)
                        }
                    }
                }
            });
        }

        const url = `${serverUrl}/tempRoute/searchforpollcomments`;
        const toSend = {
            pollId
        }
        setLoadingMoreComments(true)
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setLoadingMoreComments(false)
            } else {
                layoutPollComments({data});
            }
            //setSubmitting(false);

        }).catch(error => {
            console.error(error);
            //setSubmitting(false);
            setLoadingMoreComments(false)
            handleMessage(ParseErrorMessage(error));
        })
    }

    if (limitSearch == false) {
        setLimitSearch(true);
        prepareComments();
    }
    
    const handleCommentPost = (commentProperties, setSubmitting) => {
        handleMessage(null);
        const url = serverUrl + "/tempRoute/pollpostcomment";

        axios.post(url, commentProperties).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                handleMessage("Comment Uploaded", "SUCCESS");
                prepareComments()
                //persistLogin({...data[0]}, message, status);
            }
            setSubmitting(false);

        }).catch(error => {
            console.error(error);
            setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    const handleVoteOnPoll = (optionSelected) => {
        if (storedCredentials) {
            handleMessage(null);
            console.log(optionSelected)
            const url = serverUrl + "/tempRoute/voteonpoll";

            var toSend = {optionSelected: optionSelected, pollId: pollId}

            console.log(toSend)

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                } else {
                    handleMessage(message, status);
                    console.log("Message:")
                    console.log(message)
                    var lastVote = data.lastVote
                    console.log("Last Vote:")
                    console.log(lastVote)
                    if (message == "Vote successful") {
                        //voted
                        var optionOnesBarLength = 16.6666666667
                        var optionTwosBarLength = 16.6666666667
                        var optionThreesBarLength = 16.6666666667
                        var optionFoursBarLength = 16.6666666667
                        var optionFivesBarLength = 16.6666666667
                        var optionSixesBarLength = 16.6666666667
                        var o1V = initialPollVotesForOptions.optionOne
                        var o2V = initialPollVotesForOptions.optionTwo
                        var o3V = initialPollVotesForOptions.optionThree
                        var o4V = initialPollVotesForOptions.optionFour
                        var o5V = initialPollVotesForOptions.optionFive
                        var o6V = initialPollVotesForOptions.optionSix
                        //Change depending on initial
                        if (pollVoteOption == "None") {
                            if (optionSelected == "optionOnesVotes") {
                                o1V = o1V+1
                            } else if (optionSelected == "optionTwosVotes") {
                                o2V = o2V+1
                            } else if (optionSelected == "optionThreesVotes") {
                                o3V = o3V+1
                            } else if (optionSelected == "optionFoursVotes") {
                                o4V = o4V+1
                            } else if (optionSelected == "optionFivesVotes") {
                                o5V = o5V+1
                            } else {
                                //six
                                o6V = o6V+1
                            }
                        } else if (pollVoteOption == "One") {
                            o1V = o1V-1
                            if (optionSelected == "optionOnesVotes") {
                                o1V = o1V+1
                            } else if (optionSelected == "optionTwosVotes") {
                                o2V = o2V+1
                            } else if (optionSelected == "optionThreesVotes") {
                                o3V = o3V+1
                            } else if (optionSelected == "optionFoursVotes") {
                                o4V = o4V+1
                            } else if (optionSelected == "optionFivesVotes") {
                                o5V = o5V+1
                            } else {
                                //six
                                o6V = o6V+1
                            }
                        } else if (pollVoteOption == "Two") {
                            o2V = o2V-1
                            if (optionSelected == "optionOnesVotes") {
                                o1V = o1V+1
                            } else if (optionSelected == "optionTwosVotes") {
                                o2V = o2V+1
                            } else if (optionSelected == "optionThreesVotes") {
                                o3V = o3V+1
                            } else if (optionSelected == "optionFoursVotes") {
                                o4V = o4V+1
                            } else if (optionSelected == "optionFivesVotes") {
                                o5V = o5V+1
                            } else {
                                //six
                                o6V = o6V+1
                            }
                        } else if (pollVoteOption == "Three") {
                            o3V = o3V-1
                            if (optionSelected == "optionOnesVotes") {
                                o1V = o1V+1
                            } else if (optionSelected == "optionTwosVotes") {
                                o2V = o2V+1
                            } else if (optionSelected == "optionThreesVotes") {
                                o3V = o3V+1
                            } else if (optionSelected == "optionFoursVotes") {
                                o4V = o4V+1
                            } else if (optionSelected == "optionFivesVotes") {
                                o5V = o5V+1
                            } else {
                                //six
                                o6V = o6V+1
                            }
                        } else if (pollVoteOption == "Four") {
                            o4V = o4V-1
                            if (optionSelected == "optionOnesVotes") {
                                o1V = o1V+1
                            } else if (optionSelected == "optionTwosVotes") {
                                o2V = o2V+1
                            } else if (optionSelected == "optionThreesVotes") {
                                o3V = o3V+1
                            } else if (optionSelected == "optionFoursVotes") {
                                o4V = o4V+1
                            } else if (optionSelected == "optionFivesVotes") {
                                o5V = o5V+1
                            } else {
                                //six
                                o6V = o6V+1
                            }
                        } else if (pollVoteOption == "Five") {
                            o5V = o5V-1
                            if (optionSelected == "optionOnesVotes") {
                                o1V = o1V+1
                            } else if (optionSelected == "optionTwosVotes") {
                                o2V = o2V+1
                            } else if (optionSelected == "optionThreesVotes") {
                                o3V = o3V+1
                            } else if (optionSelected == "optionFoursVotes") {
                                o4V = o4V+1
                            } else if (optionSelected == "optionFivesVotes") {
                                o5V = o5V+1
                            } else {
                                //six
                                o6V = o6V+1
                            }
                        } else {
                            o6V = o6V-1
                            if (optionSelected == "optionOnesVotes") {
                                o1V = o1V+1
                            } else if (optionSelected == "optionTwosVotes") {
                                o2V = o2V+1
                            } else if (optionSelected == "optionThreesVotes") {
                                o3V = o3V+1
                            } else if (optionSelected == "optionFoursVotes") {
                                o4V = o4V+1
                            } else if (optionSelected == "optionFivesVotes") {
                                o5V = o5V+1
                            } else {
                                //six
                                o6V = o6V+1
                            }
                        }
                        var totalVotes = o1V+o2V+o3V+o4V+o5V+o6V
                        optionOnesBarLength = (o1V/totalVotes)*100
                        console.log("O1 BL")
                        console.log(optionOnesBarLength)
                        optionTwosBarLength = (o2V/totalVotes)*100
                        console.log("O2 BL")
                        console.log(optionTwosBarLength)
                        optionThreesBarLength = (o3V/totalVotes)*100
                        console.log("O3 BL")
                        console.log(optionThreesBarLength)
                        optionFoursBarLength = (o4V/totalVotes)*100
                        console.log("O4 BL")
                        console.log(optionFoursBarLength)
                        optionFivesBarLength = (o5V/totalVotes)*100
                        console.log("O5 BL")
                        console.log(optionFivesBarLength)
                        optionSixesBarLength = (o6V/totalVotes)*100
                        console.log("O6 BL")
                        console.log(optionSixesBarLength)
                        if (Number.isNaN(optionOnesBarLength)) {
                            optionOnesBarLength = 0
                        }
                        if (Number.isNaN(optionTwosBarLength)) {
                            optionTwosBarLength = 0
                        }
                        if (Number.isNaN(optionThreesBarLength)) {
                            optionThreesBarLength = 0
                        }
                        if (Number.isNaN(optionFoursBarLength)) {
                            optionFoursBarLength = 0
                        }
                        if (Number.isNaN(optionFivesBarLength)) {
                            optionFivesBarLength = 0
                        }
                        if (Number.isNaN(optionSixesBarLength)) {
                            optionSixesBarLength = 0
                        }
                        if (optionSelected == "optionOnesVotes") {
                            setOptionOneVoteText("Voted")
                            setOptionTwoVoteText("Vote")
                            setOptionThreeVoteText("Vote")
                            setOptionFourVoteText("Vote")
                            setOptionFiveVoteText("Vote")
                            setOptionSixVoteText("Vote")
                        } else if (optionSelected == "optionTwosVotes") {
                            setOptionOneVoteText("Vote")
                            setOptionTwoVoteText("Voted")
                            setOptionThreeVoteText("Vote")
                            setOptionFourVoteText("Vote")
                            setOptionFiveVoteText("Vote")
                            setOptionSixVoteText("Vote")
                        } else if (optionSelected == "optionThreesVotes") {
                            setOptionOneVoteText("Vote")
                            setOptionTwoVoteText("Vote")
                            setOptionThreeVoteText("Voted")
                            setOptionFourVoteText("Vote")
                            setOptionFiveVoteText("Vote")
                            setOptionSixVoteText("Vote")
                        } else if (optionSelected == "optionFoursVotes") {
                            setOptionOneVoteText("Vote")
                            setOptionTwoVoteText("Vote")
                            setOptionThreeVoteText("Vote")
                            setOptionFourVoteText("Voted")
                            setOptionFiveVoteText("Vote")
                            setOptionSixVoteText("Vote")
                        } else if (optionSelected == "optionFivesVotes") {
                            setOptionOneVoteText("Vote")
                            setOptionTwoVoteText("Vote")
                            setOptionThreeVoteText("Vote")
                            setOptionFourVoteText("Vote")
                            setOptionFiveVoteText("Voted")
                            setOptionSixVoteText("Vote")
                        } else {
                            setOptionOneVoteText("Vote")
                            setOptionTwoVoteText("Vote")
                            setOptionThreeVoteText("Vote")
                            setOptionFourVoteText("Vote")
                            setOptionFiveVoteText("Vote")
                            setOptionSixVoteText("Voted")
                        }
                        setPollVotesForOptions({optionOne: o1V, optionTwo: o2V, optionThree: o3V, optionFour: o4V, optionFive: o5V, optionSix: o6V})
                        setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                    } else {
                        //pulled
                        console.log("Change based on pull")
                        var optionOnesBarLength = 16.6666666667
                        var optionTwosBarLength = 16.6666666667
                        var optionThreesBarLength = 16.6666666667
                        var optionFoursBarLength = 16.6666666667
                        var optionFivesBarLength = 16.6666666667
                        var optionSixesBarLength = 16.6666666667
                        var o1V = initialPollVotesForOptions.optionOne
                        var o2V = initialPollVotesForOptions.optionTwo
                        var o3V = initialPollVotesForOptions.optionThree
                        var o4V = initialPollVotesForOptions.optionFour
                        var o5V = initialPollVotesForOptions.optionFive
                        var o6V = initialPollVotesForOptions.optionSix
                        if (o1V !== "Finding") {
                            if (pollVoteOption == "One") {
                                o1V = o1V-1
                            } else if (pollVoteOption == "Two") {
                                o2V = o2V-1
                            } else if (pollVoteOption == "Three") {
                                o3V = o3V-1
                            } else if (pollVoteOption == "Four") {
                                o4V = o4V-1
                            } else if (pollVoteOption == "Five") {
                                o5V = o5V-1
                            } else if (pollVoteOption == "Six") {
                                o6V = o6V-1
                            } else {
                                //Initial Poll Vote Option Would Be None
                                //Keep original
                                o1V = initialPollVotesForOptions.optionOne
                                o2V = initialPollVotesForOptions.optionTwo
                                o3V = initialPollVotesForOptions.optionThree
                                o4V = initialPollVotesForOptions.optionFour
                                o5V = initialPollVotesForOptions.optionFive
                                o6V = initialPollVotesForOptions.optionSix
                            }
                            var totalVotes = o1V+o2V+o3V+o4V+o5V+o6V
                            console.log("Total Votes:")
                            console.log(totalVotes)
                            if (totalVotes == 0) {
                                console.log("No Votes")
                                if (totalNumberOfOptions == "Two") {
                                    optionOnesBarLength = 100/2
                                    optionTwosBarLength = 100/2
                                    optionThreesBarLength = 0
                                    optionFoursBarLength = 0
                                    optionFivesBarLength = 0
                                    optionSixesBarLength = 0
                                    setPollVotesForOptions({optionOne: o1V, optionTwo: o2V, optionThree: o3V, optionFour: o4V, optionFive: o5V, optionSix: o6V})
                                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                                } else if (totalNumberOfOptions == "Three") {
                                    optionOnesBarLength = 100/3
                                    optionTwosBarLength = 100/3
                                    optionThreesBarLength = 100/3
                                    optionFoursBarLength = 0
                                    optionFivesBarLength = 0
                                    optionSixesBarLength = 0
                                    setPollVotesForOptions({optionOne: o1V, optionTwo: o2V, optionThree: o3V, optionFour: o4V, optionFive: o5V, optionSix: o6V})
                                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                                } else if (totalNumberOfOptions == "Four") {
                                    optionOnesBarLength = 100/4
                                    optionTwosBarLength = 100/4
                                    optionThreesBarLength = 100/4
                                    optionFoursBarLength = 100/4
                                    optionFivesBarLength = 0
                                    optionSixesBarLength = 0
                                    setPollVotesForOptions({optionOne: o1V, optionTwo: o2V, optionThree: o3V, optionFour: o4V, optionFive: o5V, optionSix: o6V})
                                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                                } else if (totalNumberOfOptions == "Five") {
                                    optionOnesBarLength = 100/5
                                    optionTwosBarLength = 100/5
                                    optionThreesBarLength = 100/5
                                    optionFoursBarLength = 100/5
                                    optionFivesBarLength = 100/5
                                    optionSixesBarLength = 0
                                    setPollVotesForOptions({optionOne: o1V, optionTwo: o2V, optionThree: o3V, optionFour: o4V, optionFive: o5V, optionSix: o6V})
                                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                                } else {
                                    optionOnesBarLength = 100/6
                                    optionTwosBarLength = 100/6
                                    optionThreesBarLength = 100/6
                                    optionFoursBarLength = 100/6
                                    optionFivesBarLength = 100/6
                                    optionSixesBarLength = 100/6
                                    setPollVotesForOptions({optionOne: o1V, optionTwo: o2V, optionThree: o3V, optionFour: o4V, optionFive: o5V, optionSix: o6V})
                                    setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                                }
                            } else {
                                console.log("Pulled results")
                                optionOnesBarLength = (o1V/totalVotes)*100
                                console.log("O1 BL")
                                console.log(optionOnesBarLength)
                                optionTwosBarLength = (o2V/totalVotes)*100
                                console.log("O2 BL")
                                console.log(optionTwosBarLength)
                                optionThreesBarLength = (o3V/totalVotes)*100
                                console.log("O3 BL")
                                console.log(optionThreesBarLength)
                                optionFoursBarLength = (o4V/totalVotes)*100
                                console.log("O4 BL")
                                console.log(optionFoursBarLength)
                                optionFivesBarLength = (o5V/totalVotes)*100
                                console.log("O5 BL")
                                console.log(optionFivesBarLength)
                                optionSixesBarLength = (o6V/totalVotes)*100
                                console.log("O6 BL")
                                console.log(optionSixesBarLength)
                                if (Number.isNaN(optionOnesBarLength)) {
                                    optionOnesBarLength = 0
                                }
                                if (Number.isNaN(optionTwosBarLength)) {
                                    optionTwosBarLength = 0
                                }
                                if (Number.isNaN(optionThreesBarLength)) {
                                    optionThreesBarLength = 0
                                }
                                if (Number.isNaN(optionFoursBarLength)) {
                                    optionFoursBarLength = 0
                                }
                                if (Number.isNaN(optionFivesBarLength)) {
                                    optionFivesBarLength = 0
                                }
                                if (Number.isNaN(optionSixesBarLength)) {
                                    optionSixesBarLength = 0
                                }
                            }
                            setPollVotesForOptions({optionOne: o1V, optionTwo: o2V, optionThree: o3V, optionFour: o4V, optionFive: o5V, optionSix: o6V})
                            setPollBarLengths({optionOnesBarLength: optionOnesBarLength, optionTwosBarLength: optionTwosBarLength, optionThreesBarLength: optionThreesBarLength, optionFoursBarLength: optionFoursBarLength, optionFivesBarLength: optionFivesBarLength, optionSixesBarLength: optionSixesBarLength})
                        } else {
                            handleMessage("Page didn't fully load try again", "FAILED")
                        }    
                    }
                    //loadAndGetValues()
                    //persistLogin({...data[0]}, message, status);
                }
                setSubmitting(false);

            }).catch(error => {
                console.error(error);
                setSubmitting(false);
                handleMessage(ParseErrorMessage(error));
            })
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const UpVotePoll = () => {
        if (storedCredentials) {
            //Change to loading circle
            const beforeChange = pollUpOrDownVoted
            setPollUpOrDownVoted("Changing")
            //Do rest
            handleMessage(null, null, null);
            const url = serverUrl + "/tempRoute/upvotepoll";

            var toSend = {pollId: pollId}

            console.log(toSend)

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
            
                if (status !== 'SUCCESS') {
                    handleMessage(message, status, postNum);
                    setPollUpOrDownVoted(beforeChange)
                } else {
                    handleMessage(message, status);
                    if (message == "Post UpVoted") {
                        setPollUpOrDownVoted("UpVoted")
                    } else {
                        setPollUpOrDownVoted("Neither")
                    }
                    //loadAndGetValues()
                    //persistLogin({...data[0]}, message, status);
                }
            }).catch(error => {
                console.error(error);
                setPollUpOrDownVoted(beforeChange)
                handleMessage(ParseErrorMessage(error), 'FAILED', postNum);
            })
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const DownVotePoll = () => {
        if (storedCredentials) {
            //Change to loading circle
            const beforeChange = pollUpOrDownVoted
            setPollUpOrDownVoted("Changing")
            //Do rest
            handleMessage(null, null, null);
            const url = serverUrl + "/tempRoute/downvotepoll";

            var toSend = {pollId: pollId}

            console.log(toSend)

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
            
                if (status !== 'SUCCESS') {
                    handleMessage(message, status, postNum);
                    setPollUpOrDownVoted(beforeChange)
                } else {
                    handleMessage(message, status);
                    if (message == "Post DownVoted") {
                        setPollUpOrDownVoted("DownVoted")
                    } else {
                        setPollUpOrDownVoted("Neither")
                    }
                    //loadAndGetValues()
                    //persistLogin({...data[0]}, message, status);
                }
            }).catch(error => {
                console.error(error);
                setPollUpOrDownVoted(beforeChange)
                handleMessage(ParseErrorMessage(error), 'FAILED', postNum);
            })
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const openOptionOne = () => {
        if (optionOneInfoState !== true) {
            setOptionOneInfoState(true)
        } else {
            setOptionOneInfoState(false)
        }
    }

    const openOptionTwo = () => {
        if (optionTwoInfoState !== true) {
            setOptionTwoInfoState(true)
        } else {
            setOptionTwoInfoState(false)
        }
    }

    const openOptionThree = () => {
        if (optionThreeInfoState !== true) {
            setOptionThreeInfoState(true)
        } else {
            setOptionThreeInfoState(false)
        }
    }

    const openOptionFour = () => {
        if (optionFourInfoState !== true) {
            setOptionFourInfoState(true)
        } else {
            setOptionFourInfoState(false)
        }
    }

    const openOptionFive = () => {
        if (optionFiveInfoState !== true) {
            setOptionFiveInfoState(true)
        } else {
            setOptionFiveInfoState(false)
        }
    }

    const openOptionSix = () => {
        if (optionSixInfoState !== true) {
            setOptionSixInfoState(true)
        } else {
            setOptionSixInfoState(false)
        }
    }

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{creatorDisplayName ? creatorDisplayName : creatorName}'s poll</TestText>
            </ChatScreen_Title>
            <ScrollView style={{backgroundColor: colors.primary}}>
                <WelcomeContainer style={{backgroundColor: colors.primary, paddingTop: 0}}>
                    <WelcomeContainer style={{backgroundColor: colors.primary, paddingTop: 0}}>
                        <ViewScreenPollPostFrame style={{width: '100%'}}>
                            <PostsHorizontalView style={{borderBottomWidth: 3, borderColor: colors.darkLight, width: '100%', paddingBottom: 5}}>
                                <PostsVerticalView>
                                    <PostCreatorIcon source={{uri: creatorPfpB64}}/>
                                </PostsVerticalView>
                                <PostsVerticalView style={{marginTop: 9}}>
                                    <SubTitle style={{fontSize: 20, color: colors.brand, marginBottom: 0}}>{creatorDisplayName}</SubTitle>
                                    <SubTitle style={{fontSize: 12, marginBottom: 0, color: colors.tertiary}}>@{creatorName}</SubTitle>
                                </PostsVerticalView>
                            </PostsHorizontalView>
                            <PollPostTitle viewPage={true}>
                                {objectForAllData.data.pollTitle || "Couldn't recieve data"}
                            </PollPostTitle>
                            <PollPostSubTitle style={{color: colors.tertiary}} viewPage={true}>
                                {objectForAllData.data.pollSubTitle || "Couldn't recieve data"}
                            </PollPostSubTitle>
                            <AboveBarPollPostHorizontalView viewPage={true}>
                                <PollPostSubTitle style={{width: pollBarLengths.optionOnesBarLength+'%', color: colors.tertiary}}>
                                    1
                                </PollPostSubTitle>
                                <PollPostSubTitle style={{width: pollBarLengths.optionTwosBarLength+'%', color: colors.tertiary }}>
                                    2
                                </PollPostSubTitle>
                                <PollPostSubTitle style={{width: pollBarLengths.optionThreesBarLength+'%', color: colors.tertiary }}>
                                    3
                                </PollPostSubTitle>
                                <PollPostSubTitle style={{width: pollBarLengths.optionFoursBarLength+'%', color: colors.tertiary }}>
                                    4
                                </PollPostSubTitle>
                                <PollPostSubTitle style={{width: pollBarLengths.optionFivesBarLength+'%', color: colors.tertiary }}>
                                    5
                                </PollPostSubTitle>
                                <PollPostSubTitle style={{width: pollBarLengths.optionSixesBarLength+'%', color: colors.tertiary }}>
                                    6
                                </PollPostSubTitle>
                            </AboveBarPollPostHorizontalView>
                            <PollBarOutline>
                            <PollBarItem borderChange={optionOnesBarLength} style={{ width: optionOnesBarLength+'%', backgroundColor: optionOnesColor == 'Not Specified' ? colors.brand : colors[optionOnesColor.toLowerCase()] || colors.brand}}></PollBarItem>
                            <PollBarItem borderChange={optionTwosBarLength} style={{ width: optionTwosBarLength+'%', backgroundColor: optionTwosColor == 'Not Specified' ? colors.brand : colors[optionTwosColor.toLowerCase()] || colors.brand}}></PollBarItem>
                            <PollBarItem borderChange={optionThreesBarLength} style={{ width: optionThreesBarLength+'%', backgroundColor: optionThreesColor == 'Not Specified' ? colors.brand : colors[optionThreesColor.toLowerCase()] || colors.brand }}></PollBarItem>
                            <PollBarItem borderChange={optionFoursBarLength} style={{ width: optionFoursBarLength+'%', backgroundColor: optionFoursColor == 'Not Specified' ? colors.brand : colors[optionFoursColor.toLowerCase()] || colors.brand }}></PollBarItem>
                            <PollBarItem borderChange={optionFivesBarLength} style={{ width: optionFivesBarLength+'%', backgroundColor: optionFivesColor == 'Not Specified' ? colors.brand : colors[optionFivesColor.toLowerCase()] || colors.brand }}></PollBarItem>
                            <PollBarItem borderChange={optionSixesBarLength} style={{ width: optionSixesBarLength+'%', backgroundColor: optionSixesColor == 'Not Specified' ? colors.brand : colors[optionSixesColor.toLowerCase()] || colors.brand }}></PollBarItem>
                            </PollBarOutline>
                            <PollPostHorizontalView>
                                <PollKeyViewOne pollOptions={objectForAllData.data.totalNumberOfOptions} viewPage={true} onPress={openOptionOne}>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                    <PollKeysCircle circleColor={objectForAllData.data.optionOnesColor}></PollKeysCircle>
                                    <PollPostSubTitle style={{color: colors.tertiary}}>
                                        1. {objectForAllData.data.optionOne || "Couldn't recieve data"}
                                    </PollPostSubTitle>
                                    <PollKeysCircle circleColor={objectForAllData.data.optionOnesColor}></PollKeysCircle>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                </PollKeyViewOne>
                            </PollPostHorizontalView>
                            
                            <PollPostHorizontalView visible={optionOneInfoState}>
                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollVotesForOptions.optionOne} </PollPostSubTitle>
                                </PollHorizontalViewItem>

                                <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionOnesVotes")}}>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Option One </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {optionOneVoteText} </PollPostSubTitle>
                                </PollHorizontalViewItemCenter>

                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollBarLengths.optionOnesBarLength.toFixed(2)}% </PollPostSubTitle>
                                </PollHorizontalViewItem>
                            </PollPostHorizontalView>



                            <PollPostHorizontalView>
                                <PollKeyViewTwo pollOptions={objectForAllData.data.totalNumberOfOptions} viewPage={true} onPress={openOptionTwo}>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                    <PollKeysCircle circleColor={objectForAllData.data.optionTwosColor}></PollKeysCircle>
                                    <PollPostSubTitle style={{color: colors.tertiary}}>
                                        2. {objectForAllData.data.optionTwo || "Couldn't recieve data"}
                                    </PollPostSubTitle>
                                    <PollKeysCircle circleColor={objectForAllData.data.optionTwosColor}></PollKeysCircle>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                </PollKeyViewTwo>
                            </PollPostHorizontalView>
                            
                            <PollPostHorizontalView visible={optionTwoInfoState}>
                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollVotesForOptions.optionTwo} </PollPostSubTitle>
                                </PollHorizontalViewItem>

                                <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionTwosVotes")}}>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Option Two </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {optionTwoVoteText} </PollPostSubTitle>
                                </PollHorizontalViewItemCenter>

                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollBarLengths.optionTwosBarLength.toFixed(2)}% </PollPostSubTitle>
                                </PollHorizontalViewItem>
                            </PollPostHorizontalView>

                            <PollPostHorizontalView>
                                <PollKeyViewThree pollOptions={objectForAllData.data.totalNumberOfOptions} viewPage={true} onPress={openOptionThree}>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                    <PollKeysCircle circleColor={objectForAllData.data.optionThreesColor}></PollKeysCircle>
                                    <PollPostSubTitle style={{color: colors.tertiary}}>
                                        3. {objectForAllData.data.optionThree || "Couldn't recieve data"}
                                    </PollPostSubTitle>
                                    <PollKeysCircle circleColor={objectForAllData.data.optionThreesColor}></PollKeysCircle>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                </PollKeyViewThree>
                            </PollPostHorizontalView>
                            
                            <PollPostHorizontalView visible={optionThreeInfoState}>
                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollVotesForOptions.optionThree} </PollPostSubTitle>
                                </PollHorizontalViewItem>

                                <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionThreesVotes")}}>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Option Three </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {optionThreeVoteText} </PollPostSubTitle>
                                </PollHorizontalViewItemCenter>

                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollBarLengths.optionThreesBarLength.toFixed(2)}% </PollPostSubTitle>
                                </PollHorizontalViewItem>
                            </PollPostHorizontalView>

                            <PollPostHorizontalView>
                                <PollKeyViewFour pollOptions={objectForAllData.data.totalNumberOfOptions} viewPage={true} onPress={openOptionFour}>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                    <PollKeysCircle circleColor={objectForAllData.data.optionFoursColor}></PollKeysCircle>
                                    <PollPostSubTitle style={{color: colors.tertiary}}>
                                        4. {objectForAllData.data.optionFour || "Couldn't recieve data"}
                                    </PollPostSubTitle>
                                    <PollKeysCircle circleColor={objectForAllData.data.optionFoursColor}></PollKeysCircle>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                </PollKeyViewFour>
                            </PollPostHorizontalView>

                            <PollPostHorizontalView visible={optionFourInfoState}>
                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollVotesForOptions.optionFour} </PollPostSubTitle>
                                </PollHorizontalViewItem>

                                <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionFoursVotes")}}>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Option Four </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {optionFourVoteText} </PollPostSubTitle>
                                </PollHorizontalViewItemCenter>

                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollBarLengths.optionFoursBarLength.toFixed(2)}% </PollPostSubTitle>
                                </PollHorizontalViewItem>
                            </PollPostHorizontalView>

                            <PollPostHorizontalView>
                                <PollKeyViewFive pollOptions={objectForAllData.data.totalNumberOfOptions} viewPage={true} onPress={openOptionFive}>
                                <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                    <PollKeysCircle circleColor={objectForAllData.data.optionFivesColor}></PollKeysCircle>
                                    <PollPostSubTitle style={{color: colors.tertiary}}>
                                        5. {objectForAllData.data.optionFive || "Couldn't recieve data"}
                                    </PollPostSubTitle>
                                    <PollKeysCircle circleColor={objectForAllData.data.optionFivesColor}></PollKeysCircle>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                </PollKeyViewFive>
                            </PollPostHorizontalView>

                            <PollPostHorizontalView visible={optionFiveInfoState}>
                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollVotesForOptions.optionFive} </PollPostSubTitle>
                                </PollHorizontalViewItem>

                                <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionFivesVotes")}}>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Option Five </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {optionFiveVoteText} </PollPostSubTitle>
                                </PollHorizontalViewItemCenter>

                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollBarLengths.optionFivesBarLength.toFixed(2)}% </PollPostSubTitle>
                                </PollHorizontalViewItem>
                            </PollPostHorizontalView>

                            <PollPostHorizontalView>
                                <PollKeyViewSix pollOptions={objectForAllData.data.totalNumberOfOptions} viewPage={true} onPress={openOptionSix}>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                    <PollKeysCircle circleColor={objectForAllData.data.optionSixesColor}></PollKeysCircle>
                                    <PollPostSubTitle style={{color: colors.tertiary}}>
                                        6. {objectForAllData.data.optionSix || "Couldn't recieve data"}
                                    </PollPostSubTitle>
                                    <PollKeysCircle circleColor={objectForAllData.data.optionSixesColor}></PollKeysCircle>
                                    <Octicons name={"chevron-down"} size={20} color={dark ? colors.greyish : colors.tertiary} />
                                </PollKeyViewSix>
                            </PollPostHorizontalView>

                            <PollPostHorizontalView visible={optionSixInfoState}>
                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Votes </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollVotesForOptions.optionSix} </PollPostSubTitle>
                                </PollHorizontalViewItem>

                                <PollHorizontalViewItemCenter onPress={() => {handleVoteOnPoll("optionSixesVotes")}}>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Option Six </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {optionSixVoteText} </PollPostSubTitle>
                                </PollHorizontalViewItemCenter>

                                <PollHorizontalViewItem>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> Percent </PollPostSubTitle>
                                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                    <PollPostSubTitle style={{color: colors.tertiary}} welcome={true}> {pollBarLengths.optionSixesBarLength.toFixed(2)}% </PollPostSubTitle>
                                </PollHorizontalViewItem>
                            </PollPostHorizontalView>

                            <PostHorizontalView style={{marginLeft: '5%', width: '90%', paddingVertical: 10, flex: 1, flexDirection: 'row'}}>
                            
                                {pollUpOrDownVoted == "UpVoted" && (<PostsIconFrame onPress={() => {UpVotePoll()}}>
                                    <PostsIcons style={{flex: 1, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "Neither" && (<PostsIconFrame onPress={() => {UpVotePoll()}}>
                                    <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "DownVoted" && (<PostsIconFrame onPress={() => {UpVotePoll()}}>
                                    <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "Changing" && (<PostsIconFrame></PostsIconFrame>)}

                                {pollUpOrDownVoted == "Finding" && (<PostsIconFrame style={{flex: 3}}>
                                    <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes}</SubTitle>
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "UpVoted" && (<PostsIconFrame>
                                    {initialPollUpOrDownVoted == "UpVoted" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes}</SubTitle>
                                    )}
                                    {initialPollUpOrDownVoted == "Neither" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes+1}</SubTitle>
                                    )}
                                    {initialPollUpOrDownVoted == "DownVoted" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes+2}</SubTitle>
                                    )}
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "Neither" && (<PostsIconFrame>
                                    {initialPollUpOrDownVoted == "Neither" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes}</SubTitle>
                                    )}
                                    {initialPollUpOrDownVoted == "UpVoted" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes-1}</SubTitle>
                                    )}
                                    {initialPollUpOrDownVoted == "DownVoted" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes+1}</SubTitle>
                                    )}
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "DownVoted" && (<PostsIconFrame>
                                    {initialPollUpOrDownVoted == "DownVoted" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes}</SubTitle>
                                    )}
                                    {initialPollUpOrDownVoted == "Neither" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes-1}</SubTitle>
                                    )}
                                    {initialPollUpOrDownVoted == "UpVoted" && (
                                        <SubTitle style={{alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{pollUpOrDownVotes-2}</SubTitle>
                                    )}
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "Changing" && (<PostsIconFrame>
                                    <ActivityIndicator size="small" color={colors.brand} />                
                                </PostsIconFrame>)}
                                
                                {pollUpOrDownVoted == "DownVoted" && (<PostsIconFrame onPress={() => {DownVotePoll()}}>
                                    <PostsIcons style={{flex: 1, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "Neither" && (<PostsIconFrame onPress={() => {DownVotePoll()}}>
                                    <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "UpVoted" && (<PostsIconFrame onPress={() => {DownVotePoll()}}>
                                    <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                </PostsIconFrame>)}
                                {pollUpOrDownVoted == "Changing" && (<PostsIconFrame></PostsIconFrame>)}
                                <PostsIconFrame>
                                </PostsIconFrame>
                                <PostsIconFrame>
                                    <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png')}/>
                                </PostsIconFrame>
                                <PostsIconFrame>
                                    <PostsIcons style={{flex: 1, height: 30, width: 30}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/387-share2.png')}/>
                                </PostsIconFrame>
                                <PostsIconFrame>
                                    <PostsIcons style={{flex: 1}} source={require('./../assets/img/ThreeDots.png')}/>
                                </PostsIconFrame>
                            </PostHorizontalView>
                            {typeof message === 'string' || message instanceof String && (
                                <MsgBox type={messageType}>{message}</MsgBox>
                            )}
                            <PollPostSubTitle votesText={true} style={{flex: 1, color: colors.tertiary}}>
                                Total Votes: {pollVotesForOptions.optionOne+pollVotesForOptions.optionTwo+pollVotesForOptions.optionThree+pollVotesForOptions.optionFour+pollVotesForOptions.optionFive+pollVotesForOptions.optionSix}
                            </PollPostSubTitle>
                            <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{getTimeFromUTCMS(datePosted)}</SubTitle>
                            <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: colors.descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{commentsLength} comments</SubTitle>
                        </ViewScreenPollPostFrame>
                        {storedCredentials ?
                            <ViewScreenPollPostCommentsFrame style={{width: '100%'}}>
                                <PollPostTitle commentsTitle={true}>Comments</PollPostTitle>
                                <CommentsHorizontalView writeCommentArea={true}>
                                    <Formik
                                        initialValues={{comment: '', userName: name, pollId: pollId}}
                                        onSubmit={(values, {setSubmitting}) => {
                                            if (values.comment == "") {
                                                handleMessage('You cant post and empty comment');
                                                setSubmitting(false);
                                            } else {
                                                handleCommentPost(values, setSubmitting);
                                            }
                                        }}
                                    >
                                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                            <View>
                                                <CommentsHorizontalView>
                                                    <CommentsHorizontalViewItem>
                                                        <CommenterName>Img/GIF</CommenterName>
                                                    </CommentsHorizontalViewItem>
                                                    <CommentsHorizontalViewItem>
                                                        <CommenterName>Text</CommenterName>
                                                    </CommentsHorizontalViewItem>
                                                    <CommentsHorizontalViewItem>
                                                        <CommenterName>Short Video</CommenterName>
                                                    </CommentsHorizontalViewItem>
                                                </CommentsHorizontalView>
                                                <CommentsHorizontalView writeCommentArea={true}>
                                                    <CommentsVerticalView alongLeft={true}>
                                                        <CommenterIcon source={{uri: profilePictureUri}}/>
                                                    </CommentsVerticalView>
                                                    <CommentsVerticalView>
                                                        <UserTextInput
                                                            placeholder="Post a comment"
                                                            placeholderTextColor={colors.darkLight}
                                                            onChangeText={handleChange('comment')}
                                                            onBlur={handleBlur('comment')}
                                                            value={values.comment}
                                                            multiline={true}
                                                            style={{backgroundColor: colors.primary, color: colors.tertiary, borderColor: colors.borderColor}}
                                                        />
                                                    </CommentsVerticalView>
                                                </CommentsHorizontalView>
                                                <CommentsHorizontalView belowWriteCommentArea={true}>
                                                    <CommentsVerticalView postComment={true}>
                                                        {!isSubmitting && (<StyledButton style={{backgroundColor: colors.primary}} postComment={true} onPress={handleSubmit}>
                                                            <ButtonText postComment={true}> Post </ButtonText>
                                                        </StyledButton>)}
                                                        <MsgBox type={messageType}>{message}</MsgBox>
                                                        {isSubmitting && (<StyledButton disabled={true}>
                                                            <ActivityIndicator size="large" color={colors.primary} />
                                                        </StyledButton>)}
                                                    </CommentsVerticalView>
                                                </CommentsHorizontalView>
                                            </View>
                                            )}
                                    </Formik>
                                </CommentsHorizontalView>
                                <PollPostSubTitle style={{color: colors.tertiary}}>{ifCommentText}</PollPostSubTitle>
                                <SectionList
                                    sections={changeSections}
                                    keyExtractor={(item, index) => item + index}
                                    renderItem={({ item }) => <Item commentId={item.commentId} commenterName={item.commenterName} commenterDisplayName={item.commenterDisplayName} commentsText={item.commentsText}  commentUpVotes={item.commentUpVotes} commentReplies={item.commentReplies} datePosted={item.datePosted} commenterImageB64={item.commenterImageB64}/>}
                                />
                                {loadingMoreComments == true && (
                                    <ActivityIndicator size="small" color={colors.brand} />  
                                )}
                            </ViewScreenPollPostCommentsFrame>
                        :
                            <View style={{flex: 1, justifyContent: 'center', marginTop: 20}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to comment on this poll</Text>
                                <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                                    <ButtonText> Login </ButtonText>
                                </StyledButton>
                                <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true})}>
                                        <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                                </StyledButton>
                            </View>
                        }
                    </WelcomeContainer>
                </WelcomeContainer>
            </ScrollView>
        </>
    );
}

const UserTextInput = ({label, icon, isPassword, ...props}) => {
    return(
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput postComment={true} {...props}/>
        </View>
    )
}

export default ViewPollPostPage;
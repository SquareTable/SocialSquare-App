import React, { useState, useContext, useRef, useEffect, useCallback, memo, useReducer } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, SafeAreaView, ScrollView, FlatList, Alert, useWindowDimensions, Animated, ActivityIndicator, TouchableWithoutFeedback, RefreshControl} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, useFocusEffect, useIsFocused, CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    darkModeStyling, 
    darkModeOn, 
    lightModeStyling,
    ProfileOptionsView,
    ProfileOptionsViewText,
    ProfileOptionsViewSubtitleText,
    ProfileOptionsViewButtons,
    ProfileOptionsViewButtonsText,
    ReportProfileOptionsView,
    ReportProfileOptionsViewButtons,
    ReportProfileOptionsViewButtonsText,
    ReportProfileOptionsViewSubtitleText,
    ReportProfileOptionsViewText,
    ChatScreen_Title,
    Navigator_BackButton,
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar,
    Colors,
    StyledContainer,
    ProfileHorizontalView,
    ProfileHorizontalViewItem,
    ProfIcons,
    ProfInfoAreaImage,
    ProfileBadgesView,
    ProfileBadgeIcons,
    ProfilePostsSelectionView,
    ProfilePostsSelectionBtns,
    ProfileGridPosts,
    ProfileFeaturedPosts,
    ProfileTopBtns,
    TopButtonIcons,
    ProfileSelectMediaTypeItem,
    ProfileSelectMediaTypeHorizontalView,
    ProfileSelectMediaTypeIcons,
    ProfileSelectMediaTypeIconsBorder,
    PollPostFrame,
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
    PollPostIcons,
    AboveBarPollPostHorizontalView,
    BottomPollPostHorizontalView,
    LikesView,
    CommentsView,
    PollBottomItem,
    MultiMediaPostFrame,
    ImagePostFrame,
    PostCreatorIcon,
    PostsHorizontalView,
    PostsVerticalView,
    PostHorizontalView,
    PostsIcons,
    PostsIconFrame,
    MsgBox,
    ImagePostTextFrame,
    SearchFrame,
    SearchHorizontalView,
    SearchHorizontalViewItem,
    SearchHorizontalViewItemCenter,
    SearchSubTitle,
    ConfirmLogoutButtons,
    ConfirmLogoutButtonText,
    ViewHider,
} from '../screens/screenStylings/styling.js';
import { CredentialsContext } from '../components/CredentialsContext.js';
import { AdIDContext } from '../components/AdIDContext.js';
import { Audio } from 'expo-av';
import { SimpleStylingVersion } from '../components/StylingVersionsFile.js';
import { AppStylingContext } from '../components/AppStylingContext.js';
import axios from 'axios';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import { BadgeEarntNotificationContext } from '../components/BadgeEarntNotificationContext.js';
import * as Haptics from 'expo-haptics';

import { AllCredentialsStoredContext } from '../components/AllCredentialsStoredContext.js';
import { ExperimentalFeaturesEnabledContext } from '../components/ExperimentalFeaturesEnabledContext.js';
import usePostReducer from '../hooks/usePostReducer.js';

import ImagePost from '../components/Posts/ImagePost.js';
import PollPost from '../components/Posts/PollPost.js';
import ThreadPost from '../components/Posts/ThreadPost.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet.js';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const {brand, primary, tertiary, greyish, darkLight, darkestBlue, slightlyLighterPrimary, slightlyLighterGrey, descTextColor, darkest, red, orange, yellow, green, purple} = Colors;

const HomeScreen = ({navigation, route}) => {
    const [followingFeed, dispatchFollowingFeed] = usePostReducer()
    const [forYouFeed, dispatchForYouFeed] = usePostReducer();
    console.log('Refresh items:', followingFeed.refreshItems)
    // Filter code
    const [showPhotos, setShowPhotos] = useState(undefined);
    const [showVideos, setShowVideos] = useState(undefined);
    const [showAudio, setShowAudio] = useState(undefined);
    const [showThreads, setShowThreads] = useState(undefined);
    const [showPolls, setShowPolls] = useState(undefined);
    const [showCategories, setShowCategories] = useState(undefined);
    const [PlayVideoSoundInSilentMode, setPlayVideoSoundInSilentMode] = useState(undefined)
    const OutputAsyncStorageToConsole = false
    const [updateSimpleStylesWarningHidden, setUpdateSimpleStylesWarningHidden] = useState(true);
    const {AppStylingContextState, setAppStylingContextState} = useContext(AppStylingContext);
    const adContent = `<iframe data-aa='1882208' src='https://ad.a-ads.com/1882208?size=300x250' style='width:300px; height:250px; border:0px; padding:0; overflow:hidden; background-color: transparent;'></iframe>`
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext);
    const [usernameToReport, setUsernameToReport] = useState(null);
    const [postEncrypted, setPostEncrypted] = useState(null);
    const [ProfileOptionsViewState, setProfileOptionsViewState] = useState(true);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [postSent, setPostSent] = useState(null);
    const {AdID, setAdID} = useContext(AdIDContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    async function unloadAudioFunction() {
        playRecording.unloadAsync;
    }
    if (storedCredentials) {var {name, displayName, _id} = storedCredentials} else {var {name, displayName, _id} = {name: 'SSGUEST', displayName: 'SSGUEST', _id: 'SSGUEST'}}
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const {badgeEarntNotification, setBadgeEarntNotification} = useContext(BadgeEarntNotificationContext);
    const {allCredentialsStoredList, setAllCredentialsStoredList} = useContext(AllCredentialsStoredContext);

    const prevUserID = useRef(_id)

    //Easter egg - Logo Press
    const logoPressedTimes = useRef(0);

    // Start of Feed code

    //Post usestates etc

    //Usestates etc
    const [currentFeed, setCurrentFeed] = useState(storedCredentials ? 'Following' : 'For You');

    const viewedOnThisLoadsId = React.useRef([])

    //msg stuff
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [postNumForMsg, setPostNumForMsg] = useState();

    //Experimental features
    const {experimentalFeaturesEnabled, setExperimentalFeaturesEnabled} = useContext(ExperimentalFeaturesEnabledContext);

    const handleMessage = (message, type = 'FAILED', postNum) => {
        setMessage(message);
        setMessageType(type);
        if (postNum !== null) {
            setPostNumForMsg(postNum)
        } else {
            setPostNumForMsg(null)
        }
    }

    //organise data and put to be displayed
    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                //setLoadingPostsImage(false)
                console.log("Either an error or cancelled.");
            })
    }

    const handleRecievedImagePost = (imageData, indexInRecieved, callback) => {
        var index = indexInRecieved
        if (followingFeed.posts.length !== 0) {
            index = indexInRecieved + followingFeed.posts.length
        } else {
            index = indexInRecieved
        }
        console.log(`imageData.hasSeenPosts: ${imageData.hasSeenPosts}`)

        /*
        var upVotedImages = upVotesImages
        var initialUpVotedImages = initialUpVotesImages
        var downVotedImages = downVotesImages
        var initialDownVotedImages = initialDownVotesImages
        var neitherVotedImages = neitherVotesImages
        var initialNeitherVotedImages = initialNeitherVotesImages
        */

        async function findImages() {
            //
            if (imageData.creatorPfpKey) {
                async function asyncFunctionForImages() {
                    const imageB64 = await getImageWithKey(imageData.imageKey)
                    const pfpB64 = await getImageWithKey(imageData.creatorPfpKey)
                    console.log("Image In Post Recieved")
                    //Add
                    const addAndPush = async () => {
                        console.log("TestHere")
                        var forSendBack = {format: "Image", _id: imageData._id, imageKey: imageData.imageKey, imageB64: imageB64, imageTitle: imageData.imageTitle, imageDescription: imageData.imageDescription, votes: imageData.votes, comments: imageData.comments, creatorName: imageData.creatorName, creatorDisplayName: imageData.creatorDisplayName, creatorPfpB64: pfpB64, datePosted: imageData.datePosted, postNum: index, hasSeenPosts: imageData.hasSeenPosts, upvoted: imageData.upvoted, downvoted: imageData.downvoted, isOwner: imageData.isOwner}
                        return callback(forSendBack)
                    }
                    await addAndPush()
                }
                asyncFunctionForImages()
            } else {
                console.log("No pfp")
                const imageB64 = await getImageWithKey(imageData.imageKey)
                var imageInPfp = null
                //Add
                const addAndPush = async () => {
                    var pfpB64 = imageInPfp
                    console.log("TestHere")
                    var forSendBack = {format: "Image", _id: imageData._id, imageKey: imageData.imageKey, imageB64: imageB64, imageTitle: imageData.imageTitle, imageDescription: imageData.imageDescription, votes: imageData.votes, comments: imageData.comments, creatorName: imageData.creatorName, creatorDisplayName: imageData.creatorDisplayName, creatorPfpB64: pfpB64, datePosted: imageData.datePosted, postNum: index, hasSeenPosts: imageData.hasSeenPosts, upvoted: imageData.upvoted, downvoted: imageData.downvoted, isOwner: imageData.isOwner}
                    return callback(forSendBack)
                }
                await addAndPush()
            }
        }
        findImages()
    }

    const handleRecievedPollPost = (pollData, indexInRecieved, callback) => {
        var index = indexInRecieved
        if (followingFeed.posts.length !== 0) {
            index = indexInRecieved + followingFeed.posts.length
        } else {
            index = indexInRecieved
        }
        var optionOnesBarLength = 16.6666666667
        var optionTwosBarLength = 16.6666666667
        var optionThreesBarLength = 16.6666666667
        var optionFoursBarLength = 16.6666666667
        var optionFivesBarLength = 16.6666666667
        var optionSixesBarLength = 16.6666666667
        var totalVotes = pollData.optionOnesVotes + pollData.optionTwosVotes + pollData.optionThreesVotes + pollData.optionFoursVotes + pollData.optionFivesVotes + pollData.optionSixesVotes
        //console.log(item, index);
        if (totalVotes !== 0) {
            optionOnesBarLength = (pollData.optionOnesVotes / totalVotes) * 100
            console.log("O1 BL")
            console.log(optionOnesBarLength)
            optionTwosBarLength = (pollData.optionTwosVotes / totalVotes) * 100
            console.log("O2 BL")
            console.log(optionTwosBarLength)
            optionThreesBarLength = (pollData.optionThreesVotes / totalVotes) * 100
            console.log("O3 BL")
            console.log(optionThreesBarLength)
            optionFoursBarLength = (pollData.optionFoursVotes / totalVotes) * 100
            console.log("O4 BL")
            console.log(optionFoursBarLength)
            optionFivesBarLength = (pollData.optionFivesVotes / totalVotes) * 100
            console.log("O5 BL")
            console.log(optionFivesBarLength)
            optionSixesBarLength = (pollData.optionSixesVotes / totalVotes) * 100
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
        } else {
            if (totalVotes == 0) {
                console.log("No Votes")
                if (pollData.totalNumberOfOptions == "Two") {
                    optionOnesBarLength = 100 / 2
                    optionTwosBarLength = 100 / 2
                    optionThreesBarLength = 0
                    optionFoursBarLength = 0
                    optionFivesBarLength = 0
                    optionSixesBarLength = 0
                } else if (pollData.totalNumberOfOptions == "Three") {
                    optionOnesBarLength = 100 / 3
                    optionTwosBarLength = 100 / 3
                    optionThreesBarLength = 100 / 3
                    optionFoursBarLength = 0
                    optionFivesBarLength = 0
                    optionSixesBarLength = 0
                } else if (pollData.totalNumberOfOptions == "Four") {
                    optionOnesBarLength = 100 / 4
                    optionTwosBarLength = 100 / 4
                    optionThreesBarLength = 100 / 4
                    optionFoursBarLength = 100 / 4
                    optionFivesBarLength = 0
                    optionSixesBarLength = 0
                } else if (pollData.totalNumberOfOptions == "Five") {
                    optionOnesBarLength = 100 / 5
                    optionTwosBarLength = 100 / 5
                    optionThreesBarLength = 100 / 5
                    optionFoursBarLength = 100 / 5
                    optionFivesBarLength = 100 / 5
                    optionSixesBarLength = 0
                } else if (pollData.totalNumberOfOptions == "Six") {
                    optionOnesBarLength = 100 / 6
                    optionTwosBarLength = 100 / 6
                    optionThreesBarLength = 100 / 6
                    optionFoursBarLength = 100 / 6
                    optionFivesBarLength = 100 / 6
                    optionSixesBarLength = 100 / 6
                }
            }
        }
        console.log("poll data")
        console.log(pollData)
        if (pollData.creatorPfpKey) {
            /*
            var upVotedPolls = upVotesPolls
            var initialUpVotedPolls = initialUpVotesPolls
            var downVotedPolls = downVotesPolls
            var initialDownVotedPolls = initialDownVotesPolls
            var neitherVotedPolls = neitherVotesPolls
            var initialNeitherVotedPolls = initialNeitherVotesPolls
            */
            async function getPfpImageForPollWithAsync() {
                var imageData = pollData
                const pfpB64 = await getImageWithKey(imageData.creatorPfpKey)
                var forSendBack = {format: "Poll", pollTitle: pollData.pollTitle, pollSubTitle: pollData.pollSubTitle, optionOne: pollData.optionOne, optionOnesColor: pollData.optionOnesColor, optionOnesVotes: pollData.optionOnesVotes, optionOnesBarLength: optionOnesBarLength, optionTwo: pollData.optionTwo, optionTwosColor: pollData.optionTwosColor, optionTwosVotes: pollData.optionTwosVotes, optionTwosBarLength: optionTwosBarLength, optionThree: pollData.optionThree, optionThreesColor: pollData.optionThreesColor, optionThreesVotes: pollData.optionThreesVotes, optionThreesBarLength: optionThreesBarLength, optionFour: pollData.optionFour, optionFoursColor: pollData.optionFoursColor, optionFoursVotes: pollData.optionFoursVotes, optionFoursBarLength: optionFoursBarLength, optionFive: pollData.optionFive, optionFivesColor: pollData.optionFivesColor, optionFivesVotes: pollData.optionFivesVotes, optionFivesBarLength: optionFivesBarLength, optionSix: pollData.optionSix, optionSixesColor: pollData.optionSixesColor, optionSixesVotes: pollData.optionSixesVotes, optionSixesBarLength: optionSixesBarLength, totalNumberOfOptions: pollData.totalNumberOfOptions, votes: pollData.votes, pollId: pollData._id, votedFor: pollData.votedFor, postNum: index, pollComments: pollData.pollComments, pfpB64: pfpB64, creatorName: pollData.creatorName, creatorDisplayName: pollData.creatorDisplayName, datePosted: pollData.datePosted, hasSeenPosts: pollData.hasSeenPosts, upvoted: pollData.upvoted, downvoted: pollData.downvoted, isOwner: pollData.isOwner, _id: pollData._id}
                return callback(forSendBack)
            }
            getPfpImageForPollWithAsync()
        } else {
            var pfpB64 = null
            var forSendBack = {format: "Poll", pollTitle: pollData.pollTitle, pollSubTitle: pollData.pollSubTitle, optionOne: pollData.optionOne, optionOnesColor: pollData.optionOnesColor, optionOnesVotes: pollData.optionOnesVotes, optionOnesBarLength: optionOnesBarLength, optionTwo: pollData.optionTwo, optionTwosColor: pollData.optionTwosColor, optionTwosVotes: pollData.optionTwosVotes, optionTwosBarLength: optionTwosBarLength, optionThree: pollData.optionThree, optionThreesColor: pollData.optionThreesColor, optionThreesVotes: pollData.optionThreesVotes, optionThreesBarLength: optionThreesBarLength, optionFour: pollData.optionFour, optionFoursColor: pollData.optionFoursColor, optionFoursVotes: pollData.optionFoursVotes, optionFoursBarLength: optionFoursBarLength, optionFive: pollData.optionFive, optionFivesColor: pollData.optionFivesColor, optionFivesVotes: pollData.optionFivesVotes, optionFivesBarLength: optionFivesBarLength, optionSix: pollData.optionSix, optionSixesColor: pollData.optionSixesColor, optionSixesVotes: pollData.optionSixesVotes, optionSixesBarLength: optionSixesBarLength, totalNumberOfOptions: pollData.totalNumberOfOptions, votes: pollData.votes, pollId: pollData._id, votedFor: pollData.votedFor, postNum: index, pollComments: pollData.pollComments, pfpB64: pfpB64, creatorName: pollData.creatorName, creatorDisplayName: pollData.creatorDisplayName, datePosted: pollData.datePosted, hasSeenPosts: pollData.hasSeenPosts, upvoted: pollData.upvoted, downvoted: pollData.downvoted, isOwner: pollData.isOwner, _id: pollData._id}
            return callback(forSendBack)
        }
    }

    const handleRecievedThreadPost = (threadData, indexInRecieved, callback) => {
        async function findImages() {
            const creatorImageB64 = threadData.creatorImageKey ? await getImageWithKey(threadData.creatorImageKey) : null
            const imageInThreadB64 = threadData.threadImageKey ? await getImageWithKey(threadData.threadImageKey) : null
            return callback({
                ...threadData,
                creatorImageB64,
                imageInThreadB64
            })
        }
        findImages()
    }

    const layOutAllPosts = (postsRecieved, resetPostsShowingOnLoad, feedFor) => {
        console.log(`postsRecieved amount ${postsRecieved.length}`)
        const sortAndSet = (setUpPosts) => {
            if (feedFor === "Following") {
                const allPostsHasSeenValues = setUpPosts.map(x => x.format)
                console.log('allPostsHasSeenValues:', allPostsHasSeenValues)
                console.log('allPostsHasSeenValues.length:', allPostsHasSeenValues.length)
                console.log('setUpPosts.length:', setUpPosts.length)
                const hasNotSeenRecievedPosts = setUpPosts.filter(x => x.hasSeenPosts == false)
                const hasSeenRecievedPosts = setUpPosts.filter(x => x.hasSeenPosts == true)
                const notSeenSortedRecievedPosts = hasNotSeenRecievedPosts.sort(function(a, b){
                    return a.datePosted > b.datePosted ? -1 : 1
                });
                const seenSortedRecievedPosts = hasSeenRecievedPosts.sort(function(a, b){
                    return a.datePosted > b.datePosted ? -1 : 1
                });
                const sortedRecievedPosts = notSeenSortedRecievedPosts.concat(seenSortedRecievedPosts)
                dispatchFollowingFeed({type: 'addPosts', posts: sortedRecievedPosts})
            } else if (feedFor === "For You") {
                dispatchForYouFeed({type: 'addPosts', posts: setUpPosts})
            } else {
                console.error('Wrong feed?')
            }
        }

        if (postsRecieved.length !== 0) {
            var postsProcessed = 0
            var forConcat = []
            postsRecieved.forEach(function (item, index) {
                console.log(postsProcessed)
                console.log(postsRecieved.length)
                console.log('Received formats:', postsRecieved.map(x => x.format))
                if (postsRecieved[index].format == "Image") {
                    //Image
                    handleRecievedImagePost(postsRecieved[index], index, function(setUpImagePost) {
                        if (setUpImagePost.imageKey) { //just to check if it exists and is proper
                            forConcat.push(setUpImagePost)
                            postsProcessed++;
                            if (postsProcessed == postsRecieved.length) {
                                sortAndSet(forConcat)
                            }
                        } else {
                            postsProcessed++;
                            if (postsProcessed == postsRecieved.length) {
                                sortAndSet(forConcat)
                            }
                        }
                    })
                    
                } else if (postsRecieved[index].format == "Poll") {
                    //Poll
                    handleRecievedPollPost(postsRecieved[index], index, function(setUpPollPost) {
                        if (setUpPollPost._id) { //just to check if it exists and is proper
                            forConcat.push(setUpPollPost)
                            postsProcessed++;
                            if (postsProcessed == postsRecieved.length) {
                                sortAndSet(forConcat)
                            }
                        } else {
                            postsProcessed++;
                            if (postsProcessed == postsRecieved.length) {
                                sortAndSet(forConcat)
                            }
                        }
                    })
                    
                } else if (postsRecieved[index].format == "Thread") {
                    //Thread
                    //Poll
                    handleRecievedThreadPost(postsRecieved[index], index, function(setUpThreadPost) {
                        if (setUpThreadPost._id) { //just to check if it exists and is proper
                            forConcat.push(setUpThreadPost)
                            postsProcessed++;
                            if (postsProcessed == postsRecieved.length) {
                                sortAndSet(forConcat)
                            }
                        } else {
                            postsProcessed++;
                            if (postsProcessed == postsRecieved.length) {
                                sortAndSet(forConcat)
                            }
                        }
                    })
                } else {
                    console.warn('Post format unrecognized:', postsRecieved[index].format)
                    postsProcessed++;
                    if (postsProcessed == postsRecieved.length) {
                        sortAndSet(forConcat)
                    }
                }
            })
        } else {
            if (feedFor == "Following") {
                dispatchFollowingFeed({type: 'noMorePosts'})
            } else if (feedFor == "For You") {
                dispatchForYouFeed({type: 'noMorePosts'})
            }
        }   
    }

    const loadMorePosts = () => {
        if (currentFeed == "Following") {
            if (!followingFeed.noMorePosts) { //Stop loading more posts if there are no more posts to load
                //is reload so bottom two isnt needed
                const imagePosts = followingFeed.posts.filter(x => x._id).map(x => x._id)
                const pollPosts = followingFeed.posts.filter(x => x.pollId).map(x => x.pollId)
                const threadPosts = followingFeed.posts.filter(x => x.threadId).map(x => x.threadId)
                const imageAndPolls = imagePosts.concat(pollPosts)
                const allPostIds = imageAndPolls.concat(threadPosts) // concat doesnt change original array
                const allPostIdsStringed = allPostIds.toString() 
                console.log("allPostIdsStringed:")
                console.log(allPostIdsStringed)

                dispatchFollowingFeed({type: 'startLoad'})
                const url = `${serverUrl}/feed/followerFeed`
                const toSend = {
                    alreadyOnCurrentFeed: allPostIdsStringed
                }
                axios.post(url, toSend).then((response) => {
                    const result = response.data;
                    const { message, status, data } = result;

                    if (status !== 'SUCCESS') {
                        dispatchFollowingFeed({type: 'stopLoad'})
                        handleMessage(message, status);
                        console.log(status)
                        console.log(message)
                    } else {
                        layOutAllPosts(data, false, "Following");
                        console.log(status)
                        console.log(message)
                    }

                }).catch(error => {
                    console.log(error);
                    dispatchFollowingFeed({type: 'stopLoad'})
                    handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
                })
            }
        } else if ("For You") {
            if (!forYouFeed.noMorePosts) { //Stop loading more posts if there are no more posts to load
                //is reload so bottom two isnt needed
                const imagePosts = forYouFeed.posts.filter(x => x._id).map(x => x._id)
                const pollPosts = forYouFeed.posts.filter(x => x.pollId).map(x => x.pollId)
                const threadPosts = forYouFeed.posts.filter(x => x.threadId).map(x => x.threadId)
                const imageAndPolls = imagePosts.concat(pollPosts)
                const allPostIds = imageAndPolls.concat(threadPosts) // concat doesnt change original array
                const allPostIdsStringed = allPostIds.toString() 
                console.log("allPostIdsStringed:")
                console.log(allPostIdsStringed)

                dispatchForYouFeed({type: 'startLoad'})
                const url = `${serverUrl}/feed/forYouFeed`
                const toSend = {
                    alreadyOnCurrentFeed: allPostIdsStringed
                }
                axios.post(url, toSend).then((response) => {
                    const result = response.data;
                    const { message, status, data } = result;

                    if (status !== 'SUCCESS') {
                        dispatchForYouFeed({type: 'stopLoad'})
                        handleMessage(message, status);
                        console.log(status)
                        console.log(message)
                    } else {
                        layOutAllPosts(data, false, "For You");
                        console.warn('Posts received:', data.length)
                        console.log(status)
                        console.log(message)
                    }

                }).catch(error => {
                    console.error(error);
                    console.error(error?.response?.data?.message || 'An unknown error occurred.')
                    dispatchForYouFeed({type: 'stopLoad'})
                    handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
                })
            }
        }
    }

    function loadFeed(forceReload) {
        /*
        const clearAllUpVotesDownVotesNeitherVotes = () => {
            //image
            upVotedImages = []
            initialUpVotedImages = []
            setUpVotesImages(upVotedImages)
            setInitialUpVotesImages(initialUpVotedImages)
            downVotedImages = []
            initialDownVotedImages = []
            setDownVotesImages(downVotedImages)
            setInitialDownVotesImages(initialDownVotedImages)
            neitherVotedImages = []
            initialNeitherVotedImages = []
            setNeitherVotesImages(neitherVotedImages)
            setInitialNeitherVotesImages(initialNeitherVotedImages)
            findingVotedImagesArray = []
            setFindingVotedImages(findingVotedImagesArray)
            changingVotedImagesArray = []
            setChangingVotedImages(changingVotedImagesArray)
            //poll
            upVotedPolls = []
            initialUpVotedPolls = []
            setUpVotesPolls(upVotedPolls)
            setInitialUpVotesPolls(initialUpVotedPolls)
            downVotedPolls = []
            initialDownVotedPolls = []
            setDownVotesPolls(downVotedPolls)
            setInitialDownVotesPolls(initialDownVotedPolls)
            neitherVotedPolls = []
            initialNeitherVotedPolls = []
            setNeitherVotesPolls(neitherVotedPolls)
            setInitialNeitherVotesPolls(initialNeitherVotedPolls)
            findingVotedPollsArray = []
            setFindingVotedPolls(findingVotedPollsArray)
            changingVotedPollsArray = []
            setChangingVotedPolls(changingVotedPollsArray)
            //thread
            upVotedThreads = []
            initialUpVotedThreads = []
            setUpVotesThreads(upVotedThreads)
            setInitialUpVotesThreads(initialUpVotedThreads)
            downVotedThreads = []
            initialDownVotedThreads = []
            setDownVotesThreads(downVotedThreads)
            setInitialDownVotesThreads(initialDownVotedThreads)
            neitherVotedThreads = []
            initialNeitherVotedThreads = []
            setNeitherVotesThreads(neitherVotedThreads)
            setInitialNeitherVotesThreads(initialNeitherVotedThreads)
            findingVotedThreadsArray = []
            setFindingVotedThreads(findingVotedThreadsArray)
            changingVotedThreadsArray = []
            setChangingVotedThreads(changingVotedThreadsArray)
        }
        */
        console.log('ReloadingFeed is: ' + followingFeed.reloadingFeed)
        if (followingFeed.reloadingFeed == true || forYouFeed.reloadingFeed == true || forceReload == true) {
            if (currentFeed == "Following" && storedCredentials !== null) {
                dispatchFollowingFeed({type: 'startReload'})
               console.log('Loading feed')
               //is reload so bottom two isnt needed
               
                const allPostIdsStringed = ',';

                const url = `${serverUrl}/feed/followerFeed`
                const toSend = {
                    alreadyOnCurrentFeed: allPostIdsStringed
                }
                axios.post(url, toSend).then((response) => {
                    const result = response.data;
                    const { message, status, data } = result;

                    if (status !== 'SUCCESS') {
                        dispatchFollowingFeed({type: 'stopLoad'})
                        handleMessage(message, status);
                        console.log(status)
                        console.log(message)
                    } else {
                        //clearAllUpVotesDownVotesNeitherVotes() //do as these posts are the first posts being recieved
                        console.log(data)
                        layOutAllPosts(data, forceReload, 'Following');
                        console.log(status)
                        console.log(message)
                    }

                }).catch(error => {
                    console.log(error);
                    dispatchFollowingFeed({type: 'stopLoad'})
                    handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
                })
            } else if (currentFeed == "For You") {
                dispatchForYouFeed({type: 'startReload'})
                console.log('Loading feed')
               //is reload so bottom two isnt needed
               
                const allPostIdsStringed = ',';

                const url = `${serverUrl}/feed/forYouFeed`
                const toSend = {
                    alreadyOnCurrentFeed: allPostIdsStringed
                }
                axios.post(url, toSend).then((response) => {
                    const result = response.data;
                    const { message, status, data } = result;

                    if (status !== 'SUCCESS') {
                        dispatchForYouFeed({type: 'stopLoad'})
                        handleMessage(message, status);
                        console.log(status)
                        console.log(message)
                    } else {
                        //clearAllUpVotesDownVotesNeitherVotes() //do as these posts are the first posts being recieved
                        console.log(data)
                        layOutAllPosts(data, forceReload, 'For You');
                        console.log(status)
                        console.log(message)
                    }

                }).catch(error => {
                    console.error(error);
                    console.error(error?.response?.data?.message || 'An unknown error occurred.')
                    dispatchForYouFeed({type: 'stopLoad'})
                    handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
                })
            }
        } else {
            handleMessage("An error occured because reloadingFeed is false. Please try again.", 'FAILED')
            console.error(new Error('ReloadingFeed is false'))
        }
    }

    useEffect(() => {
        //Clear all posts from all feeds when switching accounts
        dispatchFollowingFeed({type: 'resetPosts'})
        dispatchForYouFeed({type: 'resetPosts'})
    }, [storedCredentials])

    const loadFeedOnChange = () => {
        if (_id == 'SSGUEST' || storedCredentials == null) return

        if (currentFeed === "Following") {
            if (!(followingFeed.posts.length > 0)) {
                //There are no posts in the following feed so reload the feed
                loadFeed(true)
            }
        } else if (currentFeed === "For You") {
            if (!(forYouFeed.posts.length > 0)) {
                //There are no posts in the for you feed so reload the feed
                loadFeed(true)
            }
        } else {
            console.error('Wrong feed?')
        }
    }

    useEffect(loadFeedOnChange, [currentFeed])

    useEffect(() => {
        if (storedCredentials == null || _id == "SSGUEST") setCurrentFeed("For You")
        else setCurrentFeed("Following")
    }, [storedCredentials?._id])

    useEffect(() => {
        if (prevUserID.current !== _id) {
            prevUserID.current = _id
            loadFeedOnChange()
        }
    }, [storedCredentials, _id])

    const onViewRef = React.useRef((viewableItems)=> {
        //console.log(viewableItems)

        if (Array.isArray(viewableItems.changed)) {
            //
            const removeInCaseOfErrorOrNotSuccess = (idOfToRemove) => {
                console.log("Removing in case of error or not success")
                let duplicatedArray = viewedOnThisLoadsId.current.slice()
                const indexIfInArray = duplicatedArray.findIndex(x => x == idOfToRemove)
                if (indexIfInArray !== -1) {
                    duplicatedArray.splice(indexIfInArray, 1)
                    viewedOnThisLoadsId.current = duplicatedArray        
                }
            }
            //
            viewableItems.changed.forEach(function (item, index) {
                if (viewableItems.changed[index].item.format == "Image") {
                    //Image
                    var idOfPost = viewableItems.changed[index].item._id
                    console.log(idOfPost)
                    if (!viewedOnThisLoadsId.current.includes(idOfPost)) {
                        var arrayForPush = []
                        arrayForPush = arrayForPush.concat(viewedOnThisLoadsId.current)
                        arrayForPush.push(viewableItems.changed[index].item._id)
                        viewedOnThisLoadsId.current = arrayForPush
                        console.log(`viewedOnThisLoadsId: ${JSON.stringify(viewedOnThisLoadsId.current)}`)
                        const url = serverUrl + '/feed/viewedPostInFeed'
                        //
                        const dataForView = {
                            postId: idOfPost,
                            postFormat: "Image"
                        }
                        //
                        axios.post(url, dataForView).then((response) => {
                            const result = response.data;
                            const { message, status } = result;
        
                            if (status !== 'SUCCESS') {
                                console.log(message)
                                handleMessage(message, status, index);
                                removeInCaseOfErrorOrNotSuccess(idOfPost)
                            } else {
                                console.log(`Viewed Image ${idOfPost}`)
                            }
                            
                        }).catch(error => {
                            console.log(error);
                            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.", 'FAILED', index);
                            removeInCaseOfErrorOrNotSuccess(idOfPost)
                        })
                    }
                } else if (viewableItems.changed[index].item.format == "Poll") {
                    //Poll
                    var idOfPost = viewableItems.changed[index].item._id
                    console.log(idOfPost)
                    if (!viewedOnThisLoadsId.current.includes(idOfPost)) {
                        var arrayForPush = []
                        arrayForPush = arrayForPush.concat(viewedOnThisLoadsId.current)
                        arrayForPush.push(viewableItems.changed[index].item._id)
                        viewedOnThisLoadsId.current = arrayForPush
                        console.log(`viewedOnThisLoadsId: ${JSON.stringify(viewedOnThisLoadsId.current)}`)
                        const url = serverUrl + '/feed/viewedPostInFeed'
                        //
                        const dataForView = {
                            postId: idOfPost,
                            postFormat: "Poll"
                        }
                        //
                        axios.post(url, dataForView).then((response) => {
                            const result = response.data;
                            const { message, status } = result;
        
                            if (status !== 'SUCCESS') {
                                console.log(message)
                                handleMessage(message, status, index);
                                removeInCaseOfErrorOrNotSuccess(idOfPost)
                            } else {
                                console.log(`Viewed Image ${idOfPost}`)
                            }
                            
                        }).catch(error => {
                            console.log(error);
                            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.", 'FAILED', index);
                            removeInCaseOfErrorOrNotSuccess(idOfPost)
                        })
                    }
                } else if (viewableItems.changed[index].item.format == "Thread") {
                    //Thread
                    var idOfPost = viewableItems.changed[index].item._id
                    console.log('Thread Viewed:', idOfPost)
                    if (!viewedOnThisLoadsId.current.includes(idOfPost)) {
                        var arrayForPush = []
                        arrayForPush = arrayForPush.concat(viewedOnThisLoadsId.current)
                        arrayForPush.push(viewableItems.changed[index].item._id)
                        viewedOnThisLoadsId.current = arrayForPush
                        console.log(`viewedOnThisLoadsId: ${JSON.stringify(viewedOnThisLoadsId.current)}`)
                        const url = serverUrl + '/feed/viewedPostInFeed'
                        //
                        const dataForView = {
                            postId: idOfPost,
                            postFormat: "Thread"
                        }
                        //
                        axios.post(url, dataForView).then((response) => {
                            const result = response.data;
                            const { message, status } = result;
        
                            if (status !== 'SUCCESS') {
                                console.log(message)
                                handleMessage(message, status, index);
                                removeInCaseOfErrorOrNotSuccess(idOfPost)
                            } else {
                                console.log(`Viewed Image ${idOfPost}`)
                            }
                            
                        }).catch(error => {
                            console.log(error);
                            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.", 'FAILED', index);
                            removeInCaseOfErrorOrNotSuccess(idOfPost)
                        })
                    }
                } else {
                    console.log("Not a valid post format?")
                }
            })
        }
    })

    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

    // End of feed code
   
    const {colors, dark, indexNum, stylingType} = useTheme();
    
    const changeOptionsView = (PostOwner, PostEncrypted) => {
        if (ProfileOptionsViewState == true) {
            setUsernameToReport(PostOwner);
            setPostEncrypted(PostEncrypted)
            setProfileOptionsViewState(false);
            setFlatListElementsEnabledState(false);
        } else {
            setUsernameToReport(null);
            setPostEncrypted(null);
            setProfileOptionsViewState(true);
            setFlatListElementsEnabledState(true);
        }
    }

    const OptionsViewMessageButtonOnPress = () => {
        alert("Coming soon");
    }

    const OptionsViewReportButtonOnPress = () => {
        setReportProfileOptionsViewState(false);
        setProfileOptionsViewState(true);
    }

    const changeReportProfilesOptionsView = () => {
        if (ReportProfileOptionsViewState == true) {
            setReportProfileOptionsViewState(false);
            setFlatListElementsEnabledState(false);
        } else {
            setReportProfileOptionsViewState(true);
            setFlatListElementsEnabledState(true);
        }
    }

    const changeReportProfiles_ContentThatShouldNotBePosted_OptionsView = () => {
        if (ReportProfile_ContentThatShouldNotBePosted_OptionsViewState == true) {
            setReportProfile_ContentThatShouldNotBePosted_OptionsViewState(false);
        } else {
            setReportProfile_ContentThatShouldNotBePosted_OptionsViewState(true);
        }
    }

    const changeReportProfiles_PretendingToBeSomeoneElse_OptionsView = () => {
        if (ReportProfile_PretendingToBeSomeoneElse_OptionsViewState == true) {
            setReportProfile_PretendingToBeSomeoneElse_OptionsViewState(false);
        } else {
            setReportProfile_PretendingToBeSomeoneElse_OptionsViewState(true);
        }
    }
    const [ReportProfileOptionsViewState, setReportProfileOptionsViewState] = useState(true);
    const [ReportProfile_ContentThatShouldNotBePosted_OptionsViewState, setReportProfile_ContentThatShouldNotBePosted_OptionsViewState] = useState(true);
    const [ReportProfile_PretendingToBeSomeoneElse_OptionsViewState, setReportProfile_PretendingToBeSomeoneElse_OptionsViewState] = useState(true);
    const [FlatListElementsEnabledState, setFlatListElementsEnabledState] = useState(true);

    useEffect(() => {
        async function checkToShowUpdateSimpleStylesWarning() {
            const lastVersionUsed = await AsyncStorage.getItem('versionLastShownForSimpleStylingUpdateWarning')
            const simpleStylingData = JSON.parse(await AsyncStorage.getItem('simpleStylingData'))
            let lowestVersion = 9999;
            console.log('LAST VERSION USED IS ' + lastVersionUsed)
            if (simpleStylingData) {
                for (let i = 0; i < simpleStylingData.length; i++) {
                    if (simpleStylingData[i].stylingVersion < lowestVersion) {
                        lowestVersion = simpleStylingData[i].stylingVersion
                    }
                    if (simpleStylingData[i].stylingVersion == undefined) {
                        lowestVersion = 1
                    }
                }
                console.log(lowestVersion)
                console.log(lastVersionUsed)
                if (lastVersionUsed == null) {
                    console.log('Last version used is null. Now running the code for null')
                    if (lowestVersion < SimpleStylingVersion) {
                        if (AppStylingContextState == 'Default' || AppStylingContextState == 'Dark' || AppStylingContextState == 'Light' || AppStylingContextState == 'PureDark' || AppStylingContextState == 'PureLight') {
                            setAppStylingContextState('Default')
                            console.warn('Setting styling to Default')
                        }
                        setUpdateSimpleStylesWarningHidden(false)
                        setFlatListElementsEnabledState(false)
                    }
                    AsyncStorage.setItem('versionLastShownForSimpleStylingUpdateWarning', SimpleStylingVersion.toString())
                } else {
                    if (parseInt(lastVersionUsed) < SimpleStylingVersion) {
                        console.log('Last version used is less than current simple styling version')
                        if (AppStylingContextState == 'Default' || AppStylingContextState == 'Dark' || AppStylingContextState == 'Light' || AppStylingContextState == 'PureDark' || AppStylingContextState == 'PureLight') {
                            setAppStylingContextState('Default')
                            console.warn('Setting styling to Default')
                        }
                        setUpdateSimpleStylesWarningHidden(false)
                        setFlatListElementsEnabledState(false)
                        AsyncStorage.setItem('versionLastShownForSimpleStylingUpdateWarning', SimpleStylingVersion.toString())
                    }
                }
            } else {
                console.log('No simple styling data')
            }
        }
        checkToShowUpdateSimpleStylesWarning()
    }, [])

    const logoPressEasterEgg = () => {
        if (storedCredentials && allCredentialsStoredList && allCredentialsStoredList.length > 0) {
            logoPressedTimes.current = 0;
            
            const url = serverUrl + '/tempRoute/earnSpecialBadge';
            const toSend = {badgeEarnt: "homeScreenLogoPressEasterEgg"};
            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status} = result;

                if (status != "SUCCESS") {
                    if (message == "Badge already earnt.") {
                        setBadgeEarntNotification('Badge already earnt.')
                    } else {
                        alert(message);
                        console.error(message)
                    }
                } else {
                    setBadgeEarntNotification('HomeScreenLogoEasterEgg')
                    var currentStoredCredentials = storedCredentials;
                    currentStoredCredentials.badges = [...currentStoredCredentials.badges, {badgeName: 'homeScreenLogoPressEasterEgg', dateRecieved: Date.now()}]
                    setStoredCredentials(currentStoredCredentials)
                    var currentAllStoredCredentialsList = allCredentialsStoredList;
                    for (var i = 0; i < currentAllStoredCredentialsList.length; i++) {
                        if (currentAllStoredCredentialsList[i]._id == currentStoredCredentials._id) {
                            currentAllStoredCredentialsList[i] = currentStoredCredentials
                        }
                    }
                    setAllCredentialsStoredList(currentAllStoredCredentialsList);
                }
            }).catch((error) => {
                console.log(error);
                alert(error?.response?.data?.message || 'An error occured. Try checking your internet connection and then try again.')
            });
        } else {
            logoPressedTimes.current = 0;
        }
    }

    const renderFollowingFeedPost = ({item, index}) => {
        return(
            <View>
                {item.hasSeenPosts == true && (
                    <View>
                        {index-1 == -1 && (
                            <View>
                                <SubTitle style={{marginBottom: 0, color: colors.brand, textAlign: 'center'}}>All possible unviewed posts seen</SubTitle>
                                <SubTitle style={{fontSize: 8, color: colors.tertiary, textAlign: 'center', marginBottom: 5}}>Now on you may have seen these posts more than twice or interacted with them</SubTitle>
                            </View>
                        )}
                        {index-1 !== -1 && (
                            <View>
                                {followingFeed.posts.slice(0, index).findIndex(x => x.hasSeenPosts == true) == -1 && (
                                    <View>
                                        <SubTitle style={{marginBottom: 0, color: colors.brand, textAlign: 'center'}}>All possible unviewed posts seen</SubTitle>
                                        <SubTitle style={{fontSize: 8, color: colors.tertiary, textAlign: 'center', marginBottom: 5}}>Now on you may have seen these posts more than twice or interacted with them</SubTitle>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}
                
                {item.hasSeenPosts == false && (
                    <View>
                        {index-1 !== -1 && (
                            <View>
                                {followingFeed.posts.slice(0, index).findIndex(x => x.hasSeenPosts == true) !== -1 && ( //has seen one above somewhere
                                    <View>
                                        <SubTitle style={{marginBottom: 0, color: colors.brand, textAlign: 'center'}}>New Post</SubTitle>
                                        <SubTitle style={{fontSize: 8, color: colors.tertiary, textAlign: 'center', marginBottom: 5}}>You may have not seen the following post</SubTitle>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                )}

                {index % 5 == 0 && index !== 0 && (
                    <View style={{alignItems: 'center'}}>
                        <BannerAd
                            unitId={AdID}
                            size={BannerAdSize.MEDIUM_RECTANGLE}
                            requestOptions={{
                                requestNonPersonalizedAdsOnly: true,
                            }}
                            onAdFailedToLoad={(error) => console.warn('An error occured while loading ad:', error)}
                        />
                    </View>
                )}

                {item.format == "Image" ? (
                    <ImagePost post={item} index={index} dispatch={dispatchFollowingFeed} colors={colors} colorsIndexNum={indexNum}/>
                ) : item.format == "Poll" ? (
                    <PollPost post={item} index={index} dispatch={dispatchFollowingFeed} colors={colors} colorsIndexNum={indexNum}/>
                ) : item.format == "Thread" ? (
                    <ThreadPost post={item} index={index} dispatch={dispatchFollowingFeed} colors={colors} colorsIndexNum={indexNum}/>
                ) : <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>An error occured while displaying post.</Text>}
            </View>
        )
    }

    return(
        <View
         style={{flex: 1, backgroundColor: colors.primary, paddingTop: StatusBarHeight}}
         >
            <ThreeDotMenuActionSheet dispatch={dispatchFollowingFeed} threeDotsMenu={followingFeed.threeDotsMenu}/>
            <ThreeDotMenuActionSheet dispatch={dispatchForYouFeed} threeDotsMenu={forYouFeed.threeDotsMenu}/>
            <StatusBar color={colors.StatusBarColor}/>
            <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
                <TouchableOpacity disabled={!FlatListElementsEnabledState} onPress={() => {navigation.navigate('NotificationsScreen')}}>
                    <Icon name="notifications" size={32} color={colors.tertiary}/>
                </TouchableOpacity>
                {/*<Text style={{fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: colors.tertiary, marginRight: 3}}>SocialSquare</Text>*/}
                <TouchableWithoutFeedback onPress={() => {
                    logoPressedTimes.current < 49 ? logoPressedTimes.current += 1 : logoPressEasterEgg()
                    console.log('Logo pressed times = ' + logoPressedTimes.current)
                }}>
                    <Image
                        source={require('../assets/NewLogo.png')}
                        resizeMode = 'contain'
                        style={{
                            width: 35,
                            height: 35,
                            tintColor: colors.tertiary
                        }}
                    />
                </TouchableWithoutFeedback>
                <TouchableOpacity disabled={!FlatListElementsEnabledState} onPress={() => {navigation.navigate('ChatScreenStack')}}>
                    <Image
                        source={require('../assets/app_icons/chat.png')}
                        resizeMode = 'contain'
                        style={{
                            width: 35,
                            height: 35,
                            tintColor: colors.tertiary
                        }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', paddingBottom: 10}}>
                <TouchableWithoutFeedback onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCurrentFeed('For You')
                }}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: currentFeed == 'For You' ? colors.brand : colors.tertiary, marginRight: 3}}>For You</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setCurrentFeed('Following')
                }}>
                    <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: currentFeed == 'Following' ? colors.brand : colors.tertiary, marginRight: 3}}>Following</Text>
                </TouchableWithoutFeedback>
            </View>
            <ProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={updateSimpleStylesWarningHidden}>
                <ScrollView style={{marginHorizontal: 10}}>
                    <Text style={{color: colors.errorColor ? colors.errorColor : 'red', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>SocialSquare has recently been updated and the custom styles that you currently have are now out of date.</Text>
                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginVertical: 10}}>At least one of your custom styles are now outdated and SocialSquare now only supports version {SimpleStylingVersion}.</Text>
                    <StyledButton 
                        style={{marginVertical: 20, height: 'auto'}}
                        onPress={() => {
                            setUpdateSimpleStylesWarningHidden(true)
                            navigation.navigate('Profile', {
                                screen: 'Welcome',
                                params: {backButtonHidden: true, imageFromRoute: null, goToStylingMenu: true},
                            });
                        }}
                    >
                        <ButtonText style={{textAlign: 'center'}}>Go to custom stylings screen to update them and never show this message again</ButtonText>
                    </StyledButton>
                    <StyledButton onPress={() => {setUpdateSimpleStylesWarningHidden(true)}} style={{height: 'auto'}}>
                        <ButtonText style={{textAlign: 'center'}}>Ignore this message and never show it again</ButtonText>
                    </StyledButton>
                </ScrollView>
            </ProfileOptionsView>
            <ProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={ProfileOptionsViewState}>
                <ProfileOptionsViewText style={{color: colors.tertiary}}>{usernameToReport || "Couldn't get name"}</ProfileOptionsViewText>
                <ProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>Options</ProfileOptionsViewSubtitleText>
                <ProfileOptionsViewButtons greyButton={true} onPress={changeOptionsView}>
                    <ProfileOptionsViewButtonsText greyButton={true}>Cancel</ProfileOptionsViewButtonsText>
                </ProfileOptionsViewButtons> 
                <ProfileOptionsViewButtons greyButton={true} onPress={OptionsViewMessageButtonOnPress}>
                    <ProfileOptionsViewButtonsText greyButton={true}>Message</ProfileOptionsViewButtonsText>
                </ProfileOptionsViewButtons>
                <ProfileOptionsViewButtons redButton={true} onPress={OptionsViewReportButtonOnPress}>
                    <ProfileOptionsViewButtonsText redButton={true}>Report</ProfileOptionsViewButtonsText>
                </ProfileOptionsViewButtons> 
            </ProfileOptionsView>
                {postEncrypted == 'false' ?
                    <ReportProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={ReportProfileOptionsViewState} post={true}>
                        <ReportProfileOptionsViewText style={{color: colors.tertiary}}>{"Report " + usernameToReport || "Report profile"}</ReportProfileOptionsViewText>
                        <ReportProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>Use this page to report this profile. If anyone is in danger immediately call emergency services. Do Not Wait.</ReportProfileOptionsViewSubtitleText>
                        <ReportProfileOptionsViewButtons greyButton={true} onPress={changeReportProfilesOptionsView}>
                            <ReportProfileOptionsViewButtonsText greyButton={true}>Cancel</ReportProfileOptionsViewButtonsText>
                        </ReportProfileOptionsViewButtons>
                        <ReportProfileOptionsViewButtons redButton={true} onPress={changeReportProfiles_ContentThatShouldNotBePosted_OptionsView}>
                            <ReportProfileOptionsViewButtonsText redButton={true}>This post is content that should not be on SocialSquare.</ReportProfileOptionsViewButtonsText>
                        </ReportProfileOptionsViewButtons>
                        <ReportProfileOptionsViewButtons redButton={true} onPress={changeReportProfiles_PretendingToBeSomeoneElse_OptionsView}>
                            <ReportProfileOptionsViewButtonsText redButton={true}>This post is pretending to be someone they're not</ReportProfileOptionsViewButtonsText>
                        </ReportProfileOptionsViewButtons>
                    </ReportProfileOptionsView>
                :
                    <ReportProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={ReportProfileOptionsViewState} post={true}>
                        <ReportProfileOptionsViewButtons greyButton={true} onPress={changeReportProfilesOptionsView}>
                            <ReportProfileOptionsViewButtonsText greyButton={true}>Cancel</ReportProfileOptionsViewButtonsText>
                        </ReportProfileOptionsViewButtons>
                        <Text style={{fontSize: 24, color: colors.tertiary, textAlign: 'center', marginVertical: 30}}>This post is encrypted. Because this post is encrypted, SocialSquare cannot look at the post and therefore we can not take any action on it.</Text>
                        <Text style={{fontStyle: 'italic', color: 'red', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>If anyone is in immediate danger, call emergency services. Do Not Wait.</Text>
                    </ReportProfileOptionsView>
                }
            <ReportProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={ReportProfile_ContentThatShouldNotBePosted_OptionsViewState}>
                <ReportProfileOptionsViewText style={{color: colors.tertiary}}>{"Report " + usernameToReport || "Report profile"}</ReportProfileOptionsViewText>
                <ReportProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>What content are you trying to report?</ReportProfileOptionsViewSubtitleText>
                <ReportProfileOptionsViewButtons padding={true} paddingAmount={'100px'}greyButton={true} onPress={changeReportProfiles_ContentThatShouldNotBePosted_OptionsView}>
                    <ReportProfileOptionsViewButtonsText greyButton={true}>Back</ReportProfileOptionsViewButtonsText>
                </ReportProfileOptionsViewButtons>
                <ScrollView style={{width: '100%'}}>
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>It's spam</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons>
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Nudity or sexual activity</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>I just don't like it</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Hate speech or symbols</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Suicide, self-injury or eating disorders</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Sale of illegal or regulated goods</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Violence or dangerous organizations</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Bullying or harassment</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Intellectual property violation</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>Scam or fraud</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>False information</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons>
                </ScrollView>
            </ReportProfileOptionsView>
            <ReportProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={ReportProfile_PretendingToBeSomeoneElse_OptionsViewState}>
                <ReportProfileOptionsViewText style={{color: colors.tertiary}}>{"Report " + usernameToReport || "Report profile"}</ReportProfileOptionsViewText>
                <ReportProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>User Is Pretending To Be Someone Else</ReportProfileOptionsViewSubtitleText>
                <ReportProfileOptionsViewButtons greyButton={true} onPress={changeReportProfiles_PretendingToBeSomeoneElse_OptionsView}>
                    <ReportProfileOptionsViewButtonsText greyButton={true}>Back</ReportProfileOptionsViewButtonsText>
                </ReportProfileOptionsViewButtons>
                <ScrollView style={{width: '100%'}}>
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be me</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be someone I know</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons>
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be a celebrity or public figure</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => {alert("Coming soon")}}>
                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be a business or organisation</ReportProfileOptionsViewButtonsText>
                    </ReportProfileOptionsViewButtons> 
                </ScrollView>
            </ReportProfileOptionsView>
            {currentFeed == 'Following' ?
                storedCredentials ?
                    <View style={{flex: 1}}>
                        <FlatList 
                            style={{flex: 1, paddingTop: 0, backgroundColor: colors.primary}}
                            onViewableItemsChanged={onViewRef.current}
                            viewabilityConfig={viewConfigRef.current}
                            data={followingFeed.posts}
                            ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                            refreshControl={
                                <RefreshControl
                                    refreshing={followingFeed.reloadingFeed}
                                    onRefresh={() => {
                                        loadFeed(true) //Force the reload because since state is asynchronous reloadFeed will be false when the function loads
                                    }}
                                />
                            }
                            onEndReachedThreshold={3}
                            onEndReached = {({distanceFromEnd})=>{
                                if (distanceFromEnd > 0) {
                                    console.log('End of the feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                    if (followingFeed.loadingFeed == false) {
                                        loadMorePosts()
                                    }
                                }
                            }}
                            renderItem={renderFollowingFeedPost}
                            keyExtractor={item => item._id}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={() => {
                                return (
                                    <View>
                                        {followingFeed.noMorePosts ?
                                            <View style={{borderColor: colors.tertiary, borderTopWidth: 3, borderBottomWidth: 3, borderLeftWidth: 1, borderRightWidth: 1, paddingVertical: 15, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{color: colors.tertiary, fontWeight: 'bold', fontSize: 20}}>No More Posts</Text>
                                            </View>
                                        : followingFeed.loadingFeed ?
                                            <ActivityIndicator size="large" color={colors.brand} />
                                        :
                                            <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => loadMorePosts()}>
                                                <SubTitle style={{textAlign: 'center', alignSelf: 'center', textAlign: 'center', color: colors.tertiary}}>Load More</SubTitle>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                )
                            }}
                        />

                        {postNumForMsg == null && (<MsgBox type={messageType}>{message}</MsgBox>)}
                    </View>
                :
                    <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to access the following feed</Text>
                        <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                            <ButtonText> Login </ButtonText>
                        </StyledButton>
                        <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                                <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                        </StyledButton>
                    </View>
            : //Below is the For You Feed
                <View style={{flex: 1}}>
                    <FlatList 
                        style={{flex: 1, paddingTop: 0, backgroundColor: colors.primary}}
                        onViewableItemsChanged={onViewRef.current}
                        viewabilityConfig={viewConfigRef.current}
                        data={forYouFeed.posts}
                        ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                        refreshControl={
                            <RefreshControl
                                refreshing={forYouFeed.reloadingFeed} 
                                onRefresh={() => {
                                    loadFeed(true) //Force the reload because since state is asynchronous reloadFeed will be false when the function loads
                                }}
                            />
                        }
                        onEndReachedThreshold={0.7}
                        onEndReached = {({distanceFromEnd})=>{
                            if (distanceFromEnd > 0) {
                                console.log('End of the feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                if (forYouFeed.loadingFeed == false) {
                                    loadMorePosts()
                                }
                            }
                        }}
                        renderItem={({item, index}) => {
                            return(
                                <View>
                                    {item.hasSeenPosts == true && (
                                        <View>
                                            {index-1 == -1 && (
                                                <View>
                                                    <SubTitle style={{marginBottom: 0, color: colors.brand, textAlign: 'center'}}>All possible unviewed posts seen</SubTitle>
                                                    <SubTitle style={{fontSize: 8, color: colors.tertiary, textAlign: 'center', marginBottom: 5}}>Now on you may have seen these posts more than twice or interacted with them</SubTitle>
                                                </View>
                                            )}
                                            {index-1 !== -1 && (
                                                <View>
                                                    {forYouFeed.posts.slice(0, index).findIndex(x => x.hasSeenPosts == true) == -1 && (
                                                        <View>
                                                            <SubTitle style={{marginBottom: 0, color: colors.brand, textAlign: 'center'}}>All possible unviewed posts seen</SubTitle>
                                                            <SubTitle style={{fontSize: 8, color: colors.tertiary, textAlign: 'center', marginBottom: 5}}>Now on you may have seen these posts more than twice or interacted with them</SubTitle>
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    )}
                                    
                                    {item.hasSeenPosts == false && (
                                        <View>
                                            {index-1 !== -1 && (
                                                <View>
                                                    {forYouFeed.posts.slice(0, index).findIndex(x => x.hasSeenPosts == true) !== -1 && ( //has seen one above somewhere
                                                        <View>
                                                            <SubTitle style={{marginBottom: 0, color: colors.brand, textAlign: 'center'}}>New Post</SubTitle>
                                                            <SubTitle style={{fontSize: 8, color: colors.tertiary, textAlign: 'center', marginBottom: 5}}>You may have not seen the following post</SubTitle>
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    )}

                                    {index % 5 == 0 && index !== 0 && (
                                        <View style={{alignItems: 'center'}}>
                                            <BannerAd
                                                unitId={AdID}
                                                size={BannerAdSize.MEDIUM_RECTANGLE}
                                                requestOptions={{
                                                    requestNonPersonalizedAdsOnly: true,
                                                }}
                                                onAdFailedToLoad={(error) => console.warn('An error occured while loading ad:', error)}
                                            />
                                        </View>
                                    )}

                                    {item.format == "Image" && (
                                        <ImagePost post={item} index={index} dispatch={dispatchForYouFeed} colors={colors} colorsIndexNum={indexNum}/>
                                    )}
                                </View>
                            )
                        }}
                        ListFooterComponent={() => {
                            return (
                                <View>
                                    {forYouFeed.noMorePosts ?
                                        <View style={{borderColor: colors.tertiary, borderTopWidth: 3, borderBottomWidth: 3, borderLeftWidth: 1, borderRightWidth: 1, paddingVertical: 15, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: colors.tertiary, fontWeight: 'bold', fontSize: 20}}>No More Posts</Text>
                                        </View>
                                    : forYouFeed.loadingFeed ?
                                        <ActivityIndicator size="large" color={colors.brand} />
                                    :
                                        <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => loadMorePosts()}>
                                            <SubTitle style={{textAlign: 'center', alignSelf: 'center', textAlign: 'center', color: colors.tertiary}}>Load More</SubTitle>
                                        </TouchableOpacity>
                                    }
                                </View>
                            )
                        }}
                        keyExtractor={item => item._id}
                        showsVerticalScrollIndicator={false}
                    />

                    {postNumForMsg == null && (<MsgBox type={messageType}>{message}</MsgBox>)}
                </View>
            }
        
        </View>
    );
};

export default HomeScreen;
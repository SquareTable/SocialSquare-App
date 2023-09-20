import React, {useContext, useState} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
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
    CategoriesTopBtns,
    ViewScreenPollPostCommentsFrame,
    CommentsHorizontalView,
    CommentsVerticalView,
    CommentsHorizontalViewItem,
    CommenterName,
    CommenterIcon,
    StyledInputLabel,
    StyledTextInput,
    CommentIcons,
    CommentText,
    CommentsContainer,
    VoteText,
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling';

// Colors
const {brand, primary, tertiary, greyish, darkLight, slightlyLighterPrimary, descTextColor, darkest, red} = Colors;

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// formik
import {Formik} from 'formik';

//axios
import axios from 'axios';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, SectionList, View, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import ParseErrorMessage from '../components/ParseErrorMessage';
import usePostReducer from '../hooks/usePostReducer';
import ThreadPost from '../components/Posts/ThreadPost';

const ThreadViewPage = ({navigation, route}) => {
    const [postReducer, dispatch] = usePostReducer();
    const {colors, dark, colorsIndexNum} = useTheme()
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {name} = storedCredentials} else {var {name} = {name: 'SSGUEST'}}
    const {threadId, creatorPfpB64} = route.params;
    
    //ServerStuff
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [postNumForMsg, setPostNumForMsg] = useState();
    //Comment stuff
    const [ifCommentText, setIfCommentText] = useState("No comments found")
    const [changeSections, setChangeSections] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [limitSearch, setLimitSearch] = useState(false)
    const [commentLoadMax, setCommentLoadMax] = useState(10)
    const [commentsLength , setCommentsLength] = useState("Loading")
    const [loadingMoreComments, setLoadingMoreComments] = useState(false)
    //change stuff
    const [limitRefresh, setLimitRefresh] = useState(false)
    const [threadCategory, setThreadCategory] = useState("Finding")
    const [creatorDisplayName, setCreatorDisplayName] = useState("Finding")
    const [creatorName, setCreatorName] = useState("Finding")
    const [creatorImageB64, setCreatorImageB64] = useState("Finding")
    const [categoryImageB64, setCategoryImageB64] = useState("Finding")
    //Up and Down Vote Comment Stuff
    var upVotedComments = []
    var initialUpVotedComments = []
    const [initialUpVotes, setInitialUpVotes] = useState([])
    const [upVotes, setUpVotes] = useState([])
    //
    var downVotedComments = []
    var initialDownVotedComments = []
    const [initialDownVotes, setInitialDownVotes] = useState([])
    const [downVotes, setDownVotes] = useState([])
    //
    var neitherVotedComments = []
    var initialNeitherVotedComments = []
    const [initialNeitherVotes, setInitialNeitherVotes] = useState([])
    const [neitherVotes, setNeitherVotes] = useState([])
    //
    var changingVotedCommentsArray = []
    const [changingVotedComments, setChangingVotedComments] = useState([])
    //
    var findingVotedCommentsArray = []
    const [findingVotedComments, setFindingVotedComments] = useState([])
    //PFP
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext);
    // Server stuff
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const StatusBarHeight = useContext(StatusBarHeightContext);

    //get image of post
    async function getImageInPost(imageData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageData[index].imageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }
    //profile image of creator
    async function getImageInPfp(threadData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${threadData[index].creatorImageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }
    //profile image of commenter
    async function getImageInPfpComments(commentData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${commentData[index].profileImageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }
    //any image honestly
    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    //Refresh All Values
    const refreshAllValues = () => {
        const changeValues = async (data) => {
            let imageB64Var = null
            if (data.threadImageKey !== "") {
                console.log(data.threadImageKey)
                imageB64Var = await getImageWithKey(data.threadImageKey)
            }

            data.creatorImageB64 = creatorPfpB64
            data.imageInThreadB64 = imageB64Var

            dispatch({type: 'addPosts', posts: [data]})
            setCreatorDisplayName(data.creatorDisplayName)
            setCreatorName(data.creatorName)

            //Get category image
            let categoryB64Var = null
            if (data.categoryImageKey !== "") {
                console.log(data.categoryImageKey)
                categoryB64Var = await getImageWithKey(data.categoryImageKey)
            } 
            setCategoryImageB64(categoryB64Var)
            setThreadCategory(data.threadCategory)
        }
        const url = `${serverUrl}/tempRoute/getthreadbyid`;
        const toSend = {
            threadId
        }
        
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
    
            if (status !== 'SUCCESS') {
                console.log("Failed")
                handleMessage(message, status);
            } else {
                console.log("SUCCESS getting thread by ID")
                changeValues(data);
            }
            //setSubmitting(false);
        }).catch(error => {
            console.error(error);
            //setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    if (limitRefresh == false) {
        setLimitRefresh(true);
        refreshAllValues();
    }

    const prepareComments = () => {
        upVotedComments = []
        initialUpVotedComments = []
        setUpVotes(upVotedComments)
        setInitialUpVotes(initialUpVotedComments)
        downVotedComments = []
        initialDownVotedComments = []
        setDownVotes(downVotedComments)
        setInitialDownVotes(initialDownVotedComments)
        neitherVotedComments = []
        initialNeitherVotedComments = []
        setNeitherVotes(neitherVotedComments)
        setInitialNeitherVotes(initialNeitherVotedComments)
        findingVotedCommentsArray = []
        setFindingVotedComments(findingVotedCommentsArray)
        changingVotedCommentsArray = []
        setChangingVotedComments(changingVotedCommentsArray)
        setIfCommentText("No comments found")
        const layoutComments = (data) => {
            setIfCommentText("Poll Comments:")
            var imageData = data.data
            var commentData = imageData
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
                            const pfpB64 = await getImageInPfpComments(imageData, index)
                            var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, commentReplies: commentData[index].commentReplies, datePosted: commentData[index].datePosted, commenterImageB64: pfpB64}]}
                            tempSections.push(tempSectionsTemp)
                            if (commentData[index].commentUpVotes == true) {
                                console.log("UpVoted")
                                upVotedComments.push(commentData[index].commentId)
                                setUpVotes(upVotedComments)
                                initialUpVotedComments.push(commentData[index].commentId)
                                setInitialUpVotes(initialUpVotedComments)
                            } else if (commentData[index].commentDownVoted == true) {
                                console.log("DownVoted")
                                downVotedComments.push(commentData[index].commentId)
                                setDownVotes(downVotedComments)
                                initialDownVotedComments.push(commentData[index].commentId)
                                setInitialDownVotes(initialDownVotedComments)
                            } else {
                                console.log("Neither")
                                neitherVotedComments.push(commentData[index].commentId)
                                setNeitherVotes(neitherVotedComments)
                                initialNeitherVotedComments.push(commentData[index].commentId)
                                setInitialNeitherVotes(initialNeitherVotedComments)
                            }
                            itemsProcessed++;
                            if(itemsProcessed === commentData.length) {
                                //console.log(tempSections)
                                setLoadingMoreComments(false)
                                setChangeSections(tempSections) 
                            }
                        }
                        getImageWithAwait();
                    } else {
                        //add to list
                        var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, commentReplies: commentData[index].commentReplies, datePosted: commentData[index].datePosted, commenterImageB64: require("./../assets/img/Logo.png")}]}
                        if (commentData[index].commentUpVotes == true) {
                            console.log("UpVoted")
                            upVotedComments.push(commentData[index].commentId)
                            setUpVotes(upVotedComments)
                            initialUpVotedComments.push(commentData[index].commentId)
                            setInitialUpVotes(initialUpVotedComments)
                        } else if (commentData[index].commentDownVoted == true) {
                            console.log("DownVoted")
                            downVotedComments.push(commentData[index].commentId)
                            setDownVotes(downVotedComments)
                            initialDownVotedComments.push(commentData[index].commentId)
                            setInitialDownVotes(initialDownVotedComments)
                        } else {
                            console.log("Neither")
                            neitherVotedComments.push(commentData[index].commentId)
                            setNeitherVotes(neitherVotedComments)
                            initialNeitherVotedComments.push(commentData[index].commentId)
                            setInitialNeitherVotes(initialNeitherVotedComments)
                        }
                        tempSections.push(tempSectionsTemp)
                        itemsProcessed++;
                        if(itemsProcessed === commentData.length) {
                            //console.log(tempSections)
                            setLoadingMoreComments(false)
                            setChangeSections(tempSections)
                        }
                    }
                }
            });
        }

        const urlTwo = `${serverUrl}/tempRoute/searchforthreadcomments`;
        const toSend = {
            threadId
        }

        setLoadingMoreComments(true)
        axios.post(urlTwo, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setLoadingMoreComments(false)
                if (message == 'No comments') {
                    setCommentsLength(0)
                }
            } else {
                layoutComments({data});
            }
            //setSubmitting(false);

        }).catch(error => {
            console.error(error);
            setLoadingMoreComments(false)
            //setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    if (limitSearch == false) {
        setLimitSearch(true);
        prepareComments();
    }

    const handleCommentPost = (commentProperties, setSubmitting) => {
        handleMessage(null);
        const url = serverUrl + "/tempRoute/threadpostcomment";

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

    const UpVoteComment = (commentId, postNum) => {
        if (storedCredentials) {
            //Change to loading circle
            if (findingVotedComments.includes(commentId)) { 

            } else {
                if (changingVotedComments.includes(commentId)) {

                } else {
                    console.log("UpVoting")
                    upVotedComments = upVotes
                    downVotedComments = downVotes
                    neitherVotedComments = neitherVotes
                    var beforeChange = "Neither"
                    if (upVotedComments.includes(commentId)) {
                        beforeChange = "UpVoted"
                        var index = upVotedComments.indexOf(commentId);
                        if (index > -1) {
                            upVotedComments.splice(index, 1);
                        }
                        setUpVotes(upVotedComments)
                    }
                    if (downVotedComments.includes(commentId)) {
                        beforeChange = "DownVoted"
                        var index = downVotedComments.indexOf(commentId);
                        if (index > -1) {
                            downVotedComments.splice(index, 1);
                        }
                        setDownVotes(downVotedComments)
                    }
                    if (neitherVotedComments.includes(commentId)) {
                        beforeChange = "Neither"
                        var index = neitherVotedComments.indexOf(commentId);
                        if (index > -1) {
                            neitherVotedComments.splice(index, 1);
                        }
                        setNeitherVotes(neitherVotedComments)
                    }
                    changingVotedCommentsArray = changingVotedComments
                    changingVotedCommentsArray.push(commentId)
                    setChangingVotedComments(changingVotedCommentsArray)
                    //Do rest
                    handleMessage(null, null, null);
                    const url = serverUrl + "/tempRoute/upvotecomment";

                    var toSend = {format: "Thread", postId: threadId, commentId: commentId}

                    console.log(toSend)

                    axios.post(url, toSend).then((response) => {
                        const result = response.data;
                        const {message, status, data} = result;
                    
                        if (status !== 'SUCCESS') {
                            handleMessage(message, status, postNum);
                            changingVotedCommentsArray = changingVotedComments
                            var index = changingVotedCommentsArray.indexOf(commentId);
                            if (index > -1) {
                                changingVotedCommentsArray.splice(index, 1);
                                setChangingVotedComments(changingVotedCommentsArray)
                            }
                            if (beforeChange == "UpVoted") {
                                upVotedComments = upVotes
                                upVotedComments.push(commentId)
                                setUpVotes(upVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(changingVotedCommentsArray)
                            } 
                            if (beforeChange == "DownVoted") {
                                downVotedComments = downVotes
                                downVotedComments.push(commentId)
                                setDownVotes(downVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(changingVotedCommentsArray)
                            }
                            if (beforeChange == "Neither") {
                                neitherVotedComments = neitherVotes
                                neitherVotedComments.push(commentId)
                                setNeitherVotes(neitherVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(changingVotedCommentsArray)
                            }
                        } else {
                            handleMessage(message, status);
                            var tempChangingVotedCommentsArray = changingVotedComments
                            var index = tempChangingVotedCommentsArray.indexOf(commentId);
                            if (index > -1) {
                                tempChangingVotedCommentsArray.splice(index, 1);
                                console.log("Spliced tempChangingVotedCommentsArray")
                            } else {
                                console.log("Didnt find in changing array")
                            }
                            if (message == "Comment UpVoted") {
                                upVotedComments = upVotes
                                upVotedComments.push(commentId)
                                setUpVotes([])
                                setUpVotes(upVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(tempChangingVotedCommentsArray)
                            } else {
                                //Neither
                                neitherVotedComments = neitherVotes
                                neitherVotedComments.push(commentId)
                                setNeitherVotes([])
                                setNeitherVotes(neitherVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(tempChangingVotedCommentsArray)
                            }
                            //loadAndGetValues()
                            //persistLogin({...data[0]}, message, status);
                        }
                    }).catch(error => {
                        console.error(error);
                        changingVotedCommentsArray = changingVotedComments
                        var index = changingVotedCommentsArray.indexOf(commentId);
                        if (index > -1) {
                            changingVotedCommentsArray.splice(index, 1);
                        }
                        setChangingVotedComments(changingVotedCommentsArray)
                        if (beforeChange == "UpVoted") {
                            upVotedComments = upVotes
                            upVotedComments.push(commentId)
                            setUpVotes(upVotedComments)
                        } 
                        if (beforeChange == "DownVoted") {
                            downVotedComments = downVotes
                            downVotedComments.push(commentId)
                            setDownVotes(downVotedComments)
                        }
                        if (beforeChange == "Neither") {
                            neitherVotedComments = neitherVotes
                            neitherVotedComments.push(commentId)
                            setNeitherVotes(neitherVotedComments)
                        }
                        handleMessage(ParseErrorMessage(error), 'FAILED', postNum);
                    })
                }
            }
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const DownVoteComment = (commentId, postNum) => {
        if (storedCredentials) {
            //Change to loading circle
            if (findingVotedComments.includes(commentId)) { 

            } else {
                if (changingVotedComments.includes(commentId)) {

                } else {
                    console.log("UpVoting")
                    upVotedComments = upVotes
                    downVotedComments = downVotes
                    neitherVotedComments = neitherVotes
                    var beforeChange = "Neither"
                    if (upVotedComments.includes(commentId)) {
                        beforeChange = "UpVoted"
                        var index = upVotedComments.indexOf(commentId);
                        if (index > -1) {
                            upVotedComments.splice(index, 1);
                        }
                        setUpVotes(upVotedComments)
                    }
                    if (downVotedComments.includes(commentId)) {
                        beforeChange = "DownVoted"
                        var index = downVotedComments.indexOf(commentId);
                        if (index > -1) {
                            downVotedComments.splice(index, 1);
                        }
                        setDownVotes(downVotedComments)
                    }
                    if (neitherVotedComments.includes(commentId)) {
                        beforeChange = "Neither"
                        var index = neitherVotedComments.indexOf(commentId);
                        if (index > -1) {
                            neitherVotedComments.splice(index, 1);
                        }
                        setNeitherVotes(neitherVotedComments)
                    }
                    changingVotedCommentsArray = changingVotedComments
                    changingVotedCommentsArray.push(commentId)
                    setChangingVotedComments(changingVotedCommentsArray)
                    //Do rest
                    handleMessage(null, null, null);
                    const url = serverUrl + "/tempRoute/downvotecomment";

                    var toSend = {format: "Thread", postId: threadId, commentId: commentId}

                    console.log(toSend)

                    axios.post(url, toSend).then((response) => {
                        const result = response.data;
                        const {message, status, data} = result;
                    
                        if (status !== 'SUCCESS') {
                            handleMessage(message, status, postNum);
                            changingVotedCommentsArray = changingVotedComments
                            var index = changingVotedCommentsArray.indexOf(commentId);
                            if (index > -1) {
                                changingVotedCommentsArray.splice(index, 1);
                                setChangingVotedComments(changingVotedCommentsArray)
                            }
                            if (beforeChange == "UpVoted") {
                                upVotedComments = upVotes
                                upVotedComments.push(commentId)
                                setUpVotes(upVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(changingVotedCommentsArray)
                            } 
                            if (beforeChange == "DownVoted") {
                                downVotedComments = downVotes
                                downVotedComments.push(commentId)
                                setDownVotes(downVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(changingVotedCommentsArray)
                            }
                            if (beforeChange == "Neither") {
                                neitherVotedComments = neitherVotes
                                neitherVotedComments.push(commentId)
                                setNeitherVotes(neitherVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(changingVotedCommentsArray)
                            }
                        } else {
                            handleMessage(message, status);
                            var tempChangingVotedCommentsArray = changingVotedComments
                            var index = tempChangingVotedCommentsArray.indexOf(commentId);
                            if (index > -1) {
                                tempChangingVotedCommentsArray.splice(index, 1);
                                console.log("Spliced tempChangingVotedCommentsArray")
                            } else {
                                console.log("Didnt find in changing array")
                            }
                            if (message == "Comment DownVoted") {
                                downVotedComments = downVotes
                                downVotedComments.push(commentId)
                                setDownVotes([])
                                setDownVotes(downVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(tempChangingVotedCommentsArray)
                            } else {
                                //Neither
                                neitherVotedComments = neitherVotes
                                neitherVotedComments.push(commentId)
                                setNeitherVotes([])
                                setNeitherVotes(neitherVotedComments)
                                setChangingVotedComments([])
                                setChangingVotedComments(tempChangingVotedCommentsArray)
                            }
                            //loadAndGetValues()
                            //persistLogin({...data[0]}, message, status);
                        }
                    }).catch(error => {
                        console.error(error);
                        changingVotedCommentsArray = changingVotedComments
                        var index = changingVotedCommentsArray.indexOf(commentId);
                        if (index > -1) {
                            changingVotedCommentsArray.splice(index, 1);
                        }
                        setChangingVotedComments(changingVotedCommentsArray)
                        if (beforeChange == "UpVoted") {
                            upVotedComments = upVotes
                            upVotedComments.push(commentId)
                            setUpVotes(upVotedComments)
                        } 
                        if (beforeChange == "DownVoted") {
                            downVotedComments = downVotes
                            downVotedComments.push(commentId)
                            setDownVotes(downVotedComments)
                        }
                        if (beforeChange == "Neither") {
                            neitherVotedComments = neitherVotes
                            neitherVotedComments.push(commentId)
                            setNeitherVotes(neitherVotedComments)
                        }
                        handleMessage(ParseErrorMessage(error), 'FAILED', postNum);
                    })
                }
            }
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const Item = ({commentId, commenterName, commenterDisplayName, commentsText, commentUpVotes, commentReplies, datePosted, commenterImageB64}) => (
        <CommentsContainer>
            <CommentsHorizontalView>
                <CommentsVerticalView alongLeft={true}>
                    <TouchableOpacity>
                        <CommenterIcon source={{uri: commenterImageB64}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{UpVoteComment(commentId)}}>
                        {upVotes.includes(commentId) && (
                            <CommentIcons style={{tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        )}
                        {downVotes.includes(commentId) && (
                            <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        )}
                        {neitherVotes.includes(commentId) && (
                            <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        )}
                        {changingVotedComments.includes(commentId) && (
                            <CommentIcons/>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity>
                        {upVotes.includes(commentId) && (<View style={{textAlign: 'center'}}>
                            {initialUpVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes}</VoteText>
                            )}
                            {initialNeitherVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes+1}</VoteText>
                            )}
                            {initialDownVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes+2}</VoteText>
                            )}
                        </View>)}
                        {neitherVotes.includes(commentId) && (<View style={{textAlign: 'center'}}>
                            {initialNeitherVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes}</VoteText>
                            )}
                            {initialUpVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes-1}</VoteText>
                            )}
                            {initialDownVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes+1}</VoteText>
                            )}
                        </View>)}
                        {downVotes.includes(commentId) && (<View style={{textAlign: 'center'}}>
                            {initialDownVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes}</VoteText>
                            )}
                            {initialNeitherVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes-1}</VoteText>
                            )}
                            {initialUpVotes.includes(commentId)&& (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{commentUpVotes-2}</VoteText>
                            )}
                        </View>)}
                        {changingVotedComments.includes(commentId) && (<View>
                            <ActivityIndicator size="small" color={brand} />                
                        </View>)}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{DownVoteComment(commentId)}}>
                        {upVotes.includes(commentId) && (
                            <CommentIcons downVoteButton={true} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                        )}
                        {downVotes.includes(commentId) && (
                            <CommentIcons style={{tintColor: colors.brand}} downVoteButton={true} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                        )}
                        {neitherVotes.includes(commentId) && (
                            <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                        )}
                        {changingVotedComments.includes(commentId) && (
                            <CommentIcons/>
                        )}
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
                    <TouchableOpacity onPress={()=>{navigation.navigate("CommentViewPage", {commentId: commentId, threadId: threadId, postFormat: "Thread"})}}>
                        <VoteText style={{color: brand}}>
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

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <ChatScreen_Title style={{backgroundColor: dark ? colors.darkest : colors.greyish, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{creatorDisplayName ? creatorDisplayName : creatorName}'s thread</TestText>
            </ChatScreen_Title>
            <ScrollView style={{backgroundColor: colors.primary}}>
                <StyledContainer style={{width: '100%', backgroundColor: dark ? colors.darkest : colors.greyish, alignItems: 'center', paddingBottom: 2, paddingTop: 0}}>
                        <Avatar style={{height: 70, width: 70, marginBottom: 0}} source={{uri: categoryImageB64 == null || categoryImageB64 == "Finding" ? SocialSquareLogo_B64_png : categoryImageB64}}/>
                    <SubTitle style={{marginBottom: 0, color: colors.tertiary}}>Category: {threadCategory}</SubTitle>
                </StyledContainer>
                {postReducer.posts.length > 0 ?
                    <ThreadPost post={postReducer.posts[0]} colors={colors} colorsIndexNum={colorsIndexNum} dispatch={dispatch} index={0}/>
                :
                    <>
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Loading thread... (At some point we should put a loading animation here)</Text>
                        <ActivityIndicator color={colors.brand} size="large"/>
                    </>
                }
                {storedCredentials ?
                    <ViewScreenPollPostCommentsFrame style={{width: '100%', marginLeft: 0, marginRight: 0}}>
                        <PollPostTitle commentsTitle={true}>Comments</PollPostTitle>
                        <CommentsHorizontalView writeCommentArea={true}>
                            <Formik
                                initialValues={{comment: '', userName: name, threadId: threadId}}
                                onSubmit={(values, {setSubmitting}) => {
                                    if (values.comment == "") {
                                        handleMessage('You cant post and empty comment');
                                        setSubmitting(false);
                                    } else {
                                        handleCommentPost(values, setSubmitting);
                                        values.comment = ""
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
                                                    placeholderTextColor={darkLight}
                                                    onChangeText={handleChange('comment')}
                                                    onBlur={handleBlur('comment')}
                                                    value={values.comment}
                                                    multiline={true}
                                                    style={{color: colors.tertiary, backgroundColor: colors.primary, borderColor: colors.borderColor}}
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
                            <ActivityIndicator size="small" color={brand} />  
                        )}
                    </ViewScreenPollPostCommentsFrame>
                :
                    <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to comment on this thread</Text>
                        <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                            <ButtonText> Login </ButtonText>
                        </StyledButton>
                        <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true})}>
                                <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                        </StyledButton>
                    </View>
                }
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

export default ThreadViewPage;
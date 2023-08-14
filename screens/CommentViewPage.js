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
    VoteText
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
import { ImageBackground, ScrollView, SectionList, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import ParseErrorMessage from '../components/ParseErrorMessage';

const CommentViewPage = ({route, navigation}) => {
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {name} = storedCredentials || {};
    const {commentId, postId, postFormat} = route.params;
    const [AvatarImg, setAvatarImage] = useState(null)    
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
    const [commentUpOrDownVoted, setCommentUpOrDownVoted] = useState("Finding")
    const [initialCommentUpOrDownVoted, setInitialCommentUpOrDownVoted] = useState("Finding")
    const [mainCommentChanging, setMainCommentChanging] = useState(false)
    const [mainCommentFinding, setMainCommentFinding] = useState(false)
    const [threadType, setThreadType] = useState("Finding")
    const [mainCommentUpVotes, setMainCommentUpVotes] = useState("Finding")
    const [mainCommenterName, setMainCommenterName] = useState("Finding")
    const [mainCommenterDisplayName, setMainCommenterDisplayName] = useState("Finding")
    const [mainCommentsText, setmainCommentsText] = useState("Finding")
    const [mainCommentReplies, setMainCommentReplies] = useState("Finding")
    const [datePosted, setDatePosted] = useState("Finding")
    const [commenterImageB64, setCommenterImageB64] = useState("Finding")
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
    // Theme
    const {colors, dark} = useTheme();
    // PFP
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)

    //get image of post
    async function getImageInPost(imageData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageData[index].imageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }
    //profile image of creator
    async function getImageInPfp(threadData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${threadData[index].creatorImageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }
    //profile image of commenter
    async function getImageInPfpComments(commentData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${commentData[index].profileImageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }
    //any image honestly
    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    //Refresh All Values
    const refreshAllValues = () => {
        const changeValues = async (data) => {
            //set values
            const commentData = data.data[0]
            //Change text based values
            if (commentData.commentUpVoted == true) {
                setCommentUpOrDownVoted("UpVoted")
                setInitialCommentUpOrDownVoted("UpVoted")
            } else if (commentData.commentDownVoted == true) {
                setCommentUpOrDownVoted("DownVoted")
                setInitialCommentUpOrDownVoted("DownVoted")
            } else {
                setCommentUpOrDownVoted("Neither")
                setInitialCommentUpOrDownVoted("Neither")
            }
            setMainCommentUpVotes(commentData.commentUpVotes)
            setMainCommenterName(commentData.commenterName)
            setMainCommenterDisplayName(commentData.commenterDisplayName)
            setmainCommentsText(commentData.commentText)
            setMainCommentReplies(commentData.commentReplies)
            setDatePosted(commentData.datePosted)
            //Get images
            var creatorB64Var = null
            if (commentData.profileImageKey !== "") {
                console.log("ImageKey:")
                console.log(commentData.profileImageKey)
                creatorB64Var = await getImageWithKey(commentData.profileImageKey)
                setCommenterImageB64(creatorB64Var)
            } else {
                creatorB64Var = null
                setCommenterImageB64(creatorB64Var)
            }
        }
        var url = ""
        if (postFormat == "Poll") {
            url = `${serverUrl}/tempRoute/getsinglepollcomment`;
        } else if (postFormat == "Image") {
            url = `${serverUrl}/tempRoute/getsingleimagecomment`;
        } else if (postFormat == "Thread") {
            url = `${serverUrl}/tempRoute/getsinglethreadcomment`;
        }

        const toSend = {
            postId, commentId
        }
        
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
    
            if (status !== 'SUCCESS') {
                console.log("Failed")
                handleMessage(message, status);
            } else {
                console.log("SUCCESS getting comment")
                changeValues({data});
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

    const prepareReplies = () => {
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
                            const pfpB64= await getImageInPfpComments(imageData, index)
                            var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, datePosted: commentData[index].datePosted, commenterImageB64: pfpB64}]}
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
                        var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, datePosted: commentData[index].datePosted, commenterImageB64: require("./../assets/img/Logo.png")}]}
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

        var urlTwo = ""
        if (postFormat == "Poll") {
            urlTwo = `${serverUrl}/tempRoute/searchforpollcommentreplies`;
        } else if (postFormat == "Image") {
            urlTwo = `${serverUrl}/tempRoute/searchforimagecommentreplies`;
        } else if (postFormat == "Thread") {
            urlTwo = `${serverUrl}/tempRoute/searchforthreadcommentreplies`;
        }

        const toSend = {
            postId, commentId
        }

        setLoadingMoreComments(true)
        axios.post(urlTwo, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setLoadingMoreComments(false)
            } else {
                layoutComments({data});
            }
            //setSubmitting(false);

        }).catch(error => {
            console.log(error);
            setLoadingMoreComments(false)
            //setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    if (limitSearch == false) {
        setLimitSearch(true);
        prepareReplies();
    }

    const handleCommentPost = (commentProperties, setSubmitting) => {
        handleMessage(null);
        const url = serverUrl + "/tempRoute/threadpostcommentreply";

        axios.post(url, commentProperties).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                handleMessage("Comment Uploaded", "SUCCESS");
                prepareReplies()
                //persistLogin({...data[0]}, message, status);
            }
            setSubmitting(false);

        }).catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    const UpVoteComment = (commentId, postNum) => {
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

                var toSend = {format: postFormat, postId: postId, commentId: commentId}

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
                    console.log(error);
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
    }

    const DownVoteComment = (commentId, postNum) => {
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

                var toSend = {format: postFormat, postId: postId, commentId: commentId}

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
                    console.log(error);
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
    }

    const Item = ({commentId, commenterName, commenterDisplayName, commentsText, commentUpVotes, datePosted, commenterImageB64}) => (
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
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes}</VoteText>
                            )}
                            {initialNeitherVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes+1}</VoteText>
                            )}
                            {initialDownVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes+2}</VoteText>
                            )}
                        </View>)}
                        {neitherVotes.includes(commentId) && (<View style={{textAlign: 'center'}}>
                            {initialNeitherVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes}</VoteText>
                            )}
                            {initialUpVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes-1}</VoteText>
                            )}
                            {initialDownVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes+1}</VoteText>
                            )}
                        </View>)}
                        {downVotes.includes(commentId) && (<View style={{textAlign: 'center'}}>
                            {initialDownVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes}</VoteText>
                            )}
                            {initialNeitherVotes.includes(commentId) && (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes-1}</VoteText>
                            )}
                            {initialUpVotes.includes(commentId)&& (
                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{commentUpVotes-2}</VoteText>
                            )}
                        </View>)}
                        {changingVotedComments.includes(commentId) && (<View>
                            <ActivityIndicator size="small" color={colors.brand} />                
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
                        <CommenterName style={{color: colors.brand}}>@{commenterName}</CommenterName>
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
            <ScrollView style={{backgroundColor: colors.primary}}>
                <WelcomeContainer style={{backgroundColor: colors.primary}}>
                    <WelcomeContainer style={{backgroundColor: colors.primary}}>
                        <CommentsContainer>
                            <CommentsHorizontalView>
                                <CommentsVerticalView alongLeft={true}>
                                    <TouchableOpacity>
                                        <CommenterIcon source={{uri: commenterImageB64 != null && commenterImageB64 != '' ? commenterImageB64 : SocialSquareLogo_B64_png}}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{UpVoteComment(commentId)}}>
                                        {commentUpOrDownVoted == "UpVoted" && (
                                            <CommentIcons style={{tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                        )}
                                        {commentUpOrDownVoted == "DownVoted" && (
                                            <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                        )}
                                        {commentUpOrDownVoted == "Neither" && (
                                            <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                                        )}
                                        {mainCommentChanging == true && (
                                            <CommentIcons/>
                                        )}
                                        {mainCommentFinding == true && (
                                            <CommentIcons/>
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        {commentUpOrDownVoted == "UpVoted" && (<View style={{textAlign: 'center'}}>
                                            {initialCommentUpOrDownVoted == "UpVoted" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes}</VoteText>
                                            )}
                                            {initialCommentUpOrDownVoted == "Neither" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes+1}</VoteText>
                                            )}
                                            {initialCommentUpOrDownVoted == "DownVoted" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: descTextColor}}>{mainCommentUpVotes+2}</VoteText>
                                            )}
                                        </View>)}
                                        {commentUpOrDownVoted == "Neither" && (<View style={{textAlign: 'center'}}>
                                            {initialCommentUpOrDownVoted == "Neither" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes}</VoteText>
                                            )}
                                            {initialCommentUpOrDownVoted == "UpVoted" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes-1}</VoteText>
                                            )}
                                            {initialCommentUpOrDownVoted == "DownVoted" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes+1}</VoteText>
                                            )}
                                        </View>)}
                                        {commentUpOrDownVoted == "DownVoted" && (<View style={{textAlign: 'center'}}>
                                            {initialCommentUpOrDownVoted == "DownVoted" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes}</VoteText>
                                            )}
                                            {initialCommentUpOrDownVoted == "Neither" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes-1}</VoteText>
                                            )}
                                            {initialCommentUpOrDownVoted == "UpVoted" && (
                                                <VoteText style={{alignSelf: 'center', fontSize: 12, color: colors.descTextColor}}>{mainCommentUpVotes-2}</VoteText>
                                            )}
                                        </View>)}
                                        {mainCommentChanging == true && (<View>
                                            <ActivityIndicator size="small" color={colors.brand} />                
                                        </View>)}
                                        {mainCommentFinding == true && (
                                            <ActivityIndicator size="small" color={colors.brand} /> 
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{DownVoteComment(commentId)}}>
                                        {commentUpOrDownVoted == "UpVoted" && (
                                            <CommentIcons downVoteButton={true} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                        )}
                                        {commentUpOrDownVoted == "DownVoted" && (
                                            <CommentIcons style={{tintColor: colors.brand}} downVoteButton={true} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                        )}
                                        {commentUpOrDownVoted == "Neither" && (
                                            <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                        )}
                                        {mainCommentChanging == true && (
                                            <CommentIcons/>
                                        )}
                                        {mainCommentFinding == true && (
                                            <CommentIcons/>
                                        )}
                                    </TouchableOpacity>
                                </CommentsVerticalView>
                                <CommentsVerticalView>
                                    <TouchableOpacity>
                                        <CommenterName displayName={true} style={{color: colors.tertiary}}>{mainCommenterDisplayName}</CommenterName>
                                        <CommenterName style={{color: colors.brand}}>@{mainCommenterName}</CommenterName>
                                    </TouchableOpacity>
                                    <CommentText style={{color: colors.tertiary}}>{mainCommentsText}</CommentText>
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
                                    <TouchableOpacity>
                                        <VoteText style={{color: colors.brand}}>
                                            {mainCommentReplies.length} replies
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
                        <ViewScreenPollPostCommentsFrame style={{width: '100%', marginLeft: 0, marginRight: 0}}>
                                <PollPostTitle style={{color: colors.brand}} commentsTitle={true}>Comments</PollPostTitle>
                                <CommentsHorizontalView writeCommentArea={true}>
                                    <Formik
                                        initialValues={{comment: '', userName: name, postId: postId, commentId: commentId}}
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
                                                        <CommenterName style={{color: colors.brand}}>Img/GIF</CommenterName>
                                                    </CommentsHorizontalViewItem>
                                                    <CommentsHorizontalViewItem>
                                                        <CommenterName style={{color: colors.brand}}>Text</CommenterName>
                                                    </CommentsHorizontalViewItem>
                                                    <CommentsHorizontalViewItem>
                                                        <CommenterName style={{color: colors.brand}}>Short Video</CommenterName>
                                                    </CommentsHorizontalViewItem>
                                                </CommentsHorizontalView>
                                                <CommentsHorizontalView writeCommentArea={true}>
                                                    <CommentsVerticalView alongLeft={true}>
                                                        <CommenterIcon source={{uri: profilePictureUri}}/>
                                                    </CommentsVerticalView>
                                                    <CommentsVerticalView>
                                                        <UserTextInput
                                                            placeholder="Post a reply"
                                                            placeholderTextColor={darkLight}
                                                            onChangeText={handleChange('comment')}
                                                            onBlur={handleBlur('comment')}
                                                            value={values.comment}
                                                            multiline={true}
                                                            style={{backgroundColor: colors.borderColor, color: colors.descTextColor, borderColor: colors.tertiary}}
                                                        />
                                                    </CommentsVerticalView>
                                                </CommentsHorizontalView>
                                                <CommentsHorizontalView belowWriteCommentArea={true}>
                                                    <CommentsVerticalView postComment={true}>
                                                        {!isSubmitting && (<StyledButton style={{backgroundColor: colors.primary}} postComment={true} onPress={handleSubmit}>
                                                            <ButtonText style={{color: colors.brand}} postComment={true}> Post </ButtonText>
                                                        </StyledButton>)}
                                                        <MsgBox style={{color: colors.errorColor}} type={messageType}>{message}</MsgBox>
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
                                    renderItem={({ item }) => <Item commentId={item.commentId} commenterName={item.commenterName} commenterDisplayName={item.commenterDisplayName} commentsText={item.commentsText}  commentUpVotes={item.commentUpVotes} datePosted={item.datePosted} commenterImageB64={item.commenterImageB64}/>}
                                />
                                {loadingMoreComments == true && (
                                    <ActivityIndicator size="small" color={colors.brand} />  
                                )}
                            </ViewScreenPollPostCommentsFrame>
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

export default CommentViewPage;
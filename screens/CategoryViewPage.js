import React, {useContext, useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

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
    Navigator_BackButton
} from '../screens/screenStylings/styling';

// Colors
const {brand, primary, tertiary, greyish, darkLight, slightlyLighterPrimary, descTextColor, darkest, red} = Colors;

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//axios
import axios from 'axios';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, SectionList, View, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png';

import AntDesign from 'react-native-vector-icons/AntDesign';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';

const CategoryViewPage = ({route, navigation}) => {
    const {colors, dark} = useTheme()
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const {categoryTitle, NSFW, NSFL, allowScreenShots} = route.params;
    const [AvatarImg, setAvatarImage] = useState(null)
    const [gridViewState, setGridViewState] = useState("flex")
    const [featuredViewState, setFeaturedViewState] = useState("none")
    const [selectedPostFormat, setSelectedPostFormat] = useState("One")
    const [selectedPostFormatName, setSelectedPostFormatName] = useState("No thread posts yet, Be the first!")
    const [useStatePollData, setUseStatePollData] = useState()
    const [changeSections, setChangeSections] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(false)
    const [getCategoryItems, setGetCategoryItems] = useState(false)
    const [getImagesOnLoad, setGetImagesOnLoad] = useState(false)
    var allThreads = []
    var initialAllThreads = []
    //Up and Down Vote Image Stuff
    var upVotedThreads = []
    var initialUpVotedThreads = []
    const [initialUpVotes, setInitialUpVotes] = useState([])
    const [upVotes, setUpVotes] = useState([])
    //
    var downVotedThreads = []
    var initialDownVotedThreads = []
    const [initialDownVotes, setInitialDownVotes] = useState([])
    const [downVotes, setDownVotes] = useState([])
    //
    var neitherVotedThreads = []
    var initialNeitherVotedThreads = []
    const [initialNeitherVotes, setInitialNeitherVotes] = useState([])
    const [neitherVotes, setNeitherVotes] = useState([])
    //
    var changingVotedThreadsArray = []
    const [changingVotedThreads, setChangingVotedThreads] = useState([])
    //
    var findingVotedThreadsArray = []
    const [findingVotedThreads, setFindingVotedThreads] = useState([])
    //
    const [initialUpOrDownVotes, setInitialUpOrDownVotes] = useState([])
    const [upOrDownVotes, setUpOrDownVotes] = useState([])
    
    //ServerStuff
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [postNumForMsg, setPostNumForMsg] = useState();
    
    //cateogry stuff
    const [categoryDescription, setCategoryDescription] = useState("Loading");
    const [categoryTags, setCategoryTags] = useState();
    const [members, setMembers] = useState();
    //const [NSFW, setNSFW] = useState(false);
    //const [NSFL, setNSFL] = useState(false);
    const [modPerms, setModPerms] = useState();
    const [ownerPerms, setOwnerPerms] = useState();
    const [datePosted, setDatePosted] = useState();
    const [inCategory, setInCategory] = useState("Finding");
    const [initialInCategory, setInitialInCategory] = useState();

    // NSFW / NSFL warning
    const [displayAgeRequirementWarning, setDisplayAgeRequirementWarning] = useState(false);

    // Status Bar Height
    const StatusBarHeight = useContext(StatusBarHeightContext)

    useEffect(() => {
        if (NSFW || NSFL) {
            setDisplayAgeRequirementWarning(true)
        } else {
            changeToOne()
        }
    }, [])

    const dismissAgeRequirementWarning = () => {
        setDisplayAgeRequirementWarning(false)
        changeToOne()
    }

    const handleMessage = (message, type = 'FAILED', postNum) => {
        setMessage(message);
        setMessageType(type);
        if (postNum !== null) {
            setPostNumForMsg(postNum)
        } else {
            setPostNumForMsg(null)
        }
    }

    const getAllCategoryItems = () => {
        const url = `${serverUrl}/tempRoute/findcategorywithname/${categoryTitle}`;
    
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                console.log(status)
                console.log(message)
            } else {
                console.log(status)
                console.log(message)
                console.log(data)
                var CategoryData = data
                if (data.imageKey) {
                    axios.get(`${serverUrl}/getImageOnServer/${data.imageKey}`)
                    .then((response) => {
                        //set image
                        if (response.data) {
                            //convert back to image
                            var base64Icon = `data:image/jpeg;base64,${response.data}`
                            setAvatarImage(base64Icon)
                            setCategoryDescription(CategoryData.categoryDescription)
                            setCategoryTags(CategoryData.categoryTags)
                            setMembers(CategoryData.members)
                            //setNSFW(CategoryData.NSFW)
                            //setNSFL(CategoryData.NSFL)
                            setModPerms(CategoryData.modPerms)
                            setOwnerPerms(CategoryData.ownerPerms)
                            setDatePosted(CategoryData.datePosted)
                            setInCategory(CategoryData.inCategory)
                            setInitialInCategory(CategoryData.inCategory)
                        } else {
                            setAvatarImage(null)
                            setCategoryDescription(CategoryData.categoryDescription)
                            setCategoryTags(CategoryData.categoryTags)
                            setMembers(CategoryData.members)
                            //setNSFW(CategoryData.NSFW)
                            //setNSFL(CategoryData.NSFL)
                            setModPerms(CategoryData.modPerms)
                            setOwnerPerms(CategoryData.ownerPerms)
                            setDatePosted(CategoryData.datePosted)
                            setInCategory(CategoryData.inCategory)
                            setInitialInCategory(CategoryData.inCategory)
                        }
                    })
                    .catch(function (error) {
                        console.log("Image not recieved")
                        console.log(error);
                    });
                } else {
                    setAvatarImage(null)
                    setCategoryDescription(CategoryData.categoryDescription)
                    setCategoryTags(CategoryData.categoryTags)
                    setMembers(CategoryData.members)
                    //setNSFW(CategoryData.NSFW)
                    //setNSFL(CategoryData.NSFL)
                    setModPerms(CategoryData.modPerms)
                    setOwnerPerms(CategoryData.ownerPerms)
                    setDatePosted(CategoryData.datePosted)
                    setInCategory(CategoryData.inCategory)
                    setInitialInCategory(CategoryData.inCategory)
                }
            }
            //setSubmitting(false);
    
        }).catch(error => {
            console.log(error);
            //setSubmitting(false);
            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
        })
    }

    if (getCategoryItems !== true) {
        getAllCategoryItems()
        setGetCategoryItems(true)
    }

    const JoinCategory = () => {
        if (storedCredentials) {
            if (inCategory !== "Finding") {
                const url = serverUrl + "/tempRoute/joincategory";

                var toSend = {categoryTitle: categoryTitle}
                const beforeChange = inCategory
                setInCategory("Changing")
                console.log(toSend)

                axios.post(url, toSend).then((response) => {
                    const result = response.data;
                    const {message, status, data} = result;
                
                    if (status !== 'SUCCESS') {
                        handleMessage(message, status);
                        setInCategory(beforeChange)
                    } else {
                        handleMessage(message, status);
                        if (message == "Joined Category") {
                            setInCategory(true)
                        } else {
                            setInCategory(false)
                        }
                        //loadAndGetValues()
                        //persistLogin({...data[0]}, message, status);
                    }
                }).catch(error => {
                    console.log(error);
                    setInCategory(beforeChange)
                    handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.", 'FAILED', postNum);
                })
            }
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const UpVoteThread = (threadId, postNum) => {
        if (storedCredentials) {
            //Change to loading circle
            if (findingVotedThreads.includes(threadId)) { 

            } else {
                if (changingVotedThreads.includes(threadId)) {

                } else {
                    console.log("UpVoting")
                    upVotedThreads = upVotes
                    downVotedThreads = downVotes
                    neitherVotedThreads = neitherVotes
                    var beforeChange = "Neither"
                    if (upVotedThreads.includes(threadId)) {
                        beforeChange = "UpVoted"
                        var index = upVotedThreads.indexOf(threadId);
                        if (index > -1) {
                            upVotedThreads.splice(index, 1);
                        }
                        setUpVotes(upVotedThreads)
                    }
                    if (downVotedThreads.includes(threadId)) {
                        beforeChange = "DownVoted"
                        var index = downVotedThreads.indexOf(threadId);
                        if (index > -1) {
                            downVotedThreads.splice(index, 1);
                        }
                        setDownVotes(downVotedThreads)
                    }
                    if (neitherVotedThreads.includes(threadId)) {
                        beforeChange = "Neither"
                        var index = neitherVotedThreads.indexOf(threadId);
                        if (index > -1) {
                            neitherVotedThreads.splice(index, 1);
                        }
                        setNeitherVotes(neitherVotedThreads)
                    }
                    changingVotedThreadsArray = changingVotedThreads
                    changingVotedThreadsArray.push(threadId)
                    setChangingVotedThreads(changingVotedThreadsArray)
                    //Do rest
                    handleMessage(null, null, null);
                    const url = serverUrl + "/tempRoute/upvotethread";

                    var toSend = {threadId: threadId}

                    console.log(toSend)

                    axios.post(url, toSend).then((response) => {
                        const result = response.data;
                        const {message, status, data} = result;
                    
                        if (status !== 'SUCCESS') {
                            handleMessage(message, status, postNum);
                            changingVotedThreadsArray = changingVotedThreads
                            var index = changingVotedThreadsArray.indexOf(threadId);
                            if (index > -1) {
                                changingVotedThreadsArray.splice(index, 1);
                                setChangingVotedThreads(changingVotedThreadsArray)
                            }
                            if (beforeChange == "UpVoted") {
                                upVotedThreads = upVotes
                                upVotedThreads.push(threadId)
                                setUpVotes(upVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(changingVotedThreadsArray)
                            } 
                            if (beforeChange == "DownVoted") {
                                downVotedThreads = downVotes
                                downVotedThreads.push(threadId)
                                setDownVotes(downVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(changingVotedThreadsArray)
                            }
                            if (beforeChange == "Neither") {
                                neitherVotedThreads = neitherVotes
                                neitherVotedThreads.push(threadId)
                                setNeitherVotes(neitherVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(changingVotedThreadsArray)
                            }
                        } else {
                            handleMessage(message, status);
                            var tempChangingVotedThreadsArray = changingVotedThreads
                            var index = tempChangingVotedThreadsArray.indexOf(threadId);
                            if (index > -1) {
                                tempChangingVotedThreadsArray.splice(index, 1);
                                console.log("Spliced tempChangingVotedThreadsArray")
                            } else {
                                console.log("Didnt find in changing array")
                            }
                            if (message == "Thread UpVoted") {
                                upVotedThreads = upVotes
                                upVotedThreads.push(threadId)
                                setUpVotes([])
                                setUpVotes(upVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(tempChangingVotedThreadsArray)
                            } else {
                                //Neither
                                neitherVotedThreads = neitherVotes
                                neitherVotedThreads.push(threadId)
                                setNeitherVotes([])
                                setNeitherVotes(neitherVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(tempChangingVotedThreadsArray)
                            }
                            //loadAndGetValues()
                            //persistLogin({...data[0]}, message, status);
                        }
                    }).catch(error => {
                        console.log(error);
                        changingVotedThreadsArray = changingVotedThreads
                        var index = changingVotedThreadsArray.indexOf(threadId);
                        if (index > -1) {
                            changingVotedThreadsArray.splice(index, 1);
                        }
                        setChangingVotedThreads(changingVotedThreadsArray)
                        if (beforeChange == "UpVoted") {
                            upVotedThreads = upVotes
                            upVotedThreads.push(threadId)
                            setUpVotes(upVotedThreads)
                        } 
                        if (beforeChange == "DownVoted") {
                            downVotedThreads = downVotes
                            downVotedThreads.push(threadId)
                            setDownVotes(downVotedThreads)
                        }
                        if (beforeChange == "Neither") {
                            neitherVotedThreads = neitherVotes
                            neitherVotedThreads.push(threadId)
                            setNeitherVotes(neitherVotedThreads)
                        }
                        handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.", 'FAILED', postNum);
                    })
                }
            }
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const DownVoteThread = (threadId, postNum) => {
        if (storedCredentials) {
            //Change to loading circle
            if (findingVotedThreads.includes(threadId)) { 

            } else {
                if (changingVotedThreads.includes(threadId)) {

                } else {
                    console.log("DownVoting")
                    upVotedThreads = upVotes
                    downVotedThreads = downVotes
                    neitherVotedThreads = neitherVotes
                    var beforeChange = "Neither"
                    if (upVotedThreads.includes(threadId)) {
                        beforeChange = "UpVoted"
                        var index = upVotedThreads.indexOf(threadId);
                        if (index > -1) {
                            upVotedThreads.splice(index, 1);
                        }
                        setUpVotes(upVotedThreads)
                    }
                    if (downVotedThreads.includes(threadId)) {
                        beforeChange = "DownVoted"
                        var index = downVotedThreads.indexOf(threadId);
                        if (index > -1) {
                            downVotedThreads.splice(index, 1);
                        }
                        setDownVotes(downVotedThreads)
                    }
                    if (neitherVotedThreads.includes(threadId)) {
                        beforeChange = "Neither"
                        var index = neitherVotedThreads.indexOf(threadId);
                        if (index > -1) {
                            neitherVotedThreads.splice(index, 1);
                        }
                        setNeitherVotes(neitherVotedThreads)
                    }
                    changingVotedThreadsArray = changingVotedThreads
                    changingVotedThreadsArray.push(threadId)
                    setChangingVotedThreads(changingVotedThreadsArray)
                    //Do rest
                    handleMessage(null, null, null);
                    const url = serverUrl + "/tempRoute/downvotethread";

                    var toSend = {threadId: threadId}

                    console.log(toSend)

                    axios.post(url, toSend).then((response) => {
                        const result = response.data;
                        const {message, status, data} = result;
                    
                        if (status !== 'SUCCESS') {
                            handleMessage(message, status, postNum);
                            changingVotedThreadsArray = changingVotedThreads
                            var index = changingVotedThreadsArray.indexOf(threadId);
                            if (index > -1) {
                                changingVotedThreadsArray.splice(index, 1);
                                setChangingVotedThreads(changingVotedThreadsArray)
                            }
                            if (beforeChange == "UpVoted") {
                                upVotedThreads = upVotes
                                upVotedThreads.push(threadId)
                                setUpVotes(upVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(changingVotedThreadsArray)
                            } 
                            if (beforeChange == "DownVoted") {
                                downVotedThreads = downVotes
                                downVotedThreads.push(threadId)
                                setDownVotes(downVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(changingVotedThreadsArray)
                            }
                            if (beforeChange == "Neither") {
                                neitherVotedThreads = neitherVotes
                                neitherVotedThreads.push(threadId)
                                setNeitherVotes(neitherVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(changingVotedThreadsArray)
                            }
                        } else {
                            handleMessage(message, status);
                            var tempChangingVotedThreadsArray = changingVotedThreads
                            var index = tempChangingVotedThreadsArray.indexOf(threadId);
                            if (index > -1) {
                                tempChangingVotedThreadsArray.splice(index, 1);
                                console.log("Spliced tempChangingVotedThreadsArray")
                            } else {
                                console.log("Didnt find in changing array")
                            }
                            if (message == "Thread DownVoted") {
                                downVotedThreads = downVotes
                                downVotedThreads.push(threadId)
                                setDownVotes([])
                                setDownVotes(downVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(tempChangingVotedThreadsArray)
                            } else {
                                //Neither
                                neitherVotedThreads = neitherVotes
                                neitherVotedThreads.push(threadId)
                                setNeitherVotes([])
                                setNeitherVotes(neitherVotedThreads)
                                setChangingVotedThreads([])
                                setChangingVotedThreads(tempChangingVotedThreadsArray)
                            }
                            //loadAndGetValues()
                            //persistLogin({...data[0]}, message, status);
                        }
                    }).catch(error => {
                        console.log(error);
                        changingVotedThreadsArray = changingVotedThreads
                        var index = changingVotedThreadsArray.indexOf(threadId);
                        if (index > -1) {
                            changingVotedThreadsArray.splice(index, 1);
                        }
                        setChangingVotedThreads(changingVotedThreadsArray)
                        if (beforeChange == "UpVoted") {
                            upVotedThreads = upVotes
                            upVotedThreads.push(threadId)
                            setUpVotes(upVotedThreads)
                        } 
                        if (beforeChange == "DownVoted") {
                            downVotedThreads = downVotes
                            downVotedThreads.push(threadId)
                            setDownVotes(downVotedThreads)
                        }
                        if (beforeChange == "Neither") {
                            neitherVotedThreads = neitherVotes
                            neitherVotedThreads.push(threadId)
                            setNeitherVotes(neitherVotedThreads)
                        }
                        handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.", 'FAILED', postNum);
                    })
                }
            }
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    const ThreadItems = ({postNum, threadId, threadComments, threadType, threadUpVotes, threadTitle, threadSubtitle, threadTags, threadCategory, threadBody, threadImageKey, threadImageDescription, threadNSFW, threadNSFL, datePosted, threadUpVoted, threadDownVoted, creatorDisplayName, creatorName, creatorImageB64, imageInThreadB64})  => (
        <TouchableOpacity style={{backgroundColor: slightlyLighterPrimary, borderRadius: 15, marginBottom: 10}} onPress={() => navigation.navigate("ThreadViewPage", {threadId: threadId, creatorPfpB64: `data:image/jpg;base64,${creatorImageB64}`})}>
                {threadNSFW === true && (
                    <SubTitle style={{fontSize: 10, color: red, marginBottom: 0}}>(NSFW)</SubTitle>
                )}
                {threadNSFL === true && (
                    <SubTitle style={{fontSize: 10, color: red, marginBottom: 0}}>(NSFL)</SubTitle>
                )}
                <View style={{paddingHorizontal: '50%'}}>
                </View>
                <PostsHorizontalView style={{marginLeft: '5%', borderColor: darkLight, width: '90%', paddingBottom: 5, marginRight: '5%'}}>
                    <TouchableOpacity style={{width: '100%', height: 60}}>
                        <PostsHorizontalView>
                            <PostsVerticalView>
                                    <PostCreatorIcon source={{uri: creatorImageB64 != null && creatorImageB64 != '' ? creatorImageB64 : SocialSquareLogo_B64_png }}/>
                            </PostsVerticalView>
                            <PostsVerticalView style={{marginTop: 9}}>
                                <SubTitle style={{fontSize: 20, marginBottom: 0}}>{creatorDisplayName}</SubTitle>
                                <SubTitle style={{fontSize: 12, color: brand, marginBottom: 0}}>@{creatorName}</SubTitle>
                            </PostsVerticalView>
                        </PostsHorizontalView>
                    </TouchableOpacity>
                </PostsHorizontalView>
                <TouchableOpacity onPress={() => navigation.navigate("ThreadViewPage", {threadId: threadId, creatorPfpB64: creatorImageB64})}>
                    <ImagePostTextFrame style={{textAlign: 'left', alignItems: 'baseline'}}>
                        <TouchableOpacity>
                            <SubTitle style={{fontSize: 10, color: brand, marginBottom: 0}}>Category: {threadCategory}</SubTitle>
                        </TouchableOpacity>
                        <SubTitle style={{fontSize: 20, color: tertiary, marginBottom: 0}}>{threadTitle}</SubTitle>
                        {threadSubtitle !== "" && (
                            <SubTitle style={{fontSize: 18, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadSubtitle}</SubTitle>
                        )}
                        {threadTags !== "" && (
                            <TouchableOpacity>
                                <SubTitle style={{fontSize: 10, color: brand, marginBottom: 10}}>{threadTags}</SubTitle>
                            </TouchableOpacity>
                        )}
                        {threadType == "Text" && (
                            <SubTitle style={{fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadBody}</SubTitle>
                        )}
                        <View style={{textAlign: 'left', alignItems: 'baseline', marginLeft: '5%', marginRight: '5%', width: '90%'}}>
                            {threadType == "Images" && (
                                <View>
                                    <View style={{height: 200, width: 200}}>
                                        <Image style={{height: '100%', width: 'auto', resizeMode: 'contain'}} source={{uri: imageInThreadB64}}/>
                                    </View>
                                    <SubTitle style={{fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadImageDescription}</SubTitle>
                                </View>
                            )}
                        </View>
                    </ImagePostTextFrame>
                </TouchableOpacity>
                
                <PostHorizontalView style={{marginLeft: '5%', width: '90%', paddingVertical: 10, flex: 1, flexDirection: 'row'}}>
                    
                    {upVotes.includes(threadId) && (<PostsIconFrame onPress={() => {UpVoteThread(threadId, postNum)}}>
                        <PostsIcons style={{flex: 1, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                    </PostsIconFrame>)}
                    {neitherVotes.includes(threadId) && (<PostsIconFrame onPress={() => {UpVoteThread(threadId, postNum)}}>
                        <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                    </PostsIconFrame>)}
                    {downVotes.includes(threadId) && (<PostsIconFrame onPress={() => {UpVoteThread(threadId, postNum)}}>
                        <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                    </PostsIconFrame>)}
                    {changingVotedThreads.includes(threadId) && (<PostsIconFrame></PostsIconFrame>)}
                    

                    {upVotes.includes(threadId) && (<PostsIconFrame>
                        {initialUpVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes}</SubTitle>
                        )}
                        {initialNeitherVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes+1}</SubTitle>
                        )}
                        {initialDownVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes+2}</SubTitle>
                        )}
                    </PostsIconFrame>)}
                    {neitherVotes.includes(threadId) && (<PostsIconFrame>
                        {initialNeitherVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes}</SubTitle>
                        )}
                        {initialUpVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes-1}</SubTitle>
                        )}
                        {initialDownVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes+1}</SubTitle>
                        )}
                    </PostsIconFrame>)}
                    {downVotes.includes(threadId) && (<PostsIconFrame>
                        {initialDownVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes}</SubTitle>
                        )}
                        {initialNeitherVotes.includes(threadId) && (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes-1}</SubTitle>
                        )}
                        {initialUpVotes.includes(threadId)&& (
                            <SubTitle style={{alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadUpVotes-2}</SubTitle>
                        )}
                    </PostsIconFrame>)}
                    {changingVotedThreads.includes(threadId) && (<PostsIconFrame>
                        <ActivityIndicator size="small" color={colors.brand} />                
                    </PostsIconFrame>)}

                    {downVotes.includes(threadId) && (<PostsIconFrame onPress={() => {DownVoteThread(threadId, postNum)}}>
                        <PostsIcons style={{flex: 1, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                    </PostsIconFrame>)}
                    {neitherVotes.includes(threadId) && (<PostsIconFrame onPress={() => {DownVoteThread(threadId, postNum)}}>
                        <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                    </PostsIconFrame>)}
                    {upVotes.includes(threadId) && (<PostsIconFrame onPress={() => {DownVoteThread(threadId, postNum)}}>
                        <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                    </PostsIconFrame>)}
                    {changingVotedThreads.includes(threadId) && (<PostsIconFrame></PostsIconFrame>)}
                    <PostsIconFrame>
                    </PostsIconFrame>
                    <PostsIconFrame onPress={() => navigation.navigate("ThreadViewPage", {threadId: threadId, creatorPfpB64: `data:image/jpg;base64,${creatorImageB64}`})}>
                        <PostsIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png')}/>
                    </PostsIconFrame>
                    <PostsIconFrame>
                        <PostsIcons style={{flex: 1, height: 30, width: 30}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/387-share2.png')}/>
                    </PostsIconFrame>
                    <PostsIconFrame>
                        <PostsIcons style={{flex: 1}} source={require('./../assets/img/ThreeDots.png')}/>
                    </PostsIconFrame>
                </PostHorizontalView>
                {postNumForMsg == postNum && (<MsgBox type={messageType}>{message}</MsgBox>)}
                <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{datePosted}</SubTitle>
                <TouchableOpacity onPress={() => navigation.navigate("ThreadViewPage", {threadId: threadId, creatorPfpB64: `data:image/jpg;base64,${creatorImageB64}`})}>
                    <SubTitle style={{flex: 1, alignSelf: 'center', fontSize: 16, color: descTextColor, marginBottom: 0, fontWeight: 'normal'}}>{threadComments} comments</SubTitle>
                </TouchableOpacity>
        </TouchableOpacity>
    );

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

    //any image honestly
    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }

    const changeToOne = () => {
        upVotedThreads = []
        initialUpVotedThreads = []
        setUpVotes(upVotedThreads)
        setInitialUpVotes(initialUpVotedThreads)
        downVotedThreads = []
        initialDownVotedThreads = []
        setDownVotes(downVotedThreads)
        setInitialDownVotes(initialDownVotedThreads)
        neitherVotedThreads = []
        initialNeitherVotedThreads = []
        setNeitherVotes(neitherVotedThreads)
        setInitialNeitherVotes(initialNeitherVotedThreads)
        findingVotedThreadsArray = []
        setFindingVotedThreads(findingVotedThreadsArray)
        changingVotedThreadsArray = []
        setChangingVotedThreads(changingVotedThreadsArray)
        setChangeSections([])
        handleMessage(null, null, null);
        setSelectedPostFormat("One")
        setSelectedPostFormatName("No thread posts yet, Be the first!")
        const layoutThreadPosts = (data) => {
            setSelectedPostFormatName("Recent Thread Posts:")
            var threadData = data.data
            console.log("The Thread data")
            console.log(threadData)
            console.log(threadData.length)
            var tempSections = []
            var itemsProcessed = 0;
            threadData.forEach(function (item, index) {
                //image in post
                async function findImages() {
                    //
                    if (threadData[index].creatorImageKey) {
                        async function asyncFunctionForImages() {
                            if (threadData[index].threadType == "Text") {
                                const pfpB64 = await getImageInPfp(threadData, index)
                                const addAndPush = async () => {
                                    var tempSectionsTemp = {data: [{postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].threadComments, threadType: threadData[index].threadType, threadUpVotes: threadData[index].threadUpVotes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: null}]}
                                    if (threadData[index].threadUpVoted == true) {
                                        console.log("UpVoted")
                                        upVotedThreads.push(threadData[index].threadId)
                                        setUpVotes(upVotedThreads)
                                        initialUpVotedThreads.push(threadData[index].threadId)
                                        setInitialUpVotes(initialUpVotedThreads)
                                    } else if (threadData[index].threadDownVoted == true) {
                                        console.log("DownVoted")
                                        downVotedThreads.push(threadData[index].threadId)
                                        setDownVotes(downVotedThreads)
                                        initialDownVotedThreads.push(threadData[index].threadId)
                                        setInitialDownVotes(initialDownVotedThreads)
                                    } else {
                                        console.log("Neither")
                                        neitherVotedThreads.push(threadData[index].threadId)
                                        setNeitherVotes(neitherVotedThreads)
                                        initialNeitherVotedThreads.push(threadData[index].threadId)
                                        setInitialNeitherVotes(initialNeitherVotedThreads)
                                    }
                                    tempSections.push(tempSectionsTemp)
                                    itemsProcessed++;
                                    if(itemsProcessed === threadData.length) {
                                        setChangeSections(tempSections)  
                                        setLoadingPosts(false)  
                                        console.log(upVotes)
                                        console.log(downVotes)
                                        console.log(neitherVotes)
                                    }
                                }
                                await addAndPush()
                            } else if (threadData[index].threadType == "Images") {
                                const pfpB64 = await getImageInPfp(threadData, index)
                                const imageInThreadB64 = await getImageWithKey(threadData[index].threadImageKey)
                                const addAndPush = async () => {
                                    var tempSectionsTemp = {data: [{postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].threadComments, threadType: threadData[index].threadType, threadUpVotes: threadData[index].threadUpVotes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: imageInThreadB64}]}
                                    if (threadData[index].threadUpVoted == true) {
                                        console.log("UpVoted")
                                        upVotedThreads.push(threadData[index].threadId)
                                        setUpVotes(upVotedThreads)
                                        initialUpVotedThreads.push(threadData[index].threadId)
                                        setInitialUpVotes(initialUpVotedThreads)
                                    } else if (threadData[index].threadDownVoted == true) {
                                        console.log("DownVoted")
                                        downVotedThreads.push(threadData[index].threadId)
                                        setDownVotes(downVotedThreads)
                                        initialDownVotedThreads.push(threadData[index].threadId)
                                        setInitialDownVotes(initialDownVotedThreads)
                                    } else {
                                        console.log("Neither")
                                        neitherVotedThreads.push(threadData[index].threadId)
                                        setNeitherVotes(neitherVotedThreads)
                                        initialNeitherVotedThreads.push(threadData[index].threadId)
                                        setInitialNeitherVotes(initialNeitherVotedThreads)
                                    }
                                    tempSections.push(tempSectionsTemp)
                                    itemsProcessed++;
                                    if(itemsProcessed === threadData.length) {
                                        setChangeSections(tempSections)  
                                        setLoadingPosts(false)  
                                        console.log(upVotes)
                                        console.log(downVotes)
                                        console.log(neitherVotes)
                                    }
                                }
                                await addAndPush()
                            }
                        }
                        asyncFunctionForImages()
                    } else {
                        async function asyncFunctionForImages() {
                            if (threadData[index].threadType == "Text") {
                                const pfpB64 = await getImageInPfp(threadData, index)
                                const addAndPush = async () => {
                                    var tempSectionsTemp = {data: [{postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].threadComments, threadType: threadData[index].threadType, threadUpVotes: threadData[index].threadUpVotes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: null}]}
                                    if (threadData[index].threadUpVoted == true) {
                                        console.log("UpVoted")
                                        upVotedThreads.push(threadData[index].threadId)
                                        setUpVotes(upVotedThreads)
                                        initialUpVotedThreads.push(threadData[index].threadId)
                                        setInitialUpVotes(initialUpVotedThreads)
                                    } else if (threadData[index].threadDownVoted == true) {
                                        console.log("DownVoted")
                                        downVotedThreads.push(threadData[index].threadId)
                                        setDownVotes(downVotedThreads)
                                        initialDownVotedThreads.push(threadData[index].threadId)
                                        setInitialDownVotes(initialDownVotedThreads)
                                    } else {
                                        console.log("Neither")
                                        neitherVotedThreads.push(threadData[index].threadId)
                                        setNeitherVotes(neitherVotedThreads)
                                        initialNeitherVotedThreads.push(threadData[index].threadId)
                                        setInitialNeitherVotes(initialNeitherVotedThreads)
                                    }
                                    tempSections.push(tempSectionsTemp)
                                    itemsProcessed++;
                                    if(itemsProcessed === threadData.length) {
                                        setChangeSections(tempSections)  
                                        setLoadingPosts(false)  
                                        console.log(upVotes)
                                        console.log(downVotes)
                                        console.log(neitherVotes)
                                    }
                                }
                                await addAndPush()
                            } else if (threadData[index].threadType == "Images") {
                                const pfpB64 = await getImageInPfp(threadData, index)
                                const imageInThreadB64 = await getImageWithKey(threadData[index].threadImageKey)
                                const addAndPush = async () => {
                                    var tempSectionsTemp = {data: [{postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].threadComments, threadType: threadData[index].threadType, threadUpVotes: threadData[index].threadUpVotes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: imageInThreadB64}]}
                                    if (threadData[index].threadUpVoted == true) {
                                        console.log("UpVoted")
                                        upVotedThreads.push(threadData[index].threadId)
                                        setUpVotes(upVotedThreads)
                                        initialUpVotedThreads.push(threadData[index].threadId)
                                        setInitialUpVotes(initialUpVotedThreads)
                                    } else if (threadData[index].threadDownVoted == true) {
                                        console.log("DownVoted")
                                        downVotedThreads.push(threadData[index].threadId)
                                        setDownVotes(downVotedThreads)
                                        initialDownVotedThreads.push(threadData[index].threadId)
                                        setInitialDownVotes(initialDownVotedThreads)
                                    } else {
                                        console.log("Neither")
                                        neitherVotedThreads.push(threadData[index].threadId)
                                        setNeitherVotes(neitherVotedThreads)
                                        initialNeitherVotedThreads.push(threadData[index].threadId)
                                        setInitialNeitherVotes(initialNeitherVotedThreads)
                                    }
                                    tempSections.push(tempSectionsTemp)
                                    itemsProcessed++;
                                    if(itemsProcessed === threadData.length) {
                                        setChangeSections(tempSections)  
                                        setLoadingPosts(false)  
                                        console.log(upVotes)
                                        console.log(downVotes)
                                        console.log(neitherVotes)
                                    }
                                }
                                await addAndPush()
                            }
                        }
                        asyncFunctionForImages()
                    }
                }
                findImages()
            });
        }

        const url = `${serverUrl}/tempRoute/getthreadsfromcategory/${categoryTitle}`;

        setLoadingPosts(true)
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                setLoadingPosts(false)
                handleMessage(message, status);
                console.log(status)
                console.log(message)
            } else {
                layoutThreadPosts({data});
                console.log(status)
                console.log(message)
            }
            //setSubmitting(false);

        }).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingPosts(false)
            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
        })
    }

    //if (getImagesOnLoad == false) {
      //  changeToOne()
        //setGetImagesOnLoad(true)
    //}

    const changeToTwo = () => {
        setSelectedPostFormatName("This user has no Video posts.")
        setChangeSections([])
    }

    const changeToThree = () => {
        setSelectedPostFormatName("This user has no Poll posts.")
        setChangeSections([])
    }

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            {displayAgeRequirementWarning == false ?
                <>
                    <View style={{paddingTop: StatusBarHeight - 15, color: colors.primary, flexDirection: 'row', justifyContent: 'center'}}>
                        <Navigator_BackButton onPress={() => {navigation.goBack()}}>
                            <Image
                                source={require('../assets/app_icons/back_arrow.png')}
                                style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary, top: -11}}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        </Navigator_BackButton>
                        {NSFW == true && (
                            <SubTitle style={{color: red, marginBottom: 0, marginTop: 15}}>(NSFW)</SubTitle>
                        )}
                        {NSFL == true && (
                            <SubTitle style={{color: red, marginBottom: 0, marginTop: 15}}>(NSFL)</SubTitle>
                        )}
                        <PageTitle style={{fontSize: 26}} welcome={true}>{categoryTitle || "Couldn't get name"}</PageTitle>
                    </View>
                    <ScrollView style={{backgroundColor: colors.primary}}>
                        <WelcomeContainer style={{backgroundColor: colors.primary, marginTop: -60}}>
                            <ProfInfoAreaImage style={{flexDirection: 'row', width: '100%'}}>
                                {AvatarImg !== null && (
                                    <Avatar resizeMode="cover" style={{width: '40%', marginLeft: '5%', marginRight: '5%', aspectRatio: 1/1}} source={{uri: AvatarImg}} />
                                )}
                                {AvatarImg == null && (
                                    <Avatar resizeMode="cover" style={{width: '40%', marginLeft: '5%', marginRight: '5%', aspectRatio: 1/1}} source={{uri: SocialSquareLogo_B64_png}} />
                                )}
                                <ProfInfoAreaImage style={{width: '40%',  marginLeft: '5%', marginRight: '5%'}}>
                                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>{categoryDescription}</Text>
                                </ProfInfoAreaImage>
                            </ProfInfoAreaImage>
                            {categoryTags ? (
                                <SubTitle style={{color: colors.brand, marginBottom: 0}} > {categoryTags} </SubTitle>
                            ) : null}
                            <ProfileHorizontalView>
                                <ProfileHorizontalViewItem profLeftIcon={true}>
                                    <SubTitle style={{color: colors.tertiary}} welcome={true}> Members </SubTitle>
                                    <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png')}/>
                                    {initialInCategory == true && (
                                        <View>
                                            {inCategory == true && (
                                                <SubTitle welcome={true} style={{marginBottom: 0, color: colors.tertiary}}> {members} </SubTitle>
                                            )}
                                            {inCategory == false && (
                                                <SubTitle welcome={true} style={{marginBottom: 0, color: colors.tertiary}}> {members-1} </SubTitle>
                                            )}
                                        </View>
                                    )}
                                    {initialInCategory == false && (
                                        <View>
                                            {inCategory == true && (
                                                <SubTitle welcome={true} style={{marginBottom: 0, color: colors.tertiary}}> {members+1} </SubTitle>
                                            )}
                                            {inCategory == false && (
                                                <SubTitle welcome={true} style={{marginBottom: 0, color: colors.tertiary}}> {members} </SubTitle>
                                            )}
                                        </View>
                                    )}
                                    <StyledButton style={{height: 10, width: '80%', backgroundColor: dark ? colors.darkLight : colors.borderColor}} onPress={() => {JoinCategory()}}>
                                        {inCategory == false ? (
                                            <ButtonText style={{color: colors.tertiary}}>Join</ButtonText>
                                        ) : inCategory == true ? (
                                            <ButtonText style={{color: colors.tertiary}}>Leave</ButtonText>
                                        ) : inCategory == "Finding" ? (
                                            <ActivityIndicator size="small" color={colors.brand} />
                                        ) : inCategory == "Changing" ? (
                                            <ActivityIndicator size="small" color={colors.brand} />
                                        ) : null}
                                    </StyledButton>
                                </ProfileHorizontalViewItem>
                                <ProfileHorizontalViewItem profCenterIcon={true}>
                                    <SubTitle style={{color: colors.tertiary}} welcome={true}> Date Created </SubTitle>
                                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/084-calendar.png')}/>
                                    <SubTitle welcome={true} style={{width: '80%', textAlign: 'center', color: colors.tertiary}}> {datePosted} </SubTitle>
                                </ProfileHorizontalViewItem>
                            </ProfileHorizontalView>
                            <StyledButton style={{backgroundColor: colors.primary}} postCategory={true} onPress={() => {storedCredentials ? navigation.navigate("ThreadUploadPage_FromCategory_FindStack", {threadFormat: null, threadTitle: null, threadSubtitle: null, threadTags: null, categoryTitle: categoryTitle, threadBody: null, threadImage: null, threadImageDescription: null, threadNSFW: null, threadNSFL: null, goBackAfterPost: true, goBackLocation: 'ThreadUploadPage_FromCategory_FindStack', allowScreenShots: allowScreenShots}) : navigation.navigate('ModalLoginScreen', {modal: true})}}>
                                <ButtonText style={{color: colors.tertiary}} postCategory={true}>Post Thread</ButtonText>
                            </StyledButton>
                            <ProfileSelectMediaTypeHorizontalView>
                                <ProfileSelectMediaTypeItem onPress={changeToOne}>
                                    <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor}}>
                                        <ProfileSelectMediaTypeIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/079-clock.png')}/>
                                    </ProfileSelectMediaTypeIconsBorder>
                                </ProfileSelectMediaTypeItem>
                                <ProfileSelectMediaTypeItem onPress={changeToTwo}>
                                    <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor}}>
                                        <ProfileSelectMediaTypeIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/170-fire.png')}/>
                                    </ProfileSelectMediaTypeIconsBorder>                        
                                </ProfileSelectMediaTypeItem>
                                <ProfileSelectMediaTypeItem onPress={changeToThree}>
                                    <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor}}>     
                                        <ProfileSelectMediaTypeIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/157-stats-bars.png')}/>
                                    </ProfileSelectMediaTypeIconsBorder>     
                                </ProfileSelectMediaTypeItem>
                            </ProfileSelectMediaTypeHorizontalView>
                            <ProfileGridPosts display={gridViewState}>
                                <SubTitle style={{color: colors.tertiary}} profNoPosts={true}>
                                    {selectedPostFormatName}
                                </SubTitle>
                                {selectedPostFormat == "One" && (<SectionList
                                    sections={changeSections}
                                    keyExtractor={(item, index) => item + index}
                                    renderItem={({ item }) => <ThreadItems postNum={item.postNum} threadId={item.threadId} threadComments={item.threadComments} threadType={item.threadType} threadUpVotes={item.threadUpVotes} threadTitle={item.threadTitle} threadSubtitle={item.threadSubtitle} threadTags={item.threadTags} threadCategory={item.threadCategory} threadBody={item.threadBody} threadImageKey={item.threadImageKey} threadImageDescription={item.threadImageDescription} threadNSFW={item.threadNSFW} threadNSFL={item.threadNSFL} datePosted={item.datePosted} threadUpVoted={item.threadUpVoted} threadDownVoted={item.threadDownVoted} creatorDisplayName={item.creatorDisplayName} creatorName={item.creatorName} creatorImageB64={item.creatorImageB64} imageInThreadB64={item.imageInThreadB64}/>}
                                />)}
                                {selectedPostFormat == "Two" && (<SectionList
                                    sections={changeSections}
                                    keyExtractor={(item, index) => item + index}
                                    renderItem={({ item }) => <PollItem pollTitle={item.pollTitle} pollSubTitle={item.pollSubTitle} optionOne={item.optionOne} optionOnesColor={item.optionOnesColor} optionOnesVotes={item.optionOnesVotes} optionOnesBarLength={item.optionOnesBarLength} optionTwo={item.optionTwo} optionTwosColor={item.optionTwosColor} optionTwosVotes={item.optionTwosVotes} optionTwosBarLength={item.optionTwosBarLength} optionThree={item.optionThree} optionThreesColor={item.optionThreesColor} optionThreesVotes={item.optionThreesVotes} optionThreesBarLength={item.optionThreesBarLength} optionFour={item.optionFour} optionFoursColor={item.optionFoursColor} optionFoursVotes={item.optionFoursVotes} optionFoursBarLength={item.optionFoursBarLength} optionFive={item.optionFive} optionFivesColor={item.optionFivesColor} optionFivesVotes={item.optionFivesVotes} optionFivesBarLength={item.optionFivesBarLength} optionSix={item.optionSix} optionSixesColor={item.optionSixesColor} optionSixesVotes={item.optionSixesVotes} optionSixesBarLength={item.optionSixesBarLength} totalNumberOfOptions={item.totalNumberOfOptions} pollUpOrDownVotes={item.pollUpOrDownVotes} pollId={item.pollId} votedFor={item.votedFor} pollLiked={item.pollLiked} pfpB64={item.pfpB64} creatorName={item.creatorName} creatorDisplayName={item.creatorDisplayName}/>}
                                />)}
                                {selectedPostFormat == "Three" && (<SectionList
                                    sections={changeSections}
                                    keyExtractor={(item, index) => item + index}
                                    renderItem={({ item }) => <PollItem pollTitle={item.pollTitle} pollSubTitle={item.pollSubTitle} optionOne={item.optionOne} optionOnesColor={item.optionOnesColor} optionOnesVotes={item.optionOnesVotes} optionOnesBarLength={item.optionOnesBarLength} optionTwo={item.optionTwo} optionTwosColor={item.optionTwosColor} optionTwosVotes={item.optionTwosVotes} optionTwosBarLength={item.optionTwosBarLength} optionThree={item.optionThree} optionThreesColor={item.optionThreesColor} optionThreesVotes={item.optionThreesVotes} optionThreesBarLength={item.optionThreesBarLength} optionFour={item.optionFour} optionFoursColor={item.optionFoursColor} optionFoursVotes={item.optionFoursVotes} optionFoursBarLength={item.optionFoursBarLength} optionFive={item.optionFive} optionFivesColor={item.optionFivesColor} optionFivesVotes={item.optionFivesVotes} optionFivesBarLength={item.optionFivesBarLength} optionSix={item.optionSix} optionSixesColor={item.optionSixesColor} optionSixesVotes={item.optionSixesVotes} optionSixesBarLength={item.optionSixesBarLength} totalNumberOfOptions={item.totalNumberOfOptions} pollUpOrDownVotes={item.pollUpOrDownVotes} pollId={item.pollId} votedFor={item.votedFor} pfpB64={item.pfpB64} creatorName={item.creatorName} creatorDisplayName={item.creatorDisplayName} postNum={item.postNum} datePosted={item.datePosted} pollComments={item.pollComments}/>}
                                />)}
                                {loadingPosts == true && (
                                    <ActivityIndicator size="large" color={brand} style={{marginBottom: 20}} />  
                                )}
                            </ProfileGridPosts>
                        </WelcomeContainer>
                    </ScrollView>
                </>
            :
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <AntDesign name="warning" size={75} color={colors.tertiary} style={{marginBottom: 20}}/>
                    <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Warning</Text>
                    <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>You are about to see {NSFW == true ? 'NSFW' : NSFL == true ? 'NSFL' : 'Error Occured'} content</Text>
                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center'}}>By continuing you confirm that you are 18 or older and can look at adult content.</Text>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <TouchableOpacity onPress={() => {navigation.goBack()}} style={{borderColor: colors.tertiary, borderWidth: 3, padding: 12, borderRadius: 10, marginRight: 20}}>
                            <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Go back to safety</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={dismissAgeRequirementWarning} style={{borderColor: colors.errorColor, borderWidth: 3, padding: 12, borderRadius: 10}}>
                            <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </>
    );
}

export default CategoryViewPage;
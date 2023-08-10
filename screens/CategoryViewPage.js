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
import { ImageBackground, ScrollView, FlatList, View, Image, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png';

import AntDesign from 'react-native-vector-icons/AntDesign';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';

import { getTimeFromUTCMS } from '../libraries/Time.js';
import ThreadPost from '../components/Posts/ThreadPost';
import usePostReducer from '../hooks/usePostReducer';

const CategoryViewPage = ({route, navigation}) => {
    const {colors, dark, indexNum} = useTheme()

    const [threads, dispatchThreads] = usePostReducer();
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const {categoryTitle, NSFW, NSFL, allowScreenShots, categoryId} = route.params;
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
        const url = `${serverUrl}/tempRoute/findcategorybyid`;
        const toSend = {
            categoryId
        }
    
        axios.post(url, toSend).then((response) => {
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

                var toSend = {categoryId}
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
                    handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.", 'FAILED');
                })
            }
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    //get image of post
    async function getImageInPost(imageData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageData[index].imageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }
    //profile image of creator
    async function getImageInPfp(threadData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${threadData[index].creatorPfpKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }

    //any image honestly
    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data);
    }

    const changeToOne = () => {
        dispatchThreads({type: 'startReload'})
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
            var threadData = data
            console.log("The Thread data")
            console.log(threadData)
            console.log(threadData.length)
            var tempSections = []
            var itemsProcessed = 0;
            threadData.forEach(function (item, index) {
                console.log('Individual Item:', item)
                //image in post
                async function findImages() {
                    //
                    if (threadData[index].creatorPfpKey) {
                        if (threadData[index].threadType == "Text") {
                            const pfpB64 = await getImageInPfp(threadData, index)
                            const tempSectionsTemp = {postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].comments, threadType: threadData[index].threadType, votes: threadData[index].votes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: null, _id: threadData[index]._id}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === threadData.length) {
                                dispatchThreads({type: 'addPosts', posts: tempSections})
                            }
                        } else if (threadData[index].threadType == "Images") {
                            const pfpB64 = await getImageInPfp(threadData, index)
                            const imageInThreadB64 = await getImageWithKey(threadData[index].threadImageKey)
                            const tempSectionsTemp = {postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].comments, threadType: threadData[index].threadType, votes: threadData[index].votes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: imageInThreadB64, _id: threadData[index]._id}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === threadData.length) {
                                dispatchThreads({type: 'addPosts', posts: tempSections})
                            }
                        }
                    } else {
                        if (threadData[index].threadType == "Text") {
                            const pfpB64 = await getImageInPfp(threadData, index)
                            const tempSectionsTemp = {postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].comments, threadType: threadData[index].threadType, votes: threadData[index].votes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: null, _id: threadData[index]._id}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === threadData.length) {
                                dispatchThreads({type: 'addPosts', posts: tempSections})
                            }
                        } else if (threadData[index].threadType == "Images") {
                            const pfpB64 = await getImageInPfp(threadData, index)
                            const imageInThreadB64 = await getImageWithKey(threadData[index].threadImageKey)
                            const tempSectionsTemp = {postNum: index, threadId: threadData[index].threadId, threadComments: threadData[index].comments, threadType: threadData[index].threadType, votes: threadData[index].votes, threadTitle: threadData[index].threadTitle, threadSubtitle: threadData[index].threadSubtitle, threadTags: threadData[index].threadTags, threadCategory: threadData[index].threadCategory, threadBody: threadData[index].threadBody, threadImageKey: threadData[index].threadImageKey, threadImageDescription: threadData[index].threadImageDescription, threadNSFW: threadData[index].threadNSFW, threadNSFL: threadData[index].threadNSFL, datePosted: threadData[index].datePosted, threadUpVoted: threadData[index].threadUpVoted, threadDownVoted: threadData[index].threadDownVoted, creatorDisplayName: threadData[index].creatorDisplayName, creatorName: threadData[index].creatorName, creatorImageB64: pfpB64, imageInThreadB64: imageInThreadB64, _id: threadData[index]._id}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === threadData.length) {
                                dispatchThreads({type: 'addPosts', posts: tempSections})
                            }
                        }
                    }
                }
                findImages()
            });
        }

        const url = `${serverUrl}/tempRoute/getthreadsfromcategory`;
        const toSend = {categoryId}

        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                dispatchThreads({type: 'error', error: message})
            } else {
                layoutThreadPosts(data);
                console.log(status)
                console.log(message)
            }
            //setSubmitting(false);

        }).catch(error => {
            console.error(error);
            dispatchThreads({type: 'error', error: error?.response?.data?.message || "An error occurred. Try checking your network connection and retry."})
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

    const ListFooters = ({feedData, loadMoreFunction}) => {
        if (feedData.loadingFeed) {
            return <ActivityIndicator size="large" color={colors.brand}/>
        }

        if (feedData.error) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                    <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Error: {feedData.error}</Text>
                    <TouchableOpacity onPress={() => loadMoreFunction()} style={{padding: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.tertiary, marginTop: 10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: colors.tertiary}}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return null
    }

    const ListHeaders = () => {
        return (
            <>
                {postNumForMsg == null && (<MsgBox type={messageType}>{message}</MsgBox>)}
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
                    <SubTitle style={{color: colors.brand, marginBottom: 0, textAlign: 'center'}} > {categoryTags} </SubTitle>
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
                        <TouchableOpacity style={{height: 30, width: '80%', backgroundColor: dark ? colors.darkLight : colors.borderColor, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5}} onPress={JoinCategory}>
                            {typeof inCategory === "boolean" ?
                                <Text style={{fontSize: 20, color: colors.tertiary}}>{inCategory ? 'Leave' : 'Join'}</Text>
                            : inCategory === "Changing" || inCategory === "Finding" ?
                                <ActivityIndicator size="small" color={colors.brand}/>
                            : null}
                        </TouchableOpacity>
                    </ProfileHorizontalViewItem>
                    <ProfileHorizontalViewItem profCenterIcon={true}>
                        <SubTitle style={{color: colors.tertiary}} welcome={true}> Date Created </SubTitle>
                            <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/084-calendar.png')}/>
                        <SubTitle welcome={true} style={{width: '80%', textAlign: 'center', color: colors.tertiary}}> {datePosted ? getTimeFromUTCMS(datePosted) : 'Loading...'} </SubTitle>
                    </ProfileHorizontalViewItem>
                </ProfileHorizontalView>
                <TouchableOpacity style={{backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.tertiary, width: '50%', alignSelf: 'center', marginVertical: 10, borderRadius: 10}} onPress={() => {storedCredentials ? navigation.navigate("ThreadUploadPage_FromCategory_FindStack", {threadFormat: null, threadTitle: null, threadSubtitle: null, threadTags: null, categoryTitle: categoryTitle, threadBody: null, threadImage: null, threadImageDescription: null, threadNSFW: null, threadNSFL: null, goBackAfterPost: true, goBackLocation: 'ThreadUploadPage_FromCategory_FindStack', allowScreenShots: allowScreenShots, fromCategoryViewPage: true, categoryId}) : navigation.navigate('ModalLoginScreen', {modal: true})}}>
                    <ButtonText style={{color: colors.tertiary}}>Post Thread</ButtonText>
                </TouchableOpacity>
                <ProfileSelectMediaTypeHorizontalView>
                    <ProfileSelectMediaTypeItem onPress={changeToOne}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/079-clock.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToTwo}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/170-fire.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>                        
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToThree}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor}}>     
                            <ProfileSelectMediaTypeIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/157-stats-bars.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>     
                    </ProfileSelectMediaTypeItem>
                </ProfileSelectMediaTypeHorizontalView>
                <SubTitle style={{color: colors.tertiary}} profNoPosts={true}>
                    {selectedPostFormatName}
                </SubTitle>
            </>
        )
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
                    {selectedPostFormat == "One" && (<FlatList
                        data={threads.posts}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => <ThreadPost post={item} colors={colors} colorsIndexNum={indexNum} dispatch={dispatchThreads} index={index}/>}
                        ListFooterComponent={() => <ListFooters feedData={threads} loadMoreFunction={changeToOne}/>}
                        ListHeaderComponent={ListHeaders}
                    />)}
                    {selectedPostFormat == "Two" && (<FlatList
                        data={changeSections}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => <PollItem pollTitle={item.pollTitle} pollSubTitle={item.pollSubTitle} optionOne={item.optionOne} optionOnesColor={item.optionOnesColor} optionOnesVotes={item.optionOnesVotes} optionOnesBarLength={item.optionOnesBarLength} optionTwo={item.optionTwo} optionTwosColor={item.optionTwosColor} optionTwosVotes={item.optionTwosVotes} optionTwosBarLength={item.optionTwosBarLength} optionThree={item.optionThree} optionThreesColor={item.optionThreesColor} optionThreesVotes={item.optionThreesVotes} optionThreesBarLength={item.optionThreesBarLength} optionFour={item.optionFour} optionFoursColor={item.optionFoursColor} optionFoursVotes={item.optionFoursVotes} optionFoursBarLength={item.optionFoursBarLength} optionFive={item.optionFive} optionFivesColor={item.optionFivesColor} optionFivesVotes={item.optionFivesVotes} optionFivesBarLength={item.optionFivesBarLength} optionSix={item.optionSix} optionSixesColor={item.optionSixesColor} optionSixesVotes={item.optionSixesVotes} optionSixesBarLength={item.optionSixesBarLength} totalNumberOfOptions={item.totalNumberOfOptions} pollUpOrDownVotes={item.pollUpOrDownVotes} pollId={item.pollId} votedFor={item.votedFor} pollLiked={item.pollLiked} pfpB64={item.pfpB64} creatorName={item.creatorName} creatorDisplayName={item.creatorDisplayName}/>}
                    />)}
                    {selectedPostFormat == "Three" && (<FlatList
                        data={changeSections}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => <PollItem pollTitle={item.pollTitle} pollSubTitle={item.pollSubTitle} optionOne={item.optionOne} optionOnesColor={item.optionOnesColor} optionOnesVotes={item.optionOnesVotes} optionOnesBarLength={item.optionOnesBarLength} optionTwo={item.optionTwo} optionTwosColor={item.optionTwosColor} optionTwosVotes={item.optionTwosVotes} optionTwosBarLength={item.optionTwosBarLength} optionThree={item.optionThree} optionThreesColor={item.optionThreesColor} optionThreesVotes={item.optionThreesVotes} optionThreesBarLength={item.optionThreesBarLength} optionFour={item.optionFour} optionFoursColor={item.optionFoursColor} optionFoursVotes={item.optionFoursVotes} optionFoursBarLength={item.optionFoursBarLength} optionFive={item.optionFive} optionFivesColor={item.optionFivesColor} optionFivesVotes={item.optionFivesVotes} optionFivesBarLength={item.optionFivesBarLength} optionSix={item.optionSix} optionSixesColor={item.optionSixesColor} optionSixesVotes={item.optionSixesVotes} optionSixesBarLength={item.optionSixesBarLength} totalNumberOfOptions={item.totalNumberOfOptions} pollUpOrDownVotes={item.pollUpOrDownVotes} pollId={item.pollId} votedFor={item.votedFor} pfpB64={item.pfpB64} creatorName={item.creatorName} creatorDisplayName={item.creatorDisplayName} postNum={item.postNum} datePosted={item.datePosted} pollComments={item.pollComments}/>}
                    />)}
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
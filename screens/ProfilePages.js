import React, { useContext, useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesomeFive from 'react-native-vector-icons/FontAwesome5';

global.Buffer = global.Buffer || require('buffer').Buffer

import nacl from 'tweet-nacl-react-native-expo'

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
    SearchFrame,
    SearchHorizontalView,
    SearchHorizontalViewItem,
    SearchHorizontalViewItemCenter,
    SearchSubTitle,
    ViewHider,
    ProfileOptionsView,
    ProfileOptionsViewButtons,
    ProfileOptionsViewButtonsText,
    ProfileOptionsViewText,
    ProfileOptionsViewSubtitleText,
    ReportProfileOptionsView,
    ReportProfileOptionsViewButtons,
    ReportProfileOptionsViewButtonsText,
    ReportProfileOptionsViewSubtitleText,
    ReportProfileOptionsViewText,
    ProfileBadgeItemUnderline
} from './screenStylings/styling';


// Colors
const { brand, primary, tertiary, greyish, darkLight, darkestBlue, slightlyLighterPrimary, slightlyLighterGrey, descTextColor, darkest, red, orange, yellow, green, purple } = Colors;

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//axios
import axios from 'axios';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, SectionList, View, Image, TouchableOpacity, ActivityIndicator, Animated, Text, useWindowDimensions, FlatList, RefreshControl } from 'react-native';

import {useTheme} from "@react-navigation/native"

import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png';
import * as Haptics from 'expo-haptics';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import ActionSheet from 'react-native-actionsheet';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';

import usePostReducer from '../hooks/usePostReducer';
import ImagePost from '../components/Posts/ImagePost';
import PollPost from '../components/Posts/PollPost';
import ThreadPost from '../components/Posts/ThreadPost';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';
import useCategoryReducer from '../hooks/useCategoryReducer';
import CategoryItem from '../components/Posts/CategoryItem';
import ParseErrorMessage from '../components/ParseErrorMessage';

const ProfilePages = ({ route, navigation }) => {
    const [images, dispatchImages] = usePostReducer();
    const [videos, dispatchVideos] = usePostReducer();
    const [polls, dispatchPolls] = usePostReducer();
    const [threads, dispatchThreads] = usePostReducer();
    const [categories, dispatchCategories] = useCategoryReducer();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    var backButtonHidden = false
    const [PageElementsState, setPageElementsState] = useState(false)
    const { colors, indexNum } = useTheme();
    //context
    const { profilesName, profilesDisplayName, following, followers, totalLikes, profileKey, badges, pubId, bio, privateAccount } = route.params;
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    if (storedCredentials) {var { _id, secondId, badges: storedBadges } = storedCredentials} else {var {_id, secondId, badges: storedBadges} = {_id: "SSGUEST", secondId: "SSGUEST", badges: []}}
    const [selectedPostFormat, setSelectedPostFormat] = useState("One")
    const [selectedPostFormatName, setSelectedPostFormatName] = useState("This user has no Image posts.")
    const [formatOneText, setFormatOneText] = useState("This user has no Image posts.")
    const [formatTwoText, setFormatTwoText] = useState("This user has no Video posts.")
    const [formatThreeText, setFormatThreeText] = useState("This user has no Poll posts.")
    const [formatFourText, setFormatFourText] = useState("This user has no Thread posts.")
    const [formatFiveText, setFormatFiveText] = useState("This user associates with no categories.")
    const [useStatePollData, setUseStatePollData] = useState()
    const [changeSectionsTwo, setChangeSectionsTwo] = useState([])
    const [changeSectionsFive, setChangeSectionsFive] = useState([])
    const [changePollIfLiked, setChangePollIfLiked] = useState(tertiary)
    const [resetFoundPolls, setResetFoundPolls] = useState(false)
    const [loadingPostsVideo, setLoadingPostsVideo] = useState(false)
    const [loadingPostsPoll, setLoadingPostsPoll] = useState(false)
    const [loadingPostsThread, setLoadingPostsThread] = useState(false)
    const [loadingPostsCategory, setLoadingPostsCategory] = useState(false)
    const [loadingPosts, setLoadingPosts] = useState(false)

    //ServerStuff
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [postNumForMsg, setPostNumForMsg] = useState();
    const userLoadMax = 100;
    //tokens
    let cancelTokenPostFormatOne = axios.CancelToken.source();
    let cancelTokenPostFormatTwo = axios.CancelToken.source();
    let cancelTokenPostFormatThree = axios.CancelToken.source();
    let cancelTokenPostFormatFour = axios.CancelToken.source();
    let cancelTokenPostFormatFive = axios.CancelToken.source();
    //3 dots menus
    const ProfileOptionsViewOpacity = useRef(new Animated.Value(0)).current;
    const ProfileOptionsViewOpen = useRef(false);
    // Followers setup
    const [loadingFollowers, setLoadingFollowers] = useState(true);
    const [initiallyFollowed, setInitiallyFollowed] = useState()
    const [userIsFollowed, setUserIsFollowed] = useState()
    const [togglingFollow, setTogglingFollow] = useState(false)
    // Chat setup
    const [settingUpChat, setSettingUpChat] = useState(false);
    const [settingUpChatErrorMessage, setSettingUpChatErrorMessage] = useState(null);
    const [settingUpChatErrorOrigin, setSettingUpChatErrorOrigin] = useState(null);
    // Server url
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    //Unfollow confirmation
    const UnfollowPrivateAccountConfirmationPickerMenu = useRef(null);
    // When user is not found
    const [userNotFound, setUserNotFound] = useState(false);

    const [blockingUser, setBlockingUser] = useState(false)

    const [refreshing, setRefreshing] = useState(false)

    const getFollowersEtc = () => {
        //The resolve is used to know when getFollowersEtc has finished. getFollowersEtc handles errors internally, so we do not need a reject
        return new Promise(resolve => {
            const url = `${serverUrl}/tempRoute/reloadUsersDetails`;
            const toSend = {
                usersPubId: pubId
            }

            changeToOne()
            
            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const { message, status, data } = result;

                if (status !== 'SUCCESS') {
                    if (message == "User not found.") {
                        setUserNotFound(true);
                    }
                    handleMessage(message, status);
                    console.log(status)
                    console.error(message)
                    setLoadingFollowers('Error')
                    navigation.setParams({following: 'Error'});
                } else {
                    console.log(status)
                    console.log(message)
                    /*setProfilesName(data.name)
                    setProfilesDisplayName(data.displayName)
                    setFollowers(data.followers)
                    setFollowing(data.following)*/
                    setInitiallyFollowed(data.userIsFollowing)
                    setUserIsFollowed(data.userIsFollowing)
                    //setTotalLikes(data.totalLikes)
                    setLoadingFollowers(false)
                }
                //setSubmitting(false);
                resolve()
            }).catch(error => {
                console.error(error);
                //setSubmitting(false);
                handleMessage(ParseErrorMessage(error));
                setLoadingFollowers('Error')
                resolve()
            })
        })
    }

    useEffect(() => {
        getFollowersEtc()
    }, [])

    const handleMessage = (message, type = 'FAILED', postNum) => {
        setMessage(message);
        setMessageType(type);
        if (postNum !== null) {
            setPostNumForMsg(postNum)
        } else {
            setPostNumForMsg(null)
        }
    }

    const onRefresh = () => {
        setRefreshing(true)

        if (selectedPostFormat === "One") {
            loadImages()
        } else if (selectedPostFormat === "Two") {
            console.warn('SocialSquare does not support video yet')
        } else if (selectedPostFormat === "Three") {
            loadPolls()
        } else if (selectedPostFormat === "Four") {
            loadThreads()
        } else if (selectedPostFormat === "Five") {
            loadCategories()
        } else {
            console.error('Unknown selectedPostFormat:', selectedPostFormat)
        }

        getFollowersEtc().then(() => {
            setRefreshing(false)
        })
    }

    const ListHeaders = () => {
        return (
            <View style={{paddingTop: StatusBarHeight}}>
                <ProfileHorizontalView topItems={true} style={{justifyContent: 'space-between'}}>
                    <ViewHider viewHidden={backButtonHidden} style={{marginLeft: 10}}>
                        <TouchableOpacity onPress={() => {navigation.goBack()}}>
                            <Image
                                source={require('../assets/app_icons/back_arrow.png')}
                                style={{ width: 40, height: 40, tintColor: colors.tertiary}}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        </TouchableOpacity>
                    </ViewHider>
                    <TouchableOpacity onPress={changeProfilesOptionsView} style={{marginRight: 20}} disabled={!!userNotFound}>
                        <Image
                            source={userNotFound == false ? require('../assets/app_icons/3dots.png') : null}
                            style={{ width: 40, height: 40, tintColor: colors.tertiary}}
                            resizeMode="contain"
                            resizeMethod="resize"
                        />
                    </TouchableOpacity>
                </ProfileHorizontalView>
                <ProfInfoAreaImage style={{marginTop: 1}}>
                    <Avatar resizeMode="cover" source={{uri: profileKey}} />
                    <Text style={{fontSize: 35, fontWeight: 'bold', textAlign: 'center', color: colors.brand, paddingVertical: 0, paddingHorizontal: 10}}>{profilesDisplayName || profilesName || "Couldn't get name"}</Text>
                    <SubTitle style={{color: colors.tertiary, marginBottom: 0}}>{"@" + profilesName}</SubTitle>
                    {BadgesArea(badges)}
                    {bio ? <SubTitle style={{color: colors.tertiary, marginBottom: 5, fontSize: 14, textAlign: 'center'}} bioText={true} >{bio}</SubTitle> : null}
                </ProfInfoAreaImage>
                <ProfileHorizontalView>
                    <ProfileHorizontalViewItem profLeftIcon={true}>
                        <TouchableOpacity onPress={() => {navigation.navigate('ProfileStats', {type: 'Followers', followers: followers, publicId: pubId, isSelf: pubId === secondId, name: profilesDisplayName || profilesName})}} style={{alignItems: 'center'}}>
                            {pubId === secondId ?
                                <>
                                    <SubTitle welcome={true} style={{color: colors.tertiary}}> Followers </SubTitle> 
                                    <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png')} />
                                    <SubTitle welcome={true} style={{color: colors.tertiary}}> {followers} </SubTitle> 
                                </>
                            : loadingFollowers == true ?
                                <>
                                    <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png')} />
                                    <SubTitle welcome={true} style={{color: colors.tertiary}}> Followers </SubTitle> 
                                    <ActivityIndicator size="large" color={colors.tertiary} />
                                </>
                            : loadingFollowers == 'Error' ?
                                <>
                                    <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png')} />
                                    <SubTitle welcome={true} style={{color: colors.tertiary}}> Followers </SubTitle> 
                                    <SubTitle welcome={true} style={{color: colors.tertiary}}> Error </SubTitle> 
                                </>
                            :
                                <View style={{alignItems: 'center'}}>
                                    <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png')} />
                                    {initiallyFollowed == false && (
                                        <View>
                                            {userIsFollowed == true && (
                                                <SubTitle welcome={true} style={{color: colors.tertiary}}> {followers + 1} </SubTitle> 
                                            )}
                                            {(userIsFollowed == false || userIsFollowed == 'Requested') && (
                                                <SubTitle welcome={true} style={{color: colors.tertiary}}> {followers} </SubTitle> 
                                            )}
                                        </View>
                                    )}
                                    {initiallyFollowed == true && (
                                        <View>
                                            {userIsFollowed == true && (
                                                <SubTitle welcome={true} style={{color: colors.tertiary}}> {followers} </SubTitle> 
                                            )}
                                            {(userIsFollowed == false || userIsFollowed == 'Requested') && (
                                                <SubTitle welcome={true} style={{color: colors.tertiary}}> {followers - 1} </SubTitle> 
                                            )}
                                        </View>
                                    )}
                                    {initiallyFollowed == 'Requested' && (
                                        <SubTitle welcome={true} style={{color: colors.tertiary}}> {followers} </SubTitle> 
                                    )}
                                    {togglingFollow == false && pubId !== secondId && (
                                        <View style={{width: '80%', borderRadius: 5, backgroundColor: colors.primary, borderColor: colors.borderColor, borderWidth: 3, paddingHorizontal: 10, paddingTop: 2}}>
                                            {userIsFollowed == false && (
                                                <TouchableOpacity onPress={() => toggleFollowOfAUser()}>
                                                    <SubTitle welcome={true} style={{textAlign: 'center', color: colors.tertiary}}> Follow </SubTitle>
                                                </TouchableOpacity>
                                            )}
                                            {userIsFollowed == true && (
                                                <TouchableOpacity onPress={() => privateAccount == true ? UnfollowPrivateAccountConfirmationPickerMenu.current.show() : toggleFollowOfAUser()}>
                                                    <SubTitle welcome={true} style={{textAlign: 'center', color: colors.tertiary}}> Unfollow </SubTitle>
                                                </TouchableOpacity>
                                            )}
                                            {userIsFollowed == 'Requested' && (
                                                <TouchableOpacity onPress={() => toggleFollowOfAUser()}>
                                                    <SubTitle welcome={true} style={{textAlign: 'center', color: colors.tertiary, fontSize: 14}}> Requested </SubTitle>
                                                </TouchableOpacity>
                                            )}
                                            {userIsFollowed !== true && (
                                                <View>
                                                    {userIsFollowed !== false && (
                                                        <View>
                                                            {userIsFollowed !== 'Requested' && (
                                                                <ActivityIndicator size={20} color={colors.brand} />
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    )}
                                    {togglingFollow == true && (
                                        <ActivityIndicator size="large" color={colors.brand} />
                                    )}
                                </View>
                            }
                        </TouchableOpacity>
                    </ProfileHorizontalViewItem>
                    <ProfileHorizontalViewItem profCenterIcon={true}>
                        <TouchableOpacity onPress={() => {navigation.navigate('ProfileStats', {type: 'Following', followers: following, publicId: pubId, isSelf: pubId === secondId, name: profilesDisplayName || profilesName})}} style={{alignItems: 'center'}}>
                            <SubTitle style={{color: colors.tertiary}} welcome={true}> Following </SubTitle>
                            <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png')} />
                            <SubTitle style={{color: colors.tertiary}} welcome={true}> {following} </SubTitle>
                        </TouchableOpacity>
                    </ProfileHorizontalViewItem>
                    <ProfileHorizontalViewItem profRightIcon={true}>
                        <SubTitle style={{color: colors.tertiary}} welcome={true}> Upvotes </SubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')} />
                        <SubTitle style={{color: colors.tertiary}} welcome={true}> Coming soon{/*totalLikes*/} </SubTitle>
                    </ProfileHorizontalViewItem>
                </ProfileHorizontalView>
                <ProfileSelectMediaTypeHorizontalView>
                    <ProfileSelectMediaTypeItem onPress={changeToOne}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'One' ? colors.brand : colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{tintColor: selectedPostFormat == 'One' ? colors.brand : colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png')} />
                        </ProfileSelectMediaTypeIconsBorder>
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToTwo}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Two' ? colors.brand : colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{tintColor: selectedPostFormat == 'Two' ? colors.brand : colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/020-film.png')} />
                        </ProfileSelectMediaTypeIconsBorder>
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToThree}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Three' ? colors.brand : colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{tintColor: selectedPostFormat == 'Three' ? colors.brand : colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/157-stats-bars.png')} />
                        </ProfileSelectMediaTypeIconsBorder>
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToFour}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Four' ? colors.brand : colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{ height: '80%', width: '80%', tintColor: selectedPostFormat == 'Four' ? colors.brand : colors.tertiary }} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/007-pencil2.png')} />
                        </ProfileSelectMediaTypeIconsBorder>
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToFive}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Five' ? colors.brand : colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{ height: '80%', width: '80%', tintColor: selectedPostFormat == 'Five' ? colors.brand : colors.tertiary }} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png')} />
                        </ProfileSelectMediaTypeIconsBorder>
                    </ProfileSelectMediaTypeItem>
                </ProfileSelectMediaTypeHorizontalView>
            </View>
        )
    }

    const ListFooters = ({feedData, loadMoreFunction, postFormat, categoryList}) => {
        const {colors} = useTheme();
    
        if (feedData.loadingFeed) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                    <ActivityIndicator color={colors.brand} size="large"/>
                </View>
            )
        }
    
        if (feedData.error) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                    <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Error: {feedData.error}</Text>
                    <TouchableOpacity onPress={() => loadMoreFunction(false)} style={{padding: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.tertiary, marginTop: 10}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: colors.tertiary}}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    
        if (categoryList ? feedData.categories.length === 0 : feedData.posts.length === 0) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                    {categoryList ?
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>{profilesDisplayName || profilesName} isn't a part of any categories.</Text>
                    :
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>{profilesDisplayName || profilesName} has no {postFormat}s.</Text>
                    }
                </View>
            )
        }
    
        if (categoryList ? feedData.noMoreCategories : feedData.noMorePosts) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>No more {categoryList ? 'categorie' : postFormat}s to show.</Text>
                </View>
            )
        }
    
        return (
            <TouchableOpacity onPress={() => loadMoreFunction(false)} style={{padding: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.tertiary, marginVertical: 10}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: colors.tertiary}}>Load More</Text>
            </TouchableOpacity>
        )
    }

    //main
    const toSendProfileName = { pubId: pubId };

    //get image of post
    async function getImageInPost(imageData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageData[index].imageKey}`, { cancelToken: source.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPosts(false)
                console.log("Either an error or cancelled.");
            })
    }
    //profile image of creator
    async function getImageInPfp(imageData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageData[index].creatorPfpKey}`, { cancelToken: source.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPosts(false)
                console.log("Either an error or cancelled.");
            })
    }
    async function getImageInCategory(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`, { cancelToken: cancelTokenPostFormatFive.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPosts(false)
                console.log("Either an error or cancelled.");
            })
    }
    //any image honestly
    async function getImageWithKeyOne(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`, { cancelToken: cancelTokenPostFormatOne.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                dispatchImages({type: 'stopLoad'})
                console.log("Either an error or cancelled.");
            })
    }
    async function getImageWithKeyTwo(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`, { cancelToken: cancelTokenPostFormatTwo.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPostsVideo(false)
                console.log("Either an error or cancelled.");
            })
    }
    async function getImageWithKeyThree(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`, { cancelToken: cancelTokenPostFormatThree.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPostsPoll(false)
                console.log("Either an error or cancelled.");
            })
    }
    async function getImageWithKeyFour(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`, { cancelToken: cancelTokenPostFormatFour.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPostsThread(false)
                console.log("Either an error or cancelled.");
            })
    }
    async function getImageWithKeyFive(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`, { cancelToken: cancelTokenPostFormatFive.token })
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPostsCategory(false)
                console.log("Either an error or cancelled.");
            })
    }

    const layoutImagePosts = (data) => {
        var imageData = data.data.posts
        console.log("The Image data")
        console.log(imageData)
        console.log(imageData.length)

        Promise.all(
            imageData.map(async (data, index) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const imageB64 = await getImageWithKeyOne(data.imageKey)
                        resolve({
                            imageKey: data.imageKey,
                            imageB64,
                            imageTitle: data.imageTitle,
                            imageDescription: data.imageDescription,
                            votes: data.votes,
                            comments: data.comments,
                            creatorName: data.creatorName,
                            creatorDisplayName: data.creatorDisplayName,
                            datePosted: data.datePosted,
                            postNum: index,
                            creatorPfpB64: profileKey,
                            upvoted: data.upvoted,
                            downvoted: data.downvoted,
                            isOwner: data.isOwner,
                            _id: data._id
                        })
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        ).then(posts => {
            dispatchImages({
                type: 'addPosts',
                posts: posts
            })

            if (data.data.noMorePosts) {
                dispatchImages({type: 'noMorePosts'})
            }
        }).catch(error => {
            console.error(error)
            dispatchImages({type: 'error', error: String(error)})
        })
    }

    const loadImages = (reload) => {
        if (!images.loadingFeed && (reload || !images.noMorePosts)) {
            cancelTokenPostFormatTwo.cancel()
            cancelTokenPostFormatThree.cancel()
            cancelTokenPostFormatFour.cancel()
            cancelTokenPostFormatFive.cancel()

            const url = serverUrl + '/tempRoute/getImagesFromProfile';

            const type = reload ? 'startReload' : 'startLoad'

            dispatchImages({type})

            const toSend = {pubId};

            if (!reload && images.posts.length > 0) {
                toSend.previousPostId = images.posts[images.posts.length - 1]._id
            }

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {data} = result;

                layoutImagePosts({data});
            }).catch(error => {
                console.error(error);
                dispatchImages({type: 'error', error: ParseErrorMessage(error)})
            })
        }
    }

    const changeToOne = () => {
        setSelectedPostFormat("One")
        loadImages(true);
    }

    const changeToTwo = () => {
        cancelTokenPostFormatOne.cancel()
        cancelTokenPostFormatThree.cancel()
        cancelTokenPostFormatFour.cancel()
        cancelTokenPostFormatFive.cancel()
        setFormatTwoText("This user has no Video posts.")
        setSelectedPostFormat("Two")
        setChangeSectionsTwo([])
    }

    const layoutPollPosts = (data) => {
        const {posts: pollData, noMorePosts} = data;

        console.log('Poll Data:', pollData)
        console.log('Number of polls received:', pollData.length)
        var tempSections = []
        var itemsProcessed = 0
        pollData.forEach(function (item, index) {
            var optionOnesBarLength = 16.6666666667
            var optionTwosBarLength = 16.6666666667
            var optionThreesBarLength = 16.6666666667
            var optionFoursBarLength = 16.6666666667
            var optionFivesBarLength = 16.6666666667
            var optionSixesBarLength = 16.6666666667
            var totalVotes = pollData[index].optionOnesVotes+pollData[index].optionTwosVotes+pollData[index].optionThreesVotes+pollData[index].optionFoursVotes+pollData[index].optionFivesVotes+pollData[index].optionSixesVotes
            //console.log(item, index);
            if (totalVotes !== 0) {
                optionOnesBarLength = (pollData[index].optionOnesVotes/totalVotes)*100
                console.log("O1 BL")
                console.log(optionOnesBarLength)
                optionTwosBarLength = (pollData[index].optionTwosVotes/totalVotes)*100
                console.log("O2 BL")
                console.log(optionTwosBarLength)
                optionThreesBarLength = (pollData[index].optionThreesVotes/totalVotes)*100
                console.log("O3 BL")
                console.log(optionThreesBarLength)
                optionFoursBarLength = (pollData[index].optionFoursVotes/totalVotes)*100
                console.log("O4 BL")
                console.log(optionFoursBarLength)
                optionFivesBarLength = (pollData[index].optionFivesVotes/totalVotes)*100
                console.log("O5 BL")
                console.log(optionFivesBarLength)
                optionSixesBarLength = (pollData[index].optionSixesVotes/totalVotes)*100
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
                    if (pollData[index].totalNumberOfOptions == "Two") {
                        optionOnesBarLength = 100/2
                        optionTwosBarLength = 100/2
                        optionThreesBarLength = 0
                        optionFoursBarLength = 0
                        optionFivesBarLength = 0
                        optionSixesBarLength = 0
                    } else if (pollData[index].totalNumberOfOptions == "Three") {
                        optionOnesBarLength = 100/3
                        optionTwosBarLength = 100/3
                        optionThreesBarLength = 100/3
                        optionFoursBarLength = 0
                        optionFivesBarLength = 0
                        optionSixesBarLength = 0
                    } else if (pollData[index].totalNumberOfOptions == "Four") {
                        optionOnesBarLength = 100/4
                        optionTwosBarLength = 100/4
                        optionThreesBarLength = 100/4
                        optionFoursBarLength = 100/4
                        optionFivesBarLength = 0
                        optionSixesBarLength = 0
                    } else if (pollData[index].totalNumberOfOptions == "Five") {
                        optionOnesBarLength = 100/5
                        optionTwosBarLength = 100/5
                        optionThreesBarLength = 100/5
                        optionFoursBarLength = 100/5
                        optionFivesBarLength = 100/5
                        optionSixesBarLength = 0
                    } else if (pollData[index].totalNumberOfOptions == "Six") {
                        optionOnesBarLength = 100/6
                        optionTwosBarLength = 100/6
                        optionThreesBarLength = 100/6
                        optionFoursBarLength = 100/6
                        optionFivesBarLength = 100/6
                        optionSixesBarLength = 100/6
                    }
                }
            }
            console.log("poll data")
            console.log(pollData[index])
            async function getPfpImageForPollWithAsync() {
                
                var tempSectionsTemp = {_id: pollData[index]._id, pollTitle: pollData[index].pollTitle, pollSubTitle: pollData[index].pollSubTitle, optionOne: pollData[index].optionOne, optionOnesColor: pollData[index].optionOnesColor, optionOnesVotes: pollData[index].optionOnesVotes, optionOnesBarLength: optionOnesBarLength, optionTwo: pollData[index].optionTwo, optionTwosColor: pollData[index].optionTwosColor, optionTwosVotes: pollData[index].optionTwosVotes, optionTwosBarLength: optionTwosBarLength, optionThree: pollData[index].optionThree, optionThreesColor: pollData[index].optionThreesColor, optionThreesVotes: pollData[index].optionThreesVotes, optionThreesBarLength: optionThreesBarLength, optionFour: pollData[index].optionFour, optionFoursColor: pollData[index].optionFoursColor, optionFoursVotes: pollData[index].optionFoursVotes, optionFoursBarLength: optionFoursBarLength, optionFive: pollData[index].optionFive, optionFivesColor: pollData[index].optionFivesColor, optionFivesVotes: pollData[index].optionFivesVotes, optionFivesBarLength:optionFivesBarLength, optionSix: pollData[index].optionSix, optionSixesColor: pollData[index].optionSixesColor, optionSixesVotes: pollData[index].optionSixesVotes, optionSixesBarLength: optionSixesBarLength, totalNumberOfOptions: pollData[index].totalNumberOfOptions, votes: pollData[index].votes, pollId: pollData[index]._id, votedFor: pollData[index].votedFor, postNum: index, pollComments: pollData[index].pollComments, creatorName: pollData[index].creatorName, creatorDisplayName: pollData[index].creatorDisplayName, datePosted: pollData[index].datePosted, upvoted: pollData[index].upvoted, downvoted: pollData[index].downvoted, pfpB64: profileKey, isOwner: pollData[index].isOwner}
                tempSections.push(tempSectionsTemp)
                itemsProcessed++;
                if(itemsProcessed === pollData.length) {
                    dispatchPolls({type: 'addPosts', posts: tempSections})
                }
            }
            getPfpImageForPollWithAsync()
        });
        if (noMorePosts) {
            dispatchPolls({type: 'noMorePosts'})
        }
    }

    const loadPolls = (reload) => {
        if (!polls.loadingFeed && (reload || !polls.noMorePosts)) {
            cancelTokenPostFormatOne.cancel()
            cancelTokenPostFormatTwo.cancel()
            cancelTokenPostFormatFour.cancel()
            cancelTokenPostFormatFive.cancel()

            const url = serverUrl + '/tempRoute/searchforpollposts';

            const type = reload ? 'startReload' : 'startLoad'

            dispatchPolls({type})

            const toSend = {pubId};

            if (!reload && polls.posts.length > 0) {
                toSend.previousPostId = polls.posts[polls.posts.length - 1]._id
            }

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {data} = result;

                layoutPollPosts(data);
            }).catch(error => {
                console.error(error);
                dispatchPolls({type: 'error', error: ParseErrorMessage(error)})
            })
        }
    }

    const changeToThree = () => {
        dispatchPolls({type: 'startReload'})
        setSelectedPostFormat("Three")
        loadPolls(true);
    }

    const layoutThreadPosts = (data) => {
        var threadData = data.data.posts
        console.log("The Thread data")
        console.log(threadData)
        console.log(threadData.length)

        Promise.all(
            threadData.map((data, index) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        if (data.threadType === "Text") {
                            resolve({
                                postNum: index,
                                _id: threadData[index]._id,
                                comments: threadData[index].comments,
                                threadType: threadData[index].threadType,
                                votes: threadData[index].votes,
                                threadTitle: threadData[index].threadTitle,
                                threadSubtitle: threadData[index].threadSubtitle,
                                threadTags: threadData[index].threadTags,
                                threadCategory: threadData[index].threadCategory,
                                threadBody: threadData[index].threadBody,
                                threadImageKey: threadData[index].threadImageKey,
                                threadImageDescription: threadData[index].threadImageDescription,
                                threadNSFW: threadData[index].threadNSFW,
                                threadNSFL: threadData[index].threadNSFL,
                                datePosted: threadData[index].datePosted,
                                upvoted: threadData[index].upvoted,
                                downvoted: threadData[index].downvoted,
                                creatorDisplayName: threadData[index].creatorDisplayName,
                                creatorName: threadData[index].creatorName,
                                imageInThreadB64: null,
                                creatorImageB64: profileKey,
                                isOwner: threadData[index].isOwner
                            })
                        } else if (data.threadType === "Images") {
                            const imageInThreadB64 = await getImageWithKeyFour(data.threadImageKey)
                            resolve({
                                postNum: index,
                                _id: threadData[index]._id,
                                comments: threadData[index].comments,
                                threadType: threadData[index].threadType,
                                votes: threadData[index].votes,
                                threadTitle: threadData[index].threadTitle,
                                threadSubtitle: threadData[index].threadSubtitle,
                                threadTags: threadData[index].threadTags,
                                threadCategory: threadData[index].threadCategory,
                                threadBody: threadData[index].threadBody,
                                threadImageKey: threadData[index].threadImageKey,
                                threadImageDescription: threadData[index].threadImageDescription,
                                threadNSFW: threadData[index].threadNSFW,
                                threadNSFL: threadData[index].threadNSFL,
                                datePosted: threadData[index].datePosted,
                                upvoted: threadData[index].upvoted,
                                downvoted: threadData[index].downvoted,
                                creatorDisplayName: threadData[index].creatorDisplayName,
                                creatorName: threadData[index].creatorName,
                                imageInThreadB64: imageInThreadB64,
                                creatorImageB64: profileKey,
                                isOwner: threadData[index].isOwner
                            })
                        }
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        ).then(posts => {
            dispatchThreads({type: 'addPosts', posts})
            if (data.data.noMorePosts) {
                dispatchThreads({type: 'noMorePosts'})
            }
        }).catch(error => {
            console.error('An error occurred while loading threads from ProfilePages.js:', error)
            dispatchThreads({type: 'error', error: ParseErrorMessage(error)})
        })
    }

    const loadThreads = (reload) => {
        if (!threads.loadingFeed && (reload || !threads.noMorePosts)) {
            cancelTokenPostFormatOne.cancel()
            cancelTokenPostFormatTwo.cancel()
            cancelTokenPostFormatThree.cancel()
            cancelTokenPostFormatFive.cancel()

            const url = serverUrl + '/tempRoute/getthreadsfromprofile';

            const type = reload ? 'startReload' : 'startLoad'

            dispatchThreads({type})

            const toSend = {pubId};

            if (!reload && threads.posts.length > 0) {
                toSend.previousPostId = threads.posts[threads.posts.length - 1]._id
            }

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {data} = result;

                layoutThreadPosts({data});
            }).catch(error => {
                console.error(error);
                dispatchThreads({type: 'error', error: ParseErrorMessage(error)})
            })
        }
    }

    const changeToFour = () => {
        setSelectedPostFormat("Four")
        loadThreads(true)
    }

    const layoutCategoriesFound = (data) => {
        console.log('DATA:', data)
        var allData = data.categories

        Promise.all(
            allData.map(category => {
                return new Promise(async (resolve, reject) => {
                    try {
                        if (category.imageKey !== "") {
                            //category with an image
                            const imageB64 = await getImageWithKeyFive(category.imageKey)
                            
                            resolve({
                                categoryTitle: category.categoryTitle,
                                categoryDescription: category.categoryDescription,
                                members: category.members,
                                categoryTags: category.categoryTags,
                                image: imageB64,
                                NSFW: category.NSFW,
                                NSFL: category.NSFL,
                                datePosted: category.datePosted,
                                categoryId: category.categoryId
                            })
                        } else {
                            //category without an image
                            resolve({
                                categoryTitle: category.categoryTitle,
                                categoryDescription: category.categoryDescription,
                                members: category.members,
                                categoryTags: category.categoryTags,
                                image: null,
                                NSFW: category.NSFW,
                                NSFL: category.NSFL,
                                datePosted: category.datePosted,
                                categoryId: category.categoryId
                            })
                        }
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        ).then(categories => {
            dispatchCategories({type: 'addCategories', categories})
            if (data.noMoreCategories) {
                dispatchCategories({type: 'noMoreCategories'})
            }
        }).catch(error => {
            dispatchCategories({type: 'error', error: String(error)})
        })
    }

    const loadCategories = (reload) => {
        if (!categories.loadingFeed && (reload || !categories.noMorePosts)) {
            cancelTokenPostFormatOne.cancel()
            cancelTokenPostFormatTwo.cancel()
            cancelTokenPostFormatThree.cancel()
            cancelTokenPostFormatFour.cancel()

            const url = serverUrl + '/tempRoute/findcategoryfromprofile';

            const type = reload ? 'startReload' : 'startLoad'

            dispatchCategories({type})

            const toSend = {pubId};

            if (!reload && categories.categories.length > 0) {
                toSend.previousCategoryId = categories.categories[categories.categories.length - 1].categoryId
            }

            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {data} = result;

                layoutCategoriesFound(data)
            }).catch(error => {
                console.error(error);
                dispatchCategories({type: 'error', error: ParseErrorMessage(error)})
            })
        }
    }

    const changeToFive = () => {
        setSelectedPostFormat("Five")
        loadCategories(true)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            console.log(result)
            postMultiMedia(result)
        }
    };


    const OpenImgLibrary = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            } else {
                pickImage()
            }
        }
    }

    const handleScroll = (event) => {
        var scrollY = event.nativeEvent.contentOffset.y
        if (scrollY < 560) {
            Animated.timing(TopProfileBarFadeAnim, {
                toValue: 0,
                duration: 1,
                useNativeDriver: 'true'
            }).start()
        } else {
            Animated.timing(TopProfileBarFadeAnim, {
                toValue: 1,
                duration: 1,
                useNativeDriver: 'true'
            }).start()
        }
    }

    const TopProfileBarFadeAnim = useRef(new Animated.Value(0)).current;

    const changeProfilesOptionsView = () => {
        if (ProfileOptionsViewOpen.current == true) {
            Animated.timing(ProfileOptionsViewOpacity, {
                toValue: 0,
                duration: 1,
                useNativeDriver: 'true'
            }).start()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            ProfileOptionsViewOpen.current = false;
        } else {
            Animated.timing(ProfileOptionsViewOpacity, {
                toValue: 1,
                duration: 1,
                useNativeDriver: 'true'
            }).start()
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            ProfileOptionsViewOpen.current = true;
        }
    }

    const ProfileOptionsViewMessageButtonOnPress = () => {
        if (storedCredentials) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (settingUpChat == false) {
                const forAsync = async () => {
                    setSettingUpChat(true)
                    setSettingUpChatErrorMessage(null)
                    
                    const nonce = await nacl.randomBytes(24)

                    console.log("Attempting to create a DM")
                    const url = serverUrl + "/conversations/createDirectMessage";
                    const toSend = {recipientName: profilesName, cryptographicNonce: nonce}
                    axios.post(url, toSend).then((response) => {
                        const result = response.data;
                        const {message, status, data} = result;

                        if (status !== 'SUCCESS') {
                            if (message == "Direct Message Exists") {
                                setSettingUpChat(false);
                                navigateToChatScreen()
                            } else {
                                setSettingUpChat(false);
                                setSettingUpChatErrorMessage(message)
                                setSettingUpChatErrorOrigin('creating the DM')
                            }
                        } else {
                            setSettingUpChat(false);
                            navigateToChatScreen()
                        }

                    }).catch(error => {
                        console.error(error);
                        setSettingUpChat(false);
                        setSettingUpChatErrorMessage(ParseErrorMessage(error));
                        setSettingUpChatErrorOrigin('creating the DM')
                    })
                }
                forAsync()
            }
        } else {
            navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})
        }
    }

    const navigateToChatScreen = () => {
        const url = `${serverUrl}/conversations/singleDmWithName/${profilesName}`;
        axios.get(url).then((response) => {
            const result = response.data;
            const { message, status, data } = result;

            if (status !== 'SUCCESS') {
                setSettingUpChat(false)
                setSettingUpChatErrorMessage(message)
                setSettingUpChatErrorOrigin('getting the chat info from ID')
            } else {
                console.log(data)
                setSettingUpChat(false)
                setSettingUpChatErrorMessage(null)
                setSettingUpChatErrorOrigin(null)
                navigation.navigate('ChatScreenStack', {screen: 'Chat', params: {conversationId: data.conversationId, isDirectMessage: data.isDirectMessage, members: data.members, conversationImageB64: data.conversationImageB64, conversationTitleSent: data.conversationTitle, conversationNSFW: data.conversationNSFW, conversationNSFL: data.conversationNSFL, dateCreated: data.dateCreated, lastMessage: data.lastMessage, lastMessageDate: data.lastMessageDate, cryptographicNonce: data.cryptographicNonce, conversationDescription: data.conversationDescription, unreadsMessages: data.unreadsMessages}});
                changeProfilesOptionsView()
            }

        }).catch(error => {
            console.log(error);
            setSettingUpChat(false)
            setSettingUpChatErrorMessage(ParseErrorMessage(error));
            setSettingUpChatErrorOrigin('getting the chat info from ID')
        })
    }

    const ProfileOptionsViewReportButtonOnPress = () => {
        if (pubId !== secondId) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            changeProfilesOptionsView();
            navigation.navigate('ReportAccount', {reportedAccountPubId: pubId})
        } else {
            alert('You cannot report yourself')
        }
    }

    const handleBlockUser = () => {
        if (secondId !== pubId) {
            setBlockingUser(true)
            console.log('Blocking user: ' + pubId)

            const url = serverUrl + '/tempRoute/blockaccount';
            const toSend = {userToBlockPubId: pubId};

            axios.post(url, toSend).then(response => {
                const result = response.data;
                const {message, status} = result;

                if (status !== 'SUCCESS') {
                    console.log(message);
                    alert('An error occured. Please try again.')
                    setBlockingUser(false)
                } else {
                    console.log('Successfully blocked user')
                    navigation.goBack()
                }
            }).catch(error => {
                console.error(error)
                alert(ParseErrorMessage(error))
                setBlockingUser(false)
            })
        } else {
            alert('You cannot block yourself')
        }
    }

    const GetBadgeIcon = (badge) => {
        return (
            <View style={{width: 25, height: 25, marginHorizontal: 3, marginTop: 6, marginBottom: 12}}>
                {badge.badgeName == 'onSignUpBadge' ?
                    <EvilIcons name="trophy" size={35} color={colors.tertiary} style={{marginLeft: -5, marginTop: -1}}/>
                : badge.badgeName == 'homeScreenLogoPressEasterEgg' ?
                    storedBadges.findIndex(x => x.badgeName === 'homeScreenLogoPressEasterEgg') !== -1 ?
                        <Image style={{width: 25, height: 25, tintColor: colors.tertiary}} source={require('../assets/app_icons/home.png')}/>
                    :
                        <MaterialCommunityIcons name="egg-easter" size={28} color={colors.tertiary} style={{marginLeft: -1, marginTop: -1}}/>
                :
                    <AntDesign name="questioncircleo" size={25} color={colors.tertiary}/>
                }
            </View>
        )
    }

    const BadgesArea = (badges) => {
        if (badges.length > 0) {
            return (
                <ProfileBadgesView onPress={() => navigation.navigate("AccountBadges", {name: profilesName, displayName: profilesDisplayName, badgesObject: badges, profilePictureUri: profileKey})} style={{borderColor: colors.primary}}>
                    {badges.length == 1 ?
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                        </>
                    : badges.length == 2 ?
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 31}}/>
                            {GetBadgeIcon(badges[1])}
                        </>
                    : badges.length == 3 ?
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 31}}/>
                            {GetBadgeIcon(badges[1])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 62}}/>
                            {GetBadgeIcon(badges[2])}
                        </>
                    : badges.length == 4 ?
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 31}}/>
                            {GetBadgeIcon(badges[1])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 62}}/>
                            {GetBadgeIcon(badges[2])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 93}}/>
                            {GetBadgeIcon(badges[3])}
                        </>
                    :
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 31}}/>
                            {GetBadgeIcon(badges[1])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 62}}/>
                            {GetBadgeIcon(badges[2])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 93}}/>
                            {GetBadgeIcon(badges[3])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 124}}/>
                            {GetBadgeIcon(badges[4])}
                        </>
                    }
                </ProfileBadgesView>
            )
        } else {
            return null
        }
    }

    const toggleFollowOfAUser = () => {
        if (storedCredentials) {
            setTogglingFollow(true)
            const url = `${serverUrl}/tempRoute/toggleFollowOfAUser`;
            axios.post(url, {userToFollowPubId: pubId}).then((response) => {
                const result = response.data;
                const { message, status, data } = result;

                if (status !== "SUCCESS") {
                    console.log(status + message)
                    handleMessage(message)
                    setTogglingFollow(false)
                } else {
                    console.log(status + message)
                    if (message == "Followed User") {
                        //Followed
                        setUserIsFollowed(true)
                        setTogglingFollow(false)
                    } else if (message == "Requested To Follow User") {
                        //Requested
                        setUserIsFollowed('Requested')
                        setTogglingFollow(false)
                    } else {
                        //Unfollowed or unrequested
                        setUserIsFollowed(false)
                        setTogglingFollow(false)
                        if (privateAccount == true) {
                            cancelTokenPostFormatOne.cancel()
                            cancelTokenPostFormatTwo.cancel()
                            cancelTokenPostFormatThree.cancel()
                            cancelTokenPostFormatFour.cancel()
                            cancelTokenPostFormatFive.cancel()
                        }
                    }
                }
            }).catch(error => {
                console.log(error);
                setTogglingFollow(false)
                handleMessage(ParseErrorMessage(error));
            })
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
    }

    console.log('User is followed: ' + userIsFollowed)
    console.log('Initially user followed is: ' + initiallyFollowed)

    return (
        <>
            <ActionSheet
                ref={UnfollowPrivateAccountConfirmationPickerMenu}
                title={'Are you sure you want to unfollow this user? You will have to make a follow request if you want to follow them again.'}
                options={['Unfollow', 'Cancel']}
                // Define cancel button index in the option array
                // This will take the cancel option in bottom
                // and will highlight it
                cancelButtonIndex={1}
                // Highlight any specific option
                destructiveButtonIndex={0}
                onPress={(index) => {
                    if (index == 0) {
                        toggleFollowOfAUser()
                    } else {
                        console.log('Cancelled')
                    }
                }}
            />
            <ThreeDotMenuActionSheet dispatch={dispatchImages} threeDotsMenu={images.threeDotsMenu}/>
            <ThreeDotMenuActionSheet dispatch={dispatchPolls} threeDotsMenu={polls.threeDotsMenu}/>
            <ThreeDotMenuActionSheet dispatch={dispatchThreads} threeDotsMenu={threads.threeDotsMenu}/>
            <StatusBar style={colors.StatusBarColor} />
            <Animated.View style={{opacity: ProfileOptionsViewOpacity, zIndex: ProfileOptionsViewOpacity.interpolate({inputRange: [0, 1], outputRange: [-10, 3]})}}>
                {settingUpChatErrorMessage ?
                    <ProfileOptionsView style={{backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center'}} viewHidden={false}>
                        <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10}}>An error occured while {settingUpChatErrorOrigin}</Text>
                        <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>{settingUpChatErrorMessage}</Text>
                        <ProfileOptionsViewButtons 
                            greyButton={true} 
                            onPress={() => {
                                setSettingUpChat(false)
                                setSettingUpChatErrorMessage(null)
                            }}
                        >
                            <ProfileOptionsViewButtonsText>Go back</ProfileOptionsViewButtonsText>
                        </ProfileOptionsViewButtons>
                    </ProfileOptionsView>
                : settingUpChat || blockingUser ?
                    <ProfileOptionsView style={{backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center'}} viewHidden={false}>
                        <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>Loading...</Text>
                        <ActivityIndicator size="large" color={colors.tertiary} />
                    </ProfileOptionsView>
                :
                    <ProfileOptionsView style={{backgroundColor: colors.primary, height: 500}} viewHidden={false}>
                        <ProfileOptionsViewText style={{color: colors.tertiary}}>{profilesDisplayName || "Couldn't get profile display name"}</ProfileOptionsViewText>
                        <ProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>Options</ProfileOptionsViewSubtitleText>
                        <ProfileOptionsViewButtons greyButton={true} style={{height: 'auto', paddingVertical: 10}} onPress={changeProfilesOptionsView}>
                            <ProfileOptionsViewButtonsText greyButton={true}>Cancel</ProfileOptionsViewButtonsText>
                        </ProfileOptionsViewButtons> 
                        <ProfileOptionsViewButtons greyButton={true} style={{height: 'auto', paddingVertical: 10}} onPress={ProfileOptionsViewMessageButtonOnPress}>
                            <ProfileOptionsViewButtonsText greyButton={true}>Message</ProfileOptionsViewButtonsText>
                        </ProfileOptionsViewButtons>
                        <ProfileOptionsViewButtons redButton={true} style={{height: 'auto', paddingVertical: 10}} onPress={ProfileOptionsViewReportButtonOnPress}>
                            <ProfileOptionsViewButtonsText redButton={true}>Report</ProfileOptionsViewButtonsText>
                        </ProfileOptionsViewButtons> 
                        <ProfileOptionsViewButtons redButton={true} style={{height: 'auto', paddingVertical: 10}} onPress={handleBlockUser}>
                            <ProfileOptionsViewButtonsText redButton={true}>Block</ProfileOptionsViewButtonsText>
                        </ProfileOptionsViewButtons> 
                    </ProfileOptionsView>
                }
            </Animated.View>
            <Animated.View style={{paddingTop: StatusBarHeight - 10, backgroundColor: colors.primary, borderColor: colors.borderColor, borderBottomWidth: 0, alignItems: 'center', opacity: TopProfileBarFadeAnim, zIndex: TopProfileBarFadeAnim.interpolate({inputRange: [0, 1], outputRange: [-10, 100]}), position: 'absolute', top: 0, width: '100%', flexDirection: 'column'}}>
                <>
                    <View style={{position: 'absolute', top: StatusBarHeight, left: 10}}>
                        <TouchableOpacity style={{marginRight: '75.5%'}} onPress={() => {navigation.goBack()}}>
                            <Image
                                source={require('../assets/app_icons/back_arrow.png')}
                                style={{ width: 40, height: 40, tintColor: colors.tertiary}}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <PageTitle style={{fontSize: 24, padding: 0}} welcome={true}>{profilesDisplayName || profilesName || "Couldn't get name"}</PageTitle>
                        <Avatar style={{width: 40, height: 40}} resizeMode="cover" source={{uri: profileKey}}/>
                    </View>
                    <View style={{position: 'absolute', right: 10, top: StatusBarHeight}}>
                        <TouchableOpacity onPress={changeProfilesOptionsView}>
                            <Image
                                source={require('../assets/app_icons/3dots.png')}
                                style={{ width: 40, height: 40, tintColor: colors.tertiary}}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        </TouchableOpacity>
                    </View>
                </>
            </Animated.View>
            {
                userNotFound == true ?
                    <ScrollView>
                        <ListHeaders/>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold'}}>User not found</Text>
                        </View>
                    </ScrollView>
                : privateAccount == false || (userIsFollowed === true && privateAccount == true) || (privateAccount == true && pubId === secondId) ?
                    <>
                        <ProfileGridPosts>
                            {selectedPostFormat == "One" && (<FlatList
                                data={images.posts}
                                keyExtractor={(item) => item.imageKey}
                                renderItem={({ item, index }) => <ImagePost post={item} index={index} dispatch={dispatchImages} colors={colors} colorsIndexNum={indexNum}/> }
                                ListFooterComponent={<ListFooters feedData={images} loadMoreFunction={loadImages} postFormat="image"/>}
                                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                                ListHeaderComponent={<ListHeaders/>}
                                onScroll={handleScroll}
                                scrollEventThrottle={1}
                                style={{width: '100%'}}
                                onEndReachedThreshold={3}
                                onEndReached = {({distanceFromEnd})=>{
                                    if (distanceFromEnd > 0) {
                                        console.log('End of the image post feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                        if (images.loadingFeed === false) {
                                            loadImages()
                                        }
                                    }
                                }}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
                            />)}
                            {selectedPostFormat == "Two" && (<FlatList
                                data={videos.posts}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => <PollItem pollTitle={item.pollTitle} pollSubTitle={item.pollSubTitle} optionOne={item.optionOne} optionOnesColor={item.optionOnesColor} optionOnesVotes={item.optionOnesVotes} optionOnesBarLength={item.optionOnesBarLength} optionTwo={item.optionTwo} optionTwosColor={item.optionTwosColor} optionTwosVotes={item.optionTwosVotes} optionTwosBarLength={item.optionTwosBarLength} optionThree={item.optionThree} optionThreesColor={item.optionThreesColor} optionThreesVotes={item.optionThreesVotes} optionThreesBarLength={item.optionThreesBarLength} optionFour={item.optionFour} optionFoursColor={item.optionFoursColor} optionFoursVotes={item.optionFoursVotes} optionFoursBarLength={item.optionFoursBarLength} optionFive={item.optionFive} optionFivesColor={item.optionFivesColor} optionFivesVotes={item.optionFivesVotes} optionFivesBarLength={item.optionFivesBarLength} optionSix={item.optionSix} optionSixesColor={item.optionSixesColor} optionSixesVotes={item.optionSixesVotes} optionSixesBarLength={item.optionSixesBarLength} totalNumberOfOptions={item.totalNumberOfOptions} pollUpOrDownVotes={item.pollUpOrDownVotes} pollId={item.pollId} votedFor={item.votedFor} pollLiked={item.pollLiked} pfpB64={item.pfpB64} creatorName={item.creatorName} creatorDisplayName={item.creatorDisplayName} />}
                                ListFooterComponent={<ListFooters feedData={videos} loadMoreFunction={() => {alert('Coming later')}} postFormat="video"/>}
                                ListHeaderComponent={<ListHeaders/>}
                                onScroll={handleScroll}
                                scrollEventThrottle={1}
                                style={{width: '100%'}}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
                            />)}
                            {selectedPostFormat == "Three" && (<FlatList
                                data={polls.posts}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item, index }) => <PollPost post={item} index={index} dispatch={dispatchPolls} colors={colors} colorsIndexNum={indexNum}/>}
                                ListFooterComponent={<ListFooters feedData={polls} loadMoreFunction={loadPolls} postFormat="poll"/>}
                                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                                ListHeaderComponent={<ListHeaders/>}
                                onScroll={handleScroll}
                                scrollEventThrottle={1}
                                style={{width: '100%'}}
                                onEndReachedThreshold={3}
                                onEndReached = {({distanceFromEnd})=>{
                                    if (distanceFromEnd > 0) {
                                        console.log('End of the poll feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                        if (polls.loadingFeed === false) {
                                            loadPolls()
                                        }
                                    }
                                }}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
                            />)}
                            {selectedPostFormat == "Four" && (<FlatList
                                data={threads.posts}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item, index }) => <ThreadPost post={item} index={index} dispatch={dispatchThreads} colors={colors} colorsIndexNum={indexNum}/>}
                                ListFooterComponent={<ListFooters feedData={threads} loadMoreFunction={loadThreads} postFormat="thread"/>}
                                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                                ListHeaderComponent={<ListHeaders/>}
                                onScroll={handleScroll}
                                scrollEventThrottle={1}
                                style={{width: '100%'}}
                                onEndReachedThreshold={3}
                                onEndReached = {({distanceFromEnd})=>{
                                    if (distanceFromEnd > 0) {
                                        console.log('End of the thread feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                        if (threads.loadingFeed === false) {
                                            loadThreads()
                                        }
                                    }
                                }}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
                            />)}
                            {selectedPostFormat == "Five" && (<FlatList
                                data={categories.categories}
                                keyExtractor={(item) => item.categoryId}
                                renderItem={({ item }) => <CategoryItem categoryTitle={item.categoryTitle} categoryDescription={item.categoryDescription} members={item.members} categoryTags={item.categoryTags} image={item.image} NSFW={item.NSFW} NSFL={item.NSFL} datePosted={item.datePosted} categoryId={item.categoryId}/>}
                                ListFooterComponent={<ListFooters feedData={categories} loadMoreFunction={loadCategories} categoryList/>}
                                ListHeaderComponent={<ListHeaders/>}
                                onScroll={handleScroll}
                                scrollEventThrottle={1}
                                style={{width: '100%'}}
                                onEndReachedThreshold={3}
                                onEndReached = {({distanceFromEnd})=>{
                                    if (distanceFromEnd > 0) {
                                        console.log('End of the category feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                        if (categories.loadingFeed === false) {
                                            loadCategories
                                        }
                                    }
                                }}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
                            />)}
                        </ProfileGridPosts>
                    </>
                :
                <ScrollView>
                    <ListHeaders/>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <EvilIcons name="lock" color={colors.tertiary} size={70}/>
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>This is a private account.</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Follow this account to see their posts.</Text>
                    </View>
                </ScrollView>
            }
        </>
    );
}

export default ProfilePages;
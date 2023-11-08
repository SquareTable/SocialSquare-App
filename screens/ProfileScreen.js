import React, {useCallback, useContext, useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesomeFive from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ActionSheet from 'react-native-actionsheet';
import * as MediaLibrary from 'expo-media-library';
import cloneDeep from 'lodash/cloneDeep';

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
    ConfirmLogoutButtons,
    ConfirmLogoutButtonText,
    ViewHider,
    ProfileBadgeItemUnderline
} from '../screens/screenStylings/styling.js';


// Colors
const {brand, primary, tertiary, greyish, darkLight, darkestBlue, slightlyLighterPrimary, slightlyLighterGrey, descTextColor, darkest, red, orange, yellow, green, purple} = Colors;

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//axios
import axios from 'axios';

//Image picker
import * as ImagePicker from 'expo-image-picker';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, SectionList, Image, View, ActivityIndicator, Touchable, RefreshControl, SafeAreaView, Text, Animated, useWindowDimensions, Platform, PermissionsAndroid, TouchableOpacity, FlatList } from 'react-native';

import {useTheme, useIsFocused} from "@react-navigation/native"

import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';
import { ShowAccountSwitcherContext } from '../components/ShowAccountSwitcherContext.js';
import { AllCredentialsStoredContext } from '../components/AllCredentialsStoredContext.js';
import { ServerUrlContext } from '../components/ServerUrlContext.js';

import ImagePost from '../components/Posts/ImagePost.js';
import usePostReducer from '../hooks/usePostReducer.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import PollPost from '../components/Posts/PollPost.js';
import ThreadPost from '../components/Posts/ThreadPost.js';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet.js';
import useCategoryReducer from '../hooks/useCategoryReducer.js';
import CategoryItem from '../components/Posts/CategoryItem.js';
import ParseErrorMessage from '../components/ParseErrorMessage.js';

const Welcome = ({navigation, route}) => {
    const [images, dispatchImages] = usePostReducer();
    const [videos, dispatchVideos] = usePostReducer();
    const [polls, dispatchPolls] = usePostReducer();
    const [threads, dispatchThreads] = usePostReducer();
    const [categories, dispatchCategories] = useCategoryReducer();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    if (route.params) {
        var {backButtonHidden, imageFromRoute, goToStylingMenu} = route.params;
        console.log(backButtonHidden)
        if (goToStylingMenu == true) {
            navigation.replace('SimpleStylingMenu', {ableToRefresh: false, indexNumToUse: null, backToProfileScreen: true})
        }
    } else {
        var backButtonHidden = true;
        var imageFromRoute = null;
        var goToStylingMenu = false;
    }
    const [PageElementsState, setPageElementsState] = useState(false);
    const { colors, dark, indexNum } = useTheme();
    const goToSettingsScreen = () => {
        navigation.navigate("SettingsScreen");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext);
    if (storedCredentials) {var {_id, name, displayName, email, photoUrl, followers, following, badges, secondId, bio, privateAccount} = storedCredentials}
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
    const [loadingPostsImage, setLoadingPostsImage] = useState(false)
    const [loadingPostsVideo, setLoadingPostsVideo] = useState(false)
    const [loadingPostsPoll, setLoadingPostsPoll] = useState(false)
    const [loadingPostsThread, setLoadingPostsThread] = useState(false)
    const [loadingPostsCategory, setLoadingPostsCategory] = useState(false)
    const [loadingPosts, setLoadingPosts] = useState(false)
    //ImageStuff
    const [getPfp, setGetPfp] = useState(false)
    const [getImagesOnLoad, setGetImagesOnLoad] = useState(false)
    const [changingPfp, setChangingPfp] = useState(false)
    const [loadingPfp, setLoadingPfp] = useState(false)

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
    //delete post stuff
    const [postsWithDeleteMenuOpen, setPostsWithDeleteMenuOpen] = useState()
    // Account switcher
    const {showAccountSwitcher, setShowAccountSwitcher} = useContext(ShowAccountSwitcherContext)
    const {allCredentialsStoredList, setAllCredentialsStoredList} = useContext(AllCredentialsStoredContext);
    // Top profile bar
    const TopProfileBarFadeAnim = useRef(new Animated.Value(0)).current;
    // ActionSheet menus
    let PfpSaveActionMenu = useRef();
    const PfpSaveActionMenuOptions = [
        'Change Profile Picture',
        'Cancel'
    ];
    let PfpPickerActionMenu = useRef();
    const PfpPickerActionMenuOptions = [
        'Take Photo',
        'Choose from Photo Library',
        'Cancel'
    ];
    // Server URL
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)

    const accountIndex = allCredentialsStoredList ? allCredentialsStoredList.findIndex(x => x._id === _id) : null


    const handleMessage = (message, type = 'FAILED', postNum) => {
        setMessage(message);
        setMessageType(type);
        if (postNum !== null) {
            setPostNumForMsg(postNum)
        } else {
            setPostNumForMsg(null)
        }
    }

    const ListHeaders = () => {
        return (
            <>
                <ProfInfoAreaImage>
                    {loadingPfp == false && (
                        <View style={{alignSelf: 'center', alignContent: 'center'}}>
                            <TouchableOpacity onLongPress={() => {PfpSaveActionMenu.current.show()}}>
                                {displayName != '' ?
                                    <Avatar resizeMode="cover" source={{uri: profilePictureUri}} />
                                :
                                    <Avatar resizeMode="cover" source={{uri: profilePictureUri}} style={{marginBottom: 0}} />
                                }
                            </TouchableOpacity>
                            {/*changingPfp == false && (
                                <TouchableOpacity onPress={() => {ChangePfp()}}>
                                    <SubTitle style={{marginBottom: 0, color: darkestBlue, textAlign: 'center'}}>Change</SubTitle>
                                </TouchableOpacity>
                            )*/}
                            {changingPfp == true && (
                                <ActivityIndicator size="large" color={colors.brand} style={{marginBottom: 20}} />  
                            )}
                        </View>
                    )}
                    {loadingPfp == true && (
                        <View style={{alignSelf: 'center', alignContent: 'center'}}>
                            <ActivityIndicator size={10} color={colors.brand} style={{marginBottom: 20, padding: 40, borderColor: colors.darkestBlue, borderWidth: 3, borderRadius: 150}} />  
                            <SubTitle style={{marginBottom: 0, color: colors.darkestBlue, textAlign: 'center'}}></SubTitle>
                        </View>
                    )}
                    {displayName != '' &&
                        <Text style={{paddingVertical: 0, paddingHorizontal: 10, color: colors.brand, fontSize: 35, fontWeight: 'bold'}}>{displayName || name || "Couldn't get name"}</Text>
                    }
                    {BadgesArea(badges)}
                    {bio ? <SubTitle style={{color: colors.tertiary, marginBottom: 5, fontSize: 14, textAlign: 'center'}} bioText={true}>{bio}</SubTitle> : null}
                </ProfInfoAreaImage>
                <TouchableOpacity onPress={() => {navigation.navigate('EditProfile', {imageFromRoute: null})}} style={{marginBottom: 10, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 5, borderColor: colors.tertiary, borderWidth: 2, alignSelf: 'center', width: '90%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 16, textAlign: 'center'}}>Edit Profile</Text>
                </TouchableOpacity>
                <ProfileHorizontalView>
                    <ProfileHorizontalViewItem profLeftIcon={true}>
                        <TouchableOpacity onPress={() => {navigation.navigate('ProfileStats', {type: 'Followers', followers, publicId: secondId, isSelf: true, name: displayName || name})}} style={{alignItems: 'center'}}>
                            <SubTitle style={{color: colors.tertiary}} welcome={true}> Followers </SubTitle>
                            <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png')}/>
                            <SubTitle style={{color: colors.tertiary}} welcome={true}> {followers} </SubTitle>
                        </TouchableOpacity>
                    </ProfileHorizontalViewItem>
                    <ProfileHorizontalViewItem profCenterIcon={true}>
                        <TouchableOpacity onPress={() => {navigation.navigate('ProfileStats', {type: 'Following', followers: following, publicId: secondId, isSelf: true, name: displayName || name})}} style={{alignItems: 'center'}}>
                            <SubTitle style={{color: colors.tertiary}} welcome={true}> Following </SubTitle>
                            <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png')}/>
                            <SubTitle style={{color: colors.tertiary}} welcome={true}> {following} </SubTitle>
                        </TouchableOpacity>
                    </ProfileHorizontalViewItem>
                    <ProfileHorizontalViewItem profRightIcon={true}>
                        <SubTitle style={{color: colors.tertiary}} welcome={true}> Upvotes </SubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        <SubTitle style={{color: colors.tertiary}} welcome={true}> Coming soon </SubTitle>
                    </ProfileHorizontalViewItem>
                </ProfileHorizontalView>
                <ProfileSelectMediaTypeHorizontalView>
                    <ProfileSelectMediaTypeItem onPress={changeToOne}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'One' ? colors.brand : colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{tintColor: selectedPostFormat == 'One' ? colors.brand : colors.tertiary, margin: 5}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToTwo}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Two' ? colors.brand : colors.borderColor}}>
                            <ProfileSelectMediaTypeIcons style={{tintColor: selectedPostFormat == 'Two' ? colors.brand : colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/020-film.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>                        
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToThree}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Three' ? colors.brand : colors.borderColor}}>     
                            <ProfileSelectMediaTypeIcons style={{tintColor: selectedPostFormat == 'Three' ? colors.brand : colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/157-stats-bars.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>     
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToFour}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Four' ? colors.brand : colors.borderColor}}>     
                            <ProfileSelectMediaTypeIcons style={{height: '80%', width: '80%', tintColor: selectedPostFormat == 'Four' ? colors.brand : colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/007-pencil2.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>     
                    </ProfileSelectMediaTypeItem>
                    <ProfileSelectMediaTypeItem onPress={changeToFive}>
                        <ProfileSelectMediaTypeIconsBorder style={{backgroundColor: colors.borderColor, borderColor: selectedPostFormat == 'Five' ? colors.brand : colors.borderColor}}>     
                            <ProfileSelectMediaTypeIcons style={{height: '80%', width: '80%', tintColor: selectedPostFormat == 'Five' ? colors.brand : colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png')}/>
                        </ProfileSelectMediaTypeIconsBorder>     
                    </ProfileSelectMediaTypeItem>
                </ProfileSelectMediaTypeHorizontalView>
            </>
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
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>{displayName || name} isn't a part of any categories.</Text>
                    :
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>{displayName || name} has no {postFormat}s.</Text>
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
    const toSendProfileName = {pubId: secondId};

    //get image of post
    async function getImageInPost(imageData, index) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageData[index].imageKey), { cancelToken: source.token})
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingPosts(false)
            console.log("Either an error or cancelled.");
        })
    }
    //profile image of creator
    async function getImageInPfp(imageData, index) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageData[index].creatorPfpKey), { cancelToken: source.token})
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingPosts(false)
            console.log("Either an error or cancelled.");
        })
    }
    async function getImageInCategory(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { cancelToken: cancelTokenPostFormatFive.token})
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingPosts(false)
            console.log("Either an error or cancelled.");
        })
    }
    //any image honestly
    async function getImageWithKeyOne(imageKey) {
            return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { cancelToken: cancelTokenPostFormatOne.token})
            .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
                console.log(error);
                //setSubmitting(false);
                setLoadingPostsImage(false)
                console.log("Either an error or cancelled.");
            })
    }
    async function getImageWithKeyTwo(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { cancelToken: cancelTokenPostFormatTwo.token})
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingPostsVideo(false)
            console.log("Either an error or cancelled.");
        })
    }
    async function getImageWithKeyThree(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { cancelToken: cancelTokenPostFormatThree.token})
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingPostsPoll(false)
            console.log("Either an error or cancelled.");
        })
    }
    async function getImageWithKeyFour(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { cancelToken: cancelTokenPostFormatFour.token})
        .then(res => 'data:image/jpeg;base64,' + res.data).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingPostsThread(false)
            console.log("Either an error or cancelled.");
        })
    }
    async function getImageWithKeyFive(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { cancelToken: cancelTokenPostFormatFive.token})
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
                            creatorPfpB64: profilePictureUri,
                            upvoted: data.upvoted,
                            downvoted: data.downvoted,
                            isOwner: data.isOwner,
                            _id: data._id,
                            creatorPublicId: data.creatorPublicId
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

            const toSend = {pubId: secondId};

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
                
                var tempSectionsTemp = {_id: pollData[index]._id, pollTitle: pollData[index].pollTitle, pollSubTitle: pollData[index].pollSubTitle, optionOne: pollData[index].optionOne, optionOnesColor: pollData[index].optionOnesColor, optionOnesVotes: pollData[index].optionOnesVotes, optionOnesBarLength: optionOnesBarLength, optionTwo: pollData[index].optionTwo, optionTwosColor: pollData[index].optionTwosColor, optionTwosVotes: pollData[index].optionTwosVotes, optionTwosBarLength: optionTwosBarLength, optionThree: pollData[index].optionThree, optionThreesColor: pollData[index].optionThreesColor, optionThreesVotes: pollData[index].optionThreesVotes, optionThreesBarLength: optionThreesBarLength, optionFour: pollData[index].optionFour, optionFoursColor: pollData[index].optionFoursColor, optionFoursVotes: pollData[index].optionFoursVotes, optionFoursBarLength: optionFoursBarLength, optionFive: pollData[index].optionFive, optionFivesColor: pollData[index].optionFivesColor, optionFivesVotes: pollData[index].optionFivesVotes, optionFivesBarLength:optionFivesBarLength, optionSix: pollData[index].optionSix, optionSixesColor: pollData[index].optionSixesColor, optionSixesVotes: pollData[index].optionSixesVotes, optionSixesBarLength: optionSixesBarLength, totalNumberOfOptions: pollData[index].totalNumberOfOptions, votes: pollData[index].votes, pollId: pollData[index]._id, votedFor: pollData[index].votedFor, postNum: index, comments: pollData[index].comments, creatorName: pollData[index].creatorName, creatorDisplayName: pollData[index].creatorDisplayName, datePosted: pollData[index].datePosted, upvoted: pollData[index].upvoted, downvoted: pollData[index].downvoted, pfpB64: profilePictureUri, isOwner: pollData[index].isOwner, creatorPublicId: pollData[index].creatorPublicId}
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

            const toSend = {pubId: secondId};

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
                                creatorImageB64: profilePictureUri,
                                isOwner: threadData[index].isOwner,
                                creatorPublicId: threadData[index].creatorPublicId,
                                categoryImageKey: threadData[index].categoryImageKey,
                                categoryId: threadData[index].categoryId
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
                                creatorImageB64: profilePictureUri,
                                isOwner: threadData[index].isOwner,
                                creatorPublicId: threadData[index].creatorPublicId,
                                categoryImageKey: threadData[index].categoryImageKey,
                                categoryId: threadData[index].categoryId
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
            console.error('An error occurred while loading threads from ProfileScreen.js:', error)
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

            const toSend = {pubId: secondId};

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

            const toSend = {pubId: secondId};

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

    if (getImagesOnLoad == false) {
        changeToOne()
        setGetImagesOnLoad(true)
    }

    const getProfilePicture = () => {
        if (storedCredentials) {
            const url = serverUrl + '/tempRoute/getProfilePic/' + storedCredentials.name;

            axios.get(url).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    console.log('GETTING PROFILE PICTURE FOR PROFILESCREEN.JS WAS NOT A SUCCESS')
                    console.log(status)
                    console.log(message)
                } else {
                    console.log(status)
                    console.log(message)
                    axios.get(`${serverUrl}/getImageOnServer/${data}`)
                    .then((response) => {
                        const result = response.data;
                        const {message, status, data} = result;
                        console.log(status)
                        console.log(message)
                        console.log(data)
                        //set image
                        if (message == 'No profile image.' && status == 'FAILED') {
                            console.log('Setting logo to SocialSquare logo')
                            setProfilePictureUri(SocialSquareLogo_B64_png)
                            setChangingPfp(false)
                            const temp = allCredentialsStoredList;
                            temp[accountIndex].profilePictureUri = SocialSquareLogo_B64_png;
                            setAllCredentialsStoredList(temp)
                            AsyncStorage.setItem('socialSquare_AllCredentialsList', JSON.stringify(temp));
                        } else if (data) {
                            //convert back to image
                            console.log('Setting logo in tab bar to profile logo')
                            var base64Icon = `data:image/jpg;base64,${data}`
                            setProfilePictureUri(base64Icon)
                            setChangingPfp(false)
                            const temp = allCredentialsStoredList;
                            temp[accountIndex].profilePictureUri = base64Icon;
                            setAllCredentialsStoredList(temp)
                            AsyncStorage.setItem('socialSquare_AllCredentialsList', JSON.stringify(temp));
                        } else {
                            console.log('Setting logo to SocialSquare logo')
                            setProfilePictureUri(SocialSquareLogo_B64_png)
                            setChangingPfp(false)
                            const temp = allCredentialsStoredList;
                            temp[accountIndex].profilePictureUri = SocialSquareLogo_B64_png;
                            setAllCredentialsStoredList(temp)
                            AsyncStorage.setItem('socialSquare_AllCredentialsList', JSON.stringify(temp));
                        }
                    })
                    .catch(function (error) {
                        console.log("Image not recieved")
                        console.log(error);
                    });
                }
                //setSubmitting(false);

            }).catch(error => {
                console.error(error);
            })
        }
    }

    const uploadPFP = (image) => {
        const formData = new FormData();
        formData.append("image", {
            name: image.uri.substr(image.uri.lastIndexOf('/') + 1),
            uri: image.uri,
            type: 'image/jpg'
        })

        const url = serverUrl + '/tempRoute/postProfileImage';
        setChangingPfp(true)
        axios.post(url, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setChangingPfp(false)
                console.log(message)
                alert("An error occured while changing your profile picture.")
            } else {
                console.log(data)
                handleMessage(message, status)
                getProfilePicture()
                //persistLogin({...data[0]}, message, status);
            }

        }).catch(error => {
            console.log(error);
            setChangingPfp(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        
        if (!result.canceled) {
            console.log(result)
            uploadPFP(result)
        }
    };

        
    const OpenImgLibrary = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work! Go into Settings and allow SocialSquare to use camera roll permissions to get this to work.');
            } else {
                pickImage()
            }
        }
    }

    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = useCallback((reloadFeeds) => {
        if (reloadFeeds) {
            if (selectedPostFormat === "One") {
                changeToOne();
            } else if (selectedPostFormat === "Two") {
                changeToTwo();
            } else if (selectedPostFormat === "Three") {
                changeToThree();
            } else if (selectedPostFormat === "Four") {
                changeToFour();
            } else if (selectedPostFormat === "Five") {
                changeToFive();
            }
        }
        
        setRefreshing(true)
        // Get data here
        console.log("HI")
        const url = serverUrl + '/tempRoute/reloadProfileEssentials';
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                console.log("FAILED, " + message)
                setRefreshing(false)
            } else {
                const finishedIdentifying = (finalToSet, didAnErrorOccur) => {
                    console.log("Finished Identifying.")
                    if (finalToSet !== storedCredentials) {
                        if (didAnErrorOccur == false) {
                            setStoredCredentials(finalToSet)
                            console.log("Successfully refreshed.")
                            handleMessage("Successfully refreshed.", "SUCCESS")
                        } else {
                            setStoredCredentials(finalToSet)
                            console.log("Changes but may have not refreshed correctly.")
                            handleMessage("Changes but may have not refreshed correctly.", "SUCCESS")
                        }
                    } else {
                        if (didAnErrorOccur == false) {
                            console.log("Nothing changed refresh complete.")
                            handleMessage("Nothing changed refresh complete.", "SUCCESS")
                        } else {
                            console.log("Nothing changed but this may be due to an error.")
                            handleMessage("Nothing changed but this may be due to an error.", "FAILED")
                        }
                    }
                    setRefreshing(false)
                }
                //
                //console.log(data)
                //Originally this was cloneDeep(storedCredentials) but that triggered the "Switched account to account-name" animation so now I've changed it to not clone the array
                let toSetAsStoredCredentials = storedCredentials
                let itemsProcessed = 0;
                let errorWhileRefreshing = false
                const dataKeys = Object.keys(data)
                dataKeys.forEach(function(key) {
                    console.log("HELLO1")
                    try {
                        if (toSetAsStoredCredentials[key] !== data[key]) {
                            console.log("HELLO2")
                            toSetAsStoredCredentials[key] = data[key]
                            itemsProcessed++;
                            if (itemsProcessed == dataKeys.length) {
                                finishedIdentifying(toSetAsStoredCredentials, errorWhileRefreshing)
                            }
                        } else {
                            console.log("HELLO3")
                            itemsProcessed++;
                            if (itemsProcessed == dataKeys.length) {
                                finishedIdentifying(toSetAsStoredCredentials, errorWhileRefreshing)
                            }
                        }
                    } catch (err) {
                        itemsProcessed++;
                        console.log("An error occured while refreshing. " + err)
                        if (itemsProcessed == dataKeys.length) {
                            finishedIdentifying(toSetAsStoredCredentials, errorWhileRefreshing)
                        }
                    }
                })
            }

        }).catch(error => {
            console.log(error);
            setRefreshing(false)
            handleMessage(ParseErrorMessage(error));
        })
    })

    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            onRefresh()
        }
    }, [isFocused])

    const handleScroll = (event) => {
        var scrollY = event.nativeEvent.contentOffset.y
        if (scrollY < 550) {
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

    const checkForCameraPermissions = () => {
        navigation.navigate('TakeImage_Camera', {locationToGoTo: 'Welcome'})
    }

    useEffect(() => {
        if (imageFromRoute != null) {
            console.log('Image received from imageFromRoute')
            console.log(imageFromRoute)
            uploadPFP(imageFromRoute)
            navigation.setParams({imageFromRoute: null})
        }
    })

    const GetBadgeIcon = (badge) => {
        return (
            <View style={{width: 25, height: 25, marginHorizontal: 3, marginTop: 6, marginBottom: 12}}>
                {badge.badgeName == 'onSignUpBadge' ?
                    <EvilIcons name="trophy" size={35} color={colors.tertiary} style={{marginLeft: -5, marginTop: -1}}/>
                : badge.badgeName == 'homeScreenLogoPressEasterEgg' ?
                    <Image style={{width: 25, height: 25, tintColor: colors.tertiary}} source={require('../assets/app_icons/home.png')}/>
                :
                    <AntDesign name="questioncircleo" size={25} color={colors.tertiary}/>
                }
            </View>
        )
    }

    const BadgesArea = (badges) => {
        if (badges?.length > 0) {
            return (
                <ProfileBadgesView onPress={() => navigation.navigate("AccountBadges", {name: name, displayName: displayName, badgesObject: badges, profilePictureUri: profilePictureUri})} style={{borderColor: colors.primary}}>
                    {badges?.length == 1 ?
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                        </>
                    : badges?.length == 2 ?
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 31}}/>
                            {GetBadgeIcon(badges[1])}
                        </>
                    : badges?.length == 3 ?
                        <>
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary}}/>
                            {GetBadgeIcon(badges[0])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 31}}/>
                            {GetBadgeIcon(badges[1])}
                            <ProfileBadgeItemUnderline style={{backgroundColor: colors.tertiary, left: 62}}/>
                            {GetBadgeIcon(badges[2])}
                        </>
                    : badges?.length == 4 ?
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

    console.log(followers)
    return(
        <>
            <ThreeDotMenuActionSheet dispatch={dispatchImages} threeDotsMenu={images.threeDotsMenu}/>
            <ThreeDotMenuActionSheet dispatch={dispatchPolls} threeDotsMenu={polls.threeDotsMenu}/>
            <ThreeDotMenuActionSheet dispatch={dispatchThreads} threeDotsMenu={threads.threeDotsMenu}/>
            <StatusBar style={colors.StatusBarColor}/>
            {storedCredentials ?
                <>
                    <>
                        <ActionSheet
                            ref={PfpSaveActionMenu}
                            title={'Profile Picture Options'}
                            options={PfpSaveActionMenuOptions}
                            // Define cancel button index in the option array
                            // This will take the cancel option in bottom
                            // and will highlight it
                            cancelButtonIndex={2}
                            // Highlight any specific option
                            //destructiveButtonIndex={2}
                            onPress={(index) => {
                                if (index == 0) {
                                    PfpPickerActionMenu.current.show();
                                } else if (index == 1) {
                                    console.log('Cancelling')
                                }
                            }}
                        />
                    </>
                    <>
                        <ActionSheet
                            ref={PfpPickerActionMenu}
                            title={'How would you like to choose your profile picture?'}
                            options={PfpPickerActionMenuOptions}
                            // Define cancel button index in the option array
                            // This will take the cancel option in bottom
                            // and will highlight it
                            cancelButtonIndex={2}
                            // Highlight any specific option
                            //destructiveButtonIndex={2}
                            onPress={(index) => {
                                if (index == 0) {
                                    checkForCameraPermissions()
                                } else if (index == 1) {
                                    OpenImgLibrary()
                                } else if (index == 2) {
                                    console.log('Closing action picker')
                                }
                            }}
                        />
                    </>
                    <TouchableOpacity onPress={() => {setShowAccountSwitcher(true)}} style={{backgroundColor: colors.primary, paddingTop: StatusBarHeight, paddingBottom: 10, flexDirection: 'row', justifyContent: 'center'}}>
                        {privateAccount == true ? <EvilIcons name="lock" size={30} color={colors.tertiary}/> : null}
                        <SubTitle style={{color: colors.tertiary, marginBottom: 0, textAlign: 'center'}}>{"@"+name}</SubTitle>
                    </TouchableOpacity>
                    <Animated.View style={{paddingTop: StatusBarHeight - 10, backgroundColor: colors.primary, borderColor: colors.borderColor, borderBottomWidth: 1, alignItems: 'center', opacity: TopProfileBarFadeAnim, zIndex: TopProfileBarFadeAnim.interpolate({inputRange: [0, 1], outputRange: [-10, 100]}), position: 'absolute', top: 0, width: '100%', flexDirection: 'column'}}>
                        <>
                            {backButtonHidden == false &&
                                <View style={{position: 'absolute', top: StatusBarHeight, left: 10}}>
                                    <TouchableOpacity style={{marginRight: '75.5%'}} disabled={PageElementsState} onPress={() => {navigation.goBack()}}>
                                        <Image
                                            source={require('../assets/app_icons/back_arrow.png')}
                                            style={{ width: 40, height: 40, tintColor: colors.tertiary}}
                                            resizeMode="contain"
                                            resizeMethod="resize"
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => {setShowAccountSwitcher(true)}}>
                                    <PageTitle style={{fontSize: 24, padding: 0, color: colors.brand}}>{displayName || name || "Couldn't get name"}</PageTitle>
                                </TouchableOpacity>
                                <Avatar style={{width: 40, height: 40}} resizeMode="cover" source={{uri: profilePictureUri}}/>
                            </View>
                            {/*
                            <View style={{position: 'absolute', right: 10, top: StatusBarHeight}}>
                                <TouchableOpacity disabled={PageElementsState} onPress={goToSettingsScreen}>
                                    <Image
                                        source={require('../assets/app_icons/settings.png')}
                                        style={{ width: 40, height: 40, tintColor: colors.tertiary}}
                                        resizeMode="contain"
                                        resizeMethod="resize"
                                    />
                                </TouchableOpacity>
                            </View>
                            */}
                        </>
                    </Animated.View>
                    <ProfileGridPosts>
                        {selectedPostFormat == "One" && (<FlatList
                            data={images.posts}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item, index }) => <ImagePost post={item} index={index} dispatch={dispatchImages} colors={colors} colorsIndexNum={indexNum}/>}
                            ListFooterComponent={<ListFooters feedData={images} loadMoreFunction={loadImages} postFormat="image"/>}
                            ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                            ListHeaderComponent={ListHeaders}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(true)} />}
                            onScroll={handleScroll}
                            scrollEventThrottle={1}
                            style={{width: '100%'}}
                            onEndReachedThreshold={3}
                            onEndReached = {({distanceFromEnd})=>{
                                if (distanceFromEnd > 0) {
                                    console.log('End of the image feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                    if (images.loadingFeed === false) {
                                        loadImages()
                                    }
                                }
                            }}
                        />)}
                        {selectedPostFormat == "Two" && (<FlatList
                            data={videos.posts}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => <PollItem pollTitle={item.pollTitle} pollSubTitle={item.pollSubTitle} optionOne={item.optionOne} optionOnesColor={item.optionOnesColor} optionOnesVotes={item.optionOnesVotes} optionOnesBarLength={item.optionOnesBarLength} optionTwo={item.optionTwo} optionTwosColor={item.optionTwosColor} optionTwosVotes={item.optionTwosVotes} optionTwosBarLength={item.optionTwosBarLength} optionThree={item.optionThree} optionThreesColor={item.optionThreesColor} optionThreesVotes={item.optionThreesVotes} optionThreesBarLength={item.optionThreesBarLength} optionFour={item.optionFour} optionFoursColor={item.optionFoursColor} optionFoursVotes={item.optionFoursVotes} optionFoursBarLength={item.optionFoursBarLength} optionFive={item.optionFive} optionFivesColor={item.optionFivesColor} optionFivesVotes={item.optionFivesVotes} optionFivesBarLength={item.optionFivesBarLength} optionSix={item.optionSix} optionSixesColor={item.optionSixesColor} optionSixesVotes={item.optionSixesVotes} optionSixesBarLength={item.optionSixesBarLength} totalNumberOfOptions={item.totalNumberOfOptions} pollUpOrDownVotes={item.pollUpOrDownVotes} pollId={item.pollId} votedFor={item.votedFor} pollLiked={item.pollLiked} pfpB64={item.pfpB64} creatorName={item.creatorName} creatorDisplayName={item.creatorDisplayName} postsWithDeleteMenuOpen={postsWithDeleteMenuOpen} profilePictureUri={profilePictureUri}/>}
                            ListFooterComponent={<ListFooters feedData={videos} loadMoreFunction={() => {alert('Coming later')}} postFormat="video"/>}
                            ListHeaderComponent={ListHeaders}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(true)} />}
                            onScroll={handleScroll}
                            scrollEventThrottle={1}
                            style={{width: '100%'}}
                        />)}
                        {selectedPostFormat == "Three" && (<FlatList
                            data={polls.posts}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item, index }) => <PollPost post={item} index={index} dispatch={dispatchPolls} colors={colors} colorsIndexNum={indexNum}/>}
                            ListFooterComponent={<ListFooters feedData={polls} loadMoreFunction={loadPolls} postFormat="poll"/>}
                            ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                            onEndReachedThreshold={3}
                            onEndReached = {({distanceFromEnd})=>{
                                if (distanceFromEnd > 0) {
                                    console.log('End of the poll feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                    if (polls.loadingFeed === false) {
                                        loadPolls()
                                    }
                                }
                            }}
                            ListHeaderComponent={ListHeaders}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(true)} />}
                            onScroll={handleScroll}
                            scrollEventThrottle={1}
                            style={{width: '100%'}}
                        />)}
                        {selectedPostFormat == "Four" && (<FlatList
                            data={threads.posts}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item, index }) => <ThreadPost post={item} index={index} dispatch={dispatchThreads} colors={colors} colorsIndexNum={indexNum}/>}
                            ListFooterComponent={<ListFooters feedData={threads} loadMoreFunction={loadThreads} postFormat="thread"/>}
                            ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                            ListHeaderComponent={ListHeaders}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(true)} />}
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
                        />)}
                        {selectedPostFormat == "Five" && (<FlatList
                            data={categories.categories}
                            keyExtractor={(item) => item.categoryId}
                            renderItem={({ item }) => <CategoryItem categoryTitle={item.categoryTitle} categoryDescription={item.categoryDescription} members={item.members} categoryTags={item.categoryTags} image={item.image} NSFW={item.NSFW} NSFL={item.NSFL} datePosted={item.datePosted} categoryId={item.categoryId}/>}
                            ListFooterComponent={<ListFooters feedData={categories} loadMoreFunction={loadCategories} categoryList/>}
                            ListHeaderComponent={ListHeaders}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(true)} />}
                            onScroll={handleScroll}
                            scrollEventThrottle={1}
                            style={{width: '100%'}}
                            onEndReachedThreshold={3}
                            onEndReached = {({distanceFromEnd})=>{
                                if (distanceFromEnd > 0) {
                                    console.log('End of the categories feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                    if (categories.loadingFeed === false) {
                                        loadCategories()
                                    }
                                }
                            }}
                        />)}
                    </ProfileGridPosts>
                </>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to access your profile screen</Text>
                    <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                        <ButtonText> Login </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                            <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    );
}

export default Welcome;
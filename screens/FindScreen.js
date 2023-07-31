import React, {useContext, useEffect, useState, useRef, memo, PureComponent} from 'react';
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
    Colors,
    Avatar,
    StyledContainer,
    StyledInputLabel,
    StyledTextInput,
    SearchBarArea,
    LeftIcon,
    SearchHorizontalView,
    SearchHorizontalViewItem,
    SearchHorizontalViewItemCenter,
    SearchSubTitle,
    ProfIcons,
    SearchUserViewItemCenter,
    SearchFrame,
    PostIcons
} from './screenStylings/styling.js';

// Colors
const {brand, primary, tertiary, greyish, darkLight, slightlyLighterGrey, midWhite, red} = Colors;

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, View, SectionList, ActivityIndicator, Text, SafeAreaView, Keyboard, FlatList, useWindowDimensions } from 'react-native';

// formik
import {Formik} from 'formik';

//axios
import axios, { CanceledError } from 'axios';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { ExperimentalFeaturesEnabledContext } from '../components/ExperimentalFeaturesEnabledContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';

class UserItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        /* OLD DESIGN
            <SearchFrame onPress={() => navigation.navigate("ProfilePages", {profilesName: name, profilesDisplayName: displayName, following: following, followers: followers, totalLikes: totalLikes, profileKey: profileKey != null ? `data:image/jpg;base64,${profileKey}` : SocialSquareLogo_B64_png, badges: badges})}>
                {profileKey !== null && (
                    <Avatar resizeMode="cover" searchPage={true} source={{uri: profileKey}} />
                )}
                {profileKey == null && (
                    <Avatar resizeMode="cover" searchPage={true} source={require('./../assets/img/Logo.png')} />
                )}
                <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{name}</SubTitle>
                <SubTitle searchResTitleDisplayName={true} style={{color: brand}}>@{displayName}</SubTitle>
                <SearchHorizontalView>
                    <SearchHorizontalViewItem>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> Following </SearchSubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> {following.length} </SearchSubTitle>
                    </SearchHorizontalViewItem>

                    <SearchHorizontalViewItemCenter>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> Followers </SearchSubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> {followers.length} </SearchSubTitle>
                    </SearchHorizontalViewItemCenter>

                    <SearchHorizontalViewItem>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> Total Likes </SearchSubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> {totalLikes} </SearchSubTitle>
                    </SearchHorizontalViewItem>
                </SearchHorizontalView>
            </SearchFrame>
        */
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ProfilePages", {profilesName: this.props.name, profilesDisplayName: this.props.displayName, following: this.props.following, followers: this.props.followers, totalLikes: this.props.totalLikes, profileKey: this.props.profileKey != null ? this.props.profileKey : SocialSquareLogo_B64_png, badges: this.props.badges, pubId: this.props.pubId, bio: this.props.bio, privateAccount: this.props.privateAccount})} style={{borderColor: this.props.colors.darkLight, flexDirection: 'row', width: '100%', padding: 5}}>
                <View style={{alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'row'}}>
                    <Avatar style={{width: 60, height: 60, marginBottom: 5, marginTop: 5}} resizeMode="cover" searchPage={true} source={{uri: this.props.profileKey != null ? this.props.profileKey : SocialSquareLogo_B64_png}} />
                    <SubTitle style={{color: this.props.colors.tertiary, marginTop: 24, marginLeft: 10}} searchResTitle={true}>{this.props.displayName || this.props.name}</SubTitle>
                </View>
            </TouchableOpacity>
        )
    }
}

class CategoryItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SearchFrame onPress={() => this.props.navigation.navigate("CategoryViewPage", {categoryTitle: this.props.categoryTitle, NSFL: this.props.NSFL, NSFW: this.props.NSFW, allowScreenShots: (this.props.allowScreenShots != undefined ? this.props.allowScreenShots : true), categoryId: this.props.categoryId})}>
                <Avatar resizeMode="cover" searchPage={true} source={{uri: this.props.image != undefined && this.props.image != null && this.props.image != '' ? this.props.image : SocialSquareLogo_B64_png}} />
                {this.props.NSFW == false && (
                    <View>
                        {this.props.NSFL == false && (
                            <SubTitle style={{color: this.props.colors.tertiary}} searchResTitle={true}>{this.props.categoryTitle}</SubTitle>
                        )}
                        {this.props.NSFL == true && (
                            <View style={{flexDirection: 'row'}}>
                                <SubTitle searchResTitle={true} style={{color: red}}>(NSFL) </SubTitle>
                                <SubTitle style={{color: this.props.colors.tertiary}} searchResTitle={true}>{this.props.categoryTitle}</SubTitle>
                            </View>
                        )}
                    </View>
                )}
                {this.props.NSFW == true && (
                    <View style={{flexDirection: 'row'}}>
                        <SubTitle searchResTitle={true} style={{color: red}}>(NSFW) </SubTitle>
                        <SubTitle style={{color: this.props.colors.tertiary}} searchResTitle={true}>{this.props.categoryTitle}</SubTitle>
                    </View>
                )}
                <SubTitle style={{color: this.props.colors.tertiary, textAlign: 'center'}} searchResTitleDisplayName={true}>{this.props.categoryDescription}</SubTitle>
                <SubTitle searchResTitleDisplayName={true} style={{color: this.props.colors.brand}}>{this.props.categoryTags}</SubTitle>
                <SearchHorizontalView>
                    <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                        <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> Members </SearchSubTitle>
                        <ProfIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png')}/>
                        {this.props.members == 0 && ( 
                            <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> 0 </SearchSubTitle>
                        )}
                        {this.props.members !== 0 && ( 
                            <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> {this.props.members} </SearchSubTitle>
                        )}
                    </SearchHorizontalViewItemCenter>
                    <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                        <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> Date Created </SearchSubTitle>
                        <ProfIcons style={{flex: 1, tintColor: this.props.colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/084-calendar.png')}/>
                        <SearchSubTitle welcome={true} style={{flex: 1, color: this.props.colors.tertiary}}> {this.props.datePosted} </SearchSubTitle>
                    </SearchHorizontalViewItemCenter>
                </SearchHorizontalView>
            </SearchFrame>
        )
    }
}

const FindScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {experimentalFeaturesEnabled, setExperimentalFeaturesEnabled} = useContext(ExperimentalFeaturesEnabledContext)
    const [filterFormatSearch, setFilterFormatSearch] = useState("Users")
    var submitting = false;
    const [foundAmount, setFoundAmount] = useState();
    const [changeSectionsOne, setChangeSectionsOne] = useState([])
    const [changeSectionsTwo, setChangeSectionsTwo] = useState([])
    const [loadingOne, setLoadingOne] = useState(false)
    const [loadingTwo, setLoadingTwo] = useState(false)
    const [noResults, setNoResults] = useState(false);
    const [errorOccured, setErrorOccured] = useState(null)
    const searchValue = useRef(null);
    let cancelTokenPostFormatOne = axios.CancelToken.source();
    let cancelTokenPostFormatTwo = axios.CancelToken.source();
    const {serverUrl, setServerurl} = useContext(ServerUrlContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {height, width} = useWindowDimensions();
    const userListHeight = useRef(null);
    const debounceTimeout = useRef(null);
    const abortControllerRef = useRef(new AbortController())

    useEffect(() => {
        if (typeof userListHeight.current === 'number' && height > userListHeight.current && !noResults && filterFormatSearch === "Users" && searchValue.current !== "" && searchValue.currrent !== null) {
            handleUserSearch(searchValue.current)
        }
    }, [height, changeSectionsOne, filterFormatSearch])

    useEffect(() => {
        return () => {
            if (abortControllerRef.current instanceof AbortController) {
                abortControllerRef.current.abort();
                console.warn('Aborted as Find Screen was unmounted')
            }
        }
    }, [])

    //any image honestly
    async function getImageWithKeyOne(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { signal: abortControllerRef.current.signal})
        .then(res => 'data:image/jpeg;base64,' + res.data)
    }

    const handleUserSearch = (val, clear) => {
        if (loadingOne !== true) {
            setNoResults(false)
            if (val !== "") {
                const layoutUsersFound = (data) => {
                    setFoundAmount("Poll Comments:")
                    var allData = data
                    console.log(allData)
                    console.log(allData.length)
                    const tempSections = clear ? [] : [...changeSectionsOne];
                    var itemsProcessed = 0;
                    allData.forEach(function (item, index) {
                        if (allData[index].profileKey !== "") {
                            async function asyncFunctionForImages() {
                                const displayName = allData[index].displayName === "" ? allData[index].name : allData[index].displayName
                                let imageInPfpB64
                                try {
                                    imageInPfpB64 = await getImageWithKeyOne(allData[index].profileKey)
                                } catch (error) {
                                    alert(error instanceof CanceledError)
                                    if (error instanceof CanceledError) {
                                        console.warn('Cancelled intentionally')
                                    } else {
                                        console.error(error)
                                    }
                                }
                                var tempSectionsTemp = {name: allData[index].name, displayName: displayName, followers: allData[index].followers, following: allData[index].following, totalLikes: allData[index].totalLikes, profileKey: imageInPfpB64, badges: allData[index].badges, pubId: allData[index].pubId, bio: allData[index].bio, privateAccount: allData[index].privateAccount}
                                tempSections.push(tempSectionsTemp)
                                itemsProcessed++;
                                if(itemsProcessed === allData.length) {
                                    setLoadingOne(false)
                                    setChangeSectionsOne(tempSections)
                                }
                            }
                            asyncFunctionForImages()
                        } else {
                            const displayName = allData[index].displayName === "" ? allData[index].name : allData[index].displayName
                            var tempSectionsTemp = {name: allData[index].name, displayName: displayName, followers: allData[index].followers, following: allData[index].following, totalLikes: allData[index].totalLikes, profileKey: null, badges: allData[index].badges, pubId: allData[index].pubId, bio: allData[index].bio, privateAccount: allData[index].privateAccount}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === allData.length) {
                                setLoadingOne(false)
                                setChangeSectionsOne(tempSections)
                            }
                        }
                    });
                }

                setLoadingOne(true)
                setErrorOccured(null);
                const url = serverUrl + '/tempRoute/searchpageusersearch';
                const toSend = {
                    val,
                    skip: clear ? 0 : changeSectionsOne.length
                }
                submitting = true;
                axios.post(url, toSend, {signal: abortControllerRef.current.signal}).then((response) => {
                    const result = response.data;
                    const {message, status, data} = result;

                    if (status !== 'SUCCESS') {
                        setErrorOccured(message)
                        setLoadingOne(false)
                        setNoResults(false)
                        console.error(message)
                    } else {
                        console.log(data)
                        layoutUsersFound(data)
                        console.log('Search complete.')
                        setNoResults(false)
                        //persistLogin({...data[0]}, message, status);
                    }
                    submitting = false;

                }).catch(error => {
                    if (error instanceof CanceledError) {
                        console.warn('Cancelled intentionally')
                    } else {
                        console.error(error);
                        console.log(error?.response?.data?.message)
                        submitting = false;
                        setLoadingOne(false)
                        setErrorOccured(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
                        setNoResults(false)
                    }
                })
            } else {
                console.log('Empty search')
                setNoResults(false)
                setChangeSectionsOne([])
            }
        }
    }

    async function getImageInCategory(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { signal: abortControllerRef.current.signal})
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }

    const handleCategorySearch = (val) => {
        if (val !== "") {
            setChangeSectionsTwo([])
            setNoResults(false)
            const layoutCategoriesFound = (data) => {
                setFoundAmount("Poll Comments:")
                var allData = data
                console.log(allData)
                console.log(allData.length)
                var tempSections = []
                var itemsProcessed = 0;
                allData.forEach(function (item, index) {
                    if (allData[index].imageKey !== "") {   
                        async function asyncFunctionForImages() {
                            const imageB64 = await getImageInCategory(allData[index].imageKey)
                            var tempSectionsTemp = {data: [{categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: imageB64, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots, categoryId: allData[index].categoryId}]}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === allData.length) {
                                setChangeSectionsTwo(tempSections)
                                setLoadingTwo(false)
                            }
                        }
                        asyncFunctionForImages()
                    } else {     
                        var tempSectionsTemp = {data: [{categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: null, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots, categoryId: allData[index].categoryId}]}
                        tempSections.push(tempSectionsTemp)
                        itemsProcessed++;
                        if(itemsProcessed === allData.length) {
                            setChangeSectionsTwo(tempSections)
                            setLoadingTwo(false)
                        }
                    }
                });
            }

            setLoadingTwo(true)
            setErrorOccured(null)
            const url = serverUrl + '/tempRoute/searchpagesearchcategories'
            const toSend = {
                val
            }
            submitting = true;
            axios.post(url, toSend, {signal: abortControllerRef.current.signal}).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    if (message === 'No results') {
                        setNoResults(true)
                        setLoadingTwo(false)
                        return
                    }
                    setErrorOccured(message)
                    setLoadingTwo(false)
                    setNoResults(false)
                } else {
                    console.log(data)
                    setNoResults(false)
                    layoutCategoriesFound(data)
                    console.log('Category search was a success')
                    //persistLogin({...data[0]}, message, status);
                }
                submitting = false;

            }).catch(error => {
                if (error instanceof CanceledError) {
                    alert('Intentionally cancelled request')
                    console.warn('Intentionally failed request')
                } else {
                    console.log(error);
                    submitting = false;
                    setLoadingTwo(false)
                    setNoResults(false)
                    setErrorOccured(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
                    console.error(error)
                }
            })
        } else {
            console.log('Empty category search')
            setNoResults(false)
            setChangeSectionsTwo([])
        }
    }

    const handleChange = (val) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        debounceTimeout.current = setTimeout(() => {
            abortControllerRef.current.abort();

            setLoadingOne(false)
            setLoadingTwo(false)
            
            abortControllerRef.current = new AbortController();

            searchValue.current = val;
            if (submitting == false) {
                if (filterFormatSearch == "Users") {
                    console.log(val)
                    handleUserSearch(val, true)
                } else if (filterFormatSearch == "Categories") {
                    console.log(val)
                    handleCategorySearch(val)
                } 
            }
        }, 200)
    }

    useEffect(() => {
        if (searchValue.current !== "" && searchValue.current !== null) {
            setNoResults(false)
            if (filterFormatSearch == "Users") {
                handleUserSearch(searchValue.current)
            } else if (filterFormatSearch == "Categories") {
                handleCategorySearch(searchValue.current)
            }
        }
    }, [filterFormatSearch])
    return(
        <>
            <StatusBar style={colors.StatusBarColor}/>
            {storedCredentials ?
                <>
                    <TouchableWithoutFeedback style={{paddingTop: StatusBarHeight - 15, borderColor: colors.borderColor, borderBottomWidth: 1, paddingBottom: 5}} onPress={() => {Keyboard.dismiss()}}>
                        <MemoSearchInput colors={colors} handleChange={handleChange}/>
                        {experimentalFeaturesEnabled && (
                            <>
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: -20}}>
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <SubTitle style={{marginBottom: 0, fontSize: 15, fontWeight: 'normal', color: colors.tertiary}}>Users</SubTitle>
                                        {filterFormatSearch == "Users" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: brand, borderWidth: 3, padding: 10, backgroundColor: dark? darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/035-file-text.png')}/>
                                            </TouchableOpacity>
                                        )}
                                        {filterFormatSearch !== "Users" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: slightlyLighterGrey, borderWidth: 3, padding: 10, backgroundColor: dark? darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                                cancelTokenPostFormatTwo.cancel()
                                                setChangeSectionsOne([])
                                                setFilterFormatSearch("Users")  
                                            }}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/035-file-text.png')}/>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <SubTitle style={{marginBottom: 0, fontSize: 15, fontWeight: 'normal', color: colors.tertiary}}>Categories</SubTitle>
                                        {filterFormatSearch == "Categories" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: brand, borderWidth: 3, padding: 10, backgroundColor: dark? darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png')}/>
                                            </TouchableOpacity>
                                        )}
                                        {filterFormatSearch !== "Categories" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: slightlyLighterGrey, borderWidth: 3, padding: 10, backgroundColor: dark? darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                                cancelTokenPostFormatOne.cancel()
                                                setChangeSectionsTwo([])
                                                setFilterFormatSearch("Categories")
                                            }}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png')}/>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <SubTitle style={{marginBottom: 0, fontSize: 15, fontWeight: 'normal', color: colors.tertiary}}>Images</SubTitle>
                                        {filterFormatSearch == "Images" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: brand, borderWidth: 3, padding: 10, backgroundColor: dark? darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png')}/>
                                            </TouchableOpacity>
                                        )}
                                        {filterFormatSearch !== "Images" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: slightlyLighterGrey, borderWidth: 3, padding: 10, backgroundColor: dark? darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                                //cancelTokenPostFormatOne.cancel()
                                                //cancelTokenPostFormatTwo.cancel()
                                                //setChangeSections([])
                                                //setFilterFormatSearch("Images")
                                                alert('This feature is coming soon')
                                            }}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png')}/>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </>
                        )}
                    </TouchableWithoutFeedback>
                    {filterFormatSearch == "Users" && (
                        <FlatList
                            data={changeSectionsOne}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item, index }) => <UserItem name={item.name} displayName={item.displayName} followers={item.followers}  following={item.following} totalLikes={item.totalLikes} profileKey={item.profileKey} badges={item.badges} index={index} pubId={item.pubId} bio={item.bio} privateAccount={item.privateAccount} colors={colors} navigation={navigation}/>}
                            ListFooterComponent={
                                <>
                                    {noResults == true && (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>{changeSectionsOne.length > 0 ? 'No more results' : 'No results found'}</Text>
                                        </View>
                                    )}
                                    {errorOccured !== null && (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.errorColor, textAlign: 'center'}}>{errorOccured}</Text>
                                        </View>
                                    )}
                                    {loadingOne == true && (
                                        <View style={{marginTop: 20}}>
                                            <ActivityIndicator size="large" color={colors.brand} />
                                        </View>
                                    )}
                                </>
                            }
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            onEndReachedThreshold={3}
                            onEndReached = {({distanceFromEnd})=>{
                                if (distanceFromEnd > 0) {
                                    console.log('End of the feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                    if (!noResults && searchValue.current !== "" && searchValue.current !== null && errorOccured === null) {
                                        handleUserSearch(searchValue.current)
                                    }
                                }
                            }}
                            onContentSizeChange={(contentWidth, contentHeight) => {
                                userListHeight.current = contentHeight;
                            }}
                        />
                    )}
                    {filterFormatSearch == "Categories" && (
                        <SectionList
                            sections={changeSectionsTwo}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item }) => <CategoryItem categoryTitle={item.categoryTitle} categoryDescription={item.categoryDescription} members={item.members} categoryTags={item.categoryTags} image={item.image} NSFW={item.NSFW} NSFL={item.NSFL} datePosted={item.datePosted} allowScreenShots={item.allowScreenShots} categoryId={item.categoryId} colors={colors} navigation={navigation}/>}
                            ListFooterComponent={
                                <>
                                    <View style={{marginTop: 20}}>
                                        {loadingTwo == true && (
                                            <ActivityIndicator size="large" color={colors.brand} />     
                                        )}
                                    </View>
                                </>
                            }
                            ListHeaderComponent={
                                <>
                                    {noResults == true && (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>No results found</Text>
                                        </View>
                                    )}
                                    {errorOccured !== null && (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.errorColor, textAlign: 'center'}}>{errorOccured}</Text>
                                        </View>
                                    )}
                                </>
                            }
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                    {filterFormatSearch == "Images" && (
                        <View style={{alignSelf: 'center', textAlign: 'center'}}>
                            <SubTitle style={{alignSelf: 'center', textAlign: 'center', color: colors.tertiary}}>This feature is not out yet...</SubTitle>
                        </View>
                    )}
                </>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to search</Text>
                    <Text style={{color: colors.tertiary, fontSize: 14, textAlign: 'center', marginBottom: 20, fontStyle: 'italic'}}>This is done to protect user privacy</Text>
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

const UserTextInput = ({label, icon, isPassword, colors, ...props}) => {
    return(
        <SearchBarArea>
            <LeftIcon searchIcon={true}>
                <Octicons name={"search"} size={20} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput style={{backgroundColor: colors.primary, color: colors.tertiary, borderColor: colors.borderColor}} searchPage={true} {...props}/>
        </SearchBarArea>
    )
}

const SearchInput = ({colors, handleChange}) => {
    return(
        <SearchBarArea style={{alignSelf: 'center'}}>
            <UserTextInput
                placeholder="Search"
                placeholderTextColor={colors.tertiary}
                onChangeText={(val) => handleChange(val)}
                colors={colors}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </SearchBarArea>
    );
}

const MemoSearchInput = memo(SearchInput);

export default FindScreen;
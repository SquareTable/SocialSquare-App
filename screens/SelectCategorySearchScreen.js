import React, {useContext, useState, useEffect} from 'react';
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
    PostIcons,
    ChangePollOptionColorButtons
} from '../screens/screenStylings/styling.js';

// Colors
const {brand, primary, tertiary, greyish, darkLight, slightlyLighterGrey, midWhite, red} = Colors;

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { View, SectionList, SafeAreaView, Image, TouchableOpacity, Text, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';

// formik
import {Formik} from 'formik';

//axios
import axios from 'axios';
import { useTheme } from '@react-navigation/native';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';

const SelectCategorySearchScreen = ({route, navigation}) => {
    const {colors, dark} = useTheme()
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {photoUrl} = storedCredentials;
    const {threadFormat, threadTitle, threadSubtitle, threadTags, threadCategory, threadBody, threadImage, threadImageDescription, threadNSFW, threadNSFL} = route.params;
    const AvatarImg = photoUrl ? {uri: photoUrl} : require('./../assets/img/Logo.png');
    var submitting = false;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [foundAmount, setFoundAmount] = useState();
    const [debounce, setDebounce] = useState(false);
    const [changeSections, setChangeSections] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loadingResults, setLoadingResults] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    var userLoadMax = 10;

    const CategoryItem = ({categoryTitle, categoryDescription, members, categoryTags, image, NSFW, NSFL, datePosted, allowScreenShots}) => (
        <SearchFrame onPress={() => navigation.navigate("ThreadUploadPage", {threadFormat: threadFormat, threadTitle: threadTitle, threadSubtitle: threadSubtitle, threadTags: threadTags, categoryTitle: categoryTitle, threadBody: threadBody, threadImage: threadImage, threadImageDescription: threadImageDescription, threadNSFW: threadNSFW, threadNSFL: threadNSFL, allowScreenShots: (allowScreenShots != undefined ? allowScreenShots : true)})}>
            {image !== null ? (
                <Avatar resizeMode="cover" searchPage={true} source={{uri: `data:image/jpg;base64,${image}`}} />
            ) : (
                <Avatar resizeMode="cover" searchPage={true} source={{uri: SocialSquareLogo_B64_png}} />
            )}
            {NSFW == false && (
                <View>
                    {NSFL == false && (
                        <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{categoryTitle}</SubTitle>
                    )}
                    {NSFL == true && (
                        <View style={{flexDirection: 'row'}}>
                            <SubTitle searchResTitle={true} style={{color: red}}>(NSFL) </SubTitle>
                            <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{categoryTitle}</SubTitle>
                        </View>
                    )}
                </View>
            )}
            {NSFW == true && (
                <View style={{flexDirection: 'row'}}>
                    <SubTitle searchResTitle={true} style={{color: red}}>(NSFW) </SubTitle>
                    <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{categoryTitle}</SubTitle>
                </View>
            )}
            <SubTitle style={{color: colors.tertiary}} searchResTitleDisplayName={true}>{categoryDescription}</SubTitle>
            <SubTitle searchResTitleDisplayName={true} style={{color: brand}}>{categoryTags}</SubTitle>
            <SearchHorizontalView>
                <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> Members </SearchSubTitle>
                    <ProfIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png')}/>
                    {members == 0 && ( 
                        <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> 0 </SearchSubTitle>
                    )}
                    {members !== 0 && ( 
                        <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> {members} </SearchSubTitle>
                    )}
                </SearchHorizontalViewItemCenter>
                <SearchHorizontalViewItemCenter style={{height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> Date Created </SearchSubTitle>
                    <ProfIcons style={{flex: 1}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/084-calendar.png')}/>
                    <SearchSubTitle welcome={true} style={{flex: 1, color: colors.tertiary}}> {datePosted} </SearchSubTitle>
                </SearchHorizontalViewItemCenter>
            </SearchHorizontalView>
        </SearchFrame>
    );

    async function getImageInCategory(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => res.data);
    }

    const handleCategorySearch = (val) => {
        if (val !== "") {
            const layoutCategoriesFound = (data) => {
                setFoundAmount("Poll Comments:")
                var allData = data
                console.log(allData)
                console.log(allData.length)
                var tempSections = []
                var itemsProcessed = 0;
                allData.forEach(function (item, index) {
                    if (allData[index].imageKey !== "") {
                        if (index+1 <= userLoadMax) {      
                            async function asyncFunctionForImages() {
                                const imageB64 = await getImageInCategory(allData[index].imageKey)
                                var tempSectionsTemp = {data: [{categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: imageB64, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots}]}
                                tempSections.push(tempSectionsTemp)
                                itemsProcessed++;
                                if(itemsProcessed === allData.length) {
                                    setLoadingResults(false)
                                    setChangeSections(tempSections)
                                }
                            }
                            asyncFunctionForImages()
                        }
                    } else {
                        if (index+1 <= userLoadMax) {      
                            var tempSectionsTemp = {data: [{categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: null, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots}]}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === allData.length) {
                                setLoadingResults(false)
                                setChangeSections(tempSections)
                            }
                        }
                    }
                });
            }

            handleMessage(null);
            const url = `${serverUrl}/tempRoute/searchpagesearchcategories/${val}`;
            submitting = true;
            setLoadingResults(true);
            axios.get(url).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    if (message === 'No results') {
                        setNoResults(true)
                        setLoadingResults(false)
                        setErrorMessage()
                        return
                    }
                    setErrorMessage(message);
                    setNoResults(false)
                    setLoadingResults(false)
                } else {
                    console.log(data)
                    layoutCategoriesFound(data)
                    console.log('Search complete.')
                    setNoResults(false)
                    setErrorMessage()
                    //persistLogin({...data[0]}, message, status);
                }
                submitting = false;

            }).catch(error => {
                console.log(error);
                submitting = false;
                setErrorMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
                setNoResults(false)
                setLoadingResults(false)
            })
        } else {
            console.log('Empty search')
            setNoResults(false)
            setLoadingResults(false)
            setChangeSections([])
            setErrorMessage()
        }
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleChange = (val) => {
        if (submitting == false) {
            console.log(val)
            handleCategorySearch(val)
        }
    }

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <SafeAreaView style={{alignItems: 'center', marginBottom: -30, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <Image
                            source={require('../assets/app_icons/back_arrow.png')}
                            style={{minHeight: 45, minWidth: 45, width: 45, height: 45, maxWidth: 45, maxHeight: 45, tintColor: colors.tertiary, marginBottom: 15}}
                        />
                    </TouchableOpacity>
                    <SearchBarArea>
                        <UserTextInput
                            placeholder="Search"
                            placeholderTextColor={darkLight}
                            onChangeText={(val) => handleChange(val)}
                            style={{backgroundColor: colors.primary, borderColor: colors.tertiary, color: colors.tertiary}}
                        />
                    </SearchBarArea>
                </SafeAreaView>
            </TouchableWithoutFeedback>
            <SectionList
                sections={changeSections}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => <CategoryItem categoryTitle={item.categoryTitle} categoryDescription={item.categoryDescription} members={item.members} categoryTags={item.categoryTags} image={item.image} NSFW={item.NSFW} NSFL={item.NSFL} datePosted={item.datePosted} allowScreenShots={item.allowScreenShots}/>}
                ListFooterComponent={
                    loadingResults ? 
                        <ActivityIndicator color={colors.brand} size="large" style={{marginTop: 10}}/> 
                    : errorMessage ?
                        <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>{errorMessage}</Text>
                    : noResults ?
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>No results</Text>
                    :
                        null
                }
                style={{height: '100%', width: '100%'}}
            />

        </>
    );
}

const UserTextInput = ({label, icon, isPassword, ...props}) => {
    return(
        <SearchBarArea>
            <LeftIcon searchIcon={true}>
                <Octicons name={"search"} size={20} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput searchPage={true} {...props}/>
        </SearchBarArea>
    )
}

export default SelectCategorySearchScreen;

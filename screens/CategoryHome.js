import React, {useContext, useState} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    WelcomeContainer,
    Colors,
    Avatar,
    SearchHorizontalView,
    SearchHorizontalViewItem,
    SearchHorizontalViewItemCenter,
    SearchSubTitle,
    ProfIcons,
    SearchUserViewItemCenter,
    SearchFrame
} from './screenStylings/styling';

// Colors
const {brand, primary, tertiary, greyish, darkLight} = Colors;

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, View, SectionList } from 'react-native';

// formik
import {Formik} from 'formik';

//axios
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '@react-navigation/native';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import ParseErrorMessage from '../components/ParseErrorMessage';

const CategoryHome = ({navigation}) => {
    const {colors, dark} = useTheme()
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {photoUrl} = storedCredentials;
    const AvatarImg = photoUrl ? {uri: photoUrl} : require('./../assets/img/Logo.png');
    const [filterFormatSearch, setFilterFormatSearch] = useState("UsersByName")
    var submitting = false;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [foundAmount, setFoundAmount] = useState();
    const [debounce, setDebounce] = useState(false);
    const [changeSections, setChangeSections] = useState()
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    var userLoadMax = 10;

    const Item = ({name, displayName, following, followers, totalLikes}) => (
        <SearchFrame onPress={() => navigation.navigate("ProfilePages", {profilesName: name, profilesDisplayName: displayName, following: following, followers: followers, totalLikes: totalLikes})}>
            <Avatar resizeMode="cover" searchPage={true} source={AvatarImg} />
            <SubTitle searchResTitle={true}>{name}</SubTitle>
            <SubTitle searchResTitleDisplayName={true} style={{color: brand}}>@{displayName}</SubTitle>
            <SearchHorizontalView>
                <SearchHorizontalViewItem>
                    <SearchSubTitle welcome={true}> Following </SearchSubTitle>
                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                    <SearchSubTitle welcome={true}> {following.length} </SearchSubTitle>
                </SearchHorizontalViewItem>

                <SearchHorizontalViewItemCenter>
                    <SearchSubTitle welcome={true}> Followers </SearchSubTitle>
                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                    <SearchSubTitle welcome={true}> {followers.length} </SearchSubTitle>
                </SearchHorizontalViewItemCenter>

                <SearchHorizontalViewItem>
                    <SearchSubTitle welcome={true}> Total Likes </SearchSubTitle>
                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                    <SearchSubTitle welcome={true}> {totalLikes} </SearchSubTitle>
                </SearchHorizontalViewItem>
            </SearchHorizontalView>
        </SearchFrame>
    );

    const handleSearch = (commentProperties) => {
    
        const layoutUsersFound = (data) => {
            setFoundAmount("Poll Comments:")
            var allData = data
            console.log(allData)
            console.log(allData.length)
            var tempSections = []
            allData.forEach(function (item, index) {
                if (index+1 <= userLoadMax) {
                    var displayName = allData[index].displayName
                    if (displayName == "") {
                        displayName = allData[index].name
                    }
                    var tempSectionsTemp = {data: [{name: allData[index].name, displayName: displayName, followers: allData[index].followers, following: allData[index].following, totalLikes: allData[index].totalLikes}]}
                    tempSections.push(tempSectionsTemp)
                }
            });
            console.log(tempSections)
            setChangeSections(tempSections)
        }

        handleMessage(null);
        const url = serverUrl + "/tempRoute/searchpagesearch";
        console.log(commentProperties)
        submitting = true;
        axios.post(url, commentProperties).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                console.log(data)
                layoutUsersFound(data)
                handleMessage("Search Complete", "SUCCESS");
                //persistLogin({...data[0]}, message, status);
            }
            submitting = false;

        }).catch(error => {
            console.log(error);
            submitting = false;
            handleMessage(ParseErrorMessage(error));
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleChange = (val) => {
        if (submitting == false) {
            console.log(val)
            var searchProperties = {val, filterFormatSearch}
            handleSearch(searchProperties)
        }
    }

    return(
        <>    
            <StatusBar style="dark"/>
            <View style={{width: '100%', height: '100%'}}>
                <SectionList
                    sections={changeSections}
                    ListHeaderComponent={
                        <>
                                <WelcomeContainer style={{backgroundColor: colors.primary}} postScreen={true}>
                                <PageTitle>Categories (Only used for creating categories as of now)</PageTitle>
                                <StyledButton style={{backgroundColor: colors.primary}} postCategory={true} onPress={() => {navigation.navigate("CategoryCreationPage", {imageFromRoute: null})}}>
                                    <ButtonText style={{color: colors.tertiary}} postCategory={true}>Create a category</ButtonText>
                                </StyledButton>
                                <SubTitle style={{color: colors.tertiary}}>Coming Soon:</SubTitle>
                                <SubTitle>{message}</SubTitle>
                            </WelcomeContainer>
                        </>
                    }
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item name={item.name} displayName={item.displayName} followers={item.followers}  following={item.following} totalLikes={item.totalLikes}/>}
                />
            </View>

        </>
    );
}

export default CategoryHome;

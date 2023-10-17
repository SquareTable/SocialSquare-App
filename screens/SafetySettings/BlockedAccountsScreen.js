import React, {useContext, useState, useEffect, memo} from 'react';
import { StatusBar } from 'expo-status-bar';
import {useTheme} from "@react-navigation/native";

import {
    WelcomeContainer,
    Avatar,
    SettingsPageItemTouchableOpacity,
    SettingsItemImage,
    SettingsItemText,
    ConfirmLogoutView,
    ConfirmLogoutText,
    ConfirmLogoutButtons,
    ConfirmLogoutButtonText,
    TextLinkContent,
    TextLink,
    SettingsHorizontalView,
    ChatScreen_Title,
    Navigator_BackButton,
    StyledButton,
    ButtonText,
    TestText,
    SubTitle
} from '../screenStylings/styling.js';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { ActivityIndicator, ImageBackground, ScrollView, Settings, FlatList } from 'react-native';
import { ServerUrlContext } from '../../components/ServerUrlContext.js';

import {Image, View, Text, TouchableOpacity} from 'react-native';

import axios from 'axios';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import ParseErrorMessage from '../../components/ParseErrorMessage.js';

import SocialSquareLogo_B64_png from '../../assets/SocialSquareLogo_Base64_png.js'


const BlockedAccountsScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [blockedAccounts, setBlockedAccounts] = useState(null);
    const [listItems, setListItems] = useState([])
    const [errorOccurred, setErrorOccurred] = useState(null);
    const [noMoreItems, setNoMoreItems] = useState(false);
    const [loadedForTheFirstTime, setLoadedForTheFirstTime] = useState(false);
    const userLoadMax = 10;
    const [updateFlatList, setUpdateFlatList] = useState(false);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [profilePictures, setProfilePictures] = useState({});

    const fetchBlockedAccounts = () => {
        setErrorOccurred(null)
        const url = serverUrl + '/tempRoute/getuserblockedaccounts';
        axios.get(url).then(response => {
            const result = response.data;
            const {data} = result;

            const profileImageKeys = data.map(user => user.profileImageKey).filter(key => typeof key === 'string' && key.length === 36) //length of v4 uuid is 36 chars

            const profileImageData = {};

            Promise.allSettled(
                profileImageKeys.map(key => {
                    const url = serverUrl + '/getImageOnServer/' + key
                    return axios.get(url)
                })
            ).then(results => {
                results.forEach((result, index) => {
                    if (result.reason) {
                        console.error('An error occurred while finding profile image with key:', profileImageKeys[index], '. The error was:', result.reason)
                    } else {
                        profileImageData[profileImageKeys[index]] = 'data:image/jpeg;base64,' + result.value
                    }
                })

                alert('Done')

                setProfilePictures(profileImageData);
                setBlockedAccounts(data);
                console.warn(data)
            })
        }).catch(error => {
            console.error(error);
            setErrorOccurred(ParseErrorMessage(error))
        })
    }

    useEffect(() => fetchBlockedAccounts(), [])
    
    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Blocked Accounts</TestText>
            </ChatScreen_Title>
            {errorOccurred ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.tertiary, fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>An error occured.</Text>
                    <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center'}}>{errorOccurred}</Text>
                    <TouchableOpacity onPress={fetchBlockedAccounts}>
                        <Ionicons name="reload" size={50} color={colors.errorColor} />
                    </TouchableOpacity>
                </View>
            : blockedAccounts == null ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={colors.brand} />
                </View>
            : blockedAccounts.length == 0 ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold'}}>You have not blocked anyone.</Text>
                </View>
            :
                <FlatList
                    data={blockedAccounts === null ? [] : blockedAccounts}
                    keyExtractor={(item) => item.pubId}
                    renderItem={({ item, index }) => <MemoizedItem item={item} index={index} setUpdateFlatList={setUpdateFlatList} setListItems={setListItems} profilePictures={profilePictures}/>}
                    getItemLayout={(data, index) => (
                        {length: 70, offset: 70 * index, index}
                    )}
                    onEndReached={() => {noMoreItems == false ? /*loadItems()*/null : null}}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={
                        noMoreItems == true ? <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15, marginBottom: 30}}>No more users to show</Text> : <ActivityIndicator size="large" color={colors.brand} style={{marginTop: 10, marginBottom: 20}}/>
                    }
                    extraData={updateFlatList}
                />
            }
        </>
    );
}

const Item = ({item, index, setUpdateFlatList, setListItems, profilePictures}) => {
    const [changingUserIsBlocked, setChangingUserIsBlocked] = useState(false);
    const {colors, dark} = useTheme();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const blockUser = async (userPubIdToBlock) => {
        if (userPubIdToBlock == null) {
            alert('An error occured.')
            return
        }
        setChangingUserIsBlocked(true);
        console.log('Blocking user: ' + userPubIdToBlock)

        const url = serverUrl + '/tempRoute/blockaccount';
        const toSend = {userToBlockPubId: userPubIdToBlock};
        try {
            const response = await axios.post(url, toSend);
            const result = response.data;
            const {message, status} = result;

            if (status !== 'SUCCESS') {
                console.log(message);
                alert('An error occured. Please try again.')
                setChangingUserIsBlocked(false);
            } else {
                console.log('Successfully blocked user')
                setChangingUserIsBlocked(false);
                setListItems(listItems => {
                    listItems[listItems.findIndex(item => item.pubId == userPubIdToBlock)].isBlocked = true
                    return listItems;
                });
                setUpdateFlatList(updateFlatList => !updateFlatList)
            }
        } catch (e) {
            console.log(e)
            alert('An error occured. Please try again.')
            setChangingUserIsBlocked(false);
        }
    }

    const unblockUser = async (userPubIdToUnblock) => {
        if (userPubIdToUnblock == null) {
            alert('An error occured.')
            return
        }
        setChangingUserIsBlocked(true);
        console.log('Unblocking user: ' + userPubIdToUnblock)

        const url = serverUrl + '/tempRoute/unblockaccount';
        const toSend = {userToUnblockPubId: userPubIdToUnblock};
        try {
            const response = await axios.post(url, toSend);
            const result = response.data;
            const {message, status} = result;

            if (status !== 'SUCCESS') {
                console.log(message);
                alert('An error occured. Please try again.')
                setChangingUserIsBlocked(false);
            } else {
                console.log('Successfully unblocked user')
                setChangingUserIsBlocked(false);
                setListItems(listItems => {
                    listItems[listItems.findIndex(item => item.pubId == userPubIdToUnblock)].isBlocked = false
                    return listItems;
                });
                setUpdateFlatList(updateFlatList => !updateFlatList)
            }
        } catch (e) {
            console.log(e)
            alert('An error occured. Please try again.')
            setChangingUserIsBlocked(false);
        }
    }
    
    return (
        <View style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderTopWidth: index == 0 ? 3 : 0, borderBottomWidth: 3, paddingLeft: 5, borderColor: colors.borderColor, height: 70}}>
            <Image style={{width: 60, height: 60, marginBottom: 5, marginTop: 5, borderRadius: 50, borderColor: colors.brand, borderWidth: 2}} source={{uri: profilePictures[item.profileImageKey] || SocialSquareLogo_B64_png}} />
            <SubTitle style={{color: colors.tertiary, marginLeft: 10, marginTop: 8}} searchResTitle={true}>{item.displayName || item.name || 'Error getting username'}</SubTitle>
            <TouchableOpacity onPress={() => {item.isBlocked == true ? unblockUser(item.pubId) : blockUser(item.pubId)}} style={{position: 'absolute', right: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                <Text style={{color: colors.tertiary, fontSize: 16, fontWeight: 'bold'}}>{item.isBlocked == true ? "Unblock" : "Block"}</Text>
            </TouchableOpacity>
        </View>
    )
}

const MemoizedItem = memo(Item);

export default BlockedAccountsScreen;

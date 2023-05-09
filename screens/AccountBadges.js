import React, { useContext, useState } from 'react';

import { AppRegistry, StyleSheet, FlatList, Text, View, Alert, Platform, ScrollView, Animated, TouchableOpacity, Image } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@react-navigation/native';


import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    PageTitle,
    BadgeGridLayout,
    BadgeGridViewBlockStyle,
    GridViewInsideTextItemStyle,
    BadgeGridViewImage
} from './screenStylings/styling.js';



// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { set } from 'react-native-reanimated';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';

const AccountBadges = ({navigation, route}) => {
    const {name, displayName, badgesObject, profilePictureUri} = route.params;
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {badges} = storedCredentials} else {var {badges} = {badges: []}}
    const [logoutViewState, setLogoutViewState] = useState("false")
    const [badgeValue, setBadgeValue] = useState("")
    const [badgeDebounce, setBadgeDebounce] = useState("")
    const [rarity, setRarity] = useState("")
    const [badgeText, setBadgeText] = useState("")
    const [badgeDescription, setBadgeDescription] = useState("")
    const {colors, dark} = useTheme();
    const StatusBarHeight = useContext(StatusBarHeightContext)

    const SeperationLine = () => {
        return(
            <View style={{width: '100%', height: 1, backgroundColor: colors.tertiary}}/>
        )
    }

    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <View style={{paddingTop: StatusBarHeight - 10, backgroundColor: colors.primary, borderColor: colors.borderColor, borderBottomWidth: 0, alignItems: 'center', width: '100%'}}>
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
                        <PageTitle style={{fontSize: 18}} welcome={true}>{(displayName || name || "Couldn't get name") + ' badges'}</PageTitle>
                        <Avatar style={{width: 35, height: 35}} resizeMode="cover" source={{uri: profilePictureUri}}/>
                    </View>
                </>
            </View>
            <ScrollView>
                <View style={{width: '90%', alignSelf: 'center'}}>
                    <View style={{minHeight: 30}}/>
                    <Text style={{fontSize: 14, color: colors.tertiary, marginLeft: 10}}>GENERAL</Text>
                    <SeperationLine/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        <TouchableOpacity style={badgesObject.findIndex(x => x.badgeName =='onSignUpBadge') !== -1 ? {opacity: 1} : {opacity: 0.3}} onPress={() => {console.log(storedCredentials)
                            navigation.navigate('BadgeInfo', {badgeName: 'Joined SocialSquare', badgeUnlocked: badgesObject[badgesObject.findIndex(x => x.badgeName == "onSignUpBadge")].dateRecieved, usernameToUse: displayName || name || 'Cannot Find Name', hiddenBadge: false})}}>
                            <EvilIcons name="trophy" size={75} color={colors.tertiary} style={{marginLeft: -10}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{minHeight: 50}}/>
                    <Text style={{fontSize: 14, color: colors.tertiary, marginLeft: 10}}>TEXTS</Text>
                    <SeperationLine/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        <TouchableOpacity style={badgesObject.includes('sentTenTexts') ? {opacity: 1} : {opacity: 0.3}} onPress={() => {navigation.navigate('BadgeInfo', {badgeName: 'Sent 10 texts', badgeUnlocked: badgesObject.includes('sentTenTexts'), usernameToUse: displayName || name || 'Cannot Find Name', hiddenBadge: false})}}>
                            <AntDesign name="message1" size={50} color={colors.tertiary} style={{marginLeft: 5, marginTop: 10}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={badgesObject.includes('receiveTenHeartReactions') ? {opacity: 1} : {opacity: 0.3}} onPress={() => {navigation.navigate('BadgeInfo', {badgeName: 'Receive 10 heart reactions', badgeUnlocked: badgesObject.includes('receiveTenHeartReactions'), usernameToUse: displayName || name || 'Cannot Find Name', hiddenBadge: false})}}>
                            <AntDesign name="hearto" size={50} color={colors.tertiary} style={{marginLeft: 5, marginTop: 10}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{minHeight: 50}}/>
                    <Text style={{fontSize: 14, color: colors.tertiary, marginLeft: 10}}>CALLS</Text>
                    <SeperationLine/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        <TouchableOpacity style={badgesObject.includes('totalCallTimeTenMinutes') ? {opacity: 1} : {opacity: 0.3}} onPress={() => {navigation.navigate('BadgeInfo', {badgeName: '10 Minutes of Call Time', badgeUnlocked: badgesObject.includes('totalCallTimeTenMinutes'), usernameToUse: displayName || name || 'Cannot Find Name', hiddenBadge: false})}}>
                            <AntDesign name="phone" size={60} color={colors.tertiary} style={{marginTop: 10}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{minHeight: 50}}/>
                    <Text style={{fontSize: 14, color: colors.tertiary, marginLeft: 10}}>POSTS</Text>
                    <SeperationLine/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        <TouchableOpacity style={badgesObject.includes('uploadFirstPost') ? {opacity: 1} : {opacity: 0.3}} onPress={() => {navigation.navigate('BadgeInfo', {badgeName: 'Upload 1 Post', badgeUnlocked: badgesObject.includes('uploadFirstPost'), usernameToUse: displayName || name || 'Cannot Find Name', hiddenBadge: false})}}>
                            <Ionicons name="cloud-upload-outline" size={65} color={colors.tertiary}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{minHeight: 50}}/>
                    <Text style={{fontSize: 14, color: colors.tertiary, marginLeft: 10}}>COMMENTS</Text>
                    <SeperationLine/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        <TouchableOpacity style={badgesObject.includes('postFirstComment') ? {opacity: 1} : {opacity: 0.3}} onPress={() => {navigation.navigate('BadgeInfo', {badgeName: 'Post 1 Comment', badgeUnlocked: badgesObject.includes('postFirstComment'), usernameToUse: displayName || name || 'Cannot Find Name', hiddenBadge: false})}}>
                            <FontAwesome name="comments" size={65} color={colors.tertiary}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{minHeight: 50}}/>
                    <Text style={{fontSize: 14, color: colors.tertiary, marginLeft: 10}}>SPECIAL</Text>
                    <SeperationLine/>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        <TouchableOpacity style={badgesObject.findIndex(x => x.badgeName === 'homeScreenLogoPressEasterEgg') !== -1 ? {opacity: 1} : {opacity: 0.3}} onPress={() => {navigation.navigate('BadgeInfo', {badgeName: badgesObject.findIndex(x => x.badgeName =='homeScreenLogoPressEasterEgg') !== -1 ? 'Home Screen Easter Egg 1' : 'Easter Egg', badgeUnlocked: badgesObject.findIndex(x => x.badgeName =='homeScreenLogoPressEasterEgg') !== -1, usernameToUse: displayName || name || 'Cannot Find Name', hiddenBadge: badges.findIndex(x => x.badgeName == "homeScreenLogoPressEasterEgg") == -1, dateBadgeUnlocked: badgesObject[badgesObject.findIndex(x => x.badgeName == "homeScreenLogoPressEasterEgg")]?.dateRecieved})}}>
                            {badges.findIndex(x => x.badgeName === 'homeScreenLogoPressEasterEgg') !== -1 ?
                                <Image style={{width: 60, height: 60, tintColor: colors.tertiary, marginTop: 10}} source={require('../assets/app_icons/home.png')}/>
                            :
                                <MaterialCommunityIcons name="egg-easter" size={65} color={colors.tertiary}/>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{minHeight: 50}}/>
                </View>
            </ScrollView>
        </>
    );
}

export default AccountBadges;
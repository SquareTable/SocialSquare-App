import React, {useContext} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Platform, Animated, Dimensions, Alert, FlatList, Button } from "react-native";
import { useTheme } from "@react-navigation/native";
import {
    PageTitle,
    Avatar,
} from './screenStylings/styling.js';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CredentialsContext } from "../components/CredentialsContext.js";
import { StatusBarHeightContext } from "../components/StatusBarHeightContext.js";
import { getTimeFromUTCMS } from "../libraries/Time.js";

const BadgeInfo = ({navigation, route}) => {
    const {badgeName, badgeUnlocked, usernameToUse, hiddenBadge, dateBadgeUnlocked} = route.params;
    const {colors, dark} = useTheme();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
    const {name, displayName} = storedCredentials;

    const BadgeIcon = ({badgeName}) => {
        if (badgeName == 'Joined SocialSquare') {
            return <EvilIcons name="trophy" size={75} color={colors.tertiary}/>
        } else if (badgeName == 'Sent 10 texts') {
            return <AntDesign name="message1" size={75} color={colors.tertiary}/>
        } else if (badgeName == '10 Minutes of Call Time') {
            return <AntDesign name="phone" size={75} color={colors.tertiary}/>
        } else if (badgeName == 'Upload 1 Post') {
            return <Ionicons name="cloud-upload-outline" size={75} color={colors.tertiary}/>
        } else if (badgeName == 'Post 1 Comment') {
            return <FontAwesome name="comments" size={75} color={colors.tertiary}/>
        } else if (badgeName == 'Receive 10 heart reactions') {
            return <AntDesign name="hearto" size={75} color={colors.tertiary}/>
        } else if (badgeName == 'Easter Egg' || (badgeName == 'Home Screen Easter Egg 1' && hiddenBadge == true)) {
            return <MaterialCommunityIcons name="egg-easter" size={125} color={colors.tertiary}/>  
        } else if (badgeName == 'Home Screen Easter Egg 1' && hiddenBadge == false) {
            return <Image style={{height: 75, width: 75, tintColor: colors.tertiary}} source={require('../assets/app_icons/home.png')}/>
        } else {
            return <Text style={{fontSize: 30, color: colors.errorColor, fontWeight: 'bold', textAlign: 'center'}}>Error occured while getting badge icon</Text>
        }
    }

    const badgeDescription = (badgeName) => {
        if (badgeName == 'Joined SocialSquare') {
            return 'Made an account'
        } else if (badgeName == 'Sent 10 texts') {
            return 'You have sent 10 texts in the SocialSquare app.'
        } else if (badgeName == '10 Minutes of Call Time') {
            return 'Have a total of 10 minutes of call time in the SocialSquare app.'
        } else if (badgeName == 'Upload 1 Post') {
            return 'Upload your first post to SocialSquare.'
        } else if (badgeName == 'Post 1 Comment') {
            return 'Post your first comment on SocialSquare.'
        } else if (badgeName == 'Receive 10 heart reactions') {
            return 'Receive 10 heart reactions in total on the texts you have received.'
        } else if (badgeName == 'Easter Egg') {
            return 'You have not found this Easter Egg yet.'
        } else if (badgeName == 'Home Screen Easter Egg 1' && hiddenBadge == false) {
            return 'Find the first easter egg in the home screen by pressing the SocialSquare logo 50 times!'
        } else if (badgeName == 'Home Screen Easter Egg 1' && hiddenBadge == true) {
            return usernameToUse + ' has found this easter egg. Search around SocialSquare to find it as well!'
        } else {
            return 'Error occured while getting badge description'
        }
    }

    const returnBadgeName = (badgeName) => {
        if (badgeName == 'Home Screen Easter Egg 1' && hiddenBadge == true) {
            return 'Easter Egg';
        } else {
            return badgeName
        }
    }
    return(
        <>
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
                        <PageTitle style={{fontSize: 20, marginTop: 6}} welcome={true}>{returnBadgeName(badgeName)}</PageTitle>
                    </View>
                </>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <BadgeIcon badgeName={badgeName}/>
                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>{returnBadgeName(badgeName)}</Text>
                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, marginHorizontal: 10}}>{badgeDescription(badgeName)}</Text>
                {badgeUnlocked ?
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>{(name == usernameToUse || displayName == usernameToUse ? 'You' : usernameToUse) + ' unlocked this badge ' + (dateBadgeUnlocked ? getTimeFromUTCMS(dateBadgeUnlocked) : 'ERROR') + '.'}</Text>
                :
                    <>
                        {badgeName != 'Easter Egg' &&
                            <>
                                <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 10}}>{(name == usernameToUse || displayName == usernameToUse ? 'You have' : (usernameToUse + ' has')) + ' not unlocked this badge yet.'}</Text>
                                <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>Progress: number / number. Backend implementation coming soon</Text>
                            </>
                        }
                    </>
                }
            </View>
        </>
    );
}

export default BadgeInfo;
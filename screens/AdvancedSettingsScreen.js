import React, {useContext, useState} from 'react';
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
    StyledButton,
    ButtonText,
} from '../screens/screenStylings/styling.js';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, Settings } from 'react-native';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';

import {Image, View, Text, TouchableOpacity} from 'react-native';
import AppCredits from '../components/AppCredits.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import TopNavBar from '../components/TopNavBar.js';


const AdvancedSettingsScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {name, displayName, email, photoUrl} = storedCredentials}
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
    const StatusBarHeight = useContext(StatusBarHeightContext);
    

    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <TopNavBar screenName="Advanced Settings"/>
            <WelcomeContainer style={{backgroundColor: colors.primary}}>                
                <Avatar resizeMode="cover" source={{uri: profilePictureUri}} style={{marginTop: -40}}/>
                <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("SwitchServerScreen")}>
                    <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/settings.png')}/>
                    <SettingsItemText style={{color: colors.tertiary}}>Switch Server</SettingsItemText>
                </SettingsPageItemTouchableOpacity>
                <AppCredits/>
            </WelcomeContainer>
        </>
    );
}

export default AdvancedSettingsScreen;

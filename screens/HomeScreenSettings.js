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
    ChatScreen_Title,
    Navigator_BackButton,
    StyledButton,
    ButtonText,
    TestText
} from '../screens/screenStylings/styling.js';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {Image, View, Text, TouchableOpacity} from 'react-native';
import AppCredits from '../components/AppCredits.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';


const HomeScreenSettings = ({navigation}) => {
    const {colors, dark} = useTheme();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    

    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Home Screen Settings</TestText>
            </ChatScreen_Title>
            <WelcomeContainer style={{backgroundColor: colors.primary}}>                
                <View style={{marginTop: -40}}/>
                <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("Filter_HomeScreenSettings")}>
                    <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/348-filter.png')}/>
                    <SettingsItemText style={{color: colors.tertiary}}>Filter</SettingsItemText>
                </SettingsPageItemTouchableOpacity>
                <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("Algorithm_HomeScreenSettings")}>
                    <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/settings.png')}/>
                    <SettingsItemText style={{color: colors.tertiary}}>Algorithm</SettingsItemText>
                </SettingsPageItemTouchableOpacity>
                {
                    /*
                    Audio settings will be coming back eventually.
                    We are not going to have audio or video posts when we have our initial release so this will not need to be implemented.
                    It will be implemented later though

                    
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("Audio_HomeScreenSettings")}>
                        <FontAwesome name="music" size={60} color={colors.tertiary}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Audio</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                    */
                }
                <AppCredits/>
            </WelcomeContainer>
        </>
    );
}

export default HomeScreenSettings;

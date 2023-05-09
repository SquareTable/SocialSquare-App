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
} from './screenStylings/styling.js';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, Settings } from 'react-native';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';

import {Image, View, Text, TouchableOpacity} from 'react-native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';


const SafetySettingsScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {name, displayName, email, photoUrl} = storedCredentials}
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
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
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Safety Settings</TestText>
            </ChatScreen_Title>
            {storedCredentials ?
                <WelcomeContainer style={{backgroundColor: colors.primary}}>                
                    <Avatar resizeMode="cover" source={{uri: profilePictureUri}} style={{marginTop: -40}}/>
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("BlockedAccountsScreen")}>
                        <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/settings.png')}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Blocked Accounts</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                </WelcomeContainer>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to access the safety page</Text>
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

export default SafetySettingsScreen;

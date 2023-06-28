import React, {useContext, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

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
    darkModeOn,
    darkModeStyling,
    lightModeStyling,
    BackgroundDarkColor,
    TextLink,
    TextLinkContent
} from '../screens/screenStylings/styling.js';
import {useTheme} from "@react-navigation/native";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import * as WebBrowser from 'expo-web-browser';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';
import { AllCredentialsStoredContext } from '../components/AllCredentialsStoredContext.js';
import AppCredits from '../components/AppCredits.js';
import {Logout} from '../components/HandleLogout.js';
import { ExperimentalFeaturesEnabledContext } from '../components/ExperimentalFeaturesEnabledContext.js';


const SettingsPage = ({navigation}) => {
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {name, email, photoUrl} = storedCredentials}
    const [logoutViewState, setLogoutViewState] = useState(true)
    const [webBrowserResult, setWebBrowserResult] = useState(null)
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext);
    const {allCredentialsStoredList, setAllCredentialsStoredList} = useContext(AllCredentialsStoredContext);
    const {experimentalFeaturesEnabled, setExperimentalFeaturesEnabled} = useContext(ExperimentalFeaturesEnabledContext);

    const clearLogin = () => {
        AsyncStorage.removeItem('SocialSquareDMsList');
        AsyncStorage.removeItem('PlayAudioInSilentMode_AppBehaviour_AsyncStorage');
        AsyncStorage.removeItem('UserProfilePicture');
        Logout(storedCredentials, setStoredCredentials, allCredentialsStoredList, setAllCredentialsStoredList, navigation, setProfilePictureUri);
    }

    const changeLogoutView = () => {
        if (logoutViewState==true) {
            setLogoutViewState(false)
        }else{
            console.log("Closed Confirm")
            setLogoutViewState(true)
        }
    }

    const {colors} = useTheme();

    const seeAppIntroductionScreenAgainButtonOnPress = () => {
        if (storedCredentials) {
            navigation.replace('IntroScreen')
        } else {
            navigation.replace('IntroScreen_NoCredentials')
        }
    }

    const goToLink = async (linkToGoTo) => {
        let result = await WebBrowser.openBrowserAsync(linkToGoTo);
        setWebBrowserResult(result);
    };

    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <BackgroundDarkColor style={{backgroundColor: colors.primary}}>
                <ConfirmLogoutView style={{backgroundColor: colors.primary}} viewHidden={logoutViewState}>
                    <ConfirmLogoutText style={{color: colors.tertiary}}>Are you sure you want to logout?</ConfirmLogoutText>
                    <ConfirmLogoutButtons cancelButton={true} onPress={changeLogoutView}>
                        <ConfirmLogoutButtonText cancelButton={true}>Cancel</ConfirmLogoutButtonText>
                    </ConfirmLogoutButtons> 
                    <ConfirmLogoutButtons confirmButton={true} onPress={clearLogin}>
                        <ConfirmLogoutButtonText confirmButton>Confirm</ConfirmLogoutButtonText>
                    </ConfirmLogoutButtons> 
                </ConfirmLogoutView>
                <ScrollView scrollEnabled={logoutViewState}>
                    <WelcomeContainer style={{backgroundColor: colors.primary}}>
                        <Avatar resizeMode="cover" source={{uri: profilePictureUri}} />  
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => {navigation.navigate('SecuritySettingsScreen')}}>
                            <Icon name="security" size={60} color={colors.tertiary}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Security</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => {navigation.navigate('PrivacySettingsScreen')}}>
                            <Icon name="security" size={60} color={colors.tertiary}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Privacy</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => {navigation.navigate('SafetySettingsScreen')}}>
                            <Icon name="cards-heart-outline" size={60} color={colors.tertiary}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Safety</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("ActivityScreen")}>
                            <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/settings.png')}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Activity</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        {experimentalFeaturesEnabled && (
                            <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => {navigation.navigate('NotificationsSettingsScreen')}}>
                                <Icon name="alarm-light-outline" size={60} color={colors.tertiary}/>
                                <SettingsItemText style={{color: colors.tertiary}}>Notifications</SettingsItemText>
                            </SettingsPageItemTouchableOpacity>
                        )}
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("AccountSettings")}>
                            <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/settings.png')}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Account Settings</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("AppStyling")}>
                            <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/207-eye.png')}/>
                            <SettingsItemText style={{color: colors.tertiary}}>App Styling</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        {experimentalFeaturesEnabled && (
                            <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("AppStyling")}>
                                <Entypo name="archive" size={55} color={colors.tertiary}/>
                                <SettingsItemText style={{color: colors.tertiary}}>Transfer Data</SettingsItemText>
                            </SettingsPageItemTouchableOpacity>
                        )}
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => {Linking.openURL('https://github.com/SquareTable/social-media-platform/issues/new?assignees=&labels=&template=bug-report.md&title=Write+Bug+Title+here')}}>
                            <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/265-notification.png')}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Report bug</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("AdvancedSettingsScreen")}>
                            <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/settings.png')}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Advanced Settings</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        {experimentalFeaturesEnabled && (
                            <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("HomeScreenSettings")}>
                                <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/home.png')}/>
                                <SettingsItemText style={{color: colors.tertiary}}>Home Screen Settings</SettingsItemText>
                            </SettingsPageItemTouchableOpacity>
                        )}
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("ExperimentalFeatures")}>
                            <Octicons name="beaker" size={55} color={colors.tertiary}/>
                            <SettingsItemText style={{color: colors.tertiary}}>Experimental Features</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        <SettingsPageItemTouchableOpacity disabled={!logoutViewState} style={{borderColor: colors.borderColor}} onPress={() => {storedCredentials ? changeLogoutView() : navigation.navigate('ModalLoginScreen', {modal: true})}}>
                            {storedCredentials ?
                                <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/277-exit.png')}/>
                            :
                                <Icon name="login-variant" size={60} color={colors.tertiary}/>
                            }
                            <SettingsItemText style={{color: colors.tertiary}}>{storedCredentials ? 'Logout' : 'Login/Signup'}</SettingsItemText>
                        </SettingsPageItemTouchableOpacity>
                        <AppCredits/>
                        <TouchableOpacity disabled={!logoutViewState} style={{marginHorizontal: '20%', borderColor: colors.borderColor, borderWidth: 5, borderRadius: 20/2}} onPressOut={() => {Linking.openURL('https://github.com/SquareTable/social-media-platform')}}>
                            <View>
                                <Text style={{color: colors.tertiary, fontSize: 16, textAlign: 'center', padding: 7}}>Press here to visit the SocialSquare GitHub repo</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={!logoutViewState} style={{marginHorizontal: '20%', borderColor: colors.borderColor, borderWidth: 5, borderRadius: 20/2, marginTop: 20}} onPress={seeAppIntroductionScreenAgainButtonOnPress}>
                            <View>
                                <Text style={{color: colors.tertiary, fontSize: 16, textAlign: 'center', padding: 7}}>See app introduction screen again</Text>
                            </View>
                        </TouchableOpacity>
                        <TextLink disabled={!logoutViewState} style={{marginTop: 10}} onPress={() => {goToLink('https://squaretable.github.io/social-media-platform/TermsAndConditions')}}>
                            <TextLinkContent style={{color: colors.brand}}>Terms of Service</TextLinkContent>
                        </TextLink>
                        <TextLink disabled={!logoutViewState} onPress={() => {goToLink('https://squaretable.github.io/SocialSquare-App/PrivacyPolicy')}}>
                            <TextLinkContent style={{color: colors.brand}}>Privacy Policy</TextLinkContent>
                        </TextLink>
                    </WelcomeContainer>
                </ScrollView>
            </BackgroundDarkColor>
        </>
    );
}

export default SettingsPage;
const productionID = Platform.OS == 'ios' ? 'ca-app-pub-6980968247752885/8710919560' : 'ca-app-pub-6980968247752885/3057291726';

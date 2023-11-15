import React, {useContext, useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

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
    TestText,
    TextLink,
    TextLinkContent,
    StyledButton,
    ButtonText
} from '../screens/screenStylings/styling.js';
import {useTheme} from "@react-navigation/native";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View, Image, Switch, ActivityIndicator, Alert } from 'react-native';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import AppCredits from '../components/AppCredits.js';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import ParseErrorMessage from '../components/ParseErrorMessage.js';
import TopNavBar from '../components/TopNavBar.js';

var _ = require('lodash');


const NotificationsSettingsScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    //

    const [notificationsSettingsObject, setNotificationsSettingsObject] = useState({})
    const [originalNotificationsSettingsObject, setOriginalNotificationsSettingsObject] = useState({})
    const changesHaveBeenMade = Object.keys(notificationsSettingsObject).length > 0 ? !_.isEqual(notificationsSettingsObject, originalNotificationsSettingsObject) : false

    const [temp, setTemp] = useState('abc')

    const [showSettings, setShowSettings] = useState(false)
    const [notificationsAllowed, setNotificationsAllowed] = useState(false)
    const [notificationsAllowedObject, setNotificationsAllowedObject] = useState({})
    const [errorOccuredDownloadingNotificationSettings, setErrorOccuredDownloadingNotificationSettings] = useState(false)

    const {privateAccount} = storedCredentials || {privateAccount: false};

    const [savingChanges, setSavingChanges] = useState(false)
    
    const marginVerticalOnSwitches = 4.9
    const fontSizeForText = 15

    const StatusBarHeight = useContext(StatusBarHeightContext);

    const loadNotificationSettings = () => {
        setErrorOccuredDownloadingNotificationSettings(false)
        const url = serverUrl + `/tempRoute/getUserNotificationSettings`
        axios.get(url).then(response => {
            const result = response.data
            const {status, message, data} = result;

            if (status !== "SUCCESS") {
                setErrorOccuredDownloadingNotificationSettings(String(message))
            } else {
                console.log(data);
                setNotificationsSettingsObject(_.cloneDeep(data))
                setOriginalNotificationsSettingsObject(_.cloneDeep(data))
                setShowSettings(true)
            }
        }).catch(error => {
            setErrorOccuredDownloadingNotificationSettings(ParseErrorMessage(error))
        })
    }

    const saveNotificationsSettings = () => {
        setSavingChanges(true)
        const url = serverUrl + '/tempRoute/uploadNotificationsSettings';
        const toSend = {notificationSettings: notificationsSettingsObject}
        axios.post(url, toSend).then(response => {
            const result = response.data
            const {status, message} = result;
            if (status !== "SUCCESS") {
                alert('An error occured: ' + String(message))
                setSavingChanges(false)
            } else {
                setSavingChanges(false)
                navigation.goBack()
            }
        }).catch(error => {
            alert(ParseErrorMessage(error))
            setSavingChanges(false)
        })
    }

    const setContextAndAsyncStorage = (type) => {
        type == 'GainsFollower' ? setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.GainsFollower = !notificationsSettingsObject.GainsFollower
            return notificationsSettingsObject
        })
        : type == 'FollowRequests' ? setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.FollowRequests = !notificationsSettingsObject.FollowRequests
            return notificationsSettingsObject
        })
        : type == 'SendGainsFollower' ? setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.SendGainsFollower = !notificationsSettingsObject.SendGainsFollower
            return notificationsSettingsObject
        })
        : type == 'SendFollowRequests' ? setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.SendFollowRequests = !notificationsSettingsObject.SendFollowRequests
            return notificationsSettingsObject
        })
        : console.error('Wrong type has been passed to setContextAndAsyncStorage function in NotificationSettings')
        setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
    }

    const turnOnAllReceiveNotifications = async () => {
        setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.GainsFollower = true
            notificationsSettingsObject.FollowRequests = true
            return notificationsSettingsObject
        })
        setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
    }

    const turnOffAllReceiveNotifications = async () => {
        setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.GainsFollower = false
            notificationsSettingsObject.FollowRequests = false
            return notificationsSettingsObject
        })
        setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
    }

    const turnOnAllSendNotifications = async () => {
        setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.SendGainsFollower = true
            notificationsSettingsObject.SendFollowRequests = true
            return notificationsSettingsObject
        })
        setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
    }

    const turnOffAllSendNotifications = async () => {
        setNotificationsSettingsObject(notificationsSettingsObject => {
            notificationsSettingsObject.SendGainsFollower = false
            notificationsSettingsObject.SendFollowRequests = false
            return notificationsSettingsObject
        })
        setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
    }

    useEffect(() => {
        async function getNotificationsSettings() {
            async function allowsNotificationsAsync() {
                const settings = await Notifications.getPermissionsAsync();
                console.log(settings)
                setNotificationsAllowedObject(settings)
                return (
                  settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
                );
            }
            const allowsNotifications = await allowsNotificationsAsync();
            console.log('Allows Notifications:', allowsNotifications)
            setNotificationsAllowed(allowsNotifications);
            if (allowsNotifications) {
                loadNotificationSettings()
            } else {
                setShowSettings(true)
            }
        }
        if (storedCredentials) {
            getNotificationsSettings()
        }
    }, [])

    const enableNotifications = async () => {
        if (notificationsAllowedObject.status == 'denied') {
            navigation.goBack()
            if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:')
            } else if (Platform.OS === 'android') {
                import ('expo-intent-launcher').then(IntentLauncher => {
                    IntentLauncher.startActivityAsync(
                        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                        { data: 'package:' + pkg },
                    )
                })
            } else if (Platform.OS == 'web') {
                window.open('app-settings:'/*, '_system'*/)
            } else {
                alert('Platform not supported yet.')
            }
        } else {
            const status = await Notifications.requestPermissionsAsync({
                ios: {
                  allowAlert: true,
                  allowBadge: true,
                  allowSound: true,
                  allowAnnouncements: true,
                },
            });
            console.log(status)
            setNotificationsAllowed(status.granted)
            setNotificationsAllowedObject(status)
        }
    }

    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>
            <TopNavBar screenName="Notification Settings" rightIcon={
                storedCredentials ?
                    savingChanges ?
                        <ActivityIndicator size="small" color={colors.brand} style={{position: 'absolute', top: StatusBarHeight + 12, right: 20}}/>
                    :
                        <TouchableOpacity disabled={!changesHaveBeenMade} style={{position: 'absolute', top: StatusBarHeight + 10, right: 10}} onPress={saveNotificationsSettings}>
                            <Text style={{color: colors.brand, fontSize: 20, fontWeight: 'bold', opacity: changesHaveBeenMade ? 1 : 0.5}}>Save</Text>
                        </TouchableOpacity>
                : null
            }/>
            {storedCredentials ? 
                <BackgroundDarkColor style={{backgroundColor: colors.primary}}>
                    {showSettings == true ?
                        <WelcomeContainer style={{backgroundColor: colors.primary, width: '100%', height: '100%'}}>
                            {notificationsAllowed == true ?
                                <ScrollView style={{marginTop: -50, width: '100%', height: '100%', marginBottom: -25}}>
                                    <Avatar resizeMode="cover" source={{uri: profilePictureUri}} />
                                    <TestText style={{textAlign: 'center', color: colors.tertiary}}>Receive Notifications</TestText>
                                    <View style={{alignSelf: 'center', alignItems: 'center', alignContent: 'center'}}>
                                        <View style={{flexDirection: 'row', alignContent: 'center'}}>
                                            <TextLink onPress={turnOnAllReceiveNotifications}>
                                                <TextLinkContent style={{color: colors.brand, fontSize: 22}}>Turn On All</TextLinkContent>
                                            </TextLink>
                                            <TextLink style={{marginLeft: 50}} onPress={turnOffAllReceiveNotifications}>
                                                <TextLinkContent style={{color: colors.brand, fontSize: 22}}>Turn Off All</TextLinkContent>
                                            </TextLink>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10}}>
                                        <Text style={{color: colors.tertiary, fontSize: fontSizeForText, fontWeight: 'bold', marginVertical: 10}}>Someone follows you</Text>
                                        <Switch
                                            trackColor={{false: colors.borderColor, true: colors.darkestBlue}}
                                            thumbColor={notificationsSettingsObject.GainsFollower ? dark ? colors.tertiary : colors.primary : colors.teritary}
                                            ios_backgroundColor={colors.borderColor}
                                            onValueChange={() => {setContextAndAsyncStorage('GainsFollower')}}
                                            value={notificationsSettingsObject.GainsFollower}
                                        />
                                    </View>
                                    {privateAccount ?
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10}}>
                                            <Text style={{color: colors.tertiary, fontSize: fontSizeForText, fontWeight: 'bold', marginVertical: 10}}>Someone requests to follow you</Text>
                                            <Switch
                                                trackColor={{false: colors.borderColor, true: colors.darkestBlue}}
                                                thumbColor={notificationsSettingsObject.FollowRequests ? dark ? colors.tertiary : colors.primary : colors.teritary}
                                                ios_backgroundColor={colors.borderColor}
                                                onValueChange={() => {setContextAndAsyncStorage('FollowRequests')}}
                                                value={notificationsSettingsObject.FollowRequests}
                                            />
                                        </View>
                                    : null}
                                    <TestText style={{textAlign: 'center', color: colors.tertiary, marginTop: 20}}>Send Notifications</TestText>
                                    <View style={{alignSelf: 'center', alignItems: 'center', alignContent: 'center'}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <TextLink onPress={turnOnAllSendNotifications}>
                                                <TextLinkContent style={{color: colors.brand, fontSize: 22}}>Turn On All</TextLinkContent>
                                            </TextLink>
                                            <TextLink style={{marginLeft: 50}} onPress={turnOffAllSendNotifications}>
                                                <TextLinkContent style={{color: colors.brand, fontSize: 22}}>Turn Off All</TextLinkContent>
                                            </TextLink>
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10}}>
                                        <Text style={{color: colors.tertiary, fontSize: fontSizeForText, fontWeight: 'bold', marginVertical: 10}}>Following someone's account</Text>
                                        <Switch
                                            trackColor={{false: colors.borderColor, true: colors.darkestBlue}}
                                            thumbColor={notificationsSettingsObject.SendGainsFollower ? dark ? colors.teritary : colors.primary : colors.teritary}
                                            ios_backgroundColor={colors.borderColor}
                                            onValueChange={() => {setContextAndAsyncStorage('SendGainsFollower')}}
                                            value={notificationsSettingsObject.SendGainsFollower}
                                        />
                                    </View>
                                    {privateAccount ?
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10}}>
                                            <Text style={{color: colors.tertiary, fontSize: fontSizeForText, fontWeight: 'bold', marginVertical: 10}}>Requesting to follow someone's account</Text>
                                            <Switch
                                                trackColor={{false: colors.borderColor, true: colors.darkestBlue}}
                                                thumbColor={notificationsSettingsObject.SendFollowRequests ? dark ? colors.teritary : colors.primary : colors.teritary}
                                                ios_backgroundColor={colors.borderColor}
                                                onValueChange={() => {setContextAndAsyncStorage('SendFollowRequests')}}
                                                value={notificationsSettingsObject.SendFollowRequests}
                                            />
                                        </View>
                                    : null}
                                </ScrollView>
                            :
                                <>
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center', marginHorizontal: 10}}>{notificationsAllowedObject.status == 'undetermined' ? 'Notifications have not been enabled for SocialSquare yet.' : notificationsAllowedObject.status == 'denied' ? 'Push notifications for SocialSquare has been disabled in system settings.' : ('SocialSquare notification status is ' + notificationsAllowed + ' and an error has occured.')}</Text>
                                        <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center', marginVertical: 20, marginHorizontal: 10}}>{notificationsAllowedObject.status != 'denied' ? 'Please enable notifications for SocialSquare to use this feature.' : 'Please go into your device settings and enable notifications for SocialSquare to use this feature.'}</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            {notificationsAllowedObject.status != 'denied' ?
                                                <StyledButton onPress={enableNotifications}>
                                                    <ButtonText>Enable notifications</ButtonText>
                                                </StyledButton>
                                            :
                                                <StyledButton onPress={enableNotifications}>
                                                    <ButtonText>Go to settings</ButtonText>
                                                </StyledButton>
                                            }
                                        </View>
                                    </View>
                                </>
                            }
                        </WelcomeContainer>
                    : errorOccuredDownloadingNotificationSettings ?
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
                            <Text style={{color: colors.errorColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                            <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginVertical: 20}}>{errorOccuredDownloadingNotificationSettings}</Text>
                            <TouchableOpacity onPress={loadNotificationSettings}>
                                <Ionicons name="reload" size={50} color={colors.errorColor} />
                            </TouchableOpacity>
                        </View>
                    :
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="large" color={colors.brand} />
                        </View>
                    }
                </BackgroundDarkColor>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to change notifications settings</Text>
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

export default NotificationsSettingsScreen;
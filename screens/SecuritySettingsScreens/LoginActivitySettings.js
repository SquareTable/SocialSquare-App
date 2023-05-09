import React, {useContext, useState, useEffect, Component} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, SafeAreaView, Text, TouchableOpacity, Image, ActivityIndicator, Alert} from 'react-native';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    StyledButton,
    ButtonText
} from '../screenStylings/styling.js';
import {CredentialsContext} from '../../components/CredentialsContext';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import axios from 'axios';
import { ServerUrlContext } from '../../components/ServerUrlContext.js';
import Ionicons from 'react-native-vector-icons/Ionicons';

var _ = require('lodash');

const LoginActivitySettings = ({navigation, route}) => {
    const {colors, dark} = useTheme()
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const StatusBarHeight = useContext(StatusBarHeightContext)
    const [settingsLoading, setSettingsLoading] = useState(true)
    const [settingsLoadError, setSettingsLoadError] = useState(null)
    const [originalSettings, setOriginalSettings] = useState({})
    const [currentSettings, setCurrentSettings] = useState({})
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)
    const hasUnsavedChanges = !_.isEqual(originalSettings, currentSettings);
    const [savingSettings, setSavingSettings] = useState(false)
    const {navigateMethod, refreshTokenId} = route.params || {};

    const loadSettings = () => {
        setSettingsLoading(true)
        setSettingsLoadError(null)
        const url = serverUrl + '/tempRoute/loginActivitySettings'

        axios.get(url).then(response => {
            const result = response.data;
            const {status, message, data} = result;

            if (status !== 'SUCCESS') {
                setSettingsLoadError(message)
            } else {
                setOriginalSettings(data)
                setCurrentSettings(data)
            }

            setSettingsLoading(false)
        }).catch(error => {
            setSettingsLoading(false)
            console.error(error)
            setSettingsLoadError(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection and try again.')
        })
    }

    useEffect(() => {
        if (navigateMethod) {
            const settings = {
                getIP: false,
                getLocation: false,
                getDeviceType: false
            }

            setOriginalSettings(settings)
            setCurrentSettings(settings)
            setSettingsLoading(false)
        } else {
            loadSettings()
        }
    }, [])

    const goToNextScreen = () => {
        navigation.replace('TransferFromOtherPlatformsScreen', {navigateMethod: navigateMethod})
    }

    const showAccountSetupAlert = (alert) => {
        Alert.alert(
            alert || 'An unknown error occurred while saving login activity settings. Please check your internet connection and try again.',
            'Do you want to retry saving the settings or do you want to continue setting up your account and keep the data collection for login activity off? You can change the login activity settings later on.',
            [
                {text: 'Retry', onPress: saveSettings},
                {text: 'Continue', style: 'cancel', onPress: goToNextScreen}
            ],
            {cancelable: false}
        )
    }

    const saveSettings = () => {
        setSavingSettings(true)
        if (navigateMethod) {
            if (hasUnsavedChanges) {
                const url = serverUrl + '/tempRoute/updateLoginActivitySettingsOnSignup'
                const toSend = {
                    newSettings: currentSettings,
                    refreshTokenId
                }

                axios.post(url, toSend).then(response => {
                    const result = response.data;
                    const {status, message} = result;

                    if (status !== 'SUCCESS') {
                        setSavingSettings(false)
                        showAccountSetupAlert(message)
                    } else {
                        goToNextScreen()
                    }
                }).catch(error => {
                    setSavingSettings(false)
                    console.error(error)
                    showAccountSetupAlert(error?.response?.data?.message)
                })
            } else {
                goToNextScreen()
            }
        } else {
            const url = serverUrl + '/tempRoute/uploadLoginActivitySettings'
            const toSend = {
                newSettings: currentSettings
            }

            axios.post(url, toSend).then(response => {
                const result = response.data;
                const {status, message} = result;

                if (status !== 'SUCCESS') {
                    alert(message || 'An unknown error occurred while saving login activity settings. Please check your internet connection and try again.')
                } else {
                    setOriginalSettings(currentSettings)
                }
                setSavingSettings(false)
            }).catch(error => {
                console.error(error)
                setSavingSettings(false)
                alert(error?.response?.data?.message || 'An unknown error occurred while saving login activity settings. Please check your internet connection and try again.')
            })
        }
    }

    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (navigateMethod || !hasUnsavedChanges) {
              // If we don't have unsaved changes, or if this is the accountSetup page, then we don't need to do anything
              return;
            }
    
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
            // Prompt the user before leaving the screen
            Alert.alert(
              'Discard changes?',
              'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
              [
                { text: "Don't leave", style: 'cancel', onPress: () => {} },
                {
                  text: 'Discard',
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => navigation.dispatch(e.data.action),
                },
              ]
            );
        }),
        [navigation, hasUnsavedChanges]
    );

    return(
        <>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                {!navigateMethod &&
                    <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                        <Image
                        source={require('../../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                        />
                    </Navigator_BackButton>
                }
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Login Activity Settings</TestText>
                {savingSettings ?
                    <ActivityIndicator size="small" color={colors.brand} style={{position: 'absolute', top: StatusBarHeight + 12, right: 22}}/>
                :
                    <TouchableOpacity disabled={navigateMethod ? false : hasUnsavedChanges ? false : true} style={{position: 'absolute', top: StatusBarHeight + 10, right: 10}} onPress={saveSettings}>
                        <Text style={{color: colors.brand, fontSize: 20, fontWeight: 'bold', opacity: navigateMethod ? 1 : hasUnsavedChanges ? 1 : 0.5}}>Save</Text>
                    </TouchableOpacity>
                }
            </ChatScreen_Title>
            {
                navigateMethod ?
                    <>
                        <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginHorizontal: 10, marginTop: 5}}>SocialSquare lets you see what devices are logged into your account at any time. To make it easier to identify a device, what data would you want to be collected on each login?</Text>
                        <Text style={{color: colors.tertiary, fontSize: 16, textAlign: 'center', marginHorizontal: 10, marginTop: 5, fontStyle: 'italic'}}>You can change this later on in settings.</Text>
                    </>
                :
                    <>
                        <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginHorizontal: 10, marginTop: 5}}>Any changes to these settings will apply on the next login to this account.</Text>
                    </>
            }
            {
                settingsLoadError ?
                    <TouchableOpacity onPress={loadSettings} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center'}}>{settingsLoadError}</Text>
                        <Ionicons name="reload" size={50} color={colors.errorColor} />
                    </TouchableOpacity>
                : settingsLoading ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={colors.brand}/>
                    </View>
                :
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'column'}}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {
                                typeof currentSettings.getIP === 'boolean' ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary, marginRight: 25}}>Collect IP:</Text>
                                        <TouchableOpacity onPress={() => {setCurrentSettings(settings => ({...settings, getIP: !settings.getIP}))}} style={{width: 40, height: 40, borderColor: colors.borderColor, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', textAlignVertical: 'center'}}>{currentSettings.getIP ? '✓' : '✕'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary}}>Collect IP:</Text>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary}}>An error occurred</Text>
                                    </>
                            }
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {
                                typeof currentSettings.getDeviceType === 'boolean' ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary, marginRight: 25}}>Collect Device Type:</Text>
                                        <TouchableOpacity onPress={() => {setCurrentSettings(settings => ({...settings, getDeviceType: !settings.getDeviceType}))}} style={{width: 40, height: 40, borderColor: colors.borderColor, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', textAlignVertical: 'center'}}>{currentSettings.getDeviceType ? '✓' : '✕'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary}}>Collect Device Type:</Text>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary}}>An error occurred</Text>
                                    </>
                            }
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {
                                typeof currentSettings.getLocation === 'boolean' ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary, marginRight: 25}}>Collect Location:</Text>
                                        <TouchableOpacity onPress={() => {setCurrentSettings(settings => ({...settings, getLocation: !settings.getLocation}))}} style={{width: 40, height: 40, borderColor: colors.borderColor, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', textAlignVertical: 'center'}}>{currentSettings.getLocation ? '✓' : '✕'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary}}>Collect Location:</Text>
                                        <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary}}>An error occurred</Text>
                                    </>
                            }
                        </View>
                    </View>
            }
        </>
    );
}

export default LoginActivitySettings;
import React, {useContext, useState, useEffect} from 'react';
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
} from '../screenStylings/styling.js';

import {Image, View, Text, TouchableOpacity, ScrollView, Alert, Switch, Linking, ActivityIndicator} from 'react-native';

import { CredentialsContext } from '../../components/CredentialsContext.js';
import { ServerUrlContext } from '../../components/ServerUrlContext.js';
import axios from 'axios';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import ParseErrorMessage from '../../components/ParseErrorMessage.js';

var _ = require('lodash');


const Algorithm_HomeScreenSettings = ({navigation, route}) => {
    const {colors, dark} = useTheme();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [errorOccuredWhileLoadingSettings, setErrorOccuredWhileLoadingSettings] = useState(false);
    const [algorithmSettingsObject, setAlgorithmSettingsObject] = useState({
        algorithmEnabled: true,
        useUserUpvoteData: true,
        useUserDownvoteData: true,
        useUserFollowingData: true
    });
    const [originalAlgorithmSettingsObject, setOriginalAlgorithmSettingsObject] = useState({});
    const hasUnsavedChanges = Object.keys(algorithmSettingsObject).length > 0 && !loadingSettings ? !_.isEqual(algorithmSettingsObject, originalAlgorithmSettingsObject) : false;
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [temp, setTemp] = useState('abc');
    const [savingChanges, setSavingChanges] = useState(false);
    const [accountSetup, setAccountSetup] = useState(false)

    useEffect(() => {
        if (route?.params?.navigateMethod) {
            setAccountSetup(true)
            setLoadingSettings(false)
        }
    }, [])

    const loadAlgorithmSettings = () => {
        setLoadingSettings(true);
        setErrorOccuredWhileLoadingSettings(false)
        const url = serverUrl + '/tempRoute/userAlgorithmSettings/';
        axios.get(url).then(response => {
            const result = response.data;
            const {status, message, data} = result;

            if (status !== 'SUCCESS') {
                setLoadingSettings(false);
                setErrorOccuredWhileLoadingSettings(message);
            } else {
                setLoadingSettings(false);
                setAlgorithmSettingsObject(_.cloneDeep(data));
                setOriginalAlgorithmSettingsObject(_.cloneDeep(data));
            }
        }).catch(error => {
            setLoadingSettings(false);
            setErrorOccuredWhileLoadingSettings(ParseErrorMessage(error));
        })
    }

    const showAccountSetupAlert = () => {
        Alert.alert(
            'An error occured',
            'Do you want to retry saving the settings or do you want to continue setting up your account and keep the algorithm off? You can change algorithm settings later on.',
            [
                {text: 'Retry', onPress: saveAlgorithmSettings},
                {text: 'Continue', style: 'cancel', onPress: () => {
                    navigation.replace('LoginActivitySettings', {navigateMethod: route.params.navigateMethod, refreshTokenId: route.params.refreshTokenId})
                }}
            ],
            {cancelable: false}
        )
    }

    const saveAlgorithmSettings = () => {
        setSavingChanges(true);
        const url = serverUrl + '/tempRoute/uploadAlgorithmSettings'
        const toSend = {algorithmSettings: algorithmSettingsObject}
        axios.post(url, toSend).then(response => {
            const result = response.data;
            const {status, message} = result;

            if (status !== 'SUCCESS') {
                setSavingChanges(false);
                if (accountSetup) {
                    showAccountSetupAlert()
                } else {
                    Alert.alert(
                        'Error',
                        message,
                        [
                            { text: 'OK', onPress: () => {}, style: 'cancel' },
                            {
                                text: 'Retry',
                                onPress: saveAlgorithmSettings
                            }
                        ]
                    )
                }
            } else {
                if (accountSetup) {
                    navigation.replace('LoginActivitySettings', {navigateMethod: route.params.navigateMethod, refreshTokenId: route.params.refreshTokenId})
                } else {
                    setOriginalAlgorithmSettingsObject(hi => _.cloneDeep(algorithmSettingsObject));
                    setSavingChanges(false)
                }
            }
        }).catch(error => {
            setSavingChanges(false);
            if (accountSetup) {
                showAccountSetupAlert()
            } else {
                Alert.alert(
                    'Error',
                    ParseErrorMessage(error),
                    [
                        { text: 'OK', onPress: () => {}, style: 'cancel' },
                        {
                            text: 'Retry',
                            onPress: saveAlgorithmSettings
                        }
                    ]
                )
            }
        })
    }

    useEffect(() => {
        if (!route?.params?.navigateMethod) loadAlgorithmSettings();
    }, []);
    console.log(algorithmSettingsObject)

    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges || accountSetup) {
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
            <StatusBar style={colors.StatusBarColor}/>   
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                {accountSetup == false ?
                    <>
                        <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                            <Image
                            source={require('../../assets/app_icons/back_arrow.png')}
                            style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                            resizeMode="contain"
                            resizeMethod="resize"
                            />
                        </Navigator_BackButton>
                        <TestText style={{textAlign: 'center', color: colors.tertiary, fontSize: 14, top: 3}}>Home Screen Algorithm Settings</TestText>
                    </>
                : null}
                {savingChanges ?
                    <ActivityIndicator size="small" color={colors.brand} style={{position: 'absolute', top: StatusBarHeight + 12, right: 22}}/>
                :
                    <TouchableOpacity disabled={accountSetup ? false : !hasUnsavedChanges} style={{position: 'absolute', top: StatusBarHeight + 8, right: 10}} onPress={saveAlgorithmSettings}>
                        <Text style={{color: colors.brand, fontSize: 20, fontWeight: 'bold', opacity: accountSetup ? 1 : hasUnsavedChanges ? 1 : 0.5}}>Save</Text>
                    </TouchableOpacity>
                }
            </ChatScreen_Title>
            {loadingSettings == true ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={colors.brand}/>
                </View>
            : errorOccuredWhileLoadingSettings != false ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.errorColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                    <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginVertical: 20}}>{errorOccuredWhileLoadingSettings}</Text>
                    <TouchableOpacity onPress={loadAlgorithmSettings}>
                        <Ionicons name="reload" size={50} color={colors.errorColor} />
                    </TouchableOpacity>
                </View>
            :
                <ScrollView>
                    <Text style={{color: colors.tertiary, fontSize: 14, textAlign: 'center', marginHorizontal: '5%'}}>SocialSquare is committed to your privacy, safety, and health. Our algorithm is fully optional and you can decide what data gets given to the algorithm to give you better posts.</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '5%', marginVertical: 20}}>
                        <Text style={{color: colors.tertiary, fontSize: 24}}>Algorithm</Text>
                        <Switch
                            trackColor={{ false: colors.primary, true: colors.brand }}
                            thumbColor={colors.tertiary}
                            ios_backgroundColor={colors.primary}
                            onValueChange={(value) => {
                                setAlgorithmSettingsObject(algorithmSettingsObject => {
                                    algorithmSettingsObject.algorithmEnabled = value;
                                    return algorithmSettingsObject;
                                })
                                setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
                            }}
                            value={algorithmSettingsObject.algorithmEnabled}
                        />
                    </View>
                    {algorithmSettingsObject.algorithmEnabled && (
                        <>
                            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: colors.tertiary}}>Data Collection:</Text>
                            <View style={{marginHorizontal: '5%'}}>
                                <Text style={{fontSize: 16, textAlign: 'center', color: colors.tertiary}}>This list of data is already collected as it is neccesary for SocialSquare to run. You can choose what neccesary data can be used for recommending you posts here.</Text>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                                    <Text style={{color: colors.tertiary, fontSize: 24}}>Post Upvotes Data</Text>
                                    <Switch
                                        trackColor={{ false: colors.primary, true: colors.brand }}
                                        thumbColor={colors.tertiary}
                                        ios_backgroundColor={colors.primary}
                                        onValueChange={(value) => {
                                            setAlgorithmSettingsObject(algorithmSettingsObject => {
                                                algorithmSettingsObject.useUserUpvoteData = value;
                                                return algorithmSettingsObject;
                                            })
                                            setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
                                        }}
                                        value={algorithmSettingsObject.useUserUpvoteData}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                                    <Text style={{color: colors.tertiary, fontSize: 24}}>Post Downvotes Data</Text>
                                    <Switch
                                        trackColor={{ false: colors.primary, true: colors.brand }}
                                        thumbColor={colors.tertiary}
                                        ios_backgroundColor={colors.primary}
                                        onValueChange={(value) => {
                                            setAlgorithmSettingsObject(algorithmSettingsObject => {
                                                algorithmSettingsObject.useUserDownvoteData = value;
                                                return algorithmSettingsObject;
                                            })
                                            setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
                                        }}
                                        value={algorithmSettingsObject.useUserDownvoteData}
                                    />
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                                    <Text style={{color: colors.tertiary, fontSize: 24}}>Who you follow</Text>
                                    <Switch
                                        trackColor={{ false: colors.primary, true: colors.brand }}
                                        thumbColor={colors.tertiary}
                                        ios_backgroundColor={colors.primary}
                                        onValueChange={(value) => {
                                            setAlgorithmSettingsObject(algorithmSettingsObject => {
                                                algorithmSettingsObject.useUserFollowingData = value;
                                                return algorithmSettingsObject;
                                            })
                                            setTemp(temp => temp === 'abc' ? 'cba' : 'abc')
                                        }}
                                        value={algorithmSettingsObject.useUserFollowingData}
                                    />
                                </View>
                                <View style={{height: 50}}/>
                                <Text style={{color: colors.tertiary, fontSize: 14, textAlign: 'center'}}>Want to see how we use your data and make sure that it is being handled securely? Check out the SocialSquare GitHub repo to look at the code we use to run SocialSquare.</Text>
                                <TouchableOpacity style={{marginHorizontal: '20%', borderColor: colors.borderColor, borderWidth: 5, borderRadius: 20/2, marginVertical: 15}} onPressOut={() => {Linking.openURL('https://github.com/SquareTable/SocialSquare-App')}}>
                                    <Text style={{color: colors.tertiary, fontSize: 16, textAlign: 'center', padding: 7}}>Press here to visit the SocialSquare GitHub repo</Text>
                            </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            }
        </>
    );
}

export default Algorithm_HomeScreenSettings;

import { useTheme } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ServerUrlContext } from '../components/ServerUrlContext';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    StyledButton,
    ButtonText
} from './screenStylings/styling';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { CredentialsContext } from '../components/CredentialsContext';
import RadioButton from '../components/RadioButton';
import ParseErrorMessage from '../components/ParseErrorMessage';

var _ = require('lodash');

const PrivacySettings = ({navigation}) => {
    const StatusBarHeight = useContext(StatusBarHeightContext)
    const {serverUrl} = useContext(ServerUrlContext)
    const {storedCredentials} = useContext(CredentialsContext)
    const { colors } = useTheme()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [settings, setSettings] = useState(null)
    const [originalSettings, setOriginalSettings] = useState(null)
    const [savingChanges, setSavingChanges] = useState(false)

    const getSettings = () => {
        setLoading(true)
        setError(null)

        const url = serverUrl + '/tempRoute/privacySettings';

        axios.get(url).then(response => {
            const result = response.data;
            const {status, message, data} = result;

            if (status !== "SUCCESS") {
                setLoading(false)
                setError(message)
                console.error(message)
            } else {
                setError(null)
                setLoading(false)
                setSettings(data)
                setOriginalSettings(data)
            }
        }).catch(error => {
            setLoading(false)
            setError(ParseErrorMessage(error))
            console.error(error)
        })
    }

    useEffect(() => {
        if (storedCredentials) {
            getSettings()
        }
    }, [storedCredentials])

    useEffect(() => console.log('Settings are:', settings), [settings])

    const updateSettings = (changeObject) => {
        const newSettings = {
            ...settings,
            ...changeObject
        }

        setSettings(newSettings)
    }

    const changesHaveBeenMade = settings !== null && originalSettings !== null ? !_.isEqual(settings, originalSettings) : false
    console.log('Changes have been made:', changesHaveBeenMade)

    const savePrivacySettings = () => {
        setSavingChanges(true)
        const url = serverUrl + '/tempRoute/savePrivacySettings';
        const toSend = {settings}

        axios.post(url, toSend).then(response => {
            const result = response.data;
            const {status, message} = result;

            if (status !== "SUCCESS") {
                alert(message)
            } else {
                setOriginalSettings(settings)
            }

            setSavingChanges(false)
        }).catch(error => {
            console.error(error)
            setSavingChanges(false)
            alert(ParseErrorMessage(error))
        })
    }

    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (!changesHaveBeenMade) {
              // If we don't have unsaved changes, then we don't need to do anything
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
        [navigation, changesHaveBeenMade]
    );

    return (
        <>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Privacy Settings</TestText>
                {savingChanges ?
                    <ActivityIndicator size="small" color={colors.brand} style={{position: 'absolute', top: StatusBarHeight + 12, right: 20}}/>
                :
                    <TouchableOpacity disabled={!changesHaveBeenMade} style={{position: 'absolute', top: StatusBarHeight + 10, right: 10}} onPress={savePrivacySettings}>
                        <Text style={{color: colors.brand, fontSize: 20, fontWeight: 'bold', opacity: changesHaveBeenMade ? 1 : 0.5}}>Save</Text>
                    </TouchableOpacity>
                }
            </ChatScreen_Title>
            {storedCredentials ?
                loading ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Loading...</Text>
                        <ActivityIndicator color={colors.brand} size="large"/>
                    </View>
                : error ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>{error}</Text>
                        <TouchableOpacity onPress={getSettings}>
                            <Ionicons name="reload" size={50} color={colors.errorColor} />
                        </TouchableOpacity>
                    </View>
                : settings !== null ?
                    <>
                        <ScrollView contentContainerStyle={{alignItems: 'center', flex: 1}} style={{flex: 1}}>
                            <View style={{borderColor: colors.borderColor, borderWidth: 1, padding: 10, width: '100%', marginBottom: 10}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Who can see your followers</Text>
                                <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({viewFollowers: "no-one"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>No One</Text>
                                        <RadioButton selected={settings.viewFollowers == 'no-one'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({viewFollowers: "followers"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Followers</Text>
                                        <RadioButton selected={settings.viewFollowers == 'followers'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({viewFollowers: "everyone"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Everyone</Text>
                                        <RadioButton selected={settings.viewFollowers == 'everyone'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{borderColor: colors.borderColor, borderWidth: 1, padding: 10, width: '100%', marginBottom: 10}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Who can see who you follow</Text>
                                <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({viewFollowing: "no-one"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>No One</Text>
                                        <RadioButton selected={settings.viewFollowing == 'no-one'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({viewFollowing: "followers"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Followers</Text>
                                        <RadioButton selected={settings.viewFollowing == 'followers'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({viewFollowing: "everyone"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Everyone</Text>
                                        <RadioButton selected={settings.viewFollowing == 'everyone'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{borderColor: colors.borderColor, borderWidth: 1, padding: 10, width: '100%', marginBottom: 10}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Who can see your badges</Text>
                                <View style={{justifyContent: 'space-around', flexDirection: 'row'}}>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({showBadges: "no-one"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>No One</Text>
                                        <RadioButton selected={settings.showBadges == 'no-one'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({showBadges: "followers"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Followers</Text>
                                        <RadioButton selected={settings.showBadges == 'followers'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'center'}} onPress={() => updateSettings({showBadges: "everyone"})}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Everyone</Text>
                                        <RadioButton selected={settings.showBadges == 'everyone'} colors={colors} disabled/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                : 
                    <>
                        <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                            <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold'}}>An error has occured. Please go back and try again.</Text>
                        </View>
                    </>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to change privacy settings</Text>
                    <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                        <ButtonText> Login </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                            <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    )
}

export default PrivacySettings;
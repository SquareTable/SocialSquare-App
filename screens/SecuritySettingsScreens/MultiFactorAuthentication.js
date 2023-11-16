import React, {useContext, useState, useEffect, useRef} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, Text, TouchableOpacity, ActivityIndicator, FlatList, Animated} from 'react-native';
import {
    Colors,
    StyledButton,
    ButtonText
} from '../screenStylings/styling.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CredentialsContext} from '../../components/CredentialsContext';
import {ServerUrlContext} from '../../components/ServerUrlContext';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import TopNavBar from '../../components/TopNavBar.js';

const MultiFactorAuthentication = ({navigation}) => {
    const {colors, dark} = useTheme()
    const {brand} = Colors;
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [loading, setLoading] = useState(true);
    const [errorOccuredWhileLoading, setErrorOccuredWhileLoading] = useState(false);
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [enabledAuthenticationFactors, setEnabledAuthenticationFactors] = useState([]);
    const isFocused = useIsFocused();
    const loadingAnimationOpacity = useRef(new Animated.Value(0.7)).current;
    const MFAEmail = useRef(undefined);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    if (loading) {
        Animated.loop(
            Animated.sequence([
                Animated.timing(loadingAnimationOpacity, {
                    toValue: 2,
                    duration: 100,
                    useNativeDriver: true
                }),
                Animated.timing(loadingAnimationOpacity, {
                    toValue: 0.7,
                    duration: 200,
                    useNativeDriver: true
                }),
            ])
        ).start();
    }

    const checkAuthenticationFactors = () => {
        setLoading(true);
        const url = serverUrl + '/tempRoute/getAuthenticationFactorsEnabled';
        axios.get(url).then(response => {
            const result = response.data;
            const {message, status, data} = result;

            if (status != "SUCCESS") {
                console.log(message)
                setErrorOccuredWhileLoading(true);
                setLoading(false);
            } else {
                setEnabledAuthenticationFactors(data.authenticationFactorsEnabled);
                MFAEmail.current = data.MFAEmail
                setLoading(false);
                setErrorOccuredWhileLoading(false);
            }
        }).catch(error => {
            console.error(error)
            setErrorOccuredWhileLoading(true);
            setLoading(false)
        })
    }
    useEffect(() => {
        if (isFocused) {
            checkAuthenticationFactors();
        }
    }, [isFocused])

    const items = ['Email', 'SMS', 'Authentication App']
    return(
        <>
            <TopNavBar screenName="Multi-Factor Authentication"/>
            {storedCredentials ?
                errorOccuredWhileLoading == true ?
                    <TouchableOpacity onPress={checkAuthenticationFactors} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center'}}>An error occured while loading. Please retry.</Text>
                        <Ionicons name="reload" size={50} color={colors.errorColor} />
                    </TouchableOpacity>
                :
                    <View style={{flex: 1}}>
                        <FlatList
                            data={items}
                            renderItem={({index, item}) => 
                                loading == true ? 
                                    null
                                :
                                    <FactorBox colors={colors} text={item} enabledAuthenticationFactors={enabledAuthenticationFactors} index={index} navigation={navigation} items={items} MFAEmail={MFAEmail.current}/>
                            }
                            ListFooterComponent={() => loading == true ? <ActivityIndicator size="large" color={colors.brand}/> : null}
                            ItemSeparatorComponent={() => <View style={{height: 20}}/>}
                            ListHeaderComponent={() => <Text style={{textAlign: 'center', fontSize: 16, color: colors.tertiary, marginBottom: 20}}>Multi-Factor authentication allows you to protect your account even further by requiring more than just a password to get into your account. All authentication factors enabled will be required one after the other to be able to login.</Text>}
                        />
                    </View>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to enable 2FA</Text>
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

const FactorBox = ({colors, text, enabledAuthenticationFactors, index, navigation, items, MFAEmail}) => {
    const navigateTo = ['ActivateEmailMFA', 'ActivateSMSMFA', 'ActivateAuthenticationAppMFA']
    console.log(enabledAuthenticationFactors)
    return (
        <TouchableOpacity onPress={() => {text == 'Email' ? navigation.navigate(navigateTo[index], {emailEnabled: enabledAuthenticationFactors.includes(items[0]), SMSEnabled: enabledAuthenticationFactors.includes(items[1]), authenticationAppEnabled: enabledAuthenticationFactors.includes(items[2]), MFAEmail: MFAEmail}) : alert('Email is the only supported Multi-Factor Authentication option at the moment. SMS and Authentication App support will be coming soon.')}} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, borderColor: colors.tertiary, borderWidth: 3, height: 60}}>
            <Text style={{color: colors.tertiary, fontSize: 18}}>{text}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{borderColor: enabledAuthenticationFactors.includes(text) ? colors.green : colors.red, borderWidth: 3, borderRadius: 20, padding: 5, margin: 5}}>
                    <Text style={{color: enabledAuthenticationFactors.includes(text) ? colors.green : colors.red, fontSize: 18}}>{enabledAuthenticationFactors.includes(text) ? 'Enabled' : 'Disabled'}</Text>
                </View>
                <Ionicons name="arrow-forward-outline" size={40} color={colors.tertiary} />
            </View>
        </TouchableOpacity>
    )
}

export default MultiFactorAuthentication;
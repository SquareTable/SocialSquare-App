import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@react-navigation/native';

// formik
import {Formik} from 'formik';

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    Colors,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    darkModeOn,
    darkModeStyling,
    lightModeStyling
} from '../screens/screenStylings/styling.js';
import {View, ActivityIndicator, TouchableOpacity, Text} from 'react-native';

// Colors
const {brand, primary, tertiary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';
import { AllCredentialsStoredContext } from '../components/AllCredentialsStoredContext.js';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { ServerUrlContext } from '../components/ServerUrlContext.js';

import {storeJWT} from './../jwtHandler'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Signup = ({navigation, route}) => {
    if (darkModeOn === true) {
        var styling = darkModeStyling;
    } else {
        var styling = lightModeStyling;
    }
    const [webBrowserResult, setWebBrowserResult] = useState(null);
    const {allCredentialsStoredList, setAllCredentialsStoredList} = useContext(AllCredentialsStoredContext);
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext);
    const [usernameIsAvailable, setUsernameIsAvailable] = useState(undefined)
    const [usernameAvailableMessage, setUsernameAvailableMessage] = useState(undefined)
    const [usernameAvailableMessageColor, setUsernameAvailableMessageColor] = useState(undefined)

    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const goToLink = async (linkToGoTo) => {
        let result = await WebBrowser.openBrowserAsync(linkToGoTo);
        setWebBrowserResult(result);
    };

    if (route.params) {var {modal, Modal_NoCredentials} = route.params;}

    const {colors} = useTheme();

    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)

    const handleSignup = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = serverUrl + '/user/signup';

        axios.post(url, credentials).then((response) => { 
            const result = response.data;
            const {message, status, data, token, refreshToken, refreshTokenId} = result;

            
            if (status !== 'SUCCESS') {
                handleMessage(message,status);
            } else {
                persistLogin(data, message, status, {token: token, refreshToken: refreshToken}, refreshTokenId);
            }
            setSubmitting(false);

        }).catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const persistLogin = async (credentials, message, status, tokens, refreshTokenId) => {
        await storeJWT({webToken: tokens.token, refreshToken: tokens.refreshToken}, credentials._id)
        let credentialsToUse = credentials;
        var temp = allCredentialsStoredList;
        credentialsToUse.profilePictureUri = SocialSquareLogo_B64_png
        if (temp == null || temp == undefined) {
            temp = [];
            credentialsToUse.indexLength = 0;
        } else {
            credentialsToUse.indexLength = temp.length;
        }
        setProfilePictureUri(SocialSquareLogo_B64_png);
        AsyncStorage.setItem('socialSquareCredentials', JSON.stringify(credentialsToUse))
        .then(() => {
            handleMessage(message, status);
            setStoredCredentials(credentialsToUse);
            temp.push(credentialsToUse);
            AsyncStorage.setItem('socialSquare_AllCredentialsList', JSON.stringify(temp)).then(() => {
                setAllCredentialsStoredList(temp);
                navigation.replace('WelcomeToSocialSquareScreen', {navigateMethod: Modal_NoCredentials ? 'pop' : 'reset', refreshTokenId});
            })
        })
        .catch((error) => {
            console.log(error);
            handleMessage('Persisting login failed');
        })
    }

    const goBackToLoginScreen = () => {
        if (modal == true) {
            if (Modal_NoCredentials) {
                navigation.goBack();
                navigation.navigate('ModalLoginScreen', {modal: true});
            } else {
                navigation.goBack();
            }
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            });
        }
    }

    const debounce = (callback, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    }

    const checkIfUsernameIsAvailable = debounce((username) => {
        if (username.length < 1) {
            setUsernameIsAvailable(false);
            setUsernameAvailableMessage('Username cannot be blank')
            setUsernameAvailableMessageColor(colors.red)
        } else {
            const url = serverUrl + '/user/checkusernameavailability';
            axios.post(url, {username}).then((response) => {
                const result = response.data;
                const {message, status} = result;
                console.log(message)
                if (status !== 'SUCCESS') {
                    setUsernameIsAvailable(false)
                    setUsernameAvailableMessage(message)
                    setUsernameAvailableMessageColor(colors.red)
                } else {
                    if (message == 'Username is available') {
                        setUsernameIsAvailable(true);
                        setUsernameAvailableMessage('This username is available')
                        setUsernameAvailableMessageColor(colors.green)
                    } else if (message == 'Username is not available') {
                        setUsernameIsAvailable(false);
                        setUsernameAvailableMessage('This username is not available')
                        setUsernameAvailableMessageColor(colors.red)
                    } else {
                        setUsernameIsAvailable(false);
                        setUsernameAvailableMessage('An error occured. Try checking your network connection and retry.')
                        setUsernameAvailableMessageColor(colors.red)
                    }
                }
            }).catch(error => {
                console.log(error);
                setUsernameIsAvailable(false);
                setUsernameAvailableMessage(error?.response?.data?.message || 'An error occured. Try checking your network connection and retry.')
                setUsernameAvailableMessageColor(colors.red)
            })
        }
    }, 750);
    return(
        <KeyboardAwareScrollView>
            <StyledContainer style={{backgroundColor: colors.primary}}>
                <StatusBar style={colors.StatusBarColor}/>
                <InnerContainer style={{backgroundColor: colors.primary}}>
                    <PageLogo source={require('../assets/NewLogo.png')} style={{tintColor: colors.tertiary}}/>
                    <PageTitle style={{color: colors.tertiary}}>SocialSquare</PageTitle>
                    <SubTitle style={{color: colors.tertiary}}>Signup Page</SubTitle>

                    <Formik
                        initialValues={{name: '',email: '', password: '', confirmPassword: '', displayName: ''}} //Might add displayName in future - part of code is ready in backend but not all of it yet
                        onSubmit={(values, {setSubmitting}) => {
                            if (values.email == "" || values.password == "" || values.name == "" || values.confirmPassword == "") {
                                handleMessage('Please fill all the fields.');
                                setSubmitting(false);
                            } else if (values.password !== values.confirmPassword) {
                                handleMessage('Passwords do not match.');
                                setSubmitting(false);
                            } else {
                                handleSignup(values, setSubmitting);
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                <UserTextInput
                                    label="Username"
                                    icon="person"
                                    placeholder="Eg. PhotosAreCool123"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={(text) => {
                                        handleChange('name')(text);
                                        checkIfUsernameIsAvailable(text);
                                    }}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                    style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                    autoCapitalize="none"
                                    usernameIsAvailable={usernameIsAvailable}
                                    colors={colors}
                                    textContentType="username"
                                />

                                {usernameAvailableMessage ? <Text style={{color: usernameAvailableMessageColor, fontSize: 16, textAlign: 'center', marginHorizontal: '5%'}}>{usernameAvailableMessage}</Text> : null}

                                <UserTextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="example@gmail.com"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                    style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                    autoCapitalize="none"
                                    colors={colors}
                                    textContentType="emailAddress"
                                />

                                <UserTextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                    style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                    colors={colors}
                                    textContentType="newPassword"
                                    passwordRules="minlength: 8; maxlength: 17;"
                                />

                                <UserTextInput
                                    label="Confirm Password"
                                    icon="lock"
                                    placeholder="* * * * * * * *"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                    style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                    colors={colors}
                                    textContentType="newPassword"
                                    passwordRules="minlength: 8; maxlength: 17;"
                                />
                                <MsgBox type={messageType}>{message}</MsgBox>
                                {!isSubmitting && (<StyledButton onPress={handleSubmit} style={usernameIsAvailable == true ? {opacity: 1} : {opacity: 0.2}} disabled={usernameIsAvailable == true ? false : true}>
                                    <ButtonText> Signup </ButtonText>
                                </StyledButton>)}

                                {!isSubmitting && modal == true && storedCredentials && (<StyledButton onPress={() => {navigation.pop(2)}}>
                                    <ButtonText> Close </ButtonText>
                                </StyledButton>)}

                                {isSubmitting && (<StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary} />
                                </StyledButton>)}
                                <ExtraView>
                                    <ExtraText style={{color: colors.tertiary, fontSize: 20}}>Already have an account? </ExtraText>
                                    <TextLink onPress={goBackToLoginScreen}>
                                        <TextLinkContent style={{color: colors.brand, fontSize: 20, top: 5}}>Login</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                                {!storedCredentials &&
                                    <TouchableOpacity onPress={() => {modal == true ? navigation.pop(2) : navigation.reset({index: 0, routes:[{name: 'Tabs'}]})}} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                        <ButtonText style={{color: colors.tertiary, fontSize: 20}}>Continue without an account</ButtonText>
                                        <AntDesign name="arrowright" size={40} color={colors.tertiary} style={{marginLeft: 5}}/>
                                    </TouchableOpacity>
                                }
                                <Text style={{textAlign: 'center', color: colors.tertiary, marginTop: 20}}>By signing up, you agree to our </Text>
                                <TextLink onPress={() => {goToLink('https://squaretable.github.io/SocialSquare-App/TermsAndConditions')}}>
                                    <TextLinkContent style={{color: colors.brand}}>Terms of Service</TextLinkContent>
                                </TextLink>
                                <Text style={{textAlign: 'center', color: colors.tertiary}}>and</Text>
                                <TextLink onPress={() => {goToLink('https://squaretable.github.io/SocialSquare-App/PrivacyPolicy')}}>
                                    <TextLinkContent style={{color: colors.brand}}>Privacy Policy</TextLinkContent>
                                </TextLink>
                            </StyledFormArea>)}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAwareScrollView>
    );
}

const UserTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, usernameIsAvailable, colors, ...props}) => {
    return(
        <View>
            <LeftIcon style={{top: 34.5}}>
                <Octicons name={icon} size={30} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (
                <RightIcon style={{top: 32.5}} onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={colors.brand}/>
                </RightIcon>
            )}
            {label == 'Username' && usernameIsAvailable != undefined && (
                <RightIcon style={{top: 32.5}} disabled={true /* This is disabled because RightIcon is a TouchableOpacity and we do not want this icon to be touchable */}>
                    <Ionicons name={usernameIsAvailable ? 'checkmark-circle-outline' : 'close-circle-outline'} size={30} color={usernameIsAvailable ? colors.green : colors.red}/>
                </RightIcon>
            )}
        </View>
    )
}

export default Signup;

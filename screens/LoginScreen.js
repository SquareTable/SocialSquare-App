import React, {useState, useContext, useEffect, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@react-navigation/native';

// formik
import {Formik} from 'formik';

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

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
} from '../screens/screenStylings/styling.js';
import {View, ActivityIndicator, ImageBackground, StyleSheet, Text} from 'react-native';

// Colors
const {brand, primary, tertiary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import NetInfo from "@react-native-community/netinfo";

// API client
import axios from 'axios';
// mongodb+srv://Thekookiekov:<password>@cluster0.c403h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';
import { AllCredentialsStoredContext } from '../components/AllCredentialsStoredContext.js';

import FeatherIcons from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext.js';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { ServerUrlContext } from '../components/ServerUrlContext.js';

import {storeJWT} from './../jwtHandler'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ParseErrorMessage from '../components/ParseErrorMessage.js';

const LoginScreen = ({navigation, route}) => {
    const { colors, dark } = useTheme();
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [downloadingPfp, setDownloadingPfp] = useState(false);

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {allCredentialsStoredList, setAllCredentialsStoredList} = useContext(AllCredentialsStoredContext);
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
    const [profilePictureData, setProfilePictureData] = useState(null);
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)

    const sameAccount = useRef(false)

    if (route.params) {var {modal, goBackToApp} = route.params}

    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = serverUrl + "/user/signin";

        axios.post(url, credentials).then((response) => {
            const result = response.data;
            const {message, status, data, token, refreshToken} = result;

            if (status !== 'SUCCESS') {
                handleMessage(String(message),status);
            } else {
                if (message == "Email") {
                    navigation.navigate('VerifyEmailCodeScreen', {task: 'Verify Email MFA Code', email: data.email, fromAddress: data.fromAddress, username: undefined, userID: undefined, secondId: data.secondId});
                } else {
                    persistLogin(data, message, status, {token: token, refreshToken: refreshToken});
                    setDownloadingPfp(true);
                }
            }
            setSubmitting(false);
        }).catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }


    const persistLogin = async (credentials, message, status, tokens) => {
        try {
            await storeJWT({webToken: tokens.token, refreshToken: tokens.refreshToken}, credentials._id)
        } catch (error) {
            console.error(error)
            handleMessage('An error occurred while storing JWT')
        }
        let credentialsToUse = credentials;
        if (allCredentialsStoredList) {
            for (let i = 0; i < allCredentialsStoredList.length; i++) {
                if (allCredentialsStoredList[i].secondId == credentialsToUse.secondId) {
                    sameAccount.current = true;
                }
            }
        } else {
            sameAccount.current = false;
        }
        console.log('Getting profile picture for ProfilePictureUriContext')
        const getProfilePicture = () => {
            const url = serverUrl + '/tempRoute/getProfilePic/' + credentialsToUse.secondId;
    
            axios.get(url).then(async (response) => {
                const result = response.data;
                const {message, status, data} = result;
    
                if (status !== 'SUCCESS') {
                    console.log('GETTING PROFILE PICTURE FOR ProfilePictureUriContext WAS NOT A SUCCESS')
                    console.log(status)
                    console.log(message)
                    setProfilePictureData([SocialSquareLogo_B64_png, message, status, credentialsToUse])
                } else {
                    console.log(status)
                    console.log(message)
                    const getImageUrl = serverUrl + '/getImageOnServer/' + data;
                    try {
                        const imageResponse = await axios.get(getImageUrl);

                        if (imageResponse) {
                            console.log('Setting profile picture to user profile picture')
                            setProfilePictureUri('data:image/jpeg;base64,' + imageResponse.data);
                            setProfilePictureData([('data:image/jpeg;base64,' + imageResponse.data), message, status, credentialsToUse])
                        } else {
                            console.log('Setting profile picture to SocialSquare logo')
                            console.warn('An unexpected error occured while getting profile picture')
                            setProfilePictureUri(SocialSquareLogo_B64_png)
                            setProfilePictureData([SocialSquareLogo_B64_png, message, status, credentialsToUse])
                        }
                    } catch (error) {
                        console.log('Setting profile picture to SocialSquare logo')
                        console.warn('An unexpected error occured while getting profile picture')
                        console.warn(error)
                        setProfilePictureUri(SocialSquareLogo_B64_png)
                        setProfilePictureData([SocialSquareLogo_B64_png, error, 'FAILED', credentialsToUse])
                    }
                }
                //setSubmitting(false);
    
            }).catch(error => {
                if (ParseErrorMessage(error) === 'No profile image.') {
                    console.log('This account does not have a profile picture')
                    setProfilePictureUri(SocialSquareLogo_B64_png)
                    setProfilePictureData([SocialSquareLogo_B64_png, message, status, credentialsToUse])
                } else {
                    console.error(error);
                    handleMessage(ParseErrorMessage(error));
                    setDownloadingPfp(false)
                }
            })
        }
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if (state.isConnected == true) {
                if (credentials) {
                console.log('There is no profile picture in AsyncStorage. Loading profile picture for ProfilePictureUri Context using internet connection')
                getProfilePicture()
                } else {
                console.log('There is no stored credentials and no profile picture in Async Storage. Setting ProfilePictureUri to SocialSquareB64Logo')
                setProfilePictureUri(SocialSquareLogo_B64_png)
                setProfilePictureData([SocialSquareLogo_B64_png, message, status, credentialsToUse])
                }
            } else {
                console.log('There is no internet connection and no saved profile picture in Async Storage. Setting ProfilePictureUri to SocialSquareB64Logo')
                setProfilePictureUri(SocialSquareLogo_B64_png)
                setProfilePictureData([SocialSquareLogo_B64_png, message, status, credentialsToUse])
            }
        });
    }

    useEffect(() => {
        if (profilePictureData != null) {
            let profilePictureUriData = profilePictureData[0];
            let message = profilePictureData[1];
            let status = profilePictureData[2];
            let credentialsToUse = profilePictureData[3];
            console.log(credentialsToUse)
            let temp = allCredentialsStoredList;
            let tempStoredCreds = storedCredentials;
            setProfilePictureUri(profilePictureUriData);
            if (temp == null || temp == undefined) {
                temp = [];
                credentialsToUse.indexLength = 0;
            } else {
                credentialsToUse.indexLength = temp.length;
            }
            credentialsToUse.profilePictureUri = profilePictureUriData;
            AsyncStorage.setItem('socialSquareCredentials', JSON.stringify(credentialsToUse))
            .then(() => {
                setStoredCredentials(credentialsToUse);
                if (sameAccount.current == false) {
                    temp.push(credentialsToUse);
                }
                AsyncStorage.setItem('socialSquare_AllCredentialsList', JSON.stringify(temp))
                .then(() => {
                    handleMessage(String(message), status);
                    if (sameAccount.current === false) {
                        setAllCredentialsStoredList(temp);
                    }
                    if (modal === true) {
                        if (!tempStoredCreds) {
                            navigation.goBack();
                        } else {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Tabs' }],
                            });
                        }
                    } else {
                        navigation.replace("Tabs");
                    }
                    handleMessage(String(message), status);
                })
                .catch((error) => {
                    console.log(error);
                    handleMessage('Persisting login failed');
                    setDownloadingPfp(false);
                })
                })
            .catch((error) => {
                console.log(error);
                handleMessage('Persisting login failed');
                setDownloadingPfp(false);
            })
        }
    }, [profilePictureData])

    useEffect(() => {
        AsyncStorage.setItem('HasOpenedSocialSquare', 'true');
    })

    if (goBackToApp == true) {
        navigation.goBack()
    }
    return(
        <KeyboardAwareScrollView>
            <>
                <StyledContainer style={{backgroundColor: colors.primary}}>
                    <StatusBar style={colors.StatusBarColor}/>
                    <InnerContainer style={{backgroundColor: colors.primary}}>
                    <PageLogo source={require('../assets/NewLogo.png')} style={{tintColor: colors.tertiary}}/>
                        <PageTitle style={{color: colors.tertiary}}>SocialSquare</PageTitle>
                        <SubTitle style={{color: colors.tertiary}}>Login Page</SubTitle>

                        <Formik
                            initialValues={{email: '', password: ''}}
                            onSubmit={(values, {setSubmitting}) => {
                                if (values.email == "" || values.password == "") {
                                    handleMessage('Please fill all the fields.');
                                    setSubmitting(false);
                                } else {
                                    handleLogin(values, setSubmitting);
                                }
                            }}
                        >
                            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                <StyledFormArea>
                                    <UserTextInput
                                        icon="mail"
                                        placeholder="example@gmail.com"
                                        placeholderTextColor={colors.tertiary}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                        octiconColor={colors.brand}
                                        handleSubmit={handleSubmit}
                                        textContentType="emailAddress"
                                    />

                                    <UserTextInput
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
                                        octiconColor={colors.brand}
                                        handleSubmit={handleSubmit}
                                        textContentType="password"
                                    />
                                    <MsgBox type={messageType}>{message}</MsgBox>
                                    {isSubmitting == false && downloadingPfp == false ?
                                        <>
                                            <StyledButton onPress={handleSubmit}>
                                                <ButtonText> Login </ButtonText>
                                            </StyledButton>
                                            
                                            <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => modal == true ? navigation.navigate('ModalSignupScreen', {modal: true}) : navigation.navigate("Signup")}>
                                                    <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                                            </StyledButton>

                                            {!storedCredentials &&
                                                <TouchableOpacity onPress={() => {modal == true ? navigation.goBack() : navigation.replace('Tabs')}} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                                    <ButtonText style={{color: colors.tertiary, fontSize: 20}}>Continue without an account</ButtonText>
                                                    <AntDesign name="arrowright" size={40} color={colors.tertiary} style={{marginLeft: 5}}/>
                                                </TouchableOpacity>
                                            }

                                            {modal == true && storedCredentials ?
                                                <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.goBack()}>
                                                    <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Close </ButtonText>
                                                </StyledButton> 
                                            : null}

                                            <TouchableOpacity onPress={() => {navigation.navigate('ForgottenPasswordScreen')}} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 10}}>
                                                <ButtonText style={{color: colors.brand, fontSize: 20}}>Forgotten password?</ButtonText>
                                            </TouchableOpacity>
                                        </>
                                    :
                                        <ActivityIndicator size="large" color={colors.brand} />
                                    }
                                </StyledFormArea>)}
                        </Formik>
                    </InnerContainer>
                </StyledContainer>
            </>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
      flex: 1,
      justifyContent: "center"
    }
})

const UserTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, octiconColor, handleSubmit, ...props}) => {
    return(
        <View>
            <LeftIcon style={{top: 34}}>
                <Octicons name={icon} size={30} color={octiconColor} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput onSubmitEditing={handleSubmit} {...props} />
            {isPassword && (
                <RightIcon style={{top: 31}} onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={brand}/>
                </RightIcon>
            )}
        </View>
    )
}



export default LoginScreen;

import React, {useState, useContext} from 'react';
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
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from '../screenStylings/styling.js';
import {View, ActivityIndicator, ImageBackground, StyleSheet, Text, Image, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';

// Colors
const {brand, primary, tertiary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';
// mongodb+srv://Thekookiekov:<password>@cluster0.c403h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../../components/CredentialsContext';
import KeyboardAvoidingWrapper_NoScrollview from '../../components/KeyboardAvoidingWrapper_NoScrollview.js';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';


const SendAudioPage = ({navigation}) => {
    const { colors, dark} = useTheme();
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [screenshotsAllowed, setScreenshotsAllowed] = useState(false);
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const UserTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
        return(
            <View>
                <LeftIcon>
                    <Octicons name={icon} size={30} color={colors.brand} />
                </LeftIcon>
                <StyledInputLabel>{label}</StyledInputLabel>
                <StyledTextInput {...props} />
                {isPassword && (
                    <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                        <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={brand}/>
                    </RightIcon>
                )}
            </View>
        )
    }

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin = (credentials, setSubmitting) => {
        /* GET KOVID TO CHANGE THE CODE TO UPLOAD AUDIO TO THE BACKEND SERVER
        handleMessage(null);
        const url = "https://nameless-dawn-41038.herokuapp.com/user/signin";

        axios.post(url, credentials).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message,status);
            } else {
                persistLogin({...data[0]}, message, status);
                navigation.replace("Tabs");
            }
            setSubmitting(false);
        }).catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage("An error occured. Try checking your network connection and retry.");
        }) */
        alert("Coming soon")
        setSubmitting(false);
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const persistLogin = (credentials, message, status) => {
        AsyncStorage.setItem('socialSquareCredentials', JSON.stringify(credentials))
        .then(() => {
            handleMessage(message, status);
            setStoredCredentials(credentials);
            console.log(credentials)
            console.log(storedCredentials)
        })
        .catch((error) => {
            console.error(error);
            handleMessage('Persisting login failed');
        })
    }

    return(
        <KeyboardAvoidingWrapper_NoScrollview style={{backgroundColor: colors.primary}}>
            <View style={{backgroundColor: colors.primary}}>
                <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                    <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                        <Image
                        source={require('../../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                        />
                    </Navigator_BackButton>
                    <TestText style={{textAlign: 'center', color: colors.tertiary}}>Send Audio</TestText>
                </ChatScreen_Title>
                <View style={{height: '100%'}}>
                
                    <StatusBar style={colors.StatusBarColor}/>
                    <InnerContainer style={{backgroundColor: colors.primary}}>

                        <Formik
                            initialValues={{bio: ''}}
                            onSubmit={(values, {setSubmitting}) => {
                                if (values.bio == "") {
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
                                        icon="comment-discussion"
                                        placeholder="Bio goes here"
                                        placeholderTextColor={colors.tertiary}
                                        onChangeText={handleChange('bio')}
                                        onBlur={handleBlur('bio')}
                                        value={values.bio}
                                        style={{backgroundColor: colors.primary, color: colors.tertiary, height: 200}}
                                        multiline
                                    />

                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <Text style={{color: colors.tertiary, fontSize: 18, marginTop: 10, marginRight: 10}}>Allow screen capture</Text>
                                        <TouchableOpacity onPress={() => {setScreenshotsAllowed(screenshotsAllowed => !screenshotsAllowed)}} style={{width: 40, height: 40, borderColor: colors.borderColor, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', textAlignVertical: 'center'}}>{screenshotsAllowed == false ? '✕' : '✓'}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <MsgBox type={messageType}>{message}</MsgBox>
                                    {!isSubmitting && (<StyledButton onPress={handleSubmit}>
                                        <ButtonText> Post Audio </ButtonText>
                                    </StyledButton>)}

                                    {isSubmitting && (<StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>)}
                                </StyledFormArea>)}
                        </Formik>
                    </InnerContainer>
                </View>
            </View>

        </KeyboardAvoidingWrapper_NoScrollview>
    );
}



export default SendAudioPage;

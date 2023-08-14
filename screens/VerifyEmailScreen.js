import React, {useState, useContext, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import { ServerUrlContext } from '../components/ServerUrlContext';
import { Formik } from 'formik';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    InnerContainer,
    StyledFormArea,
    StyledButton,
    StyledTextInput,
    StyledInputLabel,
    LeftIcon,
    ButtonText,
    MsgBox
} from './screenStylings/styling.js';
import Octicons from 'react-native-vector-icons/Octicons';
import { CredentialsContext } from '../components/CredentialsContext';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import ParseErrorMessage from '../components/ParseErrorMessage';

const VerifyEmailScreen = ({navigation, route}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {_id} = storedCredentials;
    const emailInputRef = useRef();
    const StatusBarHeight = useContext(StatusBarHeightContext);

    useEffect(() => {
        emailInputRef?.current?.focus();
    }, [])

    try {
        var {task} = route.params;
    } catch (e) {
        console.log(e);
        navigation.goBack();
        alert("An error occured. This is a bug: " + e);
    }
    const {colors, dark} = useTheme();
    
    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleVerifyEmail = (values, setSubmitting) => {
        setSubmitting(true);
        const url = serverUrl + '/user/sendemailverificationcode';
        const toSend = {userID: _id, task: 'Add Email Multi-Factor Authentication', getAccountMethod: 'userID', username: null, email: values.email};

        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message,status);
                setSubmitting(false);
            } else {
                setSubmitting(false);
                navigation.navigate('VerifyEmailCodeScreen', {task: 'Add Email Multi-Factor Authentication', email: values.email, fromAddress: data.fromAddress, userID: _id});
            }
        }).catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

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
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Verify Email</TestText>
            </ChatScreen_Title>
            <View style={{flex: 1}}>
                <KeyboardAvoidingWrapper>
                    <InnerContainer>
                        <Formik
                            initialValues={{email: ''}}
                            onSubmit={(values, {setSubmitting}) => {
                                console.log("Submitting")
                                if (values.email == '') {
                                    handleMessage('Please enter your email.');
                                    setSubmitting(false);
                                } else {
                                    setMessage();
                                    setMessageType();
                                    handleVerifyEmail(values, setSubmitting);
                                }
                            }}
                        >
                            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                <StyledFormArea>
                                    <UserTextInput
                                        icon="mail"
                                        placeholder="Enter your email"
                                        placeholderTextColor={colors.tertiary}
                                        onChangeText={(text) => {
                                            handleChange('email')(text);
                                        }}
                                        onBlur={handleBlur('email')}
                                        value={values.username}
                                        style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                        colors={colors}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        emailInputRef={emailInputRef}
                                    />
                                    <MsgBox type={messageType}>{message}</MsgBox>
                                    {!isSubmitting && (<StyledButton onPress={handleSubmit}>
                                        <ButtonText> Submit </ButtonText>
                                    </StyledButton>)}

                                    {isSubmitting && (<StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={colors.primary} />
                                    </StyledButton>)}
                                </StyledFormArea>)}
                        </Formik>
                    </InnerContainer>
                </KeyboardAvoidingWrapper>
            </View>
        </>
    )
}

const UserTextInput = ({label, icon, colors, emailInputRef, ...props}) => {
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput ref={emailInputRef} {...props}/>
        </View>
    )
}

export default VerifyEmailScreen
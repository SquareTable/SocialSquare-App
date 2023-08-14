import React, {useState, useContext} from 'react';
import { Image, ActivityIndicator, View } from 'react-native'
import { useTheme } from '@react-navigation/native';
import {
    Navigator_BackButton,
    ChatScreen_Title,
    TestText,
    InnerContainer,
    StyledFormArea,
    StyledTextInput,
    StyledButton,
    ButtonText,
    MsgBox,
    SubTitle,
    RightIcon,
    LeftIcon,
    StyledInputLabel
} from './screenStylings/styling.js';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper.js';
import { Formik } from 'formik';
import Octicons from 'react-native-vector-icons/Octicons';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import ParseErrorMessage from '../components/ParseErrorMessage.js';

const ForgottenPasswordScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const isFocused = useIsFocused();
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleForgottenPassword = (values, setSubmitting) => {
        const url = serverUrl + '/user/sendemailverificationcode';
        const toSend = {username: values.username, task: 'Check Before Reset Password', getAccountMethod: 'username', userID: undefined, secondId: undefined}
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            console.log('Message: ' + message)
            console.log('Status: ' + status)
            console.log('Data: ' + data)

            if (status !== 'SUCCESS') {
                handleMessage(message,status);
            } else {
                isFocused ? navigation.navigate('ResetPasswordScreen', {username: values.username, email: data.blurredEmail, fromAddress: data.fromAddress}) : null
            }
            setSubmitting(false);
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
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Forgotten Password</TestText>
            </ChatScreen_Title>
            <KeyboardAvoidingWrapper>
                <InnerContainer>
                    <Formik
                        initialValues={{username: ''}}
                        onSubmit={(values, {setSubmitting}) => {
                            console.log("Submitting")
                            if (values.username == '') {
                                handleMessage('Please enter your username.');
                                setSubmitting(false);
                            } else {
                                setMessage();
                                setMessageType();
                                handleForgottenPassword(values, setSubmitting);
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                <UserTextInput
                                    icon="person"
                                    placeholder="Enter your username"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={(text) => {
                                        handleChange('username')(text.toLowerCase().trim());
                                    }}
                                    onBlur={handleBlur('username')}
                                    value={values.username}
                                    style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                    colors={colors}
                                    autoCapitalize="none"
                                    autoCorrect={false}
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
        </>
    );
}

export default ForgottenPasswordScreen;

const UserTextInput = ({label, icon, colors, ...props}) => {
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
        </View>
    )
}
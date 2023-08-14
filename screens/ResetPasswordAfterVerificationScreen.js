import React, {useContext, useState} from 'react';
import {View, Image, ActivityIndicator} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { 
    ButtonText, 
    StyledButton,
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    StyledFormArea,
    MsgBox,
    SubTitle,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    InnerContainer
} from './screenStylings/styling';
import axios from 'axios';
import {ServerUrlContext} from '../components/ServerUrlContext';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { Formik } from 'formik';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import ParseErrorMessage from '../components/ParseErrorMessage';

const ResetPasswordAfterVerificationScreen = ({navigation, route}) => {
    const {colors, dark} = useTheme();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [hidePassword, setHidePassword] = useState(true);
    const {username, code} = route.params;
    const isFocused = useIsFocused();
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const handleChangePassword = (values, setSubmitting) => {
        const url = serverUrl + '/user/changepasswordwithverificationcode';
        const toSend = values;
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            console.log(message)
            console.log(status)
            console.log(data)

            if (status !== 'SUCCESS') {
                handleMessage(message,status);
            } else {
                handleMessage(message,status);
                setTimeout(() => {
                    isFocused ? navigation.replace('LoginScreen') : null;
                }, 1000);
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
    return(
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
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Change Password</TestText>
            </ChatScreen_Title>
            <KeyboardAvoidingWrapper>
                <InnerContainer>
                    <Formik
                        initialValues={{newPassword: '', confirmNewPassword: '', verificationCode: code, username: username}}
                        onSubmit={(values, {setSubmitting}) => {
                            console.log("Submitting")
                            if (values.newPassword == '' || values.confirmNewPassword == '') {
                                handleMessage('Please fill all the fields.');
                                setSubmitting(false);
                            } else if (values.newPassword !== values.confirmNewPassword) {
                                handleMessage('Passwords do not match.');
                                setSubmitting(false);
                            } else if (values.newPassword.length < 8) {
                                handleMessage('Your new password must be 8 characters or longer.');
                                setSubmitting(false);
                            } else {
                                setMessage();
                                setMessageType();
                                handleChangePassword(values, setSubmitting);
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                <UserTextInput
                                    icon="lock"
                                    placeholder="New Password"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
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
                                    icon="lock"
                                    placeholder="Confirm New Password"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('confirmNewPassword')}
                                    onBlur={handleBlur('confirmNewPassword')}
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

export default ResetPasswordAfterVerificationScreen;

const UserTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, colors, ...props}) => {
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (
                <RightIcon style={{top: 32}} onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={colors.brand}/>
                </RightIcon>
            )}
        </View>
    )
}
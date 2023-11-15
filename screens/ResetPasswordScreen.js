// Made with help from https://thoughtbot.com/blog/make-a-snazzy-code-input-in-react-native
import React, {useState, useContext, useRef, useEffect} from 'react';
import { Image, ActivityIndicator, View, Text, Pressable, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native';
import {
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
import TopNavBar from '../components/TopNavBar.js';

const ResetPasswordScreen = ({route, navigation}) => {
    const {colors, dark} = useTheme();
    const {username, email, fromAddress} = route.params;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const CODE_LENGTH = 8;
    const [code, setCode] = useState('');
    const codeDigitsArray = new Array(CODE_LENGTH).fill(0);
    const inputFocusRef = useRef(null);
    const [containerIsFocused, setContainerIsFocused] = useState(true);
    const [submitting, setSubmitting] = useState(false)
    const isFocused = useIsFocused();
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const toDigitInput = (_value, idx) => {
        const emptyInputChar = ' ';
        const digit = code[idx] || emptyInputChar;

        const isCurrentDigit = idx === code.length;
        const isLastDigit = idx === CODE_LENGTH - 1;
        const isCodeFull = code.length === CODE_LENGTH;

        const isFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        const containerStyle =
            containerIsFocused && isFocused
                ? {borderColor: colors.tertiary, borderWidth: 2, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 12, width: 30, marginHorizontal: 2}
                : {borderColor: colors.borderColor, borderWidth: 2, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 12, width: 30, marginHorizontal: 2};
    
        return (
          <View key={idx} style={containerStyle}>
            <Text style={{color: colors.tertiary, fontSize: 16, textAlign: 'center'}}>{digit}</Text>
          </View>
        );
    };

    useEffect(() => {
        if (code.length === CODE_LENGTH) {
            inputFocusRef?.current?.blur();
            setContainerIsFocused(false);
            handleCheckVerificationCode()
        }
    }, [code]);

    const handleOnPress = () => {
        inputFocusRef?.current?.focus();
        setContainerIsFocused(true);
    };

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleCheckVerificationCode = () => {
        handleMessage('', 'SUCCESS');
        setSubmitting(true);
        setContainerIsFocused(false)
        inputFocusRef?.current?.blur();
        const url = serverUrl + "/user/checkverificationcode"
        const toSend = {username: username, verificationCode: code, getAccountMethod: 'username', task: 'Check Before Reset Password'}
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, 'FAILED');
                setSubmitting(false);
                setContainerIsFocused(true);
                inputFocusRef?.current?.focus();
                return;
            } else {
                setCode('');
                isFocused ? navigation.navigate('ResetPasswordAfterVerificationScreen', {username: username, code: code}) : null
            }
            setSubmitting(false);
        }).catch((error) => {
            console.error(error)
            handleMessage(ParseErrorMessage(error), 'FAILED');
            setSubmitting(false);
            setContainerIsFocused(true);
            inputFocusRef?.current?.focus();
        })
    }

    const handleResendCode = () => {
        handleMessage('', 'SUCCESS');
        inputFocusRef?.current?.blur();
        setContainerIsFocused(false);
        setSubmitting(true);
        const url = serverUrl + '/user/sendemailverificationcode';
        const toSend = {username: username, getAccountMethod: 'username', task: 'Check Before Reset Password'};
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            console.log('Message: ' + message)
            console.log('Status: ' + status)
            console.log('Data: ' + data)

            if (status !== 'SUCCESS') {
                console.warn(message)
                handleMessage('An error occured while resending verification code. Try checking your network connection and then try again.');
            } else {
                handleMessage(('Resent code to ' + email + ' from ' + fromAddress), 'SUCCESS');
                setCode('');
                inputFocusRef?.current?.focus();
                setContainerIsFocused(true)
            }
            setSubmitting(false);
        }).catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        });
    }
    return (
        <>
            <TopNavBar screenName="Reset Password"/>
            <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginHorizontal: '5%'}}>An email with a verification code has been sent to {email} from {fromAddress}.</Text>
            <Text style={{color: colors.tertiary, fontSize: 16, textAlign: 'center', marginHorizontal: '5%'}}>If you can't find it please check your spam folder.</Text>
            <Text style={{color: colors.errorColor, fontSize: 16, textAlign: 'center', marginHorizontal: '5%'}}>Codes expire after 5 minutes from being sent.</Text>
            <MsgBox type={messageType}>{message}</MsgBox>
            <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
                <Pressable style={styles.inputsContainer} onPress={() => {submitting == false ? handleOnPress() : null}}>
                    {codeDigitsArray.map(toDigitInput)}
                </Pressable>
                {submitting == true ?
                    <ActivityIndicator size="large" color={colors.brand} style={{marginTop: 10}}/>
                :
                    <>
                        <StyledButton style={{marginTop: 10, paddingHorizontal: 5}} onPress={handleCheckVerificationCode}>
                            <ButtonText>Submit</ButtonText>
                        </StyledButton>
                        <TouchableOpacity onPress={handleResendCode} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 10}}>
                            <ButtonText style={{color: colors.brand, fontSize: 20}}>Resend new code</ButtonText>
                        </TouchableOpacity>
                    </>
                }
                <TextInput
                    value={code}
                    onChangeText={(text) => {setCode(text.toLowerCase().trim())}}
                    returnKeyType="done"
                    textContentType="oneTimeCode"
                    maxLength={CODE_LENGTH}
                    style={styles.hiddenCodeInput}
                    ref={inputFocusRef}
                    autoFocus={true}
                    onSubmitEditing={handleCheckVerificationCode}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </View>
        </>
    );
}

export default ResetPasswordScreen;

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

const styles = StyleSheet.create({
    inputsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    inputContainer: {
      borderColor: '#cccccc',
      borderWidth: 2,
      borderRadius: 4,
      padding: 12,
    },
    inputContainerFocused: {
      borderColor: '#0f5181',
    },
    hiddenCodeInput: {
      position: 'absolute',
      height: 0,
      width: 0,
      opacity: 0,
    },
  });
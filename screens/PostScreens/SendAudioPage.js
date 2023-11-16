import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@react-navigation/native';

// formik
import {Formik} from 'formik';

// icons
import Octicons from 'react-native-vector-icons/Octicons.js';

import {
    InnerContainer,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    MsgBox
} from '../screenStylings/styling.js';
import {View, ActivityIndicator, Text, Image, TouchableOpacity} from 'react-native';

import KeyboardAvoidingWrapper_NoScrollview from '../../components/KeyboardAvoidingWrapper_NoScrollview.js';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import TopNavBar from '../../components/TopNavBar.js';

const UserTextInput = ({label, icon, ...props}) => {
    const {colors} = useTheme();
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
        </View>
    )
}


const SendAudioPage = ({navigation}) => {
    const { colors, dark} = useTheme();
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [screenshotsAllowed, setScreenshotsAllowed] = useState(false);
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const handleLogin = (credentials, setSubmitting) => {
        alert("Coming soon")
        setSubmitting(false);
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    return(
        <KeyboardAvoidingWrapper_NoScrollview style={{backgroundColor: colors.primary}}>
            <View style={{backgroundColor: colors.primary}}>
                <TopNavBar screenName="Send Audio"/>
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
                                        <ActivityIndicator size="large" color={colors.primary} />
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

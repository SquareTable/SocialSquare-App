import React, {useState, useContext, useEffect} from 'react';

import { StatusBar } from 'expo-status-bar';

// formik
import {Formik} from 'formik';

global.Buffer = global.Buffer || require('buffer').Buffer

import nacl from 'tweet-nacl-react-native-expo'

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    StyledButton,
    ButtonText,
    Colors
} from './screenStylings/styling.js';
const {brand, primary, tertiary, darkLight, slightlyLighterGrey, midWhite, slightlyLighterPrimary, descTextColor} = Colors;

//From react native
import {View, Image, ActivityIndicator, ImageBackground, StyleSheet, ScrollView, TouchableOpacity, Text} from 'react-native';

// axios
import axios from 'axios';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';

import { useIsFocused } from '@react-navigation/native';

import { useTheme } from '@react-navigation/native';

import * as Linking from 'expo-linking';

import { ServerUrlContext } from '../components/ServerUrlContext.js';

const CreateDMConversation = ({route, navigation}) => {
    const {nameSent} = route.params;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [happenOnce, setHappenOnce] = useState(false)
    const [submittingCreate, setSubmittingCreate] = useState(false)
    const [allowCreationOfChat, setAllowCreationOfChat] = useState(true)
    const [errorOrigin, setErrorOrigin] = useState('')
    const {colors, dark} = useTheme();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    useEffect(() => {
        if (allowCreationOfChat == true) {
            if (nameSent !== null) {
                if (submittingCreate == false) {
                    const forAsync = async () => {
                        setSubmittingCreate(true)
                        
                        const nonce = await nacl.randomBytes(24)
    
                        console.log("Attempting to create a DM")
                        const url = serverUrl + "/conversations/createDirectMessage";
                        const toSend = {recipientName: nameSent, cryptographicNonce: nonce}
                        axios.post(url, toSend).then((response) => {
                            const result = response.data;
                            const {message, status, data} = result;
                            console.log(data)
    
                            if (status !== 'SUCCESS') {
                                if (message == "Direct Message Exists") {
                                    navigateToChat(data)
                                } else {
                                    setSubmittingCreate(false);
                                    handleMessage(message,status);
                                    setErrorOrigin('creating the DM');
                                    setAllowCreationOfChat(false)
                                }
                            } else {
                                forAsync();
                            }
    
                        }).catch(error => {
                            console.log(error);
                            setSubmittingCreate(false);
                            handleMessage(error + ' (network error)');
                            setErrorOrigin('creating the DM');
                            setAllowCreationOfChat(false)
                        })
                    }
                    forAsync()
                }
            } else {
                handleMessage("Error with recipient name sent over.");
                setErrorOrigin('creating the DM');
                setAllowCreationOfChat(false)
            }
        }
    }, [allowCreationOfChat])

    const navigateToChat = (chatId) => {
        const url = `${serverUrl}/conversations/singleConvoWithId/${chatId}`;
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            console.log(data)

            if (status !== 'SUCCESS') {
                handleMessage(message,status);
                setSubmittingCreate(false);
                setErrorOrigin('getting chat info from ID');
                setAllowCreationOfChat(false)
            } else {
                setSubmittingCreate(false)
                setAllowCreationOfChat(false)
                navigation.pop(3)
                navigation.navigate('Chat', {conversationId: data.conversationId, isDirectMessage: data.isDirectMessage, members: data.members, conversationImageB64: data.conversationImageB64, conversationTitleSent: data.conversationTitle, conversationNSFW: data.conversationNSFW, conversationNSFL: data.conversationNSFL, dateCreated: data.dateCreated, lastMessage: data.lastMessage, lastMessageDate: data.lastMessageDate, cryptographicNonce: data.cryptographicNonce, conversationDescription: data.conversationDescription, unreadsMessages: data.unreadsMessages});
            }

        }).catch(error => {
            console.log(error);
            setSubmittingCreate(false)
            handleMessage(error + ' (network error)');
            setErrorOrigin('getting chat info from ID');
            setAllowCreationOfChat(false)
        })
    }

    return(
        <>
            {allowCreationOfChat == true ?
                <StyledContainer style={{backgroundColor: colors.primary}}>
                        <StatusBar style={colors.StatusBarColor}/>
                        <InnerContainer style={{backgroundColor: colors.primary}}>
                            <PageLogo style={{tintColor: colors.tertiary, resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png')}/>
                            <PageTitle style={{color: colors.tertiary}}>Attempting to create conversation</PageTitle>
                            {submittingCreate == true && (
                                <ActivityIndicator size="large" color={colors.brand} style={{marginBottom: 20}} />  
                            )}
                        </InnerContainer>

                </StyledContainer>
            : message === 'Error with recipient name sent over.' ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary}}>
                    <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginBottom: 20}}>There is an error with the recipient name sent over</Text>
                    <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginBottom: 20}}>This is a fatal error and you cannot continue</Text>
                    <StyledButton style={{marginBottom: 20}} onPress={() => {navigation.goBack()}}>
                        <ButtonText>Go Back</ButtonText>
                    </StyledButton>
                    <StyledButton onPress={() => {Linking.openURL('https://github.com/SquareTable/SocialSquare-App/issues/new?assignees=&labels=&template=bug-report.md&title=Write+Bug+Title+here')}}>
                        <ButtonText>Report Bug</ButtonText>
                    </StyledButton>
                </View>
            :
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>An error occured while {errorOrigin}.</Text>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Specifically the error was:</Text>
                    <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginBottom: 20}}>{message}</Text>
                    <StyledButton style={{marginBottom: 20}} onPress={() => {navigation.goBack()}}>
                        <ButtonText>Go Back</ButtonText>
                    </StyledButton>
                    <StyledButton onPress={() => {setAllowCreationOfChat(true)}}>
                        <ButtonText>Try Again</ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    );
}

export default CreateDMConversation;

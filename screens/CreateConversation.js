import React, {useState, useContext, useEffect} from 'react';

import { StatusBar } from 'expo-status-bar';

global.Buffer = global.Buffer || require('buffer').Buffer

import nacl from 'tweet-nacl-react-native-expo'

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
    AboveButtonText,
    PostHorizontalView,
    CheckBoxForPosts,
    PostIcons
} from './screenStylings/styling.js';
const {brand, primary, tertiary, darkLight, slightlyLighterGrey, midWhite, slightlyLighterPrimary, descTextColor} = Colors;

//From react native
import {View, Image, ActivityIndicator, ImageBackground, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

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

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import TopNavBar from '../components/TopNavBar.js';

const ConversationCreationPage = ({route, navigation}) => {
    const isFocused = useIsFocused();
    const [hidePassword, setHidePassword] = useState(true);
    const {conversationTitle, conversationDescription, sentConversationMembers, sentConversationNSFW, sentConversationNSFL} = route.params;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [conversationIsNSFW, setConversationIsNSFW] = useState(false);
    const [conversationIsNSFL, setConversationIsNSFL] = useState(false);
    const [selectFormat, setSelectFormat] = useState("Text");
    const [submitting, setSubmitting] = useState(false)
    const [selectedTitle, setSelectedTitle] = useState("")
    const [selectedDescription, setSelectedDescription] = useState("")
    const [selectedNSFW, setSelectedNSFW] = useState(false)
    const [initialUsersState, setInitialUsersState] = useState(null)
    const [selectedNSFL, setSelectedNSFL] = useState(false)
    const [membersInChat, setMembersInChat] = useState([])
    const [changeOnce, setChangeOnce] = useState(false)
    const {colors, dark} = useTheme();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);

    function reloadMembers () {
        if (sentConversationMembers !== null) {
            if (membersInChat !== sentConversationMembers) {
                setMembersInChat(null)
                setMembersInChat(sentConversationMembers)
                console.log("Changed conversation members")
            }
        } else {
            console.log("Null convo-members")
        }
    }

    if (sentConversationMembers !== null) {
        if (membersInChat !== sentConversationMembers) {
            setMembersInChat(null)
            setMembersInChat(sentConversationMembers)
            console.log("Changed conversation members")
        }
    } else {
        console.log("Null convo-members")
    }


    if (changeOnce == false) {
        if (conversationTitle !== null) {
            if (selectedTitle !== conversationTitle) {
                setSelectedTitle()
                setSelectedTitle(conversationTitle)
            }
        }
        if (conversationDescription !== null) {
            if (selectedDescription !== conversationDescription) {
                setSelectedDescription()
                setSelectedDescription(conversationDescription)
            }
        }
        if (sentConversationNSFW !== null) {
            if (selectedNSFW !== sentConversationNSFW) {
                setSelectedNSFW()
                setSelectedNSFW(sentConversationNSFW)
            }
        }
        if (sentConversationNSFL !== null) {
            if (selectedNSFL !== sentConversationNSFL) {
                setSelectedNSFL()
                setSelectedNSFL(sentConversationNSFL)
            }
        }
        setChangeOnce(true)
    }

    const handleCreateConversation = async (credentials) => {
        handleMessage(null);
        if (membersInChat !== null) {
            
            const nonce = await nacl.randomBytes(24)

            const url = serverUrl + "/conversations/create";
            const toSend = {conversationTitle: credentials.conversationTitle, conversationDescription: credentials.conversationDescription, conversationMembers: membersInChat, conversationNSFW: credentials.conversationNSFW, conversationNSFL: credentials.conversationNSFL, cryptographicNonce: nonce}
            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    handleMessage(message,status);
                    setSubmitting(false);
                } else {
                    handleMessage(message,status);
                    setSubmitting(false);
                    navigation.navigate("Conversations")
                }

            }).catch(error => {
                console.log(error);
                setSubmitting(false);
                handleMessage("An error occured. Try checking your network connection and retry.");
            })
        }
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    useEffect(() => {
        console.log("Reload Page")
        reloadMembers()
    },[isFocused]);

    return(
        <>
            <TopNavBar screenName="Create a Conversation"/>
            <KeyboardAvoidingWrapper style={{backgroundColor: colors.primary}}>
                <StyledContainer style={{backgroundColor: colors.primary}}>
                        <StatusBar style={colors.StatusBarColor}/>
                        <InnerContainer style={{backgroundColor: colors.primary}}>
                            <Formik
                                initialValues={{conversationTitle: selectedTitle, conversationDescription: selectedDescription, conversationMembers: membersInChat, conversationNSFW: selectedNSFW, conversationNSFL: selectedNSFL}}
                                onSubmit={(values, {setSubmitting}) => {
                                    console.log("Submitting")
                                    if (values.conversationTitle == "") {
                                        handleMessage('Please add a title.');
                                        setSubmitting(false);
                                    } else {
                                        if (membersInChat.length <= 1) {
                                            handleMessage("A conversation needs at least 3 members")
                                        } else {
                                            handleCreateConversation(values);
                                        }
                                    }
                                }}
                            >
                                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                    <StyledFormArea theOutline={true}>
                                        <UserTextInput
                                            label="Title"
                                            icon="note"
                                            placeholder=""
                                            placeholderTextColor={colors.tertiary}
                                            onChangeText={handleChange('conversationTitle')}
                                            onBlur={handleBlur('conversationTitle')}
                                            value={values.conversationTitle}
                                            colors={colors}
                                        />
                                        <UserTextInput
                                            label="Description"
                                            icon="note"
                                            placeholder=""
                                            placeholderTextColor={tertiary}
                                            onChangeText={handleChange('conversationDescription')}
                                            onBlur={handleBlur('conversationDescription')}
                                            value={values.conversationDescription}
                                            colors={colors}
                                        />
                                        <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 10}}>
                                            <PostIcons style={{width: 30, height: 30, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png')}/>
                                            <SubTitle style={{marginBottom: 0, fontWeight: 'normal', color: colors.tertiary}}>{membersInChat.length + 1}/14</SubTitle>
                                        </View>
                                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}} onPress={() => {
                                                console.log(sentConversationMembers)
                                                navigation.navigate("ConversationUserFind", {conversationTitle: values.conversationTitle, conversationDescription: values.conversationDescription, initialUsers: membersInChat, conversationNSFW: false, conversationNSFL: false})
                                            }}>
                                            <SubTitle style={{borderRadius: 1000, width: 30, height: 32.5, textAlign: 'center', fontWeight: 'normal', marginRight: 8, color: colors.tertiary, fontSize: 24}}>+</SubTitle>
                                            <SubTitle style={{color: colors.tertiary}}>Add/Remove Users</SubTitle>
                                        </TouchableOpacity>
                                        <PostHorizontalView centerAlign={true}>
                                            <CheckBoxForPosts selectedState={conversationIsNSFW} onPress={() => {
                                                if (values.conversationNSFW == true) {
                                                    setConversationIsNSFL(false)
                                                    values.conversationNSFL = false
                                                    setConversationIsNSFW(false)
                                                    values.conversationNSFW = false
                                                } else {
                                                    setConversationIsNSFL(false)
                                                    values.conversationNSFL = false
                                                    setConversationIsNSFW(true)
                                                    values.conversationNSFW = true
                                                }
                                            }}/>
                                            <AboveButtonText byCheckBox={true} style={{color: colors.tertiary}}>Mark as NSFW</AboveButtonText>
                                        </PostHorizontalView>
                                        <PostHorizontalView centerAlign={true}>
                                            <CheckBoxForPosts selectedState={conversationIsNSFL} onPress={() => {
                                                if (values.conversationNSFL == true) {
                                                    setConversationIsNSFL(false)
                                                    values.conversationNSFL = false
                                                    setConversationIsNSFW(false)
                                                    values.conversationNSFW = false
                                                } else {
                                                    setConversationIsNSFL(true)
                                                    values.conversationNSFL = true
                                                    setConversationIsNSFW(false)
                                                    values.conversationNSFW = false
                                                }
                                            }}/>
                                            <AboveButtonText byCheckBox={true} style={{color: colors.tertiary}}>Mark as NSFL</AboveButtonText>
                                        </PostHorizontalView>
                                        <MsgBox type={messageType}>{message}</MsgBox>
                                        {!submitting && (<StyledButton style={{backgroundColor: colors.brand}} onPress={() => {
                                            setSubmitting(true)
                                            handleSubmit()
                                        }}>
                                            <ButtonText> Submit </ButtonText>
                                        </StyledButton>)}

                                        {submitting && (<ActivityIndicator size="large" color={colors.brand} />)}
                                        
                                    </StyledFormArea>)}
                            </Formik>
                        </InnerContainer>

                </StyledContainer>
            </KeyboardAvoidingWrapper>
        </>
    );
}

const UserTextInput = ({label, icon, body, colors, ...props}) => {
    if (body == true) {
        return(
            <View>
                <LeftIcon searchIcon={true}>
                    <Octicons name={icon} size={30} color={colors.brand} />
                </LeftIcon>
                <StyledInputLabel style={{color: colors.tertiary}}>{label}</StyledInputLabel>
                <StyledTextInput searchPage={true} style={{borderColor: colors.borderColor, borderRadius: 10, color: colors.tertiary}} {...props}/>
            </View>
        )
    } else {
        return(
            <View>
                <StyledInputLabel style={{color: colors.tertiary}}>{label}</StyledInputLabel>
                <StyledTextInput searchPage={true} style={{borderColor: colors.borderColor, borderRightWidth: 0, borderTopWidth: 0, borderRadius: 2, backgroundColor: colors.primary, paddingLeft: 10, color: colors.tertiary}} {...props}/>
            </View>
        )
    }
}

export default ConversationCreationPage;

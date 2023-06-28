import React, {useState, useContext, useRef, useCallback} from 'react';
import { StatusBar } from 'expo-status-bar';
import { createChatKeys } from "../tweetNacl.js";

global.Buffer = global.Buffer || require('buffer').Buffer

import nacl from 'tweet-nacl-react-native-expo'

import { SafeAreaView } from 'react-native-safe-area-context';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import * as SecureStore from 'expo-secure-store';

import Clipboard from 'expo-clipboard';

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
    SearchBarArea,
    PostsHorizontalView,
    PostsVerticalView,
    PostCreatorIcon,
    PostIcons,
    WelcomeContainer,
    SearchFrame,
    Avatar,
    SearchHorizontalView,
    SearchHorizontalViewItem,
    SearchHorizontalViewItemCenter,
    SearchSubTitle,
    ProfIcons
} from './screenStylings/styling.js';
import {View, ActivityIndicator, ImageBackground, SectionList, StyleSheet, Image, Dimensions, Keyboard, KeyboardEvent, KeyboardAvoidingView, Text, Animated, Switch, AppState, Platform} from 'react-native';

// Colors
const {brand, primary, tertiary, darkLight, descTextColor, slightlyLighterPrimary, slightlyLighterGrey, red, yellow, darkestBlue, darkest} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

//Image picker
import * as ImagePicker from 'expo-image-picker';


// API client
import axios from 'axios';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '@react-navigation/native';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';
import { SocketContext } from '../components/socketHandler.js';
import { ReconnectPromptContext } from '../components/reconnectPrompt.js';
import { FlatList, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { color, set } from 'react-native-reanimated';

import AntDesign from 'react-native-vector-icons/AntDesign';

import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';

import { BlurView } from 'expo-blur';
import * as ScreenCapture from 'expo-screen-capture';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';


function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}


const Chat = ({route, navigation}) => {
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {socket, setSocket} = useContext(SocketContext);
    const {reconnectPrompt, setReconnectPrompt} = useContext(ReconnectPromptContext);
    const prevReconnectPrompt = usePrevious(reconnectPrompt);
    const [hidePassword, setHidePassword] = useState(true);
    const {conversationId, conversationTitleSent, cryptographicNonce, conversationDescriptionSent, isDirectMessage, conversationNSFW, conversationNSFL} = route.params;
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [conversations, setConversations] = useState();
    const [conversationTitle, setConversationTitle] = useState(conversationTitleSent)
    const [conversationDescription, setConversationDescription] = useState(conversationDescriptionSent)
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [pfpB64s, setPfpB64s] = useState([])
    const [loadingConversation, setLoadingConversation] = useState(false)
    const [checkingForConversationValues, setCheckingForConversationValues] = useState(false)
    const [generatingEncryptionKeys, setGeneratingEncryptionKeys] = useState(false)
    const [errorCheckingForEncryption, setErrorCheckingForEncryption] = useState(null)
    const [errorGeneratingEncryptionKeys, setErrorGeneratingEncryptionKeys] = useState(false)
    const [sendingOrLoadingMessageIndicator, setSendingOrLoadingMessageIndicator] = useState(false)
    const [socketAllow, setSocketAllow] = useState(false)
    const scrollRef = useRef();
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    var scrollOffset = 0
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [membersInChat, setMembersInChat] = useState([])
    const [encryptionOn, setEncryptionOn] = useState()
    const [encryptionLoading, setEncryptionLoading] = useState(false)
    const [screenshotLoading, setScreenshotLoading] = useState(false)
    const [screenShotsOn, setScreenShotsOn] = useState(false)
    const [changingIfEncryptionOn, setChangingIfEncryptionOn] = useState(false)
    const [groupIcon, setGroupIcon] = useState("")
    const [loadingGroupIcon, setLoadingGroupIcon] = useState(false)
    const [changingGroupIcon, setChangingGroupIcon] = useState(false)
    const [removedFromConversation, setRemovedFromConversation] = useState(false)
    const [newTitleValue, setNewTitleValue] = useState("")
    const [newDescriptionValue, setNewDescriptionValue] = useState("")
    const [transferringOwnership, setTransferringOwnership] = useState("")
    const [transferOwnershipConfirm, setTransferOwnershipConfirm] = useState(null)
    const [titleLoading, setTitleLoading] = useState(false)
    const [descriptionLoading, setDescriptionLoading] = useState(false)
    const [lastMessageSeen, setLastMessageSeen] = useState([])
    const [loadingSeenMessages, setLoadingSeenMessages] = useState(false)
    const [seenMessagesStringValue, setSeenMessagesStringValue] = useState("")
    const [messageOptionsOpen, setMessageOptionsOpen] = useState(null)
    const thisUserLMS = useRef('')
    const [unreadsWithinSingularConversation, setUnreadsWithinSingularConversation] = useState(0)
    const [scrollToBottomIsVisible, setScrollToBottomIsVisible] = useState(false)
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {_id, secondId, name} = storedCredentials;
    const [usersWithinChat, setUsersWithinChat] = useState([]) 
    const [usersPFPData, setUsersPFPData] = useState([])
    const [thisUserIsOwner, setThisUserIsOwner] = useState(false)
    const [removingUser, setRemovingUser] = useState(false)
    const [addingUser, setAddingUser] = useState(false)
    const [addMemberSearch, setAddMemberSearch] = useState(false)
    const [changeSections, setChangeSections] = useState([])
    const [loadingOne, setLoadingOne] = useState()
    var usersLoading = []

    // Leave conversation confirmation warning
    const LeaveConversationConfirmationBoxOpacity = useRef(new Animated.Value(0)).current;

    //NSFW / NSFL warning showing
    const [showAgeWarning, setShowAgeWarning] = useState(false);

    //Blur View for when app is backgrounded to prevent screenshots
    const screenshotsPreventingBlurViewOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (conversationNSFL == true || conversationNSFW == true) {
            setShowAgeWarning(true)
        }
    }, [])

    var userLoadMax = 10;

    //Colors
    const {colors, dark} = useTheme();

    //any image honestly
    useEffect(()=>{
        if (arrivalMessage !== null) {
            setMessages((prev)=>[...prev, arrivalMessage])
            setLatestViewedMessage([])
        }
    }, [arrivalMessage])

    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data).catch(error => {
            console.log(error);
        })
    }
    
    const [latestViewedMessage, setLatestViewedMessage] = useState()

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 40;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const getGroupIcon = () => {
        const url = `${serverUrl}/conversations/getGroupIcon/${conversationId}/${_id}`;
        setLoadingGroupIcon(true)
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                console.log(status)
                console.log(message)
                setLoadingGroupIcon(false)
            } else {
                console.log(status)
                console.log(message)
                axios.get(`${serverUrl}/getImageOnServer/${data}`)
                .then((response) => {
                    //set image
                    if (response.data) {
                        //convert back to image
                        var base64Icon = `data:image/jpeg;base64,${response.data}`
                        setGroupIcon(base64Icon)
                        setLoadingGroupIcon(false)
                    } else {
                        setGroupIcon(SocialSquareLogo_B64_png)
                        setLoadingGroupIcon(false)
                    }
                })
                .catch(function (error) {
                    console.log("Image not recieved")
                    console.log(error);
                });
            }
            //setSubmitting(false);

        }).catch(error => {
            console.log(error);
            //setSubmitting(false);
            setLoadingGroupIcon(false)
            handleMessage("An error occured. Try checking your network connection and retry.");
        })
    }

    //Encryption Stuff
    
    async function saveEncryptionKeys(key, value) {
        await SecureStore.setItemAsync(key, value);
    }
      
    async function getValueForEncryptionKeys(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            return result;
        } else {
            return null
        }
    }

    const createKeysForEncryption = async () => {
        setGeneratingEncryptionKeys(true)
        const generatedKeyPair = await createChatKeys()
        if (generatedKeyPair == null || typeof generatedKeyPair == "undefined") {
            console.log("Error Creating Keys")
            handleMessage("Error Creating Keys", "FAILED")
            return null;
        } else {
            console.log(`Pub Key ${generatedKeyPair.publicKey}`)
            console.log(`Priv Key ${generatedKeyPair.secretKey}`)
            const url = serverUrl + "/conversations/sendpublicencryptionkey";
            axios.post(url, {publicKey: generatedKeyPair.publicKey, conversationId: conversationId, sentId: _id}).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== "SUCCESS") {
                    console.log(status)
                    console.log(message)
                    handleMessage(message, status)
                } else {
                    //Change encryption keys with uuids too
                    console.log(status)
                    console.log(message)
                    if (typeof data.keysUniqueId !== "undefined") {
                        try {
                            const asyncForSaving = async () => {
                                saveEncryptionKeys(data.keysUniqueId, generatedKeyPair.secretKey)
                                return generatedKeyPair;
                            }
                            asyncForSaving()
                        } catch (error) {
                            console.error(error);
                            handleMessage("Error occured while saving secret encryption key", "FAILED")
                            return null;
                        }
                    } else {
                        handleMessage("Error reciever uuid (client-side)", "FAILED")
                        return null;
                    }
                }
            }).catch(error => {
                console.log(error)
                handleMessage("An error occured. Try checking your network connection and retry.");
                return null;
            })
        }
    }

    const checkForEncryption = () => {
        setCheckingForConversationValues(true)
        const url = `${serverUrl}/conversations/checkForEncryption/${_id}/${conversationId}`;
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                        
            if (status !== 'SUCCESS') {
                console.log(status)
                console.log(message)
                if (message == "Public Key Not Found") {
                    setEncryptionOn(true)
                    const asyncForCreationOne = async () => {
                        setCheckingForConversationValues(false)
                        const createdKeys = await createKeysForEncryption()
                        if (createdKeys !== null) {
                            setGeneratingEncryptionKeys(false)
                        } else {
                            setGeneratingEncryptionKeys(false)
                            setErrorGeneratingEncryptionKeys(true)
                        }
                    }
                    asyncForCreationOne()
                } else {
                    setCheckingForConversationValues(false)
                    setErrorCheckingForEncryption(message)
                }
            } else {
                console.log(status)
                console.log(message)
                if (message == "Encryption Key Found") {   
                    setEncryptionOn(true)
                    const checkIfKeyIsStored = async () => {
                        setCheckingForConversationValues(false)
                        const foundPrivKey = await getValueForEncryptionKeys(data.keysUniqueId)
                        if (foundPrivKey !== null) {
                            setCheckingForConversationValues(false)
                        } else {
                            const asyncForCreationTwo = async () => {
                                setCheckingForConversationValues(false)
                                const createdKeys = await createKeysForEncryption()
                                if (createdKeys !== null) {
                                    setGeneratingEncryptionKeys(false)
                                } else {
                                    setGeneratingEncryptionKeys(false)
                                    setErrorGeneratingEncryptionKeys(true)
                                }
                            }
                            asyncForCreationTwo()
                        }
                    }
                    checkIfKeyIsStored()
                } else {
                    //Chat not encrypted
                    console.log("Chat Not Encrypted")
                    setEncryptionOn(false)
                    setCheckingForConversationValues(false)
                }
            }
    
        }).catch(error => {
            console.log(error);
            setLoadingConversation(false)
            setErrorCheckingForEncryption("An error occured. Try checking your network connection and retry.")
        })
    }

    const checkForScreenshotsAllowed = () => {
        setScreenshotLoading(true)
        const url = `${serverUrl}/conversations/checkForScreenshotsAllowed/${_id}/${conversationId}`;
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                        
            if (status !== 'SUCCESS') {
                console.log(status)
                console.log(message)
                setScreenshotLoading(false)
            } else {
                console.log(status)
                console.log(message)
                if (message == "ScreenShots allowed.") {   
                    setScreenShotsOn(true)
                    setScreenshotLoading(false)
                } else {
                    setScreenShotsOn(false)
                    setScreenshotLoading(false)
                }
            }
    
        }).catch(error => {
            console.log(error);
            setScreenshotLoading(false)
        })
    }

    //Load conversation Completely
    //Load all images once so it doesnt have to happen for each key, re-do the category load if there is a new key introduced, do the same for names etc.

    const checkIfImageIsLoaded = (keyForTest) => {
        if (usersPFPData.includes(keyForTest)) {
            console.log("Image has already been loaded.")
        } else {
            console.log(`Loading new image key: ${keyForTest}`)
            async function forAsync () {
                //get image
                var thisImage = await getImageWithKey(keyForTest)
                var imageB64s = usersPFPData.slice()
                imageB64s.push({imageKey: keyForTest, b64: thisImage})
                setUsersPFPData(imageB64s)
            }
            forAsync()
        }
    }

    const seenFilterAndTurnToString = () => {
        console.log("Getting string of viewed")
        var stringValue = ""
        var itemsProcessed = 0;
        if (lastMessageSeen !== []) {
            const pubIdsProcessed = []
            lastMessageSeen.forEach(function (item, index) {
                if (messages !== []) {
                    if (membersInChat !== []) {
                        if (pubIdsProcessed.includes(item.secondId) == false) {
                            console.log(index, item)
                            console.log(item.messagesId)
                            console.log(messages[messages.length-1].messagesId)
                            if (item.messagesId == messages[messages.length-1].messagesId) {
                                const indexOfMemberInChat = membersInChat.findIndex(x => x.pubId == item.secondId)
                                console.log("Found one that has seen")
                                if (indexOfMemberInChat !== -1) {
                                    console.log(membersInChat[indexOfMemberInChat])
                                    if (membersInChat[indexOfMemberInChat].displayName !== "") {
                                        var stringMerged = stringValue.concat(`${membersInChat[indexOfMemberInChat].displayName}, `)
                                        stringValue = stringMerged
                                        pubIdsProcessed.push(item.secondId)
                                        console.log(`display name concat complete ${stringValue}`)
                                        itemsProcessed++;
                                        if (itemsProcessed == lastMessageSeen.length) {
                                            if (stringValue !== "") {
                                                var str = stringValue.slice(0, -2); 
                                                console.log(`stringVal of seen ${str}`)
                                                setSeenMessagesStringValue(str)
                                            } else {
                                                console.log("At 1 setting message string val: 0")
                                                setSeenMessagesStringValue("0")
                                            }
                                        }
                                    } else {
                                        var stringMerged = stringValue.concat(`${membersInChat[indexOfMemberInChat].name}, `)
                                        stringValue = stringMerged
                                        pubIdsProcessed.push(item.secondId)
                                        console.log(`name concat complete ${stringValue}`)
                                        itemsProcessed++;
                                        if (itemsProcessed == lastMessageSeen.length) {
                                            if (stringValue !== "") {
                                                var str = stringValue.slice(0, -2); 
                                                console.log(`stringVal of seen ${str}`)
                                                setSeenMessagesStringValue(str)
                                            } else {
                                                console.log("At 2 setting message string val: 0")
                                                setSeenMessagesStringValue("0")
                                            }
                                        }
                                    }
                                } else {
                                    console.log("indexOfMemberInChat is -1")
                                    var stringMerged = stringValue.concat(`Couldn't Get Name, `)
                                    stringValue = stringMerged
                                    pubIdsProcessed.push(item.secondId)
                                    itemsProcessed++;
                                    if (itemsProcessed == lastMessageSeen.length) {
                                        if (stringValue !== "") {
                                            var str = stringValue.slice(0, -2); 
                                            console.log(`stringVal of seen ${str}`)
                                            setSeenMessagesStringValue(str)
                                        } else {
                                            console.log("At 3 setting message string val: 0")
                                            setSeenMessagesStringValue("0")
                                        }
                                    }
                                }
                            } else {
                                itemsProcessed++;
                                if (itemsProcessed == lastMessageSeen.length) {
                                    if (stringValue !== "") {
                                        var str = stringValue.slice(0, -2); 
                                        console.log(`stringVal of seen ${str}`)
                                        setSeenMessagesStringValue(str)
                                    } else {
                                        console.log("At 4 setting message string val: 0")
                                        setSeenMessagesStringValue("0")
                                    }
                                }
                            }
                        } else {
                            itemsProcessed++;
                            if (itemsProcessed == lastMessageSeen.length) {
                                if (stringValue !== "") {
                                    var str = stringValue.slice(0, -2); 
                                    console.log(`stringVal of seen ${str}`)
                                    setSeenMessagesStringValue(str)
                                } else {
                                    console.log("At 5 setting message string val: 0")
                                    setSeenMessagesStringValue("0")
                                }
                            }
                        } 
                    }
                }
            })
        } else {
            console.log("Get string of viewed returning 0")
            setSeenMessagesStringValue("0")
        }
    }

    useEffect(() => {
        if (lastMessageSeen !== []) {
            if (messages !== []) {
                if (membersInChat !== []) {
                    seenFilterAndTurnToString()
                }
            }
        }
    }, [lastMessageSeen, messages, membersInChat]);

    const getSeenAmountForMessages = (messagesData) => {
        setLoadingSeenMessages(true)
        const url = `${serverUrl}/conversations/getSeenMessages/${_id}/${currentChat}/${messagesData[messagesData.length-1].messagesId}`;
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            
            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setLoadingSeenMessages(false)
            } else {
                if (message !== "None Seen") {
                    console.log("SUCCESS GETTING SEEN AMOUNT FOR MESSAGES")
                    const addToLMSArray = []
                    var itemsProcessed = 0;
                    data.forEach(function (item, index) {
                        if (lastMessageSeen.findIndex(x => x.secondId == data[index].userThatViewed && x.messagesId == data[index].messageViewedId) == -1) {
                            addToLMSArray.push({secondId: data[index].userThatViewed, messagesId: data[index].messageViewedId})
                            itemsProcessed++;
                            if (itemsProcessed == data.length) {
                                setLastMessageSeen((prev)=>[...prev.concat(addToLMSArray)])
                                setLoadingSeenMessages(false)
                            }
                        } else {
                            itemsProcessed++; 
                            if (itemsProcessed == data.length) {
                                if (addToLMSArray.length == 0) {
                                    setLoadingSeenMessages(false)
                                } else {
                                    setLastMessageSeen((prev)=>[...prev.concat(addToLMSArray)])
                                    setLoadingSeenMessages(false)
                                }
                            } 
                        }
                    })
                } else {
                    console.log("None Seen")
                    setLoadingSeenMessages(false)
                }
            }
        }).catch(error => {
            console.log(error)
            handleMessage(error)
            setLoadingSeenMessages(false)
        })
        
    }

    const getMessages = async () => {
        console.log("Get Messages")
        if (currentChat == null || currentChat == "") {
            //
            console.log("Not an actual value")
        } else {
            //console.log(currentChat)
            const url = `${serverUrl}/messages/firsttwenty/${currentChat}`;
            axios.get(url).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                    
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setLoadingConversation(false)
                } else {
                    console.log("SUCCESS GETTING MESSAGES")
                    console.log(data)
                    function sortAndSet (allData) {
                        console.log("Sorting")
                        /* happens in the backend too */
                        const sortedMessages = allData.sort(function(a, b){
                            var first = a.datePosted.split(" ")[0];
                            var second = b.datePosted.split(" ")[0];
                            if (first !== second) {
                                var aa = first.split('/').reverse().join(),
                                    bb = second.split('/').reverse().join();
                                //console.log(`aa ${aa}`)
                                //console.log(`bb ${bb}`)
                                return aa < bb ? -1 : (aa > bb ? 1 : 0);
                            } else {
                                var ind11 = a.datePosted.indexOf(' ');
                                var ind12 = a.datePosted.indexOf(' ', ind11 + 1);
                                var firstTime = a.datePosted.substring(ind12);
                                //console.log(firstTime)
                                var ind21 = b.datePosted.indexOf(' ');
                                var ind22 = b.datePosted.indexOf(' ', ind21 + 1);
                                var secondTime = b.datePosted.substring(ind22);
                                //console.log(ind22)
                                return firstTime < secondTime ? -1 : (firstTime > secondTime ? 1 : 0);
                            }
                        });
                        //console.log("sorted messages:")
                        //console.log(sortedMessages)
                        setMessages(sortedMessages)
                        getSeenAmountForMessages(sortedMessages)
                        handleMessage("Search Complete", "SUCCESS");
                        setLoadingConversation(true)
                        setLoadingConversation(false)
                    }
                    if (data.length !== 0) {
                        const afterRecievingKeysId = (thisUsersPublicKeyObject, uint8Nonce) => {
                            console.log("after recieving keys id")
                            var itemsProcessed = 0;
                            var allData = []
                            data.forEach(function(item, index) {
                                const forAsync = async () => {
                                    if (data[index].isServerMessage !== true) {
                                        if (data[index].isEncrypted == true) {
                                            const keyUUID = thisUsersPublicKeyObject.keysUniqueId
                                            console.log("Encrypted")
                                            if (data[index].encryptedChatText !== null) {
                                                console.log(data[index])
                                                const foundIndexOfThisUsersMessage = await data[index].encryptedChatText.findIndex(x => x.keysUniqueId == keyUUID);
                                                console.log(`Found index: ${foundIndexOfThisUsersMessage}`)
                                                if (foundIndexOfThisUsersMessage !== -1) {
                                                    const isUsersKey = await getValueForEncryptionKeys(keyUUID)
                                                    if (isUsersKey !== null) {
                                                        console.log("Decode")
                                                        const decodedPrivKey = await nacl.util.decodeBase64(isUsersKey)
                                                        const forAsync = async () => {
                                                            
                                                            const decodedPubKey = await nacl.util.decodeBase64(data[index].encryptedChatText[foundIndexOfThisUsersMessage].pubkey)
    
                                                            const nonce = uint8Nonce
    
                                                            const messageDecoded = await nacl.util.decodeBase64(data[index].encryptedChatText[foundIndexOfThisUsersMessage].encryptedString)
                                                            //console.log(`message Decoded: ${messageDecoded}`)
                                                            const messageDecrypted = await nacl.box.open(messageDecoded, nonce, decodedPubKey, decodedPrivKey)
                                                            //console.log(`message Decrypted: ${messageDecrypted}`)
                                                            const messageEncoded = await nacl.util.encodeUTF8(messageDecrypted)
                                                            //console.log(`message Encoded: ${messageEncoded}`)
    
                                                            //
                                                            if (data[index].senderImageKey !== "") {
                                                                checkIfImageIsLoaded(data[index].senderImageKey)
                                                                //push
                                                                var toPush = {
                                                                    messagesId: data[index]._id,
                                                                    publicId: data[index].publicId,
                                                                    senderName: data[index].senderName,
                                                                    senderImageKey: data[index].senderImageKey,
                                                                    senderDisplayName: data[index].senderDisplayName,
                                                                    chatText: "",
                                                                    datePosted: data[index].datePosted,
                                                                    dateUpdated: data[index].dateUpdated,
                                                                    encryptedChatText: messageEncoded,
                                                                    isServerMessage: data[index].isServerMessage,
                                                                    involvedIds: data[index].involvedIds
                                                                }
                                                                allData.push(toPush)
                                                                itemsProcessed++;
                                                                if (itemsProcessed == data.length) {
                                                                    sortAndSet(allData)
                                                                }
                                                            } else {
                                                                //push
                                                                var toPush = {
                                                                    messagesId: data[index]._id,
                                                                    publicId: data[index].publicId,
                                                                    senderName: data[index].senderName,
                                                                    senderImageKey: "",
                                                                    senderDisplayName: data[index].senderDisplayName,
                                                                    chatText: "",
                                                                    datePosted: data[index].datePosted,
                                                                    dateUpdated: data[index].dateUpdated,
                                                                    encryptedChatText: messageEncoded,
                                                                    isServerMessage: data[index].isServerMessage,
                                                                    involvedIds: data[index].involvedIds
                                                                }
                                                                allData.push(toPush)
                                                                itemsProcessed++;
                                                                if (itemsProcessed == data.length) {
                                                                    sortAndSet(allData)
                                                                }
                                                            }
                                                        }
                                                        forAsync()            
                                                    } else {
                                                        console.log("No Pub Found")
                                                        if (data[index].senderImageKey !== "") {
                                                            checkIfImageIsLoaded(data[index].senderImageKey)
                                                            //push
                                                            var toPush = {
                                                                messagesId: data[index]._id,
                                                                publicId: data[index].publicId,
                                                                senderName: data[index].senderName,
                                                                senderImageKey: data[index].senderImageKey,
                                                                senderDisplayName: data[index].senderDisplayName,
                                                                chatText: "",
                                                                datePosted: data[index].datePosted,
                                                                dateUpdated: data[index].dateUpdated,
                                                                encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                                isServerMessage: data[index].isServerMessage,
                                                                involvedIds: data[index].involvedIds
                                                            }
                                                            allData.push(toPush)
                                                            itemsProcessed++;
                                                            if (itemsProcessed == data.length) {
                                                                sortAndSet(allData)
                                                            }
                                                        } else {
                                                            //push
                                                            var toPush = {
                                                                messagesId: data[index]._id,
                                                                publicId: data[index].publicId,
                                                                senderName: data[index].senderName,
                                                                senderImageKey: "",
                                                                senderDisplayName: data[index].senderDisplayName,
                                                                chatText: "",
                                                                datePosted: data[index].datePosted,
                                                                dateUpdated: data[index].dateUpdated,
                                                                encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                                isServerMessage: data[index].isServerMessage,
                                                                involvedIds: data[index].involvedIds
                                                            }
                                                            allData.push(toPush)
                                                            itemsProcessed++;
                                                            if (itemsProcessed == data.length) {
                                                                sortAndSet(allData)
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    console.log("Didnt Find the Key for this message")
                                                    console.log("No Pub Found")
                                                    if (data[index].senderImageKey !== "") {
                                                        checkIfImageIsLoaded(data[index].senderImageKey)
                                                        //push
                                                        var toPush = {
                                                            messagesId: data[index]._id,
                                                            publicId: data[index].publicId,
                                                            senderName: data[index].senderName,
                                                            senderImageKey: data[index].senderImageKey,
                                                            senderDisplayName: data[index].senderDisplayName,
                                                            chatText: "",
                                                            datePosted: data[index].datePosted,
                                                            dateUpdated: data[index].dateUpdated,
                                                            encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                            isServerMessage: data[index].isServerMessage,
                                                            involvedIds: data[index].involvedIds
                                                        }
                                                        allData.push(toPush)
                                                        itemsProcessed++;
                                                        if (itemsProcessed == data.length) {
                                                            sortAndSet(allData)
                                                        }
                                                    } else {
                                                        //push
                                                        var toPush = {
                                                            messagesId: data[index]._id,
                                                            publicId: data[index].publicId,
                                                            senderName: data[index].senderName,
                                                            senderImageKey: "",
                                                            senderDisplayName: data[index].senderDisplayName,
                                                            chatText: "",
                                                            datePosted: data[index].datePosted,
                                                            dateUpdated: data[index].dateUpdated,
                                                            encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                            isServerMessage: data[index].isServerMessage,
                                                            involvedIds: data[index].involvedIds
                                                        }
                                                        allData.push(toPush)
                                                        itemsProcessed++;
                                                        if (itemsProcessed == data.length) {
                                                            sortAndSet(allData)
                                                        }
                                                    }
                                                }
                                            } else {
                                                console.log("What")
                                                itemsProcessed++;
                                                if (itemsProcessed == data.length) {
                                                    sortAndSet(allData)
                                                }
                                            }
                                        } else {
                                            console.log("Not Encrypted")
                                            if (data[index].senderImageKey !== "") {
                                                checkIfImageIsLoaded(data[index].senderImageKey)
                                                //push
                                                var toPush = {
                                                    messagesId: data[index]._id,
                                                    publicId: data[index].publicId,
                                                    senderName: data[index].senderName,
                                                    senderImageKey: data[index].senderImageKey,
                                                    senderDisplayName: data[index].senderDisplayName,
                                                    chatText: data[index].chatText,
                                                    datePosted: data[index].datePosted,
                                                    dateUpdated: data[index].dateUpdated,
                                                    encryptedChatText: "",
                                                    isServerMessage: data[index].isServerMessage,
                                                    involvedIds: data[index].involvedIds
                                                }
                                                allData.push(toPush)
                                                itemsProcessed++;
                                                if (itemsProcessed == data.length) {
                                                    sortAndSet(allData)
                                                }    
                                            } else {
                                                //push
                                                var toPush = {
                                                    messagesId: data[index]._id,
                                                    publicId: data[index].publicId,
                                                    senderName: data[index].senderName,
                                                    senderImageKey: "",
                                                    senderDisplayName: data[index].senderDisplayName,
                                                    chatText: data[index].chatText,
                                                    datePosted: data[index].datePosted,
                                                    dateUpdated: data[index].dateUpdated,
                                                    encryptedChatText: "",
                                                    isServerMessage: data[index].isServerMessage,
                                                    involvedIds: data[index].involvedIds
                                                }
                                                allData.push(toPush)
                                                itemsProcessed++;
                                                if (itemsProcessed == data.length) {
                                                    sortAndSet(allData)
                                                }
                                            }
                                        }
                                    } else {
                                        var toPush = {
                                            messagesId: data[index]._id,
                                            publicId: "",
                                            senderName: "",
                                            senderImageKey: "",
                                            senderDisplayName: "",
                                            chatText: data[index].chatText,
                                            datePosted: data[index].datePosted,
                                            dateUpdated: data[index].dateUpdated,
                                            encryptedChatText: "",
                                            isServerMessage: true,
                                            involvedIds: data[index].involvedIds
                                        }
                                        allData.push(toPush)
                                        itemsProcessed++;
                                        if (itemsProcessed == data.length) {
                                            sortAndSet(allData)
                                        }
                                    }
                                }
                                forAsync()
                            })
                        }
                        const nonceArray = []
                        const nonceObject = cryptographicNonce[0]
                        //for loop
                        var objectToPush = 0;
                        for (let i = 0; i < 24; i++) {
                            nonceArray.push(nonceObject[`${objectToPush}`])
                            //console.log("nonce array:")
                            //console.log(nonceArray)
                            objectToPush++;
                            if (nonceArray.length == 24) {
                                const nonce = new Uint8Array(nonceArray)
                                //console.log(nonce)
                                const urlForGettingKeyInUse = `${serverUrl}/conversations/getCurrentKeyInUse/${conversationId}/${_id}`;
                                axios.get(urlForGettingKeyInUse).then((response) => {
                                    const result = response.data;
                                    const {message, status, sendback} = result;
        
                                    if (status !== 'SUCCESS') {
                                        //handleMessage(message, "FAILED")
                                        //console.log("FAILED")
                                        //console.log(message)
                                        afterRecievingKeysId("None", nonce)
                                    } else {
                                        afterRecievingKeysId(sendback, nonce)
                                    }
                                })
                            }
                        }
                    } else {
                        console.log("No messages?")
                        setMessages([])
                        setLoadingConversation(true)
                        setLoadingConversation(false)
                        console.log("Loading off")
                    }
                }
    
            }).catch(error => {
                console.log(error);
                setLoadingConversation(false)
                handleMessage("An error occured. Try checking your network connection and retry.");
            })
        }
    };

    const getAllMemberData = () => {
        const url = `${serverUrl}/conversations/getMembers/${conversationId}`;
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                        
            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setLoadingConversation(true)
                setLoadingConversation(false)
            } else {
                handleMessage("Member Search Complete", "SUCCESS");
                setLoadingConversation(true)
                setLoadingConversation(false)
                var itemsProcessed = 0;
                var imageB64s = []
                var membersFound = []
                //console.log(data)
                data.forEach(function (item, index) {
                    if (data[index].publicId == secondId) {
                        if (data[index].isOwner == true) {
                            console.log("This user is owner")
                            setThisUserIsOwner(true)
                        }
                    }
                    if (data[index].profileImageKey !== "") {
                        async function forAsync () {
                            //get image
                            var thisImage = await getImageWithKey(data[index].profileImageKey)
                            imageB64s.push({imageKey: data[index].profileImageKey, b64: thisImage})
                            //members
                            membersFound.push({pubId: data[index].publicId, name: data[index].name, displayName: data[index].displayName, imageKey: data[index].profileImageKey, isOwner: data[index].isOwner})
                            //push image
                            itemsProcessed++;
                            console.log(`Pushed ${itemsProcessed}`)
                            if (itemsProcessed == data.length) {
                                console.log("HAseb")
                                //console.log(imageB64s)
                                setUsersPFPData([...imageB64s])
                                setMembersInChat(membersFound)
                                //console.log(membersFound)
                            }
                        }
                        forAsync()
                    } else {
                        membersFound.push({pubId: data[index].publicId, name: data[index].name, displayName: data[index].displayName, imageKey: data[index].profileImageKey, isOwner: data[index].isOwner})
                        //push image
                        itemsProcessed++;
                        console.log(`Pushed ${itemsProcessed}`)
                        if (itemsProcessed == data.length) {
                            console.log("HAseb")
                            //console.log(imageB64s)
                            setUsersPFPData([...imageB64s])
                            setMembersInChat(membersFound)
                            //console.log(membersFound)
                        }
                    }
                })
                //persistLogin({...data[0]}, message, status);
            }
    
        }).catch(error => {
            console.log(error);
            setLoadingConversation(true)
            setLoadingConversation(false)
            handleMessage("An error occured. Try checking your network connection and retry.");
        })
    }

    const [serverTextUsers, setServerTextUsers] = useState([])

    const getSingleServerMessagesMemberData = (publicId) => {
        if (serverTextUsers.includes(publicId) !== true) {
            var tempServerUsers = serverTextUsers
            tempServerUsers.push(publicId)
            setServerTextUsers(tempServerUsers)
            console.log(publicId)
            const url = `${serverUrl}/conversations/getSingleMember/${publicId}`;
            axios.get(url).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                            
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setLoadingConversation(false)
                    var tempServerUsers = serverTextUsers
                    var index = tempServerUsers.findIndex(x => x == publicId)
                    tempServerUsers.splice(index, 1)
                    setServerTextUsers(tempServerUsers)
                } else {
                    //console.log(data)
                    var membersFound = serverTextUsers
                    var index = membersFound.findIndex(x => x.publicId === publicId);
                    if (index == -1) {
                        console.log("New user")
                        //members
                        membersFound.push({pubId: data.publicId, name: data.name, displayName: data.displayName, imageKey: data.profileImageKey, isOwner: data.isOwner})
                        //push image
                        setServerTextUsers(membersFound)
                        console.log(membersFound)
                    } else {
                        //members
                        membersFound.splice(index, 1);
                        membersFound.push({pubId: data.publicId, name: data.name, displayName: data.displayName, imageKey: data.profileImageKey, isOwner: data.isOwner})
                        //push image
                        setServerTextUsers(membersFound)
                        console.log(membersFound)
                    }
                }
            }).catch(error => {
                console.log(error);
                setLoadingConversation(false)
                handleMessage("An error occured. Try checking your network connection and retry.");
                var tempServerUsers = serverTextUsers
                var index = tempServerUsers.findIndex(x => x == publicId)
                tempServerUsers.splice(index, 1)
                setServerTextUsers(tempServerUsers)
            })
        }
    }

    const getSingleMemberData = (publicId) => {
        if (usersLoading.includes(publicId) !== true) {
            usersLoading.push(publicId)
            console.log(publicId)
            const url = `${serverUrl}/conversations/getSingleMember/${publicId}`;
            axios.get(url).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                            
                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setLoadingConversation(false)
                    var index = usersLoading.findIndex(x => x == publicId)
                    usersLoading.splice(index, 1)
                } else {
                    //console.log(data)
                    var membersFound = membersInChat.slice()
                    var index = membersFound.findIndex(x => x.publicId === publicId);
                    const imageB64s = usersPFPData.slice()
                    if (index == -1) {
                        console.log("New user")
                        if (data.profileImageKey !== "") {
                            async function forAsync () {
                                //get image
                                var thisImage = await getImageWithKey(data.profileImageKey)
                                imageB64s.push({imageKey: data.profileImageKey, b64: thisImage})
                                //members
                                membersFound.push({pubId: data.publicId, name: data.name, displayName: data.displayName, imageKey: data.profileImageKey, isOwner: data.isOwner})
                                //push image
                                //console.log(imageB64s)
                                setUsersPFPData([...imageB64s])
                                setMembersInChat(membersFound)
                                var index = usersLoading.findIndex(x => x == publicId)
                                usersLoading.splice(index, 1)
                                console.log(membersFound)
                            }
                            forAsync()
                        } else {
                            //members
                            membersFound.push({pubId: data.publicId, name: data.name, displayName: data.displayName, imageKey: data.profileImageKey, isOwner: data.isOwner})
                            //push image
                            console.log("HAseb")
                            //console.log(imageB64s)
                            setMembersInChat(membersFound)
                            var index = usersLoading.findIndex(x => x == publicId)
                            usersLoading.splice(index, 1)
                            console.log(membersFound)
                        }
                    } else {
                        if (data.profileImageKey !== "") {
                            async function forAsync () {
                                //get image
                                var thisImage = await getImageWithKey(data.profileImageKey)
                                imageB64s.push({imageKey: data.profileImageKey, b64: thisImage})
                                //members
                                membersFound.splice(index, 1);
                                membersFound.push({pubId: data.publicId, name: data.name, displayName: data.displayName, imageKey: data.profileImageKey, isOwner: data.isOwner})
                                //push image
                                //console.log(imageB64s)
                                setUsersPFPData([...imageB64s])
                                setMembersInChat(membersFound)
                                var index = usersLoading.findIndex(x => x == publicId)
                                usersLoading.splice(index, 1)
                                console.log(membersFound)
                            }
                            forAsync()
                        } else {
                            //members
                            membersFound.splice(index, 1);
                            membersFound.push({pubId: data.publicId, name: data.name, displayName: data.displayName, imageKey: data.profileImageKey, isOwner: data.isOwner})
                            //push image
                            console.log("HAseb")
                            //console.log(imageB64s)
                            setMembersInChat(membersFound)
                            var index = usersLoading.findIndex(x => x == publicId)
                            usersLoading.splice(index, 1)
                            console.log(membersFound)
                        }
                    }
                }
            }).catch(error => {
                console.log(error);
                setLoadingConversation(false)
                handleMessage("An error occured. Try checking your network connection and retry.");
                var index = usersLoading.findIndex(x => x == publicId)
                usersLoading.splice(index, 1)
            })
        }
    }

    const checkGroupsTitle = () => {
        setTitleLoading(true)
        const url = `${serverUrl}/conversations/checkForTitle/${_id}/${conversationId}`;
        axios.get(url, {idSent: _id, conversationId: conversationId}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== "SUCCESS") {
                console.log(status)
                console.log(message)
                handleMessage(message, status)
                setTitleLoading(false)
            } else {
                console.log(status)
                console.log(message)
                setConversationTitle(data)
                setTitleLoading(false)
            }
            
        }).catch(error => {
            console.log(error)
            handleMessage("An error occured. Try checking your network connection and retry.");
            setTitleLoading(false)
        })
    }

    const checkGroupsDescription = () => {
        setDescriptionLoading(true)
        const url = `${serverUrl}/conversations/checkForDescription/${_id}/${conversationId}`;
        axios.get(url, {idSent: _id, conversationId: conversationId}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== "SUCCESS") {
                console.log(status)
                console.log(message)
                handleMessage(message, status)
                setDescriptionLoading(false)
            } else {
                console.log(status)
                console.log(message)
                setConversationDescription(data)
                setDescriptionLoading(false)
            }
            
        }).catch(error => {
            console.log(error)
            handleMessage("An error occured. Try checking your network connection and retry.");
            setDescriptionLoading(false)
        })
    }

    useEffect(() => {
        //getSingleMemberData
    }, [membersInChat]);

    //UseEffects
    /*
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (socketAllow == true) {
                console.log("Disconnecting from socket")
                socket.disconnect() 
            }
        })    
    }, [navigation])
    */

    const handleScroll = (e) => {
        scrollOffset = e.nativeEvent.contentOffset.y;
        if (isCloseToBottom(e.nativeEvent)) {
            try {
                setScrollToBottomIsVisible(false)
                if (messages !== []) {
                    //console.log(messages[messages.length-1].datePosted)
                    socket.emit("viewed-message", conversationId, secondId, messages[messages.length-1].messagesId, messages[messages.length-1].datePosted);
                    thisUserLMS.current = [messages.length-1].datePosted
                    if (lastMessageSeen.findIndex(x => x.secondId == secondId && x.messagesId == messages[messages.length-1].messagesId) !== -1) {
                        //already includes
                    } else {
                        console.log("HS message seen")
                        console.log(`Handle Scroll Updated messages: ${JSON.stringify(messages[messages.length-1].messagesId)}`)
                        console.log("Updating LMS")
                        const clonedLMS = lastMessageSeen.slice()
                        clonedLMS.push({secondId: secondId, messagesId: messages[messages.length-1].messagesId})
                        setLastMessageSeen(clonedLMS)
                    }
                    setTimeout(() => {
                        //incase
                        socket.emit("viewed-message", conversationId, secondId, messages[messages.length-1].messagesId, messages[messages.length-1].datePosted);
                    }, (2000));
                }
            } catch (error) {
                console.log(`Scroll View error ${error}`)
            }
        } else {
            setScrollToBottomIsVisible(true)
        }
    };

    function onKeyboardDidShow(e) {
        console.log(`Keyboard opened: ${e.endCoordinates.height}`)
        setKeyboardHeight(e.endCoordinates.height);
        const newOffset = scrollOffset + e.endCoordinates.height;
        scrollRef.current.scrollToOffset({ offset: newOffset, animated: true });
    }
    
    function onKeyboardDidHide() {
        console.log(`Keyboard closed`)
        setKeyboardHeight(0);
    }
    
    useEffect(() => {
        const KDS = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const KDH = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            KDS.remove()
            KDH.remove()
        };
    }, []);
        
    const getMessagesAndStuff = () => {
        console.log("All loading done, getting messages and data.")
        getAllMemberData()
        getMessages()
    }
    
    const fullLoadOfAll = () => {
        setSocketAllow()
        setSendingOrLoadingMessageIndicator(true) 
        socket.emit("join-conversation", conversationId, secondId);
        if (isDirectMessage == false) {
            getGroupIcon()
            checkGroupsTitle()
            checkGroupsDescription()
            checkForScreenshotsAllowed()
        }
        setCheckingForConversationValues(true)
        const url = `${serverUrl}/conversations/checkForEncryption/${_id}/${conversationId}`;
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                        
            if (status !== 'SUCCESS') {
                console.log(status)
                console.log(message)
                if (message == "Public Key Not Found") {
                    setEncryptionOn(true)
                    const asyncForCreationOne = async () => {
                        setCheckingForConversationValues(false)
                        const createdKeys = await createKeysForEncryption()
                        if (createdKeys !== null) {
                            setGeneratingEncryptionKeys(false)
                            getMessagesAndStuff()
                        } else {
                            setGeneratingEncryptionKeys(false)
                            setErrorGeneratingEncryptionKeys(true)
                        }
                    }
                    asyncForCreationOne()
                } else {
                    setCheckingForConversationValues(false)
                    setErrorCheckingForEncryption(message)
                }
            } else {
                console.log(status)
                console.log(message)
                if (message == "Encryption Key Found") {   
                    setEncryptionOn(true)
                    const checkIfKeyIsStored = async () => {
                        setCheckingForConversationValues(false)
                        const foundPrivKey = await getValueForEncryptionKeys(data.keysUniqueId)
                        if (foundPrivKey !== null) {
                            setCheckingForConversationValues(false)
                            getMessagesAndStuff()
                        } else {
                            const asyncForCreationTwo = async () => {
                                setCheckingForConversationValues(false)
                                const createdKeys = await createKeysForEncryption()
                                if (createdKeys !== null) {
                                    setGeneratingEncryptionKeys(false)
                                    getMessagesAndStuff()
                                } else {
                                    setGeneratingEncryptionKeys(false)
                                    setErrorGeneratingEncryptionKeys(true)
                                }
                            }
                            asyncForCreationTwo()
                        }
                    }
                    checkIfKeyIsStored()
                } else {
                    //Chat not encrypted
                    console.log("Chat Not Encrypted")
                    setEncryptionOn(false)
                    setCheckingForConversationValues(false)
                    getMessagesAndStuff()
                }
            }
    
        }).catch(error => {
            console.log(error);
            setLoadingConversation(false)
            setErrorCheckingForEncryption("An error occured. Try checking your network connection and retry.")
        })
    }

    useEffect(() => {
        fullLoadOfAll()
    }, []);

    useEffect(() => {
        if (socket == '') {

        } else {
            console.log("Change in socket")
                
            socket.on("client-joined-conversation", () => {
                console.log("Connected to conversation")
                setSendingOrLoadingMessageIndicator(false)
            });

            socket.on("recieve-message", messageSent => {
                console.log("Messages Recieved")
                //Check if any values are different
                //getSingleMemberData() //add when sockets find the names and keys and what not or the name, display, and pfpimagekey are sent on message
                //Decrypt
                const afterRecievingKeysId = (thisUsersPublicKeyObject) => {
                    console.log("after recieving keys id")
                    const forAsync = async () => {
                        if (messageSent.isEncrypted == true) {
                            const keyUUID = thisUsersPublicKeyObject.keysUniqueId
                            console.log("Encrypted")
                            if (messageSent.encryptedChatText !== null) {
                                console.log(messageSent)
                                const foundIndexOfThisUsersMessage = await messageSent.encryptedChatText.findIndex(x => x.keysUniqueId == keyUUID);
                                console.log(`Found index: ${foundIndexOfThisUsersMessage}`)
                                if (foundIndexOfThisUsersMessage !== -1) {
                                    const isUsersKey = await getValueForEncryptionKeys(keyUUID)
                                    if (isUsersKey !== null) {
                                        console.log("Decode")
                                        const decodedPrivKey = nacl.util.decodeBase64(isUsersKey)
                                        const forAsync = async () => {
                
                                            const decodedPubKey = await nacl.util.decodeBase64(messageSent.encryptedChatText[foundIndexOfThisUsersMessage].pubkey)
                                                
                                            const nonceArray = []
                                            const nonceObject = cryptographicNonce[0]
                                            //for loop
                                            var objectToPush = 0;
                                            for (let i = 0; i < 24; i++) {
                                                nonceArray.push(nonceObject[`${objectToPush}`])
                                                //console.log("nonce array:")
                                                //console.log(nonceArray)
                                                objectToPush++;
                                                if (nonceArray.length == 24) {
                                                    const nonce = new Uint8Array(nonceArray)
                                                    //console.log(nonce)
                                                    const messageDecoded = nacl.util.decodeBase64(messageSent.encryptedChatText[foundIndexOfThisUsersMessage].encryptedString)
                                                    const messageDecrypted = nacl.box.open(messageDecoded, nonce, decodedPubKey, decodedPrivKey)
                                                    const messageEncoded = nacl.util.encodeUTF8(messageDecrypted)
                                                    
                                                    //console.log(`message Decoded: ${messageDecoded}`)
                                                    //console.log(`message Decrypted: ${messageDecrypted}`)
                                                    //console.log(`message Encoded: ${messageEncoded}`)
                                                    //
                                                    if (messageSent.senderImageKey !== "") {
                                                        checkIfImageIsLoaded(messageSent.senderImageKey)
                                                        //push
                                                        var toPush = {
                                                            messagesId: messageSent._id,
                                                            publicId: messageSent.publicId,
                                                            senderName: messageSent.senderName,
                                                            senderImageKey: messageSent.senderImageKey,
                                                            senderDisplayName: messageSent.senderDisplayName,
                                                            chatText: "",
                                                            datePosted: messageSent.datePosted,
                                                            dateUpdated: messageSent.dateUpdated,
                                                            encryptedChatText: messageEncoded,
                                                            isServerMessage: false,
                                                            involvedIds: {}
                                                        }
                                                        setArrivalMessage(toPush)
                                                    } else {
                                                        //push
                                                        var toPush = {
                                                            messagesId: messageSent._id,
                                                            publicId: messageSent.publicId,
                                                            senderName: messageSent.senderName,
                                                            senderImageKey: "",
                                                            senderDisplayName: messageSent.senderDisplayName,
                                                            chatText: "",
                                                            datePosted: messageSent.datePosted,
                                                            dateUpdated: messageSent.dateUpdated,
                                                            encryptedChatText: messageEncoded,
                                                            isServerMessage: false,
                                                            involvedIds: {}
                                                        }
                                                        setArrivalMessage(toPush)
                                                    }
                                                }
                                            }
                                        }
                                        forAsync()            
                                    } else {
                                        console.log("No Pub Found")
                                        if (messageSent.senderImageKey !== "") {
                                            checkIfImageIsLoaded(messageSent.senderImageKey)
                                            //push
                                            var toPush = {
                                                messagesId: messageSent._id,
                                                publicId: messageSent.publicId,
                                                senderName: messageSent.senderName,
                                                senderImageKey: messageSent.senderImageKey,
                                                senderDisplayName: messageSent.senderDisplayName,
                                                chatText: "",
                                                datePosted: messageSent.datePosted,
                                                dateUpdated: messageSent.dateUpdated,
                                                encryptedChatText: `${messageSent.encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                isServerMessage: false,
                                                involvedIds: {}
                                            }
                                            setArrivalMessage(toPush)
                                        } else {
                                            //push
                                            var toPush = {
                                                messagesId: messageSent._id,
                                                publicId: messageSent.publicId,
                                                senderName: messageSent.senderName,
                                                senderImageKey: "",
                                                senderDisplayName: messageSent.senderDisplayName,
                                                chatText: "",
                                                datePosted: messageSent.datePosted,
                                                dateUpdated: messageSent.dateUpdated,
                                                encryptedChatText: `${messageSent.encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                isServerMessage: false,
                                                involvedIds: {}
                                            }
                                            setArrivalMessage(toPush)
                                        }
                                    }
                                } else {
                                    console.log("Didnt Find the Key for this message")
                                    console.log("No Pub Found")
                                    if (messageSent.senderImageKey !== "") {
                                        checkIfImageIsLoaded(messageSent.senderImageKey)
                                        //push
                                        var toPush = {
                                            messagesId: messageSent._id,
                                            publicId: messageSent.publicId,
                                            senderName: messageSent.senderName,
                                            senderImageKey: messageSent.senderImageKey,
                                            senderDisplayName: messageSent.senderDisplayName,
                                            chatText: "",
                                            datePosted: messageSent.datePosted,
                                            dateUpdated: messageSent.dateUpdated,
                                            encryptedChatText: `${messageSent.encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                            isServerMessage: false,
                                            involvedIds: {}
                                        }
                                        setArrivalMessage(toPush)
                                    } else {
                                        //push
                                        var toPush = {
                                            messagesId: messageSent._id,
                                            publicId: messageSent.publicId,
                                            senderName: messageSent.senderName,
                                            senderImageKey: "",
                                            senderDisplayName: messageSent.senderDisplayName,
                                            chatText: "",
                                            datePosted: messageSent.datePosted,
                                            dateUpdated: messageSent.dateUpdated,
                                            encryptedChatText: `${messageSent.encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                            isServerMessage: false,
                                            involvedIds: {}
                                        }
                                        setArrivalMessage(toPush)
                                    }
                                }
                            }
                        } else {
                            console.log("Not Encrypted")
                            console.log(messageSent.chatText)
                            if (messageSent.senderImageKey !== "") {
                                checkIfImageIsLoaded(messageSent.senderImageKey)
                                //push
                                var toPush = {
                                    messagesId: messageSent._id,
                                    publicId: messageSent.publicId,
                                    senderName: messageSent.senderName,
                                    senderImageKey: messageSent.senderImageKey,
                                    senderDisplayName: messageSent.senderDisplayName,
                                    chatText: messageSent.chatText,
                                    datePosted: messageSent.datePosted,
                                    dateUpdated: messageSent.dateUpdated,
                                    encryptedChatText: "",
                                    isServerMessage: false,
                                    involvedIds: {}
                                }
                                setArrivalMessage(toPush)
                            } else {
                                //push
                                var toPush = {
                                    messagesId: messageSent._id,
                                    publicId: messageSent.publicId,
                                    senderName: messageSent.senderName,
                                    senderImageKey: "",
                                    senderDisplayName: messageSent.senderDisplayName,
                                    chatText: messageSent.chatText,
                                    datePosted: messageSent.datePosted,
                                    dateUpdated: messageSent.dateUpdated,
                                    encryptedChatText: "",
                                    isServerMessage: false,
                                    involvedIds: {}
                                }
                                setArrivalMessage(toPush)
                            }
                        }
                    }
                    forAsync()
                }
                const urlForGettingKeyInUse = `${serverUrl}/conversations/getCurrentKeyInUse/${conversationId}/${_id}`;
                axios.get(urlForGettingKeyInUse).then((response) => {
                    const result = response.data;
                    const {message, status, sendback} = result;

                    if (status !== 'SUCCESS') {
                        //handleMessage(message, "FAILED")
                        //console.log("FAILED")
                        //console.log(message)
                        afterRecievingKeysId("None")
                    } else {
                        afterRecievingKeysId(sendback)
                    }
                })
            });

            socket.on("user-left-conversation", (userThatLeft, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "Left",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatLeft: userThatLeft}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("user-kicked", (userThatKicked, userThatGotKicked, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "User Kicked",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatKicked: userThatKicked, userThatGotKicked: userThatGotKicked}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("screenshots-toggled-on", (userThatToggled, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                setScreenShotsOn(true)
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "Screenshots On",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatToggled: userThatToggled}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("screenshots-toggled-off", (userThatToggled, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                setScreenShotsOn(false)
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "Screenshots Off",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatToggled: userThatToggled}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("encryption-toggled-on", (userThatToggled, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                checkForEncryption()
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "Encryption Toggled On",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatToggled: userThatToggled}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("encryption-toggled-off", (userThatToggled, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                checkForEncryption()
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "Encryption Toggled Off",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatToggled: userThatToggled}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("user-added", (userThatAdded, userThatGotAdded, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "User Added",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatAdded: userThatAdded, userThatGotAdded: userThatGotAdded}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("ownership-transferred", (oldOwner, newOwner, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "Ownership Transferred",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {oldOwner: oldOwner, newOwner: newOwner}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("group-icon-changed", (userThatChangedIcon, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "Group Icon Changed",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatChangedIcon: userThatChangedIcon}
                }
                setArrivalMessage(serverMessage)
            });

            socket.on("new-title", (userThatChangedIt, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "New Title",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatChangedIt: userThatChangedIt}
                }
                setArrivalMessage(serverMessage)
                checkGroupsTitle()
            });

            socket.on("new-description", (userThatChangedIt, messageId, dateOfServerMsg) => {
                //add a server message to the list of messages
                const serverMessage = {
                    messagesId: messageId,
                    publicId: "",
                    senderName: "",
                    senderImageKey: "",
                    senderDisplayName: "",
                    chatText: "New Description",
                    datePosted: dateOfServerMsg,
                    dateUpdated: dateOfServerMsg,
                    encryptedChatText: "",
                    isServerMessage: true,
                    involvedIds: {userThatChangedIt: userThatChangedIt}
                }
                setArrivalMessage(serverMessage)
                checkGroupsDescription()
            });

            socket.on("seen-message", (secondIdSent, messagesId) => {
                console.log("User seen message")
                try {
                    var updatedMessages = [];
                    setMessages(currentState => { // Do not change the state by getting the updated state
                        if (typeof currentState == "undefined" || currentState === undefined) {
                            updatedMessages = []
                            return currentState;
                        } else {
                            updatedMessages = currentState;
                            return currentState;
                        }
                    })
                    if (typeof updatedMessages == "undefined" || updatedMessages === undefined) {
                        //Undefined
                    } else {
                        if (updatedMessages !== []) {
                            console.log(`Seen-Message Updated messages: ${JSON.stringify(updatedMessages[updatedMessages.length-1].messagesId)}`)
                            if (updatedMessages[updatedMessages.length-1].messagesId == messagesId) {
                                var upToDateLMS;
                                setLastMessageSeen(currentState => { // Do not change the state by getting the updated state
                                    upToDateLMS = currentState;
                                    return currentState;
                                })
                                if (typeof upToDateLMS == "undefined" || upToDateLMS === undefined) {
                                    //Undefined
                                } else {
                                    if (upToDateLMS.findIndex(x => x.secondId == secondIdSent && x.messagesId == messagesId) !== -1) {
                                        //already includes
                                    } else {
                                        console.log("seen-message message seen")
                                        console.log(`seen-message Updated messages: ${JSON.stringify(updatedMessages[updatedMessages.length-1].messagesId)}`)
                                        console.log("Updating LMS")
                                        const clonedLMS = upToDateLMS.slice()
                                        clonedLMS.push({secondId: secondIdSent, messagesId: messagesId})
                                        setLastMessageSeen(clonedLMS)
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log(`seen-message error ${error}`)
                }
            })

            socket.on("error-with-room", () => {
                setSendingOrLoadingMessageIndicator(false);
                console.log("Error with room")
                handleMessage("Error with room")
            });
            
            socket.on("empty-text-sent", () => {
                setSendingOrLoadingMessageIndicator(false);
                console.log("Empty text sent")
                handleMessage("Empty text sent")
            });

            socket.on("no-publicid-passed", () => {
                setSendingOrLoadingMessageIndicator(false);
                console.log("Error with public Id passed")
                handleMessage("Error with room")
            });

            socket.on("couldnt-find-user", () => {
                console.log("Couldnt Find User")
                handleMessage("Couldnt Find User")
            })

            socket.on("couldnt-find-user", () => {
                setSendingOrLoadingMessageIndicator(false);
                console.log("Couldnt Find User")
                handleMessage("Couldnt Find User")
            })

            socket.on("error-while-finding-user", () => {
                setSendingOrLoadingMessageIndicator(false);
                console.log("Error while finding user")
                handleMessage("Error while finding user")
            })
            
            socket.on("couldnt-find-conversation", () => {
                console.log("Couldnt find conversation")
                handleMessage("Couldnt find conversation")
            })

            socket.on("error-while-finding-conversation", () => {
                console.log("Error while finding conversation")
                handleMessage("Error while finding conversation")
            })

            socket.on("error-marking-message-as-seen", () => {
                console.log("Error marking message as seen")
                //handleMessage("Error marking message as seen")
            })

            socket.on("message-sent-to-database", (messageThatWasSent, messageThatWasSentIsEncrypted) => {
                var updatedNewMessage;
                setNewMessage(currentState => { // Do not change the state by getting the updated state
                    updatedNewMessage = currentState;
                    return currentState;
                })
                console.log(`New message: ${updatedNewMessage}`)
                if (messageThatWasSentIsEncrypted !== true) {
                    const messageData = {
                        messagesId: messageThatWasSent._id,
                        publicId: messageThatWasSent.publicId,
                        senderName: messageThatWasSent.senderName,
                        senderDisplayName: messageThatWasSent.senderDisplayName,
                        senderImageKey: messageThatWasSent.senderImageKey,
                        chatText: updatedNewMessage,
                        datePosted: messageThatWasSent.datePosted,
                        dateUpdated: messageThatWasSent.dateUpdated,
                        encryptedChatText: "",
                        isServerMessage: false,
                        involvedIds: {}
                    }
                    //do rest
                    setArrivalMessage(messageData)
                    setNewMessage()
                    setNewMessage("")
                    setSendingOrLoadingMessageIndicator(false);
                } else {
                    const messageData = {
                        messagesId: messageThatWasSent._id,
                        publicId: messageThatWasSent.publicId,
                        senderName: messageThatWasSent.senderName,
                        senderDisplayName: messageThatWasSent.senderDisplayName,
                        senderImageKey: messageThatWasSent.senderImageKey,
                        chatText: "",
                        datePosted: messageThatWasSent.datePosted,
                        dateUpdated: messageThatWasSent.dateUpdated,
                        encryptedChatText: updatedNewMessage,
                        isServerMessage: false,
                        involvedIds: {}
                    }
                    //do rest
                    setArrivalMessage(messageData)
                    setNewMessage()
                    setNewMessage("")
                    setSendingOrLoadingMessageIndicator(false);
                }
                //
                console.log("Message Sent")
                handleMessage("Message Sent", "SUCCESS")
            })
            
            socket.on("error-uploading-message-to-database", (message, messageThatWasSent, messageThatWasSentIsEncrypted) => {
                var updatedNewMessage;
                setNewMessage(currentState => { // Do not change the state by getting the updated state
                    updatedNewMessage = currentState;
                    return currentState;
                })
                console.log(`New message: ${updatedNewMessage}`)
                if (messageThatWasSentIsEncrypted !== true) {
                    const messageData = {
                        messagesId: messageThatWasSent._id,
                        publicId: messageThatWasSent.publicId,
                        senderName: messageThatWasSent.senderName,
                        senderDisplayName: messageThatWasSent.senderDisplayName,
                        senderImageKey: messageThatWasSent.senderImageKey,
                        chatText: updatedNewMessage,
                        datePosted: messageThatWasSent.datePosted,
                        dateUpdated: messageThatWasSent.dateUpdated,
                        encryptedChatText: "",
                        isServerMessage: false,
                        involvedIds: {}
                    }
                    //do rest
                    setArrivalMessage(messageData)
                    setNewMessage()
                    setNewMessage("")
                    setSendingOrLoadingMessageIndicator(false);
                } else {
                    const messageData = {
                        messagesId: messageThatWasSent._id,
                        publicId: messageThatWasSent.publicId,
                        senderName: messageThatWasSent.senderName,
                        senderDisplayName: messageThatWasSent.senderDisplayName,
                        senderImageKey: messageThatWasSent.senderImageKey,
                        chatText: "",
                        datePosted: messageThatWasSent.datePosted,
                        dateUpdated: messageThatWasSent.dateUpdated,
                        encryptedChatText: updatedNewMessage,
                        isServerMessage: false,
                        involvedIds: {}
                    }
                    //do rest
                    setArrivalMessage(messageData)
                    setNewMessage()
                    setNewMessage("")
                    setSendingOrLoadingMessageIndicator(false);
                }
                //
                console.log(message)
                handleMessage("Message sent but not saved")
            })

            socket.on("removed-from-convo", () => {
                setRemovedFromConversation(true)
            })
        }
    }, [socket])

    if (currentChat !== conversationId) {
        console.log("Setting")
        setCurrentChat(conversationId)
    }

    //All other stuff and a few useeffects

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const handleSubmit = () => {
        setSendingOrLoadingMessageIndicator(true)
        console.log("Posting")
        if (newMessage == "") {
            handleMessage("Can't send an empty text.", "FAILED")
            setSendingOrLoadingMessageIndicator(false)
        } else {
            const urlOne = `${serverUrl}/conversations/checkForEncryptionAndPublicKeys/${_id}/${conversationId}`
            axios.get(urlOne).then((response) => {
                const result = response.data
                const {message, status, data} = result;

                if (status !== "SUCCESS") {
                    handleMessage("Error checking if chat is encrypted", "FAILED")
                } else {
                    if (message !== "Chat is not encrypted") {
                        //Chat Is Encrypted
                        const afterEncryptionSend = (allEncryptedVersions) => {
                            const secondMessageModel = {
                                senderId: secondId,
                                chatText: "",
                                conversationId: currentChat,
                                isEncrypted: true,
                                encryptedChatText: allEncryptedVersions,
                                isServerMessage: false,
                                involvedIds: {}
                            }
                            setSendingOrLoadingMessageIndicator(true);
                            socket.emit("send-message", secondMessageModel);
                        }
                        var allEncryptedVersions = []
                        const onceThisUsersKeyIsFound = async (usersKeyInUse, pubKeyOfEncrypter) => {
                            const decodedPrivKey = nacl.util.decodeBase64(usersKeyInUse)
                            var itemsProcessed = 0;
                            data.forEach(function (item, index) {
                                const forAsync = async () => {
                                    const strDecoded = new Uint8Array(nacl.util.decodeUTF8(newMessage))
                                    //console.log(strDecoded)

                                    const nonceArray = []
                                    const nonceObject = cryptographicNonce[0]
                                    //for loop
                                    var objectToPush = 0;
                                    for (let i = 0; i < 24; i++) {
                                        nonceArray.push(nonceObject[`${objectToPush}`])
                                        //console.log("nonce array:")
                                        //console.log(nonceArray)
                                        objectToPush++;
                                        if (nonceArray.length == 24) {
                                            const nonce = new Uint8Array(nonceArray)
                                            //console.log(nonce)

                                            const decodedPubKey = await nacl.util.decodeBase64(data[index].pubKey)
                                            const encryptedString = await nacl.box(strDecoded, nonce, decodedPubKey, decodedPrivKey)
                                            //console.log(encryptedString)
                                            const Base64EncryptedStr = nacl.util.encodeBase64(encryptedString)
                                            //console.log(Base64EncryptedStr)
                                            console.log(`pubKeyOfEncrypter: ${pubKeyOfEncrypter}`)
                                            allEncryptedVersions.push({encryptedString: Base64EncryptedStr, keysUniqueId: data[index].keysUniqueId, pubkey: pubKeyOfEncrypter})
                                            itemsProcessed++;
                                            if (itemsProcessed == data.length) {
                                                afterEncryptionSend(allEncryptedVersions)
                                            }
                                        }
                                    }
                                }
                                forAsync()
                            })
                        }
                        //encrypt all
                        var forEachItemsProcessed = 0;
                        data.forEach(function (item, index) {
                            const forAsync = async () => {
                                const isUsersKey = await getValueForEncryptionKeys(data[index].keysUniqueId)
                                if (isUsersKey !== null) {
                                    onceThisUsersKeyIsFound(isUsersKey, data[index].pubKey)
                                } else {
                                    forEachItemsProcessed++;
                                }
                            }
                            forAsync()
                        })
                    } else {
                        //Not Encrypted Chat
                        const secondMessageModel = {
                            senderId: secondId,
                            chatText: newMessage,
                            conversationId: currentChat,
                            isEncrypted: false,
                            encryptedChatText: allEncryptedVersions,
                            isServerMessage: false,
                            involvedIds: {}
                        }
                        setSendingOrLoadingMessageIndicator(true);
                        socket.emit("send-message", secondMessageModel);
                    }
                }
            }).catch(error => {
                console.log(error);
                setSendingOrLoadingMessageIndicator(false);
                handleMessage("An error occured. Try checking your network connection and retry.");
            })
        }
    }

    useEffect(() => {
        if (showAgeWarning != true) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
        setLatestViewedMessage([])
        const foundIndex = messages.findIndex(x => x.datePosted == thisUserLMS.current)
        if (foundIndex !== -1) {
            var positionNotIndex = foundIndex + 1
            var unreadAmount = messages.length - positionNotIndex
            setUnreadsWithinSingularConversation(unreadAmount)
        }
    }, [messages]);

    //Chat Settings Stuff

    var submitting = false;

    const addUser = (pubIdOfUserToAdd) => {
        const url = `${serverUrl}/addMember`
        setAddingUser(true)
        axios.post(url, {sentId: _id, conversationId: conversationId, pubIdOfUserToAdd: pubIdOfUserToAdd}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                    
            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setAddingUser(false)
            } else {
                const tempChangeSections = changeSections
                const index = tempChangeSections.findIndex(x => x.data[0].pubId == pubIdOfUserToAdd)
                if (index !== -1) {
                    if (data.imageKey !== "") {
                        checkIfImageIsLoaded(data.imageKey)
                    }
                    tempChangeSections.splice(index, 1);
                    var membersForTheAdd = membersInChat.slice()
                    membersForTheAdd.push(data)
                    setChangeSections(tempChangeSections)
                    setMembersInChat(membersForTheAdd)
                    setAddingUser(false)
                    setAddMemberSearch(false)
                } else {
                    if (data.imageKey !== "") {
                        checkIfImageIsLoaded(data.imageKey)
                    }
                    var membersForTheAdd = membersInChat.slice()
                    membersForTheAdd.push(data)
                    setMembersInChat(membersForTheAdd)
                    setAddingUser(false)
                    setAddMemberSearch(false)
                }
            }
        }).catch(error => {
            console.log(error);
            setAddingUser(false);
            handleMessage("An error occured. Try checking your network connection and retry.");
        })
    }

    const removeUser = (pubIdOfUserToRemove) => {
        const url = `${serverUrl}/removeMember`;
        setRemovingUser(true)
        console.log("removing")
        axios.post(url, {sentId: _id, conversationId: conversationId, pubIdOfUserToRemove: pubIdOfUserToRemove}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                    
            console.log(message, status)
            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setRemovingUser(false)
            } else {
                var membersForTheRemove = membersInChat.slice()
                var index = membersForTheRemove.findIndex(x => x.pubId === pubIdOfUserToRemove)
                if (index !== -1) {
                    membersForTheRemove.splice(index, 1);
                    setMembersInChat(membersForTheRemove)
                    console.log("Succesfully removed", "SUCCESS")
                    handleMessage("Succesfully removed", "SUCCESS")
                    setRemovingUser(false)
                } else {
                    console.log("Member removed but visually couldn't splice", "FAILED")
                    handleMessage("Member removed but visually couldn't splice", "FAILED")
                    setRemovingUser(false)
                }
            }
        }).catch(error => {
            console.log(error);
            setRemovingUser(false);
            handleMessage("An error occured. Try checking your network connection and retry.");
        })
    }

    const UserItem = ({pubId, name, displayName, following, followers, totalLikes, profileKey}) => (
        <SearchFrame onPress={() => {addUser(pubId)}}>
            {profileKey !== null && (
                <Avatar resizeMode="cover" searchPage={true} source={{uri: profileKey}} />
            )}
            {profileKey == null && (
                <Avatar resizeMode="cover" searchPage={true} source={{uri: SocialSquareLogo_B64_png}} />
            )}
            <SubTitle searchResTitle={true}>{displayName}</SubTitle>
            <SubTitle searchResTitleDisplayName={true} style={{color: brand}}>@{name}</SubTitle>
            <SearchHorizontalView>
                <SearchHorizontalViewItem>
                    <SearchSubTitle welcome={true}> Following </SearchSubTitle>
                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                    <SearchSubTitle welcome={true}> {following} </SearchSubTitle>
                </SearchHorizontalViewItem>

                <SearchHorizontalViewItemCenter>
                    <SearchSubTitle welcome={true}> Followers </SearchSubTitle>
                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                    <SearchSubTitle welcome={true}> {followers} </SearchSubTitle>
                </SearchHorizontalViewItemCenter>

                <SearchHorizontalViewItem>
                    <SearchSubTitle welcome={true}> Total Likes </SearchSubTitle>
                    <ProfIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                    <SearchSubTitle welcome={true}> {totalLikes} </SearchSubTitle>
                </SearchHorizontalViewItem>
            </SearchHorizontalView>
        </SearchFrame>
    );

    const leaveConversation = () => {
        const url = `${serverUrl}/leaveConversations`;
        setRemovingUser(true)
        console.log("removing")
        axios.post(url, {idSent: _id, conversationId: conversationId}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
            
            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setRemovingUser(false)
            } else {
                navigation.goBack()
            }
        }).catch(error => {
            console.log(error);
            setRemovingUser(false);
            handleMessage("An error occured. Try checking your network connection and retry.");
        })
    }

    //any image honestly
    async function getImageWithKeyOne(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpg;base64,' + res.data).catch(error => {
            console.log(error);
            //setSubmitting(false);
            console.log("Either an error or cancelled.");
        })
    }

    const handleUserSearch = (val) => {
        setChangeSections()
        if (val !== "") {
            const layoutUsersFound = (data) => {
                var allData = data
                console.log(allData)
                console.log(allData.length)
                var tempSections = []
                var itemsProcessed = 0;
                allData.forEach(function (item, index) {
                    if (membersInChat.findIndex(x => x.pubId === allData[index].pubId) == -1) {
                        if (allData[index].pubId !== secondId) {
                            handleMessage("Search Complete", "SUCCESS");
                            if (allData[index].profileKey !== "") {
                                async function asyncFunctionForImages() {
                                    if (index+1 <= userLoadMax) {
                                        var displayName = allData[index].displayName
                                        if (displayName == "") {
                                            displayName = allData[index].name
                                        }
                                        const imageInPfpB64 = await getImageWithKeyOne(allData[index].profileKey)
                                        var tempSectionsTemp = {data: [{pubId: allData[index].pubId, name: allData[index].name, displayName: displayName, followers: allData[index].followers, following: allData[index].following, totalLikes: allData[index].totalLikes, profileKey: imageInPfpB64}]}
                                        tempSections.push(tempSectionsTemp)
                                        itemsProcessed++;
                                        if(itemsProcessed === allData.length) {
                                            setLoadingOne(false)
                                            setChangeSections(tempSections)
                                        }
                                    }
                                }
                                asyncFunctionForImages()
                            } else {
                                if (index+1 <= userLoadMax) {
                                    var displayName = allData[index].displayName
                                    if (displayName == "") {
                                        displayName = allData[index].name
                                    }
                                    var tempSectionsTemp = {data: [{pubId: allData[index].pubId, name: allData[index].name, displayName: displayName, followers: allData[index].followers, following: allData[index].following, totalLikes: allData[index].totalLikes, profileKey: null}]}
                                    tempSections.push(tempSectionsTemp)
                                    itemsProcessed++;
                                    if(itemsProcessed === allData.length) {
                                        setLoadingOne(false)
                                        setChangeSections(tempSections)
                                    }
                                }
                            }
                        } else {
                            itemsProcessed++;
                            if (tempSections.length !== 0) {
                                if(itemsProcessed === allData.length) {
                                    setLoadingOne(false)
                                    setChangeSections(tempSections)
                                } 
                            } else {
                                setLoadingOne(false)
                                handleMessage("No results", "FAILED")
                            }
                        }
                    } else {
                        itemsProcessed++;
                        if (tempSections.length !== 0) {
                            if(itemsProcessed === allData.length) {
                                setLoadingOne(false)
                                setChangeSections(tempSections)
                            } 
                        } else {
                            setLoadingOne(false)
                            handleMessage("No results", "FAILED")
                        }
                    }
                });
            }

            setLoadingOne(true)
            handleMessage(null);
            const url = `${serverUrl}/tempRoute/searchpageusersearch/${val}`;
            submitting = true;
            axios.get(url).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    handleMessage(message, status);
                    setLoadingOne(false)
                } else {
                    console.log(data)
                    layoutUsersFound(data)
                    //persistLogin({...data[0]}, message, status);
                }
                submitting = false;

            }).catch(error => {
                console.log(error);
                submitting = false;
                setLoadingOne(false)
                handleMessage("An error occured. Try checking your network connection and retry.");
            })
        } else {
            handleMessage("Empty search");
            setChangeSections()
        }
    }

    const handleChange = (val) => {
        if (submitting == false) {
            console.log(val)
            handleUserSearch(val)
        }
    }

    const uploadPFP = (image) => {
        const formData = new FormData();
        formData.append("image", {
            name: image.uri.substr(image.uri.lastIndexOf('/') + 1),
            uri: image.uri,
            type: 'image/jpg'
        })
        formData.append("userId", _id)
        formData.append("conversationId", conversationId)

        const url = serverUrl + "/postGroupIcon";
        setChangingGroupIcon(true)
        axios.post(url, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setChangingGroupIcon(false)
                console.log(message)
            } else {
                console.log(data)
                handleMessage(message, status)
                getGroupIcon()
                setChangingGroupIcon(false)
                //persistLogin({...data[0]}, message, status);
            }
            setChangingGroupIcon(false);

        }).catch(error => {
            console.log(error);
            setChangingGroupIcon(false);
            handleMessage("An error occured. Try checking your network connection and retry.");
        })
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        
        if (!result.canceled) {
            console.log(result)
            uploadPFP(result)
        }
    };

        
    const OpenImgLibrary = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            } else {
                pickImage()
            }
        }
    }

    const toggleEncryptionFunction = () => {
        setEncryptionLoading(true)
        const url = serverUrl + "/toggleConversationEncryption";
        axios.post(url, {idSent: _id, conversationId: conversationId}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== "SUCCESS") {
                console.log(status)
                console.log(message)
                handleMessage(message, status)
                setEncryptionLoading(false)
            } else {
                console.log(status)
                console.log(message)
                if (message == "Turned encryption off") {
                    setEncryptionLoading(false)
                } else {
                    setEncryptionLoading(false)
                }
            }
        }).catch(error => {
            console.log(error)
            handleMessage("An error occured. Try checking your network connection and retry.");
            setEncryptionLoading(false)
        })
    }

    const toggleScreenshotFunction = () => {
        setScreenshotLoading(true)
        const url = serverUrl + "/toggleScreenshotsAllowed";
        axios.post(url, {idSent: _id, conversationId: conversationId}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== "SUCCESS") {
                console.log(status)
                console.log(message)
                handleMessage(message, status)
                setScreenshotLoading(false)
            } else {
                console.log(status)
                console.log(message)
                if (message == "Turned screenshots off") {
                    setScreenshotLoading(false)
                } else {
                    setScreenshotLoading(false)
                }
            }
        }).catch(error => {
            console.log(error)
            handleMessage("An error occured. Try checking your network connection and retry.");
            setScreenshotLoading(false)
        })
    }

    const transferOwnershipFunction = (pubId) => {
        setTransferringOwnership(true)
        const url = serverUrl + "/transferOwnerShip";
        axios.post(url, {idSent: _id, convoId: conversationId, idOfOther: pubId}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== "SUCCESS") {
                console.log(status)
                console.log(message)
                handleMessage(message, status)
                setTransferringOwnership(false)
                setTransferOwnershipConfirm(null)
            } else {
                console.log(status)
                console.log(message)
                setTransferringOwnership(false)
                setTransferOwnershipConfirm(null)
            }
        }).catch(error => {
            console.log(error)
            handleMessage("An error occured. Try checking your network connection and retry.");
            setTransferringOwnership(false)
            setTransferOwnershipConfirm(null)
        })
    }

    const changeGroupsName = (newTitle) => {
        setTitleLoading(true)
        if (newTitle !== conversationTitle) {
            if (newTitle !== "") {
                const url = serverUrl + "/changeGroupName";
                axios.post(url, {idSent: _id, conversationId: conversationId, newName: newTitle}).then((response) => {
                    const result = response.data;
                    const {message, status, data} = result;

                    if (status !== "SUCCESS") {
                        console.log(status)
                        console.log(message)
                        handleMessage(message, status)
                        setTitleLoading(false)
                    } else {
                        console.log(status)
                        console.log(message)
                    }
                }).catch(error => {
                    console.log(error)
                    handleMessage("An error occured. Try checking your network connection and retry.");
                    setTitleLoading(false)
                })
            } else {
                console.log("message empty")
            }
        }
    }

    const changeGroupsDescription = (newDescription) => {
        setDescriptionLoading(true)
        if (newDescription !== conversationTitle) {
            const url = serverUrl + "/changeGroupDescription";
            axios.post(url, {idSent: _id, conversationId: conversationId, newDescription: newDescription}).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== "SUCCESS") {
                    console.log(status)
                    console.log(message)
                    handleMessage(message, status)
                    setDescriptionLoading(false)
                } else {
                    console.log(status)
                    console.log(message)
                }
            }).catch(error => {
                console.log(error)
                handleMessage("An error occured. Try checking your network connection and retry.");
                setDescriptionLoading(false)
            })
        }
    }

    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false)

    const loadMoreMessages = () => {
        setLoadingMoreMessages(true)
        const messagesId = messages[0].messagesId
        console.log(messagesId)
        const url = `${serverUrl}/messages/loadmore/${currentChat}/${messagesId}`;
            axios.get(url).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                    
                if (status !== 'SUCCESS') {
                    setLoadingMoreMessages(false)
                } else {
                    console.log("SUCCESS GETTING MESSAGES")
                    function sortAndSet (allData) {
                        console.log("Sorting")
                        /* happens in the backend too */
                        allData.sort(function(a, b){
                            var first = a.datePosted.split(" ")[0];
                            var second = b.datePosted.split(" ")[0];
                            if (first !== second) {
                                var aa = first.split('/').reverse().join(),
                                    bb = second.split('/').reverse().join();
                                //console.log(`aa ${aa}`)
                                //console.log(`bb ${bb}`)
                                return aa < bb ? -1 : (aa > bb ? 1 : 0);
                            } else {
                                var ind11 = a.datePosted.indexOf(' ');
                                var ind12 = a.datePosted.indexOf(' ', ind11 + 1);
                                var firstTime = a.datePosted.substring(ind12);
                                //console.log(firstTime)
                                var ind21 = b.datePosted.indexOf(' ');
                                var ind22 = b.datePosted.indexOf(' ', ind21 + 1);
                                var secondTime = b.datePosted.substring(ind22);
                                //console.log(ind22)
                                return firstTime < secondTime ? -1 : (firstTime > secondTime ? 1 : 0);
                            }
                        });
                        //console.log(allData)
                        var newArray = allData.concat(messages);
                        setMessages(newArray)
                        handleMessage("Search Complete", "SUCCESS");
                        setLoadingMoreMessages(true)
                        setLoadingMoreMessages(false)
                    }
                    if (data.length !== 0) {
                        const afterRecievingKeysId = (thisUsersPublicKeyObject, uint8Nonce) => {
                            console.log("after recieving keys id")
                            var itemsProcessed = 0;
                            var allData = []
                            data.forEach(function(item, index) {
                                const forAsync = async () => {
                                    if (data[index].isServerMessage !== true) {
                                        if (data[index].isEncrypted == true) {
                                            const keyUUID = thisUsersPublicKeyObject.keysUniqueId
                                            console.log("Encrypted")
                                            if (data[index].encryptedChatText !== null) {
                                                console.log(data[index])
                                                const foundIndexOfThisUsersMessage = await data[index].encryptedChatText.findIndex(x => x.keysUniqueId == keyUUID);
                                                console.log(`Found index: ${foundIndexOfThisUsersMessage}`)
                                                if (foundIndexOfThisUsersMessage !== -1) {
                                                    const isUsersKey = await getValueForEncryptionKeys(keyUUID)
                                                    if (isUsersKey !== null) {
                                                        console.log("Decode")
                                                        const decodedPrivKey = await nacl.util.decodeBase64(isUsersKey)
                                                        const forAsync = async () => {
                                                            
                                                            const decodedPubKey = await nacl.util.decodeBase64(data[index].encryptedChatText[foundIndexOfThisUsersMessage].pubkey)
    
                                                            const nonce = uint8Nonce
    
                                                            const messageDecoded = await nacl.util.decodeBase64(data[index].encryptedChatText[foundIndexOfThisUsersMessage].encryptedString)
                                                            //console.log(`message Decoded: ${messageDecoded}`)
                                                            const messageDecrypted = await nacl.box.open(messageDecoded, nonce, decodedPubKey, decodedPrivKey)
                                                            //console.log(`message Decrypted: ${messageDecrypted}`)
                                                            const messageEncoded = await nacl.util.encodeUTF8(messageDecrypted)
                                                            //console.log(`message Encoded: ${messageEncoded}`)
    
                                                            //
                                                            if (data[index].senderImageKey !== "") {
                                                                checkIfImageIsLoaded(data[index].senderImageKey)
                                                                //push
                                                                var toPush = {
                                                                    messagesId: data[index]._id,
                                                                    publicId: data[index].publicId,
                                                                    senderName: data[index].senderName,
                                                                    senderImageKey: data[index].senderImageKey,
                                                                    senderDisplayName: data[index].senderDisplayName,
                                                                    chatText: "",
                                                                    datePosted: data[index].datePosted,
                                                                    dateUpdated: data[index].dateUpdated,
                                                                    encryptedChatText: messageEncoded,
                                                                    isServerMessage: data[index].isServerMessage,
                                                                    involvedIds: data[index].involvedIds
                                                                }
                                                                allData.push(toPush)
                                                                itemsProcessed++;
                                                                if (itemsProcessed == data.length) {
                                                                    sortAndSet(allData)
                                                                }
                                                            } else {
                                                                //push
                                                                var toPush = {
                                                                    messagesId: data[index]._id,
                                                                    publicId: data[index].publicId,
                                                                    senderName: data[index].senderName,
                                                                    senderImageKey: "",
                                                                    senderDisplayName: data[index].senderDisplayName,
                                                                    chatText: "",
                                                                    datePosted: data[index].datePosted,
                                                                    dateUpdated: data[index].dateUpdated,
                                                                    encryptedChatText: messageEncoded,
                                                                    isServerMessage: data[index].isServerMessage,
                                                                    involvedIds: data[index].involvedIds
                                                                }
                                                                allData.push(toPush)
                                                                itemsProcessed++;
                                                                if (itemsProcessed == data.length) {
                                                                    sortAndSet(allData)
                                                                }
                                                            }
                                                        }
                                                        forAsync()            
                                                    } else {
                                                        console.log("No Pub Found")
                                                        if (data[index].senderImageKey !== "") {
                                                            checkIfImageIsLoaded(data[index].senderImageKey)
                                                            //push
                                                            var toPush = {
                                                                messagesId: data[index]._id,
                                                                publicId: data[index].publicId,
                                                                senderName: data[index].senderName,
                                                                senderImageKey: data[index].senderImageKey,
                                                                senderDisplayName: data[index].senderDisplayName,
                                                                chatText: "",
                                                                datePosted: data[index].datePosted,
                                                                dateUpdated: data[index].dateUpdated,
                                                                encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                                isServerMessage: data[index].isServerMessage,
                                                                involvedIds: data[index].involvedIds
                                                            }
                                                            allData.push(toPush)
                                                            itemsProcessed++;
                                                            if (itemsProcessed == data.length) {
                                                                sortAndSet(allData)
                                                            }
                                                        } else {
                                                            //push
                                                            var toPush = {
                                                                messagesId: data[index]._id,
                                                                publicId: data[index].publicId,
                                                                senderName: data[index].senderName,
                                                                senderImageKey: "",
                                                                senderDisplayName: data[index].senderDisplayName,
                                                                chatText: "",
                                                                datePosted: data[index].datePosted,
                                                                dateUpdated: data[index].dateUpdated,
                                                                encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                                isServerMessage: data[index].isServerMessage,
                                                                involvedIds: data[index].involvedIds
                                                            }
                                                            allData.push(toPush)
                                                            itemsProcessed++;
                                                            if (itemsProcessed == data.length) {
                                                                sortAndSet(allData)
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    console.log("Didnt Find the Key for this message")
                                                    console.log("No Pub Found")
                                                    if (data[index].senderImageKey !== "") {
                                                        checkIfImageIsLoaded(data[index].senderImageKey)
                                                        //push
                                                        var toPush = {
                                                            messagesId: data[index]._id,
                                                            publicId: data[index].publicId,
                                                            senderName: data[index].senderName,
                                                            senderImageKey: data[index].senderImageKey,
                                                            senderDisplayName: data[index].senderDisplayName,
                                                            chatText: "",
                                                            datePosted: data[index].datePosted,
                                                            dateUpdated: data[index].dateUpdated,
                                                            encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                            isServerMessage: data[index].isServerMessage,
                                                            involvedIds: data[index].involvedIds
                                                        }
                                                        allData.push(toPush)
                                                        itemsProcessed++;
                                                        if (itemsProcessed == data.length) {
                                                            sortAndSet(allData)
                                                        }
                                                    } else {
                                                        //push
                                                        var toPush = {
                                                            messagesId: data[index]._id,
                                                            publicId: data[index].publicId,
                                                            senderName: data[index].senderName,
                                                            senderImageKey: "",
                                                            senderDisplayName: data[index].senderDisplayName,
                                                            chatText: "",
                                                            datePosted: data[index].datePosted,
                                                            dateUpdated: data[index].dateUpdated,
                                                            encryptedChatText: `${data[index].encryptedChatText[0].encryptedString} (You dont have the keys to decrypt this)`,
                                                            isServerMessage: data[index].isServerMessage,
                                                            involvedIds: data[index].involvedIds
                                                        }
                                                        allData.push(toPush)
                                                        itemsProcessed++;
                                                        if (itemsProcessed == data.length) {
                                                            sortAndSet(allData)
                                                        }
                                                    }
                                                }
                                            } else {
                                                console.log("What")
                                                itemsProcessed++;
                                                if (itemsProcessed == data.length) {
                                                    sortAndSet(allData)
                                                }
                                            }
                                        } else {
                                            console.log("Not Encrypted")
                                            if (data[index].senderImageKey !== "") {
                                                checkIfImageIsLoaded(data[index].senderImageKey)
                                                //push
                                                var toPush = {
                                                    messagesId: data[index]._id,
                                                    publicId: data[index].publicId,
                                                    senderName: data[index].senderName,
                                                    senderImageKey: data[index].senderImageKey,
                                                    senderDisplayName: data[index].senderDisplayName,
                                                    chatText: data[index].chatText,
                                                    datePosted: data[index].datePosted,
                                                    dateUpdated: data[index].dateUpdated,
                                                    encryptedChatText: "",
                                                    isServerMessage: data[index].isServerMessage,
                                                    involvedIds: data[index].involvedIds
                                                }
                                                allData.push(toPush)
                                                itemsProcessed++;
                                                if (itemsProcessed == data.length) {
                                                    sortAndSet(allData)
                                                }    
                                            } else {
                                                //push
                                                var toPush = {
                                                    messagesId: data[index]._id,
                                                    publicId: data[index].publicId,
                                                    senderName: data[index].senderName,
                                                    senderImageKey: "",
                                                    senderDisplayName: data[index].senderDisplayName,
                                                    chatText: data[index].chatText,
                                                    datePosted: data[index].datePosted,
                                                    dateUpdated: data[index].dateUpdated,
                                                    encryptedChatText: "",
                                                    isServerMessage: data[index].isServerMessage,
                                                    involvedIds: data[index].involvedIds
                                                }
                                                allData.push(toPush)
                                                itemsProcessed++;
                                                if (itemsProcessed == data.length) {
                                                    sortAndSet(allData)
                                                }
                                            }
                                        }
                                    } else {
                                        var toPush = {
                                            messagesId: data[index]._id,
                                            publicId: "",
                                            senderName: "",
                                            senderImageKey: "",
                                            senderDisplayName: "",
                                            chatText: data[index].chatText,
                                            datePosted: data[index].datePosted,
                                            dateUpdated: data[index].dateUpdated,
                                            encryptedChatText: "",
                                            isServerMessage: true,
                                            involvedIds: data[index].involvedIds
                                        }
                                        allData.push(toPush)
                                        itemsProcessed++;
                                        if (itemsProcessed == data.length) {
                                            sortAndSet(allData)
                                        }
                                    }
                                }
                                forAsync()
                            })
                        }
                        const nonceArray = []
                        const nonceObject = cryptographicNonce[0]
                        //for loop
                        var objectToPush = 0;
                        for (let i = 0; i < 24; i++) {
                            nonceArray.push(nonceObject[`${objectToPush}`])
                            //console.log("nonce array:")
                            //console.log(nonceArray)
                            objectToPush++;
                            if (nonceArray.length == 24) {
                                const nonce = new Uint8Array(nonceArray)
                                //console.log(nonce)
                                const urlForGettingKeyInUse = `${serverUrl}/conversations/getCurrentKeyInUse/${conversationId}/${_id}`;
                                axios.get(urlForGettingKeyInUse).then((response) => {
                                    const result = response.data;
                                    const {message, status, sendback} = result;
        
                                    if (status !== 'SUCCESS') {
                                        //handleMessage(message, "FAILED")
                                        //console.log("FAILED")
                                        afterRecievingKeysId("None", nonce)
                                        //console.log(message)
                                    } else {
                                        afterRecievingKeysId(sendback, nonce)
                                    }
                                })
                            }
                        }
                    } else {
                        console.log("No messages?")
                        setMessages([])
                        setLoadingMoreMessages(true)
                        setLoadingMoreMessages(false)
                        console.log("Loading off")
                    }
                }
    
            }).catch(error => {
                console.log(error);
                setLoadingMoreMessages(false)
                handleMessage("An error occured. Try checking your network connection and retry.");
            })
    }

    useEffect(() => {
        if (prevReconnectPrompt == true) {
            if (reconnectPrompt == false) {
                fullLoadOfAll()
            }
        }
    }, [reconnectPrompt])

    const dismissAgeWarning = () => {
        setShowAgeWarning(false)
    }

    // Code that runs after the age warning has been dismissed
    useEffect(() => {
        if (showAgeWarning == false) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [showAgeWarning])

    useEffect(() => {
        const state = AppState.currentState;
        if (state === "active") {
            screenshotsPreventingBlurViewOpacity.setValue(0)
        } else {
            screenshotsPreventingBlurViewOpacity.setValue(1)
        }
    }, [])

    useEffect(() => {
        const appStateSubscription = AppState.addEventListener("change", _handleAppStateChange);
        if (Platform.OS == 'android') {
            var appStateBlurSubscription = AppState.addEventListener('blur', handleAppStateBlur);
            var appStateFocusSubscription = AppState.addEventListener('focus', handleAppStateFocus);
        }
    
        return () => {
            appStateSubscription.remove();
            if (Platform.OS == 'android') {
                appStateBlurSubscription.remove();
                appStateFocusSubscription.remove();
            }
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (nextAppState === "active") {
            screenshotsPreventingBlurViewOpacity.setValue(0)
        } else {
            screenshotsPreventingBlurViewOpacity.setValue(1)
        }
    }

    const handleAppStateBlur = () => {
        screenshotsPreventingBlurViewOpacity.setValue(1)
    }

    const handleAppStateFocus = () => {
        screenshotsPreventingBlurViewOpacity.setValue(0)
    }

    useEffect(() => {
        async function allowOrPreventScreenshots() {
            if (!await ScreenCapture.isAvailableAsync()) {
                alert('This device does not support disabling screenshots. Chats will be disabled soon in the future.')
            } else if (Platform.OS == 'ios' && Platform.Version < 11) {
                alert('This device does not support disabling screenshots. Chats will be disabled soon in the future.')
            } else {
                if (screenShotsOn == false) {
                    await ScreenCapture.preventScreenCaptureAsync();
                } else {
                    await ScreenCapture.allowScreenCaptureAsync();
                }
            }
        }
        allowOrPreventScreenshots()

        return async () => {
            await ScreenCapture.allowScreenCaptureAsync();
        }
    }, [screenShotsOn])


    return(
        <>
            <Animated.View style={{height: '100%', width: '100%', position: 'absolute', top: 0, zIndex: screenshotsPreventingBlurViewOpacity.interpolate({inputRange: [0, 1], outputRange: [-10, 3]}), opacity: screenshotsPreventingBlurViewOpacity}}>
                <BlurView intensity={100} style={{height: '100%', width: '100%'}}/>
            </Animated.View>
            <Animated.View style={{height: '100%', width: '100%', position: 'absolute', top: 0, backgroundColor: 'transparent', opacity: LeaveConversationConfirmationBoxOpacity, zIndex: LeaveConversationConfirmationBoxOpacity.interpolate({inputRange: [0, 1], outputRange: [-10, 2]}), justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.4, backgroundColor: colors.primary, borderRadius: 20, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderColor: colors.borderColor, borderWidth: 3}}>
                    {isDirectMessage == false ?
                        <>
                            <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold'}}>Are you sure you want to leave this conversation?</Text>
                            <TouchableOpacity onPress={() => {LeaveConversationConfirmationBoxOpacity.setValue(0)}} style={{borderColor: colors.tertiary, borderWidth: 3, padding: 12, borderRadius: 10, marginVertical: 20}}>
                                <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Stay in conversation</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={leaveConversation} style={{borderColor: colors.errorColor, borderWidth: 3, padding: 20, borderRadius: 10}}>
                                <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Leave</Text>
                            </TouchableOpacity>
                        </>
                    :
                        <>
                            <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold'}}>You cannot leave DMs</Text>
                            <TouchableOpacity onPress={() => {LeaveConversationConfirmationBoxOpacity.setValue(0)}} style={{borderColor: colors.tertiary, borderWidth: 3, padding: 12, borderRadius: 10, marginVertical: 20}}>
                                <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Go back</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </Animated.View>
            {showAgeWarning == true ?
                <View style={{backgroundColor: colors.primary, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <AntDesign name="warning" size={75} color={colors.tertiary} style={{marginBottom: 20}}/>
                    <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Warning</Text>
                    <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>You are about to see a {conversationNSFW == true ? 'NSFW' : conversationNSFL == true ? 'NSFL' : 'adult'} conversation</Text>
                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center'}}>By continuing you confirm that you are 18 or older and can look at adult content.</Text>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <TouchableOpacity onPress={() => {navigation.goBack()}} style={{borderColor: colors.tertiary, borderWidth: 3, padding: 12, borderRadius: 10, marginRight: 20}}>
                            <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Go back to safety</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={dismissAgeWarning} style={{borderColor: colors.errorColor, borderWidth: 3, padding: 12, borderRadius: 10}}>
                            <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {LeaveConversationConfirmationBoxOpacity.setValue(1)}} style={{borderColor: colors.tertiary, borderWidth: 3, padding: 12, borderRadius: 10, marginTop: 20}}>
                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Leave conversation</Text>
                    </TouchableOpacity>
                </View>
            :
            
                <StyledContainer style={{height: '100%', width: '100%', flex: 1, paddingLeft: 0, paddingRight: 0, backgroundColor: colors.darkerPrimary}}>
                    {settingsOpen == true && (
                        <View style={{position: 'absolute', zIndex: 10, height: Dimensions.get('window').height, width: Dimensions.get('window').width, backgroundColor: colors.primary}}>
                            <View style={{marginTop: StatusBarHeight + 10, alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: Dimensions.get('window').height * 0.06, width: '100%', borderColor: colors.borderColor, borderBottomWidth: 3, flexDirection: 'row'}}>
                                <View style={{width: '10%', height: '100%', marginLeft: '5%', marginRight: '2.5%'}}>
                                    <TouchableOpacity style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                        if (addMemberSearch == false) {
                                            setSettingsOpen(false)
                                        } else {
                                            setAddMemberSearch(false)
                                        }
                                    }}>
                                        <Image style={{width: '80%', height: '80%', resizeMode: 'contain', tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/321-arrow-left2.png')}/>
                                    </TouchableOpacity>
                                </View>
                                <SubTitle numberOfLines={1} style={{width: '65%', marginTop: 0, padding: 0, alignSelf: 'center', marginBottom: 0, fontSize: 24, color: colors.tertiary}}>{conversationTitle}</SubTitle>
                                <View style={{width: '10%', height: '100%', marginRight: '5%'}}>
                                    <TouchableOpacity style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                        LeaveConversationConfirmationBoxOpacity.setValue(1)
                                    }}>
                                        <Image style={{width: '80%', height: '80%', resizeMode: 'contain', tintColor: colors.red}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/277-exit.png')}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {addMemberSearch == true && (
                                <View style={{height: Dimensions.get('window').height * 0.94, width: '100%'}}>
                                    <PageTitle style={{color: colors.tertiary}}>Select Recipient</PageTitle>
                                    <SubTitle style={{color: colors.tertiary, textAlign: 'center'}}>{message}</SubTitle>
                                    <SearchBarArea style={{alignSelf: 'center', marginTop: -20, marginBottom: -10}}>
                                        <UserTextInput
                                            placeholder="Search"
                                            placeholderTextColor={colors.tertiary}
                                            onChangeText={(val) => handleChange(val)}
                                            type="Search"
                                            addingUser={addingUser}
                                            colors={colors}
                                        />
                                    </SearchBarArea>
                                    <View style={{width: '100%'}}>
                                        {addingUser == false && (
                                            <SectionList
                                                sections={changeSections}
                                                keyExtractor={(item, index) => item + index}
                                                renderItem={({ item }) => <UserItem pubId={item.pubId} name={item.name} displayName={item.displayName} followers={item.followers}  following={item.following} totalLikes={item.totalLikes} profileKey={item.profileKey}/>}
                                                ListFooterComponent={
                                                    loadingOne == true ? <ActivityIndicator size="large" color={colors.brand} style={{marginVertical: 20}} /> : <View style={{height: 280}}/>
                                                }
                                            />
                                        )}
                                        {addingUser == true && (
                                            <ActivityIndicator size="large" color={colors.brand} style={{marginVertical: 20}} />  
                                        )}
                                    </View>
                                </View>
                            )}
                            {transferOwnershipConfirm !== null && (
                                <View style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.3, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.15, backgroundColor: colors.primary, position: 'absolute', alignSelf: 'center', borderRadius: 30, zIndex: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                                    <View>
                                        <SubTitle style={{textAlign: 'center', width: '95%', marginTop: '5%', alignSelf: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: colors.darkLight, height: '35%', color: colors.tertiary}}>Transfer ownership to {transferOwnershipConfirm.name}?</SubTitle>
                                        {transferringOwnership == false && (
                                            <View>
                                                <TouchableOpacity style={{width: '80%', paddingTop: 10, paddingBottom: 10, marginBottom: 5, alignContent: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: colors.brand, borderRadius: 30}} onPress={() => {
                                                    transferOwnershipFunction(transferOwnershipConfirm.pubId)
                                                }}>
                                                    <SubTitle style={{marginBottom: 0, textAlign: 'center'}}> Confirm </SubTitle>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{width: '80%', paddingTop: 10, paddingBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: colors.brand, borderRadius: 30}} onPress={() => {
                                                    setTransferOwnershipConfirm(null)
                                                }}>
                                                    <SubTitle style={{marginBottom: 0, textAlign: 'center'}}> Cancel </SubTitle>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        {transferringOwnership == true && (
                                            <ActivityIndicator size="large" color={colors.brand} />  
                                        )}
                                    </View>
                                </View>
                            )}
                            {addMemberSearch == false && (
                                <View style={{height: Dimensions.get('window').height * 0.9}}>
                                    {isDirectMessage == false && (
                                        <ScrollView style={{backgroundColor: colors.primary, height: '100%'}}>
                                            <MsgBox type={messageType} style={{marginBottom: 10, marginTop: 0}}>{message}</MsgBox>
                                            {loadingGroupIcon == false && (
                                                <View style={{alignSelf: 'center', alignContent: 'center'}}>
                                                    {groupIcon !== "" && (
                                                        <Avatar resizeMode="cover" source={{uri: groupIcon}}/>
                                                    )}
                                                    {groupIcon == "" && (
                                                        <Avatar resizeMode="cover" source={{uri: SocialSquareLogo_B64_png}}/>
                                                    )}
                                                    {changingGroupIcon == false && (
                                                        <TouchableOpacity onPress={() => {OpenImgLibrary()}}>
                                                            <SubTitle style={{marginBottom: 0, color: colors.darkestBlue, textAlign: 'center'}}>Change</SubTitle>
                                                        </TouchableOpacity>
                                                    )}
                                                    {changingGroupIcon == true && (
                                                        <ActivityIndicator size="large" color={colors.brand} style={{marginBottom: 20}} />  
                                                    )}
                                                </View>
                                            )}
                                            {loadingGroupIcon == true && (
                                                <View style={{alignSelf: 'center', alignContent: 'center'}}>
                                                    <ActivityIndicator size={10} color={colors.brand} style={{marginBottom: 20, padding: 40, borderColor: colors.darkestBlue, borderWidth: 3, borderRadius: 150}} />  
                                                    <SubTitle style={{marginBottom: 0, color: colors.darkestBlue, textAlign: 'center'}}></SubTitle>
                                                </View>
                                            )}
                                            {titleLoading == false && (
                                                <View style={{flex: 1, marginBottom: 0, marginTop: 0}}>
                                                    <UserTextInput
                                                        placeholder=""
                                                        textAlign={'center'}
                                                        placeholderTextColor={colors.tertiary}
                                                        fontSize={18}
                                                        color={colors.tertiary}
                                                        multiline={false}
                                                        type="GroupTitle"
                                                        style={{marginTop: 20, alignSelf: 'center'}}
                                                        onChangeText={(val) => setNewTitleValue(val)}
                                                        value={newTitleValue}
                                                        defaultValue={conversationTitle}
                                                        currentTitle={conversationTitle}
                                                        submitText={() => {
                                                            changeGroupsName(newTitleValue)
                                                        }}
                                                        colors={colors}
                                                    />
                                                </View>
                                            )}
                                            {titleLoading == true && (
                                                <ActivityIndicator size="large" color={colors.brand} />  
                                            )}
                                            {descriptionLoading == false && (
                                                <View style={{flex: 1, marginBottom: 0, marginTop: 0}}>
                                                    <UserTextInput
                                                        placeholder=""
                                                        textAlign={'center'}
                                                        placeholderTextColor={colors.tertiary}
                                                        fontSize={12}
                                                        color={colors.tertiary}
                                                        multiline={true}
                                                        type="GroupDescription"
                                                        style={{marginTop: 20, alignSelf: 'center'}}
                                                        onChangeText={(val) => setNewDescriptionValue(val)}
                                                        value={newDescriptionValue}
                                                        defaultValue={conversationDescription}
                                                        currentDescription={conversationDescription}
                                                        submitText={() => {
                                                            changeGroupsDescription(newDescriptionValue)
                                                        }}
                                                        colors={colors}
                                                    />
                                                </View>
                                            )}
                                            {descriptionLoading == true && (
                                                <ActivityIndicator size="large" color={colors.brand} />  
                                            )}
                                            <View style={{alignItems: 'center', alignSelf: 'center'}}>
                                                {changingIfEncryptionOn == false && (
                                                    <View>
                                                        {
                                                            thisUserIsOwner == true ?
                                                                <View style={{flexDirection: 'row'}}>
                                                                    <SubTitle style={{color: colors.brand, textAlign: 'center', fontSize: 24}}>Encryption   </SubTitle>
                                                                    <View style={{width: 50}}/>
                                                                    {encryptionLoading == false ?
                                                                        encryptionOn == true ?
                                                                            <Switch
                                                                                trackColor={{ false: colors.primary, true: colors.brand }}
                                                                                thumbColor={colors.tertiary}
                                                                                ios_backgroundColor={colors.primary}
                                                                                onValueChange={toggleEncryptionFunction}
                                                                                value={true}
                                                                            />
                                                                        :
                                                                            <Switch
                                                                                trackColor={{ false: colors.primary, true: colors.brand }}
                                                                                thumbColor={colors.tertiary}
                                                                                ios_backgroundColor={colors.primary}
                                                                                onValueChange={toggleEncryptionFunction}
                                                                                value={false}
                                                                            />
                                                                    :
                                                                        <ActivityIndicator size="large" color={colors.brand} style={{marginBottom: 10, marginLeft: 10}}/>
                                                                    }
                                                                </View>
                                                            :
                                                                <SubTitle style={{color: colors.brand, textAlign: 'center'}}>Chat encryption is {encryptionOn == true ? 'on' : 'off'}</SubTitle>
                                                        }
                                                        {
                                                            thisUserIsOwner == true ?
                                                                <View style={{flexDirection: 'row'}}>
                                                                    <SubTitle style={{color: colors.brand, textAlign: 'center', fontSize: 24}}>Screenshots</SubTitle>
                                                                    <View style={{width: 50}}/>
                                                                    {screenshotLoading == false ?
                                                                        screenShotsOn == true ?
                                                                            <Switch
                                                                                trackColor={{ false: colors.primary, true: colors.brand }}
                                                                                thumbColor={colors.tertiary}
                                                                                ios_backgroundColor={colors.primary}
                                                                                onValueChange={toggleScreenshotFunction}
                                                                                value={true}
                                                                            />
                                                                        :
                                                                            <Switch
                                                                                trackColor={{ false: colors.primary, true: colors.brand }}
                                                                                thumbColor={colors.tertiary}
                                                                                ios_backgroundColor={colors.primary}
                                                                                onValueChange={toggleScreenshotFunction}
                                                                                value={false}
                                                                            />
                                                                    :
                                                                        <ActivityIndicator size="large" color={colors.brand} style={{marginBottom: 10, marginLeft: 10}}/>
                                                                    }
                                                                </View>
                                                            :
                                                                <SubTitle style={{color: colors.brand, textAlign: 'center'}}>Screenshots are {screenShotsOn == true ? 'on' : 'off'}</SubTitle>
                                                        }
                                                    </View>
                                                )}
                                                {changingIfEncryptionOn == true && (
                                                    <ActivityIndicator size="large" color={colors.brand} />  
                                                )}
                                                <SubTitle style={{color: colors.tertiary}}>Members</SubTitle>
                                                <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 10}}>
                                                    <PostIcons style={{width: 30, height: 30, tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png')}/>
                                                    <SubTitle style={{marginBottom: 0, fontWeight: 'normal', color: colors.tertiary}}>{membersInChat.length}/14</SubTitle>
                                                </View>
                                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}
                                                    disabled={membersInChat.length == 14}
                                                    onPress={() => {
                                                    setAddMemberSearch(true)
                                                }}>
                                                    <SubTitle style={{borderRadius: 1000, width: 30, height: 33.5, textAlign: 'center', fontWeight: 'normal', marginRight: 8, color: colors.tertiary, fontSize: 26}}>+</SubTitle>
                                                    <SubTitle style={{color: colors.tertiary}}>Add Users</SubTitle>
                                                </TouchableOpacity>
                                            </View>
                                            <ScrollView style={{flex: 1, marginBottom: 70}}>
                                                {membersInChat.map((member, index) => {
                                                    return (
                                                        <View key={member.pubId} style={{borderTopWidth: 3, height: 70, borderColor: colors.borderColor, width: '70%', alignSelf: 'center'}}>
                                                            <PostsHorizontalView style={{marginLeft: '5%', width: '90%', marginBottom: 5, marginRight: '5%'}}>
                                                                {member.isOwner == false && (
                                                                    <View>
                                                                        {thisUserIsOwner == true && (
                                                                            <View>
                                                                                {transferringOwnership == false && (
                                                                                    <TouchableOpacity onPress={() => setTransferOwnershipConfirm({pubId : member.pubId, name: member.name})}>
                                                                                        <Image style={{width: 12.5, height: 12.5, marginTop: 27, marginRight: 5, tintColor: colors.yellow}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/216-star-empty.png')}/>
                                                                                    </TouchableOpacity>
                                                                                )}
                                                                                {transferringOwnership == true && (
                                                                                    <TouchableOpacity disabled={true} onPress={() => setTransferOwnershipConfirm({pubId : member.pubId, name: member.name})}>
                                                                                        <Image style={{width: 12.5, height: 12.5, marginTop: 27, marginRight: 5, tintColor: colors.yellow}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/216-star-empty.png')}/>
                                                                                    </TouchableOpacity>
                                                                                )}
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                )}
                                                                <PostsVerticalView>
                                                                    {usersPFPData.findIndex(x => x.imageKey === member.imageKey) !== -1 && (
                                                                        <PostCreatorIcon source={{uri: usersPFPData[usersPFPData.findIndex(x => x.imageKey === member.imageKey)].b64}}/>
                                                                    )}
                                                                    {usersPFPData.findIndex(x => x.imageKey === member.imageKey) == -1 && (
                                                                        <PostCreatorIcon source={{uri: SocialSquareLogo_B64_png}}/>
                                                                    )}
                                                                </PostsVerticalView>
                                                                <PostsVerticalView style={{marginTop: 9}}>
                                                                    {member.displayName == "" && (
                                                                        <View>
                                                                            <SubTitle style={{fontSize: 20, color: colors.brand, marginBottom: 0}}>{member.name}</SubTitle>
                                                                            <SubTitle style={{fontSize: 12, marginBottom: 0, color: colors.tertiary}}>@{member.name}</SubTitle>
                                                                        </View>
                                                                    )}
                                                                    {member.displayName !== "" && (
                                                                        <View>
                                                                            <SubTitle style={{fontSize: 20, color: colors.brand, marginBottom: 0}}>{member.displayName}</SubTitle>
                                                                            <SubTitle style={{fontSize: 12, marginBottom: 0, color: colors.tertiary}}>@{member.name}</SubTitle>
                                                                        </View>
                                                                    )}
                                                                </PostsVerticalView>
                                                                {member.isOwner == true && (
                                                                    <Image style={{width: 25, height: 25, marginTop: 19.75, marginLeft: 5, tintColor: colors.yellow}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/218-star-full.png')}/>
                                                                )}
                                                                {member.isOwner == false && (
                                                                    <View>
                                                                        {thisUserIsOwner == true && (
                                                                            <View>
                                                                                {transferOwnershipConfirm == null && (
                                                                                    <View>
                                                                                        {removingUser == false && (
                                                                                            <TouchableOpacity onPress={() => removeUser(member.pubId)}>
                                                                                                <Image style={{width: 12.5, height: 12.5, marginTop: 27, marginLeft: 5, tintColor: colors.red}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/174-bin2.png')}/>
                                                                                            </TouchableOpacity>
                                                                                        )}
                                                                                        {removingUser == true && (
                                                                                            <TouchableOpacity disabled={true} onPress={() => removeUser(member.pubId)}>
                                                                                                <Image style={{width: 12.5, height: 12.5, marginTop: 27, marginLeft: 5, tintColor: colors.red}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/174-bin2.png')}/>
                                                                                            </TouchableOpacity>
                                                                                        )}
                                                                                    </View>
                                                                                )}
                                                                                {transferOwnershipConfirm !== null && (
                                                                                    <TouchableOpacity disabled={true} onPress={() => removeUser(member.pubId)}>
                                                                                        <Image style={{width: 12.5, height: 12.5, marginTop: 27, marginLeft: 5, tintColor: colors.red}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/174-bin2.png')}/>
                                                                                    </TouchableOpacity>
                                                                                )}
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                )}
                                                            </PostsHorizontalView>
                                                        </View>
                                                    )
                                                })}
                                            </ScrollView>
                                        </ScrollView>
                                    )}
                                    {isDirectMessage == true && (
                                        <ScrollView style={{backgroundColor: colors.primary}}>
                                            <MsgBox type={messageType} style={{marginBottom: 10, marginTop: 0}}>{message}</MsgBox>
                                            {/* doesnt work I think, I could probs fix but cbb
                                            {membersInChat.findIndex(x => x.pubId !== secondId) !== -1 && (
                                                <View style={{alignSelf: 'center', alignContent: 'center'}}>
                                                    {usersPFPData.findIndex(x => x.imageKey == membersInChat[membersInChat.findIndex(x => x.pubId !== secondId).imageKey]) !== -1 && (
                                                        <Avatar resizeMode="cover" source={{uri: usersPFPData[usersPFPData.findIndex(x => x.imageKey == membersInChat[membersInChat.findIndex(x => x.pubId !== secondId).imageKey])].b64}}/>
                                                    )}
                                                    {usersPFPData.findIndex(x => x.imageKey == membersInChat[membersInChat.findIndex(x => x.pubId !== secondId).imageKey]) == -1 && (
                                                        <Avatar resizeMode="cover"/>
                                                    )}
                                                </View>
                                            )}
                                            */}
                                            <View>
                                                {encryptionLoading == false && (
                                                    <View>
                                                        {encryptionOn == false && (
                                                            <TouchableOpacity onPress={() => {toggleEncryptionFunction()}}>
                                                                <SubTitle style={{color: colors.brand, textAlign: 'center'}}>Turn encryption on</SubTitle>
                                                            </TouchableOpacity>
                                                        )}
                                                        {encryptionOn == true && (
                                                            <TouchableOpacity onPress={() => {toggleEncryptionFunction()}}>
                                                                <SubTitle style={{color: colors.brand, textAlign: 'center'}}>Turn encryption off</SubTitle>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View> 
                                                )}
                                                {encryptionLoading == true && (
                                                    <ActivityIndicator size="large" color={colors.brand} style={{marginBottom: 20}} />  
                                                )}
                                                {screenshotLoading == false && (
                                                    <View>
                                                        {screenShotsOn == false && (
                                                            <TouchableOpacity onPress={() => {toggleScreenshotFunction()}}>
                                                                <SubTitle style={{color: colors.brand, textAlign: 'center'}}>Turn screenshots on</SubTitle>
                                                            </TouchableOpacity>
                                                        )}
                                                        {screenShotsOn == true && (
                                                            <TouchableOpacity onPress={() => {toggleScreenshotFunction()}}>
                                                                <SubTitle style={{color: colors.brand, textAlign: 'center'}}>Turn screenshots off</SubTitle>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                )}
                                                {screenshotLoading == true && (
                                                    <ActivityIndicator size="large" color={colors.brand} style={{marginBottom: 20}} />  
                                                )}
                                            </View>
                                        </ScrollView>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                        {scrollToBottomIsVisible == true && settingsOpen == false && (
                            <View style={{alignSelf: 'flex-end', position: 'absolute', zIndex: 20, height: 30, width: 30, right: 10, top: Dimensions.get('window').height * 0.785, marginTop: -10, backgroundColor: colors.primary, borderRadius: 30, borderColor: colors.borderColor}}>
                                <TouchableOpacity style={{width: '100%', height: '100%'}} onPress={() => {scrollRef.current.scrollToEnd({ animated: true })}}>
                                    {unreadsWithinSingularConversation !== 0 && (
                                        <Text style={{position: 'absolute', alignSelf: 'flex-end', backgroundColor: colors.red, color: colors.tertiary, borderRadius: 50}}>{unreadsWithinSingularConversation}</Text>
                                    )}
                                    <Image style={{width: 30, height: 30, tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                                </TouchableOpacity>
                            </View>
                        )}
                        {checkingForConversationValues == true && (
                            <View style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.3, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.15, backgroundColor: colors.primary, position: 'absolute', alignSelf: 'center', borderRadius: 30, zIndex: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                                <SubTitle style={{textAlign: 'center', width: '95%', paddingBottom: '5%', marginTop: '5%', alignSelf: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: colors.borderColor}}>Loading Conversation Values</SubTitle>
                                <ActivityIndicator size="50%" color={colors.brand}/>  
                            </View>
                        )}
                        {generatingEncryptionKeys == true && (
                            <View style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.3, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.15, backgroundColor: colors.primary, position: 'absolute', alignSelf: 'center', borderRadius: 30, zIndex: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                                <SubTitle style={{textAlign: 'center', width: '95%', paddingBottom: '5%', marginTop: '5%', alignSelf: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: colors.borderColor}}>Generating Encryption Keys</SubTitle>
                                <ActivityIndicator size="50%" color={colors.brand}/>  
                            </View>
                        )}
                        {errorCheckingForEncryption !== null && (
                            <View style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.3, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.15, backgroundColor: colors.primary, position: 'absolute', alignSelf: 'center', borderRadius: 30, zIndex: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                                <SubTitle style={{textAlign: 'center', width: '95%', paddingBottom: '5%', marginTop: '5%', alignSelf: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: colors.borderColor, height: '40%', marginTop: '10%', color: colors.errorColor}}>{errorCheckingForEncryption}</SubTitle>
                                <TouchableOpacity style={{height: '30%', marginBottom: '10%', marginTop: '10%', backgroundColor: colors.brand, width: '80%', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 30}} onPress={() => {
                                    setErrorCheckingForEncryption(null)
                                    navigation.goBack()
                                }}>
                                    <ButtonText style={{textAlign: 'center'}}> Go Back </ButtonText>
                                </TouchableOpacity>
                            </View>
                        )}
                        {errorGeneratingEncryptionKeys == true && (
                            <View style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.3, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.15, backgroundColor: colors.primary, position: 'absolute', alignSelf: 'center', borderRadius: 30, zIndex: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                                <SubTitle style={{textAlign: 'center', width: '95%', paddingBottom: '5%', marginTop: '5%', alignSelf: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: colors.borderColor, height: '30%', marginBottom: '10%', marginTop: '10%', color: colors.errorColor}}>Error Generating Encryption Keys</SubTitle>
                                <StyledButton style={{height: '30%', marginBottom: '10%', marginTop: '10%'}} onPress={() => {
                                    setErrorGeneratingEncryptionKeys(false)
                                    navigation.goBack()
                                }}>
                                    <ButtonText> Go Back </ButtonText>
                                </StyledButton>
                            </View>
                        )}
                        {removedFromConversation == true && (
                            <View style={{width: Dimensions.get('window').width * 0.8, height: Dimensions.get('window').height * 0.3, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.15, backgroundColor: colors.primary, position: 'absolute', alignSelf: 'center', borderRadius: 30, zIndex: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                                <SubTitle style={{textAlign: 'center', width: '95%', paddingBottom: '5%', marginTop: '5%', alignSelf: 'center', justifyContent: 'center', borderBottomWidth: 3, borderColor: colors.borderColor, height: '40%', marginTop: '10%'}}>{"You have sadly been removed from this conversation :("}</SubTitle>
                                <TouchableOpacity style={{height: '30%', marginBottom: '10%', marginTop: '10%', backgroundColor: colors.brand, width: '80%', alignContent: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 30}} onPress={() => {
                                    navigation.goBack()
                                }}>
                                    <ButtonText style={{textAlign: 'center'}}> Go Back </ButtonText>
                                </TouchableOpacity>
                            </View>
                        )}
                        {messageOptionsOpen !== null && (
                            <View style={{width: Dimensions.get('window').width * 0.8, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.2, backgroundColor: colors.darkerPrimary, position: 'absolute', alignSelf: 'center', justifyContent: 'center', borderRadius: 30, zIndex: 10}}>
                                <TouchableOpacity style={{marginVertical: '2%', backgroundColor: colors.brand, marginTop: 50, width: '80%', paddingVertical: 20, alignContent: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 30}} onPress={() => {
                                    setMessageOptionsOpen(null)
                                }}>
                                    <ButtonText style={{textAlign: 'center'}}> Add Reactions (Doesn't work yet)</ButtonText>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginVertical: '2%', backgroundColor: colors.brand, width: '80%', paddingVertical: 20, alignContent: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 30}} onPress={() => {
                                    if (messageOptionsOpen.chatText !== "") {
                                        Clipboard.setString(messageOptionsOpen.chatText)
                                        console.log("Saved to clipboard")
                                        setMessageOptionsOpen(null)
                                    } else if (messageOptionsOpen.encryptedChatText) {
                                        Clipboard.setString(messageOptionsOpen.encryptedChatText)
                                        console.log("Saved to clipboard")
                                        setMessageOptionsOpen(null)
                                    } else {
                                        handleMessage("Problem getting text in message", "FAILED")
                                        setMessageOptionsOpen(null)
                                    }

                                }}>
                                    <ButtonText style={{textAlign: 'center'}}> Copy Text </ButtonText>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginVertical: '2%', backgroundColor: colors.brand, marginBottom: 50, width: '80%', paddingVertical: 20, alignContent: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 30}} onPress={() => {
                                    setMessageOptionsOpen(null)
                                }}>
                                    <ButtonText style={{textAlign: 'center'}}> Close </ButtonText>
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: Dimensions.get('window').height * 0.06, width: '100%', borderColor: colors.borderColor, borderBottomWidth: 3, paddingBottom: 5, flexDirection: 'row', backgroundColor: colors.darkerPrimary}}>
                            <View style={{width: '10%', height: '100%', marginLeft: '5%', marginRight: '2.5%'}}>
                                <TouchableOpacity style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={() => navigation.goBack()}>
                                    <Image style={{width: '80%', height: '80%', resizeMode: 'contain', tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/321-arrow-left2.png')}/>
                                </TouchableOpacity>
                            </View>
                            <SubTitle numberOfLines={1} style={{width: '65%', marginTop: 0, padding: 0, alignSelf: 'center', marginBottom: 0, fontSize: 24, color: colors.tertiary}}>{conversationTitle}</SubTitle>
                            <View style={{width: '10%', height: '100%', marginRight: '2.5%'}}>
                                <TouchableOpacity style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <Image style={{width: '80%', height: '80%', resizeMode: 'contain', tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/067-phone.png')}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: '10%', height: '100%', marginRight: '5%'}}>
                                <TouchableOpacity style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                    console.log("Opening Settings")
                                    setSettingsOpen(true)
                                }}>
                                    <Image style={{width: '80%', height: '80%', resizeMode: 'contain', tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/269-info.png')}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    <View style={{flex: 1, width: '100%'}}>
                        <View style={{flexGrow: 1, height: Dimensions.get('window').height * 0.65, width: '100%'}}>
                            <FlatList 
                                ref={scrollRef}
                                style={{flex: 1, paddingTop: 0, backgroundColor: colors.primary}}
                                onScroll={handleScroll}
                                data={messages}
                                onContentSizeChange={(width, height) => {
                                    // get content height from onContentSizeChange
                                    if (height < Dimensions.get('window').height * 0.65) {
                                        try {
                                            if (messages !== []) {
                                                console.log(messages[messages.length-1].datePosted)
                                                socket.emit("viewed-message", conversationId, secondId, messages[messages.length-1].messagesId, messages[messages.length-1].datePosted);
                                                if (lastMessageSeen.findIndex(x => x.secondId == secondId && x.messagesId == messages[messages.length-1].messagesId) !== -1) {
                                                    //already includes
                                                } else {
                                                    console.log("HS message seen")
                                                    console.log(`Handle Scroll Updated messages: ${JSON.stringify(messages[messages.length-1].messagesId)}`)
                                                    console.log("Updating LMS")
                                                    const clonedLMS = lastMessageSeen.slice()
                                                    clonedLMS.push({secondId: secondId, messagesId: messages[messages.length-1].messagesId})
                                                    setLastMessageSeen(clonedLMS)
                                                }
                                            }
                                        } catch (error) {
                                            console.log(`Scroll View error ${error}`)
                                        }
                                    }
                                }}
                                renderItem={({item, index}) => {
                                    var m = item
                                    return(
                                        <View style={{marginBottom: 10, paddingHorizontal: 10}}>
                                            {m.isServerMessage == false && (
                                                <View>
                                                    {index == 0 && (
                                                        <View>
                                                            {loadingMoreMessages == false && (
                                                                <TouchableOpacity style={{alignSelf: 'center', marginBottom: 10}} onPress={() => {loadMoreMessages()}}>
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', color: colors.tertiary}}>Load More</SubTitle>                                                    
                                                                </TouchableOpacity>
                                                            )}
                                                            {loadingMoreMessages == true && (
                                                                <ActivityIndicator size="large" color={colors.brand} />  
                                                            )}
                                                        </View>
                                                    )}
                                                    {m.publicId == storedCredentials.secondId && (
                                                        <View>
                                                            {m.senderDisplayName == "" && (
                                                                <View style={{marginLeft: '20%', flexDirection: 'row', textAlign: 'left', width: '80%'}}>
                                                                    <SubTitle style={{fontSize: 18, marginBottom: 0, marginTop: 0, color: colors.tertiary}}>{m.senderName} </SubTitle>
                                                                    <SubTitle numberOfLines={1} style={{fontSize: 14, color: colors.brand, marginBottom: 0, marginTop: 2}}>@{m.senderName}</SubTitle>
                                                                </View>
                                                            )}
                                                            {m.senderDisplayName !== "" && (
                                                                <View style={{marginLeft: '20%', flexDirection: 'row', textAlign: 'left', width: '80%'}}>
                                                                    <SubTitle style={{fontSize: 18, marginBottom: 0, marginTop: 0, color: colors.tertiary}}>{m.senderDisplayName} </SubTitle>
                                                                    <SubTitle numberOfLines={1} style={{fontSize: 14, color: colors.brand, marginBottom: 0, marginTop: 2}}>@{m.senderName}</SubTitle>
                                                                </View>
                                                            )}
                                                            <View style={{flexDirection: 'row'}}>
                                                                {m.senderImageKey !== "" && (
                                                                    <PostsVerticalView style={{width: '20%'}}>
                                                                        {usersPFPData.findIndex(x => x.imageKey === m.senderImageKey) !== -1 && (
                                                                            <PostCreatorIcon style={{width: 60, height: 60}} source={{uri: usersPFPData[usersPFPData.findIndex(x => x.imageKey === m.senderImageKey)].b64}}/>
                                                                        )}
                                                                        {usersPFPData.findIndex(x => x.imageKey === m.senderImageKey) == -1 && (
                                                                            <PostCreatorIcon style={{width: 60, height: 60}}/>
                                                                        )}
                                                                    </PostsVerticalView>
                                                                )}
                                                                {m.senderImageKey == "" && (
                                                                    <PostsVerticalView style={{width: '20%', alignItems: 'center'}}>
                                                                        <PostCreatorIcon style={{aspectRatio: 1/1, height: 60}} source={{uri: SocialSquareLogo_B64_png}}/>
                                                                    </PostsVerticalView>
                                                                )}
                                                                <TouchableOpacity style={{flex: 1, backgroundColor: colors.darkestBlue, borderRadius: 20, paddingHorizontal: 5, paddingTop: 10, paddingBottom: 10, width: '100%'}} onLongPress={() => {setMessageOptionsOpen({messagesId: m.messagesId, chatText: m.chatText, encryptedChatText: m.encryptedChatText})}}>
                                                                    <PostsHorizontalView>
                                                                        <PostsVerticalView style={{width: '80%'}}>
                                                                            {m.chatText !== "" && (
                                                                                <SubTitle style={{fontSize: 14, lineHeight: 20, marginBottom: 0, fontWeight: 'normal'}}>{m.chatText}</SubTitle>
                                                                            )}
                                                                            {m.chatText == "" && (
                                                                                <SubTitle style={{fontSize: 14, lineHeight: 20, marginBottom: 0, fontWeight: 'normal'}}>{m.encryptedChatText}</SubTitle>
                                                                            )}
                                                                            </PostsVerticalView>
                                                                    </PostsHorizontalView>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <SubTitle style={{marginLeft: '20%', fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, fontWeight: 'normal', color: colors.tertiary}}>{m.dateUpdated}</SubTitle>
                                                        </View>
                                                    )}
                                                    {m.publicId !== storedCredentials.secondId && (
                                                        <View>
                                                            {m.senderDisplayName == "" && (
                                                                <View style={{flexDirection: 'row', textAlign: 'left'}}>
                                                                    <SubTitle style={{fontSize: 18, marginBottom: 0, marginTop: 0, color: colors.tertiary}}>{m.senderName} </SubTitle>
                                                                    <SubTitle numberOfLines={1} style={{fontSize: 14, color: colors.brand, marginBottom: 0, marginTop: 2}}>@{m.senderName}</SubTitle>
                                                                </View>
                                                            )}
                                                            {m.senderDisplayName !== "" && (
                                                                <View style={{flexDirection: 'row', textAlign: 'left'}}>
                                                                    <SubTitle style={{fontSize: 18, marginBottom: 0, marginTop: 0, color: colors.tertiary}}>{m.senderDisplayName} </SubTitle>
                                                                    <SubTitle numberOfLines={1} style={{fontSize: 14, color: colors.brand, marginBottom: 0, marginTop: 2}}>@{m.senderName}</SubTitle>
                                                                </View>
                                                            )}
                                                            <View style={{flexDirection: 'row'}}>
                                                                <TouchableOpacity style={{flex: 1, backgroundColor: colors.darkestBlue, borderRadius: 20, paddingHorizontal: 5, paddingTop: 10, paddingBottom: 10, width: '100%'}} onLongPress={() => {setMessageOptionsOpen({messagesId: m.messagesId, chatText: m.chatText, encryptedChatText: m.encryptedChatText})}}>
                                                                    <PostsHorizontalView>
                                                                        <PostsVerticalView style={{width: '80%'}}>
                                                                            {m.chatText !== "" && (
                                                                                <SubTitle style={{fontSize: 14, lineHeight: 20, marginBottom: 0, fontWeight: 'normal'}}>{m.chatText}</SubTitle>
                                                                            )}
                                                                            {m.chatText == "" && (
                                                                                <SubTitle style={{fontSize: 14, lineHeight: 20, marginBottom: 0, fontWeight: 'normal'}}>{m.encryptedChatText}</SubTitle>
                                                                            )}
                                                                        </PostsVerticalView>
                                                                    </PostsHorizontalView>
                                                                </TouchableOpacity>
                                                                {m.senderImageKey !== "" && (
                                                                    <PostsVerticalView style={{width: '20%'}}>
                                                                        {usersPFPData.findIndex(x => x.imageKey === m.senderImageKey) !== -1 && (
                                                                            <PostCreatorIcon style={{width: 60, height: 60}} source={{uri: usersPFPData[usersPFPData.findIndex(x => x.imageKey === m.senderImageKey)].b64}}/>
                                                                        )}
                                                                        {usersPFPData.findIndex(x => x.imageKey === m.senderImageKey) == -1 && (
                                                                            <PostCreatorIcon style={{width: 60, height: 60}}/>
                                                                        )}
                                                                    </PostsVerticalView>
                                                                )}
                                                                {m.senderImageKey == "" && (
                                                                    <PostsVerticalView style={{width: '20%', alignItems: 'center'}}>
                                                                        <PostCreatorIcon style={{aspectRatio: 1/1, height: 60}} source={{uri: SocialSquareLogo_B64_png}}/>
                                                                    </PostsVerticalView>
                                                                )}
                                                            </View>
                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, fontWeight: 'normal'}}>{m.dateUpdated}</SubTitle>
                                                        </View>
                                                    )}
                                                    {index == (messages.length-1) && (
                                                        <View>
                                                            {loadingSeenMessages == true && (
                                                                <ActivityIndicator size="large" color={colors.brand}/>
                                                            )}
                                                            {loadingSeenMessages == false && (
                                                                <View>
                                                                    {lastMessageSeen.length !== 0 && (
                                                                        <TouchableOpacity style={{alignSelf: 'center', width: '80%'}}>
                                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 5, alignSelf: 'center', color: colors.tertiary}}>Seen by {seenMessagesStringValue}</SubTitle>
                                                                        </TouchableOpacity>
                                                                    )}
                                                                    {lastMessageSeen.length == 0 && (
                                                                        <View>
                                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 5, alignSelf: 'center', color: colors.tertiary}}>Seen by 0</SubTitle>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                            {m.isServerMessage == true && (
                                                <View>
                                                    <TouchableOpacity onLongPress={() => {setMessageOptionsOpen({messagesId: m.messagesId, chatText: m.chatText, encryptedChatText: m.encryptedChatText})}}>
                                                        {index == 0 && (
                                                            <View>
                                                                {m.chatText !== "Conversation Created" && (
                                                                    <View>
                                                                        {loadingMoreMessages == false && (
                                                                            <TouchableOpacity style={{alignSelf: 'center', marginBottom: 10}} onPress={() => {loadMoreMessages()}}>
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', textAlign: 'center', color: colors.tertiary}}>Load More</SubTitle>                                                    
                                                                            </TouchableOpacity>
                                                                        )}
                                                                        {loadingMoreMessages == true && (
                                                                            <ActivityIndicator size="large" color={colors.brand} />  
                                                                        )}
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "Conversation Created" && (
                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>The conversation was created.</SubTitle>                                                        
                                                        )}
                                                        {m.chatText == "Left" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatLeft) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatLeft)].name} left the conversation.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatLeft) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatLeft)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "User Kicked" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatKicked) !== -1 && (
                                                                    <View>
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotKicked) == -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatGotKicked)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatKicked)].name} kicked loading...</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotKicked) !== -1 && (
                                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatKicked)].name} kicked {serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotKicked)].name}.</SubTitle>                                                        
                                                                        )}
                                                                    </View>
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatKicked) == -1 && (
                                                                    <View>
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotKicked) == -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatKicked)}
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatGotKicked)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>loading... kicked loading...</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotKicked) !== -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatKicked)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>loading... kicked {serverTextUsers[serverTextUsers.findIndex(x => x.publicId === m.involvedIds.userThatGotKicked)].name}</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "User Added" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatAdded) !== -1 && (
                                                                    <View>
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotAdded) == -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatGotAdded)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatAdded)].name} Added loading...</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotAdded) !== -1 && (
                                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatAdded)].name} Added {serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotAdded)].name}.</SubTitle>                                                        
                                                                        )}
                                                                    </View>
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatAdded) == -1 && (
                                                                    <View>
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotAdded) == -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatAdded)}
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatGotAdded)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>loading... Added loading...</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatGotAdded) !== -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.userThatGotAdded)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>loading... Added {serverTextUsers[serverTextUsers.findIndex(x => x.publicId === m.involvedIds.userThatGotAdded)].name}</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "Ownership Transferred" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.oldOwner) !== -1 && (
                                                                    <View>
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.newOwner) == -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.newOwner)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.oldOwner)].name} transferred ownership to loading...</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.newOwner) !== -1 && (
                                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.oldOwner)].name} transferred ownership to {serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.newOwner)].name}.</SubTitle>                                                        
                                                                        )}
                                                                    </View>
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.oldOwner) == -1 && (
                                                                    <View>
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.newOwner) == -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.oldOwner)}
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.newOwner)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>loading... transferred ownership to loading...</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                        {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.newOwner) !== -1 && (
                                                                            <View>
                                                                                {getSingleServerMessagesMemberData(m.involvedIds.oldOwner)}
                                                                                <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>loading... transferred ownership to {serverTextUsers[serverTextUsers.findIndex(x => x.publicId === m.involvedIds.newOwner)].name}</SubTitle>                                                        
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "Group Icon Changed" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIcon) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIcon)].name} changed the group icon.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIcon) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatChangedIcon)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "Screenshots On" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled)].name} turned on screenshots.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatToggled)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "Screenshots Off" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled)].name} turned off screenshots.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatToggled)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "Encryption Toggled On" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled)].name} turned on encryption.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatToggled)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "Encryption Toggled Off" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled)].name} turned off encryption.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatToggled) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatToggled)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "New Title" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIt) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIt)].name} changed the group name.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIt) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatChangedIt)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                        {m.chatText == "New Description" && (
                                                            <View>
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIt) !== -1 && (
                                                                    <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>{serverTextUsers[serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIt)].name} changed the group description.</SubTitle>                                                        
                                                                )}
                                                                {serverTextUsers.findIndex(x => x.pubId === m.involvedIds.userThatChangedIt) == -1 && (
                                                                    <View>
                                                                        {getSingleServerMessagesMemberData(m.involvedIds.userThatChangedIt)} 
                                                                        <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 0, width: '100%', alignSelf: 'center', fontWeight: 'normal', textAlign: 'center', color: colors.tertiary}}>Loading...</SubTitle>                                                        
                                                                    </View>
                                                                )}
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                    {index == (messages.length-1) && (
                                                        <View>
                                                            {loadingSeenMessages == true && (
                                                                <ActivityIndicator size="large" color={colors.brand}/>
                                                            )}
                                                            {loadingSeenMessages == false && (
                                                                <View>
                                                                    {lastMessageSeen.length !== 0 && (
                                                                        <TouchableOpacity style={{alignSelf: 'center', width: '80%'}}>
                                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 5, alignSelf: 'center', color: colors.tertiary}}>Seen by {seenMessagesStringValue}</SubTitle>
                                                                        </TouchableOpacity>
                                                                    )}
                                                                    {lastMessageSeen.length == 0 && (
                                                                        <View>
                                                                            <SubTitle style={{fontSize: 12, lineHeight: 20, paddingLeft: 10, marginBottom: 0, marginTop: 5, alignSelf: 'center', color: colors.tertiary}}>Seen by 0</SubTitle>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    )
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            
                            <View style={{height: 3, backgroundColor: colors.borderColor}}/>
                            <MsgBox type={messageType} style={{marginBottom: 10, marginTop: 0, borderColor: colors.darkLight, borderTopWidth: 3}}>{message}</MsgBox>
                            
                            <KeyboardSpacer/>
                        </View>
                        <View style={{flex: 1}}>
                            <View style={{flexDirection: 'row', width: '100%', height: 100, alignItems: 'center', justifyContent: 'center', paddingTop: 0, bottom: keyboardHeight}}>
                                {encryptionOn == true && (
                                    <View style={{flex: 1, marginBottom: 0, marginTop: 0}}>
                                        <UserTextInput
                                            autoCorrect={false}
                                            placeholder="Send Encrypted Message"
                                            placeholderTextColor={colors.tertiary}
                                            onChangeText={val => {setNewMessage(val)}}
                                            value={newMessage}
                                            defaultValue=""
                                            multiline={true}
                                            type="Send"
                                            colors={colors}
                                        />
                                    </View>
                                )}
                                {encryptionOn == false && (
                                    <View style={{flex: 1, marginBottom: 0, marginTop: 0}}>
                                        <UserTextInput
                                            autoCorrect={false}
                                            placeholder="Send Message"
                                            placeholderTextColor={colors.tertiary}
                                            onChangeText={val => {setNewMessage(val)}}
                                            value={newMessage}
                                            defaultValue=""
                                            multiline={true}
                                            type="Send"
                                            colors={colors}
                                        />
                                    </View>
                                )}
                                {sendingOrLoadingMessageIndicator == true && (
                                    <ActivityIndicator size="large" color={colors.brand} />  
                                )}
                                {sendingOrLoadingMessageIndicator == false && (
                                    <TouchableOpacity onPress={() => {
                                            handleSubmit()
                                        }}>
                                        <Image style={{width: 35, height: 35, marginLeft: 5, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/323-circle-right.png')}/>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </StyledContainer>
            }
        </>
    );
}

const UserTextInput = ({label, icon, type, addingUser, submitText, currentTitle, currentDescription, value, colors, ...props}) => {
    return(
        <SearchBarArea style={{width: '100%'}}>
            {type == "Send" && (
                <View style={{width: '100%'}}>
                    <StyledTextInput searchPage={true} value={value} {...props} style={{paddingLeft: 55, paddingRight: 10, marginTop: 0, marginBottom: 0, color: colors.tertiary, backgroundColor: colors.primary, borderColor: colors.borderColor}}/>
                    <LeftIcon searchIcon={true} style={{top: 13}}>
                        <TouchableOpacity>
                            <Image style={{width: 25, height: 25, tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/250-hipster.png')}/>
                        </TouchableOpacity>
                    </LeftIcon>
                </View>
            )}
            {type == "Search" && (
                <View style={{width: '100%'}}>
                    <StyledInputLabel style={{color: colors.tertiary}}>{label}</StyledInputLabel>
                    <StyledTextInput disabled={addingUser} value={value} searchPage={true} {...props} style={{paddingLeft: 55, paddingRight: 10, marginTop: 0, marginBottom: 0, color: colors.tertiary, backgroundColor: colors.primary, borderColor: colors.borderColor}}/>
                    <LeftIcon searchIcon={true} style={{top: 24.5}}>
                        <TouchableOpacity>
                            <Image style={{width: 25, height: 25, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/135-search.png')}/>
                        </TouchableOpacity>
                    </LeftIcon>
                </View>
            )}
            {type == "GroupTitle" && (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '85%'}}>
                    <View style={{justifyContent: 'center'}}>
                        <TextInput
                            {...props}
                            maxLength={25}
                            placeholderTextColor={colors.tertiary}
                            style={{color: colors.tertiary}}
                        />
                    </View>
                    {value !== currentTitle && (
                        <View>
                            {value !== "" && (
                                <TouchableOpacity onPress={() => submitText()}>
                                    <Image style={{width: 15, height: 15, marginLeft: 5, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                </TouchableOpacity>
                            )}
                            {value == "" && (
                                <TouchableOpacity>
                                    <Image style={{width: 15, height: 15, marginLeft: 5, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/006-pencil.png')}/>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    {value == currentTitle && (
                        <TouchableOpacity>
                            <Image style={{width: 15, height: 15, marginLeft: 5, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/006-pencil.png')}/>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {type == "GroupDescription" && (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '85%'}}>
                    <View style={{justifyContent: 'center'}}>
                        <TextInput
                            {...props}
                            maxLength={160}
                            placeholderTextColor={colors.tertiary}
                            style={{color: colors.tertiary}}
                        />
                    </View>
                    {value !== currentDescription && (
                        <View>
                            {value !== "" && (
                                <TouchableOpacity onPress={() => submitText()}>
                                    <Image style={{width: 15, height: 15, marginLeft: 5, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                                </TouchableOpacity>
                            )}
                            {value == "" && (
                                <TouchableOpacity>
                                    <Image style={{width: 15, height: 15, marginLeft: 5, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/006-pencil.png')}/>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    {value == currentDescription && (
                        <TouchableOpacity>
                            <Image style={{width: 15, height: 15, marginLeft: 5, tintColor: colors.brand}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/006-pencil.png')}/>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </SearchBarArea>
    )
}

export default Chat;

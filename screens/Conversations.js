import React, {useState, useContext, useEffect, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';

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
    Navigator_RightButton
} from './screenStylings/styling.js';
import {View, ActivityIndicator, ImageBackground, StyleSheet, Image, SectionList, Text, Animated} from 'react-native';

// Colors
const {brand, primary, tertiary, darkLight, descTextColor, slightlyLighterPrimary, red} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';

//online member context
import { OnlineContext } from '../components/conversationOnlineHandler';

//socket context
import { SocketContext } from '../components/socketHandler';

import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import { useIsFocused } from '@react-navigation/native';

import { ReconnectPromptContext } from '../components/reconnectPrompt';

import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';

import {useTheme} from '@react-navigation/native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import { ServerUrlContext } from '../components/ServerUrlContext.js';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import TopNavBar from '../components/TopNavBar.js';

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const Conversations = ({navigation}) => {
    const isFocused = useIsFocused();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    //could just use socket instead of OnlineContext
    const {onlineUsers, setOnlineUsers} = useContext(OnlineContext);
    const {socket, setSocket} = useContext(SocketContext);
    const {reconnectPrompt, setReconnectPrompt} = useContext(ReconnectPromptContext);
    const prevReconnectPrompt = usePrevious(reconnectPrompt);
    const [onlineUsersForShow, setOnlineUsersForShow] = useState([])
    const [onlineUsersImageB64s, setOnlineUsersImageB64s] = useState([])
    const [compareOnlineUsers, setCompareOnlineUsers] = useState([])
    if (storedCredentials) {var {name} = storedCredentials} else {var {name} = {name: 'SSGUEST'}}
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [conversationsSections, setConversationSections] = useState([])
    const [loadingConversations, setLoadingConversations] = useState(false)
    const [extraUnreadsMessages, setExtraUnreadMessages] = useState([])
    const {colors, dark} = useTheme()
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    var userLoadMax = 30
    const LoadingOnlineUsersPlaceholderAnimationOpacity = useRef(new Animated.Value(1)).current;
    const StatusBarHeight = useContext(StatusBarHeightContext);

    Animated.loop(
        Animated.sequence([
            Animated.timing(LoadingOnlineUsersPlaceholderAnimationOpacity, {
                toValue: 0.5,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(LoadingOnlineUsersPlaceholderAnimationOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            })
        ])
    ).start();
    
    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }
    
    //any image honestly
    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }

    const ConversationItem = ({conversationId, isDirectMessage, members, conversationImageB64, conversationTitle, conversationNSFW, conversationNSFL, dateCreated, lastMessage, lastMessageDate, cryptographicNonce, conversationDescription, unreadsMessages}) => (
        <TouchableOpacity style={{borderColor: colors.darkLight, borderWidth: 3, height: 100, borderRadius: 20, paddingTop: 5, paddingBottom: 5, paddingLeft: 2, paddingRight: 2, marginBottom: 10, width: '90%', alignSelf: 'center'}} onPress={() => navigation.navigate("Chat", {conversationId: conversationId, conversationTitleSent: conversationTitle, cryptographicNonce: cryptographicNonce, conversationDescriptionSent: conversationDescription, isDirectMessage: isDirectMessage, conversationNSFL: conversationNSFL, conversationNSFW: conversationNSFW})}>
            <PostsHorizontalView>
                <PostsVerticalView>
                    <PostCreatorIcon style={{height: 50, aspectRatio: 1/1}} source={{uri: conversationImageB64 != null || '' ? conversationImageB64 : SocialSquareLogo_B64_png}}/>
                </PostsVerticalView>
                <PostsVerticalView style={{marginTop: 9, width: '55%'}}>
                    <View style={{height: 70, justifyContent: 'center', width: '100%'}}>
                        {conversationNSFW == true && (
                            <SubTitle numberOfLines={1} style={{fontSize: 20, marginBottom: 0, marginTop: 0, color: colors.red, width: '100%'}}>{conversationTitle}</SubTitle>
                        )}
                        {conversationNSFL == true && (
                            <SubTitle numberOfLines={1} style={{fontSize: 20, marginBottom: 0, marginTop: 0, color: colors.red, width: '100%'}}>{conversationTitle}</SubTitle>
                        )}
                        {conversationNSFW == false && (
                            <View>
                                {conversationNSFL == false && (
                                    <SubTitle numberOfLines={1} style={{fontSize: 20, marginBottom: 0, marginTop: 0, width: '100%', color: colors.tertiary}}>{conversationTitle}</SubTitle>
                                )}
                            </View>
                        )}
                        <SubTitle numberOfLines={1} style={{fontSize: 16, color: colors.brand, marginBottom: 0, marginTop: 2, width: '100%'}}>{members} Members</SubTitle>
                    </View>
                </PostsVerticalView>
            </PostsHorizontalView>
            {unreadsMessages + extraUnreadsMessages.filter(x => x == conversationId).length !== 0 && (
                <View style={{position: 'absolute', right: 10, top: 10, fontWeight: 'bold'}}>
                    {unreadsMessages !== "" && (
                        <Text style={{backgroundColor: colors.red, color: colors.tertiary, borderRadius: 1000, aspectRatio: 1, width: 20, textAlign: 'center', position: 'absolute', fontWeight: 'bold', right: 5}}>
                            {unreadsMessages + extraUnreadsMessages.filter(x => x == conversationId).length}
                        </Text>
                    )}
                </View>
            )}
            {/*
            <PostsHorizontalView style={{marginTop: 5, borderTopWidth: 3, borderColor: darkLight, alignItems: 'center'}}>
                <PostsVerticalView style={{marginTop: 9}}>
                    <View style={{width: 70, justifyContent: 'center', alignItems: 'center'}}>
                        <SubTitle style={{fontSize: 15, fontWeight: 'normal', marginBottom: 0, marginTop: 0}}>{lastMessageDate}</SubTitle>
                        <SubTitle style={{fontSize: 12, fontWeight: 'normal', color: brand, marginBottom: 0, marginTop: 0}}>Seen</SubTitle>
                    </View>
                </PostsVerticalView>
                <SubTitle style={{fontSize: 12, marginRight: 70, color: descTextColor, marginBottom: 0, marginTop: 0, marginTop: 5}}>{lastMessage}</SubTitle>
            </PostsHorizontalView>
            */}
        </TouchableOpacity>
    );

    const loadConversations = () => {
        setConversationSections([])
        const layoutConversationsFound = (data) => {
            var allData = data
            //console.log(allData)
            //console.log(allData.length)
            var tempSections = []
            var itemsProcessed = 0;
            setExtraUnreadMessages([])
            console.log('Length of data: ' + allData.length)
            allData.forEach(function (item, index) {
                console.log(`Unread Messages: ${allData[index].unreadsMessages}`)
                if (allData[index].conversationImageKey !== "") {
                    if (index+1 <= userLoadMax) {      
                        async function asyncFunctionForImages() {
                            const imageB64 = await getImageWithKey(allData[index].conversationImageKey)
                            var tempSectionsTemp = {data: [{conversationId: allData[index].conversationId, isDirectMessage: allData[index].isDirectMessage, members: allData[index].members, conversationImageB64: imageB64, conversationTitle: allData[index].conversationTitle, conversationDescription: allData[index].conversationDescription, conversationNSFW: allData[index].conversationNSFW, conversationNSFL: allData[index].conversationNSFL, dateCreated: allData[index].dateCreated, lastMessage: allData[index].lastMessage, lastMessageDate: allData[index].lastMessageDate, cryptographicNonce: allData[index].cryptographicNonce, unreadsMessages: allData[index].unreadsMessages}]}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            console.log(itemsProcessed)
                            if(itemsProcessed === allData.length) {
                                console.log('Done loading conversations')
                                setConversationSections(tempSections)
                                setLoadingConversations(false)
                            }
                        }
                        asyncFunctionForImages()
                    }
                } else {
                    if (index+1 <= userLoadMax) {      
                        var tempSectionsTemp = {data: [{conversationId: allData[index].conversationId, isDirectMessage: allData[index].isDirectMessage, members: allData[index].members, conversationImageB64: null, conversationTitle: allData[index].conversationTitle, conversationDescription: allData[index].conversationDescription, conversationNSFW: allData[index].conversationNSFW, conversationNSFL: allData[index].conversationNSFL, dateCreated: allData[index].dateCreated, lastMessage: allData[index].lastMessage, lastMessageDate: allData[index].lastMessageDate, cryptographicNonce: allData[index].cryptographicNonce, unreadsMessages: allData[index].unreadsMessages}]}
                        tempSections.push(tempSectionsTemp)
                        itemsProcessed++;
                        console.log(itemsProcessed)
                        if(itemsProcessed === allData.length) {
                            console.log('Done loading conversations')
                            setConversationSections(tempSections)
                            setLoadingConversations(false)
                        }
                    }
                }
            });
        }

        handleMessage(null);
        const url = `${serverUrl}/conversations/getConvos`;
        setLoadingConversations(true)
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                
            if (status !== 'SUCCESS') {
                console.log(`${status}: ${message}`)
                handleMessage(message, status);
                setLoadingConversations(false)
            } else {
                //console.log(data)
                layoutConversationsFound(data)
                handleMessage("Search Complete", "SUCCESS");
                //persistLogin({...data[0]}, message, status);
            }

        }).catch(error => {
            console.log(error);
            setLoadingConversations(false)
            handleMessage("An error occured. Try checking your network connection and retry.");
        })
    }

    const checkForChangeInOnlineUsersDetails = () => {
        //use keys to get b64's
        function afterGettingNewUserStuff(arrayOfNewMembersOnline) {
            var itemsProcessed = 0
            var tempImageB64s = []
            arrayOfNewMembersOnline.forEach(function (item, index) {
                if (arrayOfNewMembersOnline[index].imageKey !== "") {
                    if (onlineUsersImageB64s.includes(arrayOfNewMembersOnline[index].imageKey)) {
                        itemsProcessed++;
                        if (itemsProcessed == arrayOfNewMembersOnline.length) {
                            if (tempImageB64s.length !== 0) {
                                var tempOnlineUsersImageB64s = onlineUsersImageB64s.concat(tempImageB64s)
                                setOnlineUsersImageB64s(tempOnlineUsersImageB64s)
                            }
                        }
                    } else {
                        async function asyncForImageGetting() {
                            const imageB64OfOnlineMember = await getImageWithKey(arrayOfNewMembersOnline[index].imageKey)
                            tempImageB64s.push({imageKey: arrayOfNewMembersOnline[index].imageKey, imageB64: imageB64OfOnlineMember})
                            itemsProcessed++;
                            if (itemsProcessed == arrayOfNewMembersOnline.length) {
                                if (tempImageB64s.length !== 0) {
                                    var tempOnlineUsersImageB64s = onlineUsersImageB64s.concat(tempImageB64s)
                                    setOnlineUsersImageB64s(tempOnlineUsersImageB64s)
                                }
                            }
                        }
                        asyncForImageGetting()
                    }
                } else {
                    itemsProcessed++;
                    if (itemsProcessed == arrayOfNewMembersOnline.length) {
                        if (tempImageB64s.length !== 0) {
                            var tempOnlineUsersImageB64s = onlineUsersImageB64s.concat(tempImageB64s)
                            setOnlineUsersImageB64s(tempOnlineUsersImageB64s)
                        }
                    }
                }
            })
        } 
        //
        const allOnlineUsersStringed = onlineUsers.toString()
        console.log(allOnlineUsersStringed)
        const url = `${serverUrl}/getUsersDetailsWithPubIds/${allOnlineUsersStringed}`
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                
            if (status !== 'SUCCESS') {
                console.log(status)
                console.log(message)
                handleMessage(message, status)
            } else {
                console.log(status)
                console.log(message)
                var itemsProcessed = 0;
                var pushToOnlineUsersForShow = []
                if (data.length !== 0) {
                    data.forEach(function (item, index) {
                        var tempOnlineUsersForShow = onlineUsersForShow
                        var indexFound = tempOnlineUsersForShow.findIndex(x => x.pubId == data[index].pubId)
                        if (indexFound !== -1) {
                            if (onlineUsersForShow[index] !== data[index]) {
                                tempOnlineUsersForShow.splice(indexFound, 1)
                                tempOnlineUsersForShow.push(data[index])
                                itemsProcessed++;
                                if (itemsProcessed == data.length) {
                                    if (pushToOnlineUsersForShow.length !== 0) {
                                        var tempOnlineUsersForShow = onlineUsersForShow.concat(pushToOnlineUsersForShow)
                                        setOnlineUsersForShow(tempOnlineUsersForShow)
                                        afterGettingNewUserStuff(pushToOnlineUsersForShow)
                                    }
                                }
                            } else {
                                itemsProcessed++;
                                if (itemsProcessed == data.length) {
                                    if (pushToOnlineUsersForShow.length !== 0) {
                                        var tempOnlineUsersForShow = onlineUsersForShow.concat(pushToOnlineUsersForShow)
                                        setOnlineUsersForShow(tempOnlineUsersForShow)
                                        afterGettingNewUserStuff(pushToOnlineUsersForShow)
                                    }
                                }
                            }
                        } else {
                            pushToOnlineUsersForShow.push(data[index])
                            itemsProcessed++;
                            if (itemsProcessed == data.length) {
                                if (pushToOnlineUsersForShow.length !== 0) {
                                    var tempOnlineUsersForShow = onlineUsersForShow.concat(pushToOnlineUsersForShow)
                                    setOnlineUsersForShow(tempOnlineUsersForShow)
                                    afterGettingNewUserStuff(pushToOnlineUsersForShow)
                                }
                            }
                        }
                    })
                } else {
                    console.log("No user data sent back")
                }
            }
        }).catch(error => {
            console.log(error);
            handleMessage("Error occured while getting online users, check your internet connection and try again.")
        })
    }

    const checkConversationMembersOnlineStatuses = () => {
        const url = `${serverUrl}/getOnlineUsersByDms`
        axios.get(url).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
                    
            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                console.log(message)
                console.log(status)
            } else {
                console.log(message)
                console.log(status)
                const onlineUsersFiltered = onlineUsers.slice().filter(x => typeof x == 'string')
                console.log(`online users ${data}`)
                if (data.length) {
                    if (data.length !== 0) {
                        var onlineUsersProcessed = 0
                        var toAddToOnlineUsers = []
                        console.log(`online users context array whatnot: ${onlineUsersFiltered}`)
                        data.forEach(function (item, index) {
                            if (onlineUsersFiltered.includes(data[index]) == false) {
                                toAddToOnlineUsers.push(data[index])
                                onlineUsersProcessed++;
                                if (onlineUsersProcessed == data.length) {
                                    setOnlineUsers((prev)=>prev.concat(toAddToOnlineUsers))
                                }
                            } else {
                                onlineUsersProcessed++;
                                if (onlineUsersProcessed == data.length) {
                                    if (toAddToOnlineUsers > 0) {
                                        setOnlineUsers((prev)=>prev.concat(toAddToOnlineUsers))    
                                    } else {
                                        checkForChangeInOnlineUsersDetails()
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }).catch(error => {
            console.log(error);
            handleMessage("An error occured getting online users. Try checking your network connection and retry.");
        })
    }

    useEffect(() => {
        if (storedCredentials) {
            if (socket == '') {

            } else {
                socket.on("message-sent-when-out-of-convo", (messageId, convoId) => {
                    console.log(`Message: ${messageId}, conversation: ${convoId}`) 
                    setExtraUnreadMessages((prev)=>[...prev, convoId])
                });
            }
        }
    }, [socket])

    useEffect(() => {
        if (storedCredentials) {
            console.log(`Conversation.js Change in onlineUsers, new OU: ${onlineUsers}`)
            if (onlineUsers.length !== onlineUsersForShow.length) {
                if (onlineUsers.length !== 0) {
                    //use keys to get b64's
                    function afterGettingNewUserStuff(arrayOfNewMembersOnline) {
                        var itemsProcessed = 0
                        var tempImageB64s = []
                        arrayOfNewMembersOnline.forEach(function (item, index) {
                            if (arrayOfNewMembersOnline[index].imageKey !== "") {
                                if (onlineUsersImageB64s.includes(arrayOfNewMembersOnline[index].imageKey)) {
                                    itemsProcessed++;
                                    if (itemsProcessed == arrayOfNewMembersOnline.length) {
                                        if (tempImageB64s.length !== 0) {
                                            var tempOnlineUsersImageB64s = onlineUsersImageB64s.concat(tempImageB64s)
                                            setOnlineUsersImageB64s(tempOnlineUsersImageB64s)
                                        }
                                    }
                                } else {
                                    async function asyncForImageGetting() {
                                        const imageB64OfOnlineMember = await getImageWithKey(arrayOfNewMembersOnline[index].imageKey)
                                        tempImageB64s.push({imageKey: arrayOfNewMembersOnline[index].imageKey, imageB64: imageB64OfOnlineMember})
                                        itemsProcessed++;
                                        if (itemsProcessed == arrayOfNewMembersOnline.length) {
                                            if (tempImageB64s.length !== 0) {
                                                var tempOnlineUsersImageB64s = onlineUsersImageB64s.concat(tempImageB64s)
                                                setOnlineUsersImageB64s(tempOnlineUsersImageB64s)
                                            }
                                        }
                                    }
                                    asyncForImageGetting()
                                }
                            } else {
                                itemsProcessed++;
                                if (itemsProcessed == arrayOfNewMembersOnline.length) {
                                    if (tempImageB64s.length !== 0) {
                                        var tempOnlineUsersImageB64s = onlineUsersImageB64s.concat(tempImageB64s)
                                        setOnlineUsersImageB64s(tempOnlineUsersImageB64s)
                                    }
                                }
                            }
                        })
                    } 
                    //
                    const allOnlineUsersStringed = onlineUsers.toString()
                    console.log(allOnlineUsersStringed)
                    const url = `${serverUrl}/getUsersDetailsWithPubIds/${allOnlineUsersStringed}`
                    axios.get(url).then((response) => {
                        const result = response.data;
                        const {message, status, data} = result;
                            
                        if (status !== 'SUCCESS') {
                            console.log(status)
                            console.log(message)
                            handleMessage(message, status)
                        } else {
                            console.log(status)
                            console.log(message)
                            var itemsProcessed = 0;
                            var pushToOnlineUsersForShow = []
                            if (data.length !== 0) {
                                data.forEach(function (item, index) {
                                    var tempOnlineUsersForShow = onlineUsersForShow
                                    var indexFound = tempOnlineUsersForShow.findIndex(x => x.pubId == data[index].pubId)
                                    if (indexFound !== -1) {
                                        if (tempOnlineUsersForShow[indexFound] !== data[index]) {
                                            tempOnlineUsersForShow.splice(indexFound, 1)
                                            tempOnlineUsersForShow.push(data[index])
                                            pushToOnlineUsersForShow.push(data[index])
                                            itemsProcessed++;
                                            if (itemsProcessed == data.length) {
                                                if (pushToOnlineUsersForShow.length !== 0) {
                                                    setOnlineUsersForShow(tempOnlineUsersForShow)
                                                    afterGettingNewUserStuff(pushToOnlineUsersForShow)
                                                }
                                            }
                                        } else {
                                            itemsProcessed++;
                                            if (itemsProcessed == data.length) {
                                                if (pushToOnlineUsersForShow.length !== 0) {
                                                    var tempOnlineUsersForShow = onlineUsersForShow.concat(pushToOnlineUsersForShow)
                                                    setOnlineUsersForShow(tempOnlineUsersForShow)
                                                    afterGettingNewUserStuff(pushToOnlineUsersForShow)
                                                }
                                            }
                                        }
                                    } else {
                                        pushToOnlineUsersForShow.push(data[index])
                                        itemsProcessed++;
                                        if (itemsProcessed == data.length) {
                                            if (pushToOnlineUsersForShow.length !== 0) {
                                                var tempOnlineUsersForShow = onlineUsersForShow.concat(pushToOnlineUsersForShow)
                                                setOnlineUsersForShow(tempOnlineUsersForShow)
                                                afterGettingNewUserStuff(pushToOnlineUsersForShow)
                                            }
                                        }
                                    }
                                })
                            } else {
                                console.log("No user data sent back")
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                        handleMessage("Error occured while getting online users, check your internet connection and try again.")
                    })
                } else {
                    console.log("Setting OUFS to nothing")
                    setOnlineUsersForShow([])
                }
            }
        }
    }, [onlineUsers, onlineUsersForShow, onlineUsersImageB64s])

    useEffect(() => {
        if (storedCredentials && isFocused == true) {
            console.log("Reload Conversations")
            loadConversations()
            checkConversationMembersOnlineStatuses()
        }
    },[isFocused]);

    useEffect(() => {
        if (storedCredentials) {
            if (prevReconnectPrompt == true) {
                if (reconnectPrompt == false) {
                    setOnlineUsers([])
                    checkConversationMembersOnlineStatuses()
                    loadConversations()
                }
            }
        }
    }, [reconnectPrompt])

    const handleChange = (val) => {
        alert('Coming soon')
    }

    return(
        <>
            <StatusBar style={colors.StatusBarColor}/>
            <TopNavBar screenName={storedCredentials ? name : 'Conversations'} rightIcon={
                <>
                    {storedCredentials &&
                        <Navigator_RightButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.navigate("CreateConversationSelection")}}>
                            <AntDesign name="plus" size={40} color={colors.tertiary} />
                        </Navigator_RightButton>
                    }
                </>
            }/>
            {storedCredentials ?
                <View style={{flex: 1}}>
                    <SectionList
                        sections={conversationsSections}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => <ConversationItem conversationId={item.conversationId} isDirectMessage={item.isDirectMessage} members={item.members} conversationImageB64={item.conversationImageB64} conversationTitle={item.conversationTitle} conversationDescription={item.conversationDescription} conversationNSFW={item.conversationNSFW} conversationNSFL={item.conversationNSFL} dateCreated={item.dateCreated} lastMessage={item.lastMessage} lastMessageDate={item.lastMessageDate} cryptographicNonce={item.cryptographicNonce} unreadsMessages={item.unreadsMessages}/>}
                        ListFooterComponent={<View style={{height: 30}}/>}
                        ListHeaderComponent={
                            <View style={{width: '90%', alignSelf: 'center', marginBottom: 3}}>
                                <MsgBox type={messageType}>{message}</MsgBox>
                                <SearchBarArea style={{alignSelf: 'center', width: '100%', marginBottom: 0}}>
                                    <UserTextInput
                                        placeholder="Search Conversations"
                                        placeholderTextColor={colors.tertiary}
                                        onChangeText={(val) => handleChange(val)}
                                        style={{backgroundColor: colors.primary, borderColor: colors.borderColor, color: colors.tertiary}}
                                    />
                                </SearchBarArea>
                                {onlineUsers.length !== onlineUsersForShow.length ?
                                    <>
                                        <SubTitle style={{marginBottom: 0, fontWeight: 'normal', fontSize: 12, textAlign: 'center', marginVertical: 2, color: colors.tertiary}}>Dm Users Online:</SubTitle>
                                        <FlatList 
                                            contentContainerStyle={{justifyContent: 'center'}}
                                            horizontal={true}
                                            style={{flexDirection: 'row', borderColor: colors.borderColor, borderBottomWidth: 3, marginBottom: 5}}
                                            data={[{key: 1}, {key: 2}, {key: 3}, {key: 4}, {key: 5}, {key: 6}, {key: 7}, {key: 8}, {key: 9}, {key: 10}, {key: 11}, {key: 12}, {key: 13}, {key: 14}, {key: 15}, {key: 16}]}
                                            renderItem={({item, index}) => {
                                                return(
                                                    <View style={{alignItems: 'center'}}>
                                                        <Animated.View style={{height: 80, width: 80, borderRadius: 200, borderColor: colors.slightlyLighterPrimary, backgroundColor: colors.slightlyLighterPrimary, opacity: LoadingOnlineUsersPlaceholderAnimationOpacity}}/>
                                                        <Animated.View style={{height: 15, width: 60, marginTop: 5, borderRadius: 20, borderColor: colors.slightlyLighterPrimary, backgroundColor: colors.slightlyLighterPrimary, opacity: LoadingOnlineUsersPlaceholderAnimationOpacity}}/>
                                                        <Animated.View style={{height: 15, width: 90, marginTop: 5, borderRadius: 20, borderColor: colors.slightlyLighterPrimary, backgroundColor: colors.slightlyLighterPrimary, opacity: LoadingOnlineUsersPlaceholderAnimationOpacity}}/>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </>
                                :
                                    onlineUsersForShow.length == 0 ? (/*
                                        <TouchableOpacity style={{flexDirection: 'column', height: 80, width: 80, marginVertical: 10, borderRadius: 200, borderColor: colors.darkLight, borderWidth: 3, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{textAlign: 'center', color: colors.tertiary}}>No one</Text>
                                        </TouchableOpacity>*/
                                        null
                                    )
                                :   onlineUsersForShow.length !== 0 && (
                                        <>
                                            <SubTitle style={{marginBottom: 0, fontWeight: 'normal', fontSize: 12, textAlign: 'center', marginVertical: 2, color: colors.tertiary}}>Dm Users Online:</SubTitle>
                                            <FlatList 
                                                contentContainerStyle={{justifyContent: 'center'}}
                                                horizontal={true}
                                                style={{flexDirection: 'row', borderColor: colors.borderColor, borderBottomWidth: 3}}
                                                data={onlineUsersForShow}
                                                keyExtractor={(item, index) => item + index}
                                                extraData={onlineUsersImageB64s}
                                                renderItem={({item, index}) => {
                                                    return(
                                                        <View style={{alignItems: 'center'}}>
                                                            <TouchableOpacity style={{flexDirection: 'column', marginVertical: 10}}>
                                                                {item.imageKey !== "" && (
                                                                    <View>
                                                                        {onlineUsersImageB64s.findIndex(x => x.imageKey == item.imageKey) !== -1 ? (
                                                                            <Image style={{height: 80, width: 80, borderRadius: 200, borderColor: colors.borderColor, borderWidth: 3}} source={{uri: `data:image/jpg;base64,${onlineUsersImageB64s[onlineUsersImageB64s.findIndex(x => x.imageKey == item.imageKey)].imageB64}`}}/>
                                                                        ) : (
                                                                            <Image style={{height: 80, width: 80, borderRadius: 200, borderWidth: 3, borderColor: colors.borderColor}}/>
                                                                        )} 
                                                                    </View>
                                                                )}
                                                                {item.imageKey == "" && (
                                                                    <Image style={{height: 80, width: 80, borderRadius: 200, borderWidth: 3, borderColor: colors.borderColor}} source={{uri: SocialSquareLogo_B64_png}}/>
                                                                )}
                                                            </TouchableOpacity>
                                                            {item.displayName == "" && (
                                                                <View style={{marginBottom: 5}}>
                                                                    <Text style={{color: colors.tertiary, textAlign: 'center'}}>@{item.name}</Text>
                                                                </View>
                                                            )}
                                                            {item.displayName !== "" && (
                                                                <View style={{marginBottom: 5}}>
                                                                    <Text style={{color: colors.brand, textAlign: 'center'}}>{item.displayName}</Text>
                                                                    <Text style={{color: colors.tertiary, textAlign: 'center'}}>@{item.name}</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </>
                                    )
                                }
                            </View>
                        }
                    />
                </View>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to see conversations</Text>
                    <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                        <ButtonText> Login </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                            <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    );
}

const UserTextInput = ({label, icon, isPassword, ...props}) => {
    const {colors} = useTheme();
    return(
        <SearchBarArea style={{width: '100%'}}>
            <LeftIcon searchIcon={true}>
                <Octicons name={"search"} size={20} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput searchPage={true} {...props}/>
        </SearchBarArea>
    )
}

export default Conversations;

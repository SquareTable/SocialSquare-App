import React, {useContext, useEffect, memo} from 'react';
import { StatusBar } from 'expo-status-bar';
import {useTheme} from "@react-navigation/native";

import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    SubTitle
} from '../screenStylings/styling.js';

//credentials context
import { ActivityIndicator, FlatList, Image, View, Text, TouchableOpacity } from 'react-native';
import { ServerUrlContext } from '../../components/ServerUrlContext.js';

import axios from 'axios';

import Ionicons from 'react-native-vector-icons/Ionicons.js';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import ParseErrorMessage from '../../components/ParseErrorMessage.js';

import SocialSquareLogo_B64_png from '../../assets/SocialSquareLogo_Base64_png.js'
import useUserReducer from '../../hooks/useUserReducer.js';


const BlockedAccountsScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [reducer, dispatch] = useUserReducer()

    const fetchBlockedAccounts = () => {
        if (!reducer.noMoreUsers) {
            dispatch({type: 'startLoad'})

            const url = serverUrl + '/tempRoute/getuserblockedaccounts';
            const toSend = {skip: reducer.users.length}
            axios.post(url, toSend).then(response => {
                const result = response.data;
                const {data} = result;

                const {blockedAccounts, noMoreItems} = data || {};

                const profileImageKeys = blockedAccounts.map(user => user.profileImageKey).filter(key => typeof key === 'string' && key.length > 1)

                const profileImageData = {};

                Promise.allSettled(
                    profileImageKeys.map(key => {
                        const url = serverUrl + '/getImageOnServer/' + key
                        return axios.get(url)
                    })
                ).then(results => {
                    results.forEach((result, index) => {
                        if (result.reason) {
                            console.error('An error occurred while finding profile image with key:', profileImageKeys[index], '. The error was:', result.reason)
                        } else {
                            profileImageData[profileImageKeys[index]] = 'data:image/jpeg;base64,' + result.value.data
                        }
                    })

                    dispatch({type: 'addUsers', users: blockedAccounts})
                    dispatch({type: 'addProfilePictures', profilePictures: profileImageData})
                    if (noMoreItems) dispatch({type: 'noMoreUsers'})
                })
            }).catch(error => {
                console.error(error);
                dispatch({type: 'error', error: ParseErrorMessage(error)})
            })
        }
    }

    useEffect(() => fetchBlockedAccounts(), [])
    
    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Blocked Accounts</TestText>
            </ChatScreen_Title>
            {reducer.error ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.tertiary, fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>An error occured.</Text>
                    <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center'}}>{reducer.error}</Text>
                    <TouchableOpacity onPress={fetchBlockedAccounts}>
                        <Ionicons name="reload" size={50} color={colors.errorColor} />
                    </TouchableOpacity>
                </View>
            : reducer.loadingFeed === true ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={colors.brand} />
                </View>
            : reducer.users.length == 0 ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold'}}>You have not blocked anyone.</Text>
                </View>
            :
                <FlatList
                    data={reducer.users}
                    keyExtractor={(item) => item.pubId}
                    renderItem={({ item, index }) => <MemoizedItem item={item} index={index} dispatch={dispatch} profilePictures={reducer.profilePictures} navigation={navigation}/>}
                    getItemLayout={(data, index) => (
                        {length: 70, offset: 70 * index, index}
                    )}
                    onEndReached={() => {reducer.noMoreUsers === false ? loadItems() : null}}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={
                        reducer.noMoreUsers === true ? <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15, marginBottom: 30}}>No more users to show</Text> : reducer.loadingFeed ? <ActivityIndicator size="large" color={colors.brand} style={{marginTop: 10, marginBottom: 20}}/> : null
                    }
                />
            }
        </>
    );
}

const Item = ({item, index, dispatch, profilePictures, navigation}) => {
    const {colors, dark} = useTheme();
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const blockUser = async (userPubIdToBlock) => {
        dispatch({type: 'startChangingBlockedStatus', userIndex: index})
        const url = serverUrl + '/tempRoute/blockaccount';
        const toSend = {userToBlockPubId: userPubIdToBlock};

        axios.post(url, toSend).then(() => {
            dispatch({type: 'blockUser', userIndex: index})
        }).catch(error => {
            console.error(error)
            alert('An error occurred while blocking user: ' + ParseErrorMessage(error))
            dispatch({type: 'stopChangingBlockedStatus', userIndex: index})
        })
    }

    const unblockUser = async (userPubIdToUnblock) => {
        dispatch({type: 'startChangingBlockedStatus', userIndex: index})
        const url = serverUrl + '/tempRoute/unblockaccount';
        const toSend = {userToUnblockPubId: userPubIdToUnblock};
        
        axios.post(url, toSend).then(() => {
            dispatch({type: 'unblockUser', userIndex: index})
        }).catch(error => {
            console.error(error)
            alert('An error occurred while blocking user: ' + ParseErrorMessage(error))
            dispatch({type: 'stopChangingBlockedStatus', userIndex: index})
        })
    }

    const navigateToProfileScreen = () => {
        navigation.navigate('ProfilePages', {pubId: item.pubId})
    }
    
    return (
        <View style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderTopWidth: index == 0 ? 3 : 0, borderBottomWidth: 3, paddingLeft: 5, borderColor: colors.borderColor, height: 70}}>
            <TouchableOpacity onPress={navigateToProfileScreen}>
                <Image style={{width: 60, height: 60, marginBottom: 5, marginTop: 5, borderRadius: 50, borderColor: colors.brand, borderWidth: 2}} source={{uri: profilePictures[item.profileImageKey] || SocialSquareLogo_B64_png}} />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToProfileScreen}>
                <SubTitle style={{color: colors.tertiary, marginLeft: 10, marginTop: 8}} searchResTitle={true}>{item.displayName || item.name || 'Error getting username'}</SubTitle>
            </TouchableOpacity>
            {item.changingBlockedStatus ?
                <View style={{position: 'absolute', right: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color={colors.brand} size="large"/>
                </View>
            :
                <TouchableOpacity onPress={() => {item.blocked == true ? unblockUser(item.pubId) : blockUser(item.pubId)}} style={{position: 'absolute', right: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3}}>
                    <Text style={{color: colors.tertiary, fontSize: 16, fontWeight: 'bold'}}>{item.blocked == true ? "Unblock" : "Block"}</Text>
                </TouchableOpacity>
            
            }
        </View>
    )
}

const MemoizedItem = memo(Item);

export default BlockedAccountsScreen;

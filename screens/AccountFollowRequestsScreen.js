import React, {useContext, useEffect, memo, useRef} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator} from 'react-native';
import {
    SubTitle
} from './screenStylings/styling.js';
import axios from 'axios';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import TopNavBar from '../components/TopNavBar.js';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import ParseErrorMessage from '../components/ParseErrorMessage.js';
import useUserReducer from '../hooks/useUserReducer.js';

const AccountFollowRequestsScreen = ({navigation, route}) => {
    const {colors, dark} = useTheme()
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const [reducer, dispatch] = useUserReducer();
    const skipAmountRef = useRef(0);

    const loadItems = () => {
        const url = serverUrl + '/tempRoute/followrequests/' + skipAmountRef.current;

        dispatch({type: 'startLoad'})

        axios.get(url).then(async response => {
            const result = response.data;
            const {skip, items, noMoreItems} = result.data;

            Promise.allSettled(
                items.map(requester => {
                    if (requester.profileImageKey && requester.profileImageKey !== "") {
                        return axios.get(serverUrl + '/getImageOnServer/' + requester.profileImageKey)
                    }

                    return Promise.resolve('SocialSquare');
                })
            ).then(pfps => {
                const users = items.map((requester, index) => {
                    console.warn(pfps[index].value.data)
                    return {
                        ...requester,
                        profileImageB64: pfps[index].status !== 'fulfilled' ? 'SocialSquare' : pfps[index].value.data
                    }
                })

                dispatch({type: 'addUsers', noMoreItems, users});
                skipAmountRef.current = skip;
            })
        }).catch(error => {
            console.error(error);
            dispatch({type: 'error', error: ParseErrorMessage(error)});
        })
    }

    useEffect(loadItems, []);

    const denyFollowRequest = (userToDeny, itemIndex) => {
        const url = serverUrl + '/tempRoute/denyfollowrequest';
        const toSend = {accountFollowRequestDeniedPubID: userToDeny};

        axios.post(url, toSend).then(() => {
            dispatch({type: 'removeUser', userIndex: itemIndex})
        }).catch(error => {
            console.error(error)
            alert('An error occurred while denying follow request: ' + ParseErrorMessage(error))
        })
    }

    const acceptFollowRequest = (userToAccept, itemIndex) => {
        const url = serverUrl + '/tempRoute/acceptfollowrequest';
        const toSend = {accountFollowRequestAcceptedPubID: userToAccept};

        axios.post(url, toSend).then(() => {
            dispatch({type: 'removeUser', userIndex: itemIndex})
        }).catch(error => {
            console.error(error)
            alert('An error occurred while accepting follow request: ' + ParseErrorMessage(error))
        })
    }

    const navigateToProfileScreen = (pubId) => {
        navigation.navigate('ProfilePages', {pubId})
    }

    const Item = ({item, index}) => {
        if (item.status === 'FAILED') {
            return (
                <View style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderTopWidth: index == 0 ? 3 : 0, borderBottomWidth: 3, paddingLeft: 5, borderColor: colors.borderColor, height: 70}}>
                    <AntDesign name="exclamationcircleo" size={50} color={colors.errorColor} style={{marginTop: 5, marginBottom: 5}}/>
                    <SubTitle style={{color: colors.tertiary, marginLeft: 10, marginTop: 8}} searchResTitle={true}>Error loading user</SubTitle>
                </View>
            )
        } else {
            return (
                <View style={{alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderTopWidth: index == 0 ? 3 : 0, borderBottomWidth: 3, paddingLeft: 5, borderColor: colors.borderColor, height: 70}}>
                    <TouchableOpacity onPress={() => navigateToProfileScreen(item.pubId)}>
                        <Image style={{width: 60, height: 60, marginBottom: 5, marginTop: 5, borderRadius: 50, borderColor: colors.brand, borderWidth: 2}} source={{uri: item.profileImageB64 === 'SocialSquare' ? SocialSquareLogo_B64_png : ('data:image/jpg;base64,' + item.profileImageB64)}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigateToProfileScreen(item.pubId)}>
                        <SubTitle style={{color: colors.tertiary, marginLeft: 10, marginTop: 8, fontSize: 16}} searchResTitle={true}>{item.displayName || item.name || 'Error getting username'}</SubTitle>
                    </TouchableOpacity>
                    <View style={{position: 'absolute', right: 10, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => {acceptFollowRequest(item.pubId, index)}} style={{justifyContent: 'center', alignItems: 'center', borderColor: colors.borderColor, borderWidth: 2, paddingVertical: 6, paddingHorizontal: 8, marginHorizontal: 3, borderRadius: 10}}>
                            <Text style={{color: colors.tertiary, fontSize: 15, fontWeight: 'bold', color: colors.green}}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {denyFollowRequest(item.pubId, index)}} style={{justifyContent: 'center', alignItems: 'center', borderColor: colors.borderColor, borderWidth: 2, paddingVertical: 6, paddingHorizontal: 8, marginHorizontal: 3, borderRadius: 10}}>
                            <Text style={{color: colors.tertiary, fontSize: 15, fontWeight: 'bold', color: colors.red}}>Deny</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    const MemoizedItem = memo(Item);
    return(
        <>
            <TopNavBar screenName="Account Follow Requests"/>
            {reducer.users.length > 0 ?
                <FlatList
                    data={reducer.users}
                    keyExtractor={(item) => item.pubId}
                    renderItem={({ item, index }) => <MemoizedItem item={item} index={index}/>}
                    getItemLayout={(data, index) => (
                        {length: 70, offset: 70 * index, index}
                    )}
                    onEndReached={() => {reducer.noMoreItems === false && reducer.loadingFeed ? loadItems() : null}}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            {
                                reducer.noMoreItems === true ?
                                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15, marginBottom: 30}}>No more users to show</Text>
                                : reducer.loadingFeed ?
                                    <ActivityIndicator color={colors.brand} size="large"/>
                                : reducer.error ?
                                    <>
                                        <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10}}>{reducer.error}</Text>
                                        <TouchableOpacity onPress={loadItems}>
                                            <Ionicons name="reload" size={50} color={colors.errorColor} />
                                        </TouchableOpacity>
                                    </>
                                : null
                            }
                        </View>
                    }
                />
            :
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {
                        reducer.error ?
                            <>
                                <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10}}>{reducer.error}</Text>
                                <TouchableOpacity onPress={loadItems}>
                                    <Ionicons name="reload" size={50} color={colors.errorColor} />
                                </TouchableOpacity>
                            </>
                        : reducer.loadingFeed ?
                            <>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10}}>Loading...</Text>
                                <ActivityIndicator size="large" color={colors.brand}/>
                            </>
                        :
                            <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginHorizontal: '5%'}}>No one is requesting to follow you right now</Text>
                    }    
                </View>
            }
        </>
    );
}

export default AccountFollowRequestsScreen;
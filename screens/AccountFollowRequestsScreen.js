import React, {useContext, useEffect, memo, useState, useRef} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, SafeAreaView, Text, TouchableOpacity, Image, FlatList, ActivityIndicator} from 'react-native';
import {
    SubTitle
} from './screenStylings/styling.js';
import axios from 'axios';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import TopNavBar from '../components/TopNavBar.js';

const AccountFollowRequestsScreen = ({navigation, route}) => {
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {colors, dark} = useTheme()
    const userLoadMax = 10;
    const [listItems, setListItems] = useState([])
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [noMoreItems, setNoMoreItems] = useState(false);
    const [accountFollowRequests, setAccountFollowRequests] = useState('NOT LOADED');
    const [errorOccured, setErrorOccured] = useState(false);
    const [refreshFlatList, setRefreshFlatList] = useState(false);

    async function loadItems() {
        if (noMoreItems == false && accountFollowRequests != 'NOT LOADED' && accountFollowRequests.length > 0) {
            let toAddToList = [];
            for (let i = 0; i < userLoadMax; i++) {
                if ((listItems.length + i) < accountFollowRequests.length) {
                    let url = serverUrl + '/tempRoute/getuserbyid';
                    try {
                        const response = await axios.post(url, {pubId: accountFollowRequests[(listItems.length + i)]});
                        const result = response.data;
                        const {message, status, data} = result;

                        if (status !== 'SUCCESS') {
                            console.log(message);
                            toAddToList.push({status: 'FAILED'});
                        } else {
                            let dataToUse = data;
                            console.log(data)
                            if (data.profileImageKey && data.profileImageKey !== '') {
                                let getImageUrl = serverUrl + '/getImageOnServer/' + data.profileImageKey
                                try {
                                    const imageResponse = await axios.get(getImageUrl);

                                    if (imageResponse.data) {
                                        dataToUse.profileImageB64 = 'data:image/jpeg;base64,' + imageResponse.data;
                                    } else {
                                        console.log(imageMessage);
                                        dataToUse.profileImageB64 = SocialSquareLogo_B64_png;
                                    }
                                } catch (e) {
                                    console.log(e)
                                    dataToUse.profileImageB64 = SocialSquareLogo_B64_png
                                }
                            } else {
                                dataToUse.profileImageB64 = SocialSquareLogo_B64_png
                            }
                            dataToUse.status = 'SUCCESS';
                            toAddToList.push(dataToUse);
                        }
                    } catch (e) {
                        console.log(e)
                        toAddToList.push({status: 'FAILED'});
                    }
                    console.log(toAddToList.length)
                    console.log('Items loaded: ' + (listItems.length + i))
                } else {
                    setNoMoreItems(true);
                    break;
                }
            }
            console.log(toAddToList);
            setListItems(listItems => [...listItems, ...toAddToList]);
        }
    }

    useEffect(() => {
        axios.get(serverUrl + '/tempRoute/getfollowrequests').then(response => {
            const result = response.data;
            const {message, status, data} = result;
            
            if (status !== 'SUCCESS') {
                console.log(message);
                setErrorOccured(true);
            } else {
                setAccountFollowRequests(data);
            }
        }).catch(e => {
            console.error(e)
            setErrorOccured(true);
        })
    }, [])

    useEffect(() => {
        if (accountFollowRequests !== 'NOT LOADED') {
            loadItems();
        }
    }, [accountFollowRequests]) //When account follow requests have been loaded, load the items

    const denyFollowRequest = async (userToDeny, itemIndex) => {
        const url = serverUrl + '/tempRoute/denyfollowrequest';
        const toSend = {accountFollowRequestDeniedPubID: userToDeny};
        try {
            const response = await axios.post(url, toSend);
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                console.log(message)
                alert('An error occured. Please try again.')
            } else {
                setListItems(listItems => {
                    let newList = listItems;
                    newList.splice(itemIndex, 1);
                    return newList;
                })
                setAccountFollowRequests(accountFollowRequests => {
                    let newList = accountFollowRequests;
                    newList.splice(itemIndex, 1);
                    return newList;
                })
                setRefreshFlatList(refreshFlatList => !refreshFlatList)
            }
        } catch (e) {
            console.log(e)
            alert('An error occured. Please try again.')
        }
    }

    const acceptFollowRequest = async (userToAccept, itemIndex) => {
        const url = serverUrl + '/tempRoute/acceptfollowrequest';
        const toSend = {accountFollowRequestAcceptedPubID: userToAccept};
        try {
            const response = await axios.post(url, toSend);
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                console.log(message)
                alert('An error occured. Please try again.')
            } else {
                setListItems(listItems => {
                    let newList = listItems;
                    newList.splice(itemIndex, 1);
                    return newList;
                })
                setAccountFollowRequests(accountFollowRequests => {
                    let newList = accountFollowRequests;
                    newList.splice(itemIndex, 1);
                    return newList;
                })
                setRefreshFlatList(refreshFlatList => !refreshFlatList)
            }
        } catch (e) {
            console.log(e)
            alert('An error occured. Please try again.')
        }
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
                        <Image style={{width: 60, height: 60, marginBottom: 5, marginTop: 5, borderRadius: 50, borderColor: colors.brand, borderWidth: 2}} source={{uri: item.profileImageB64}} />
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
            {errorOccured ? (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold'}}>An error occured. Please try again.</Text>
                </View>
            ) : (
                accountFollowRequests.length != 0 ?
                    listItems.length != 0 ?
                        <FlatList
                            data={listItems}
                            keyExtractor={(item, index) => 'key'+index}
                            renderItem={({ item, index }) => <MemoizedItem item={item} index={index}/>}
                            getItemLayout={(data, index) => (
                                {length: 70, offset: 70 * index, index}
                            )}
                            onEndReached={() => {noMoreItems == false ? loadItems() : null}}
                            onEndReachedThreshold={0.2}
                            ListFooterComponent={
                                noMoreItems == true ? <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 15, marginBottom: 30}}>No more users to show</Text> : <ActivityIndicator size="large" color={colors.brand} style={{marginTop: 10, marginBottom: 20}}/>
                            }
                            extraData={refreshFlatList}
                        />
                    :
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <ActivityIndicator size="large" color={colors.brand}/>
                        </View>
                :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontSize: 30, textAlign: 'center', fontWeight: 'bold', marginHorizontal: '5%'}}>No one is requesting to follow you right now</Text>
                    </View>
            )}
        </>
    );
}

export default AccountFollowRequestsScreen;
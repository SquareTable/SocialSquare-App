import React, {useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
    StyledButton,
    ButtonText
} from './screenStylings/styling.js';
import AntDesign from 'react-native-vector-icons/AntDesign.js'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {CredentialsContext} from '../components/CredentialsContext';
import TopNavBar from '../components/TopNavBar.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import useNotificationReducer from '../hooks/useNotificationReducer.js';
import axios from 'axios';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import ParseErrorMessage from '../components/ParseErrorMessage.js';
import Ionicons from 'react-native-vector-icons/Ionicons.js';

const NotificationsScreen = ({navigation}) => {
    const [notificationReducer, dispatch] = useNotificationReducer();

    const {colors, dark} = useTheme();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {privateAccount} = storedCredentials} else {var {privateAccount} = {privateAccount: false}}
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {serverUrl} = useContext(ServerUrlContext)

    const loadNotifications = (reloadFeed) => {
        console.warn(notificationReducer.notifications)
        dispatch({type: reloadFeed ? 'startReloadingNotifications' : 'startLoadingNotifications'})

        const url = serverUrl + '/tempRoute/getnotifications';
        const toSend = notificationReducer.notifications.length > 0 ? {lastNotificationId: notificationReducer.notifications[notificationReducer.notifications.length - 1]._id} : {};

        axios.post(url, toSend).then(response => {
            const result = response.data;
            const {notifications, noMoreNotifications} = result.data;

            dispatch({type: 'addNotifications', notifications, noMoreNotifications})
        }).catch(error => {
            console.error(ParseErrorMessage(error))
            dispatch({type: 'errorLoadingNotifications', error: ParseErrorMessage(error)})
        })
    }

    const clearNotifications = () => {
        alert('Coming soon')
    }

    const cancelClearingNotifications = () => {
        alert('Coming soon')
    }

    useEffect(() => {
        loadNotifications();
    }, [])

    return(
        <>
            <TopNavBar screenName="Notifications" hideBackButton rightIcon={
                <TouchableOpacity style={{top: StatusBarHeight + 2, right: 10, position: 'absolute', zIndex: 2}} onPress={() => {navigation.navigate('HomeScreen')}}>
                    <AntDesign size={40} color={colors.tertiary} name="arrowright"/>
                </TouchableOpacity>
            }/>
            {storedCredentials ?
                <>
                    {
                        privateAccount == true ?
                            <TouchableOpacity style={{borderColor: colors.borderColor, borderWidth: 3}} onPress={() => {navigation.navigate('AccountFollowRequestsScreen')}}>
                                <View style={{justifyContent: 'center', alignItems: 'flex-start', marginLeft: 5}}>
                                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold'}}>Account Follow Requests</Text>
                                    <Text style={{color: colors.tertiary, fontSize: 16}}>Check who wants to follow you</Text>
                                </View>
                                <View style={{position: 'absolute', right: 5, top: 4, alignItems: 'center', justifyContent: 'center'}}>
                                    <EvilIcons size={45} color={colors.tertiary} name="arrow-right"/>
                                </View>
                            </TouchableOpacity>
                        : null
                    }
                    {
                        notificationReducer.clearing ?
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Clearing notifications...</Text>
                                <ActivityIndicator color={colors.brand} size="large"/>
                            </View>
                        : notificationReducer.errorClearing ?
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: colors.errorColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                                <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginVertical: 20}}>{notificationReducer.errorClearing}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={cancelClearingNotifications} style={{borderColor: colors.tertiary, borderWidth: 3, padding: 12, borderRadius: 10, marginRight: 20}}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={clearNotifications} style={{borderColor: colors.errorColor, borderWidth: 3, padding: 12, borderRadius: 10}}>
                                        <Text style={{color: colors.tertiary, fontSize: 14, fontWeight: 'bold'}}>Retry</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        : notificationReducer.notifications.length > 0 ?
                            <FlatList
                                data={notificationReducer.notifications}
                                renderItem={({item}) => {/* Implement when notifications are implemented */}}
                                keyExtractor={(item, index) => 'key'+index}
                                ListHeaderComponent={
                                    <TouchableOpacity style={{borderColor: colors.red, borderWidth: 2, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, marginHorizontal: 40, marginVertical: 10}} onPress={clearNotifications}>
                                        <Text style={{color: colors.red, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Clear Notifications</Text>
                                    </TouchableOpacity>
                                }
                                ListFooterComponent={
                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Notifications need backend implementation and will be coming soon</Text>
                                    </View>
                                }
                                refreshControl={
                                    <RefreshControl
                                        refreshing={notificationReducer.reloadingFeed}
                                        onRefresh={() => {
                                            loadNotifications(true)
                                        }}
                                    />
                                }
                                
                            />
                        :
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
                                {
                                    notificationReducer.error ?
                                        <>
                                            <Text style={{color: colors.errorColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                                            <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginVertical: 20}}>{notificationReducer.error}</Text>
                                            <TouchableOpacity onPress={loadNotifications(true)}>
                                                <Ionicons name="reload" size={50} color={colors.errorColor} />
                                            </TouchableOpacity>
                                        </>
                                    : notificationReducer.loadingFeed ?
                                        <ActivityIndicator color={colors.brand} size="large"/>
                                    :
                                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>You have no notifications from the past 7 days</Text>
                                }
                            </View>
                    }
                </>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to see notifications</Text>
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

export default NotificationsScreen;
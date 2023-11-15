import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
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

const NotificationsScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {privateAccount} = storedCredentials} else {var {privateAccount} = {privateAccount: false}}
    const [notifications, setNotifications] = useState([])
    const StatusBarHeight = useContext(StatusBarHeightContext);
    return(
        <>
            <TopNavBar screenName="Notifications" hideBackButton rightIcon={
                <TouchableOpacity style={{top: StatusBarHeight + 2, right: 10, position: 'absolute', zIndex: 2}} onPress={() => {navigation.navigate('HomeScreen')}}>
                    <AntDesign size={40} color={colors.tertiary} name="arrowright"/>
                </TouchableOpacity>
            }/>
            {storedCredentials ?
                <>
                    <FlatList
                        data={notifications}
                        renderItem={({item}) => {/* Implement when notifications are implemented */}}
                        keyExtractor={(item, index) => 'key'+index}
                        ListHeaderComponent={
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
                        ListFooterComponent={
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Notifications need backend implementation and will be coming soon</Text>
                            </View>
                        }
                        
                    />
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
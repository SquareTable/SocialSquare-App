import React, {useContext, useState} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, SafeAreaView, Text, TouchableOpacity, Image} from 'react-native';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    StyledButton,
    ButtonText,
    ConfirmLogoutButtonText,
    ConfirmLogoutButtons,
    ConfirmLogoutView,
    ConfirmLogoutText
} from '../screenStylings/styling.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {CredentialsContext} from '../../components/CredentialsContext.js';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';

const DataControl = ({navigation}) => {
    const {colors, dark} = useTheme()
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [hideConfirmDeleteAccountScreen, setHideConfirmDeleteAccountScreen] = useState(true);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    return(
        <>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Data Control</TestText>
            </ChatScreen_Title>
            <ConfirmLogoutView style={{backgroundColor: colors.primary, height: 500}} viewHidden={hideConfirmDeleteAccountScreen}>
                <ConfirmLogoutText style={{color: colors.tertiary, fontSize: 24}}>Are you sure you want to delete your account?</ConfirmLogoutText>
                <ConfirmLogoutText style={{color: colors.tertiary, fontSize: 18, marginVertical: 2}}>This action is IRREVERSIBLE. Once you delete your account, SocialSquare can't do anything to get your account back.</ConfirmLogoutText>
                <ConfirmLogoutText style={{color: colors.tertiary, fontSize: 14, marginVertical: 3}}>Everything will get deleted except the categories and conversations you have created.</ConfirmLogoutText>
                <ConfirmLogoutText style={{color: colors.tertiary, fontSize: 14, marginVertical: 2}}>The only user identifiable information stored in categories is your User ID that points to your account. When your account gets deleted, the User ID will point to nothing.</ConfirmLogoutText>
                <ConfirmLogoutText style={{color: colors.tertiary, fontSize: 14, marginVertical: 2}}>All of the messages you have sent in conversations will be deleted, and other users will not be able to see them. But the other users in the conversation would still be able to see their own messages and send new messages.</ConfirmLogoutText>
                <ConfirmLogoutButtons style={{height: 70}} cancelButton={true} onPress={() => {setHideConfirmDeleteAccountScreen(true)}}>
                    <ConfirmLogoutButtonText cancelButton={true}>Cancel</ConfirmLogoutButtonText>
                </ConfirmLogoutButtons> 
                <ConfirmLogoutButtons 
                    style={{height: 70}} 
                    confirmButton={true} 
                    onPress={() => {
                        navigation.navigate('DeleteAccountConfirmation')
                        setHideConfirmDeleteAccountScreen(true)
                    }}
                >
                    <ConfirmLogoutButtonText confirmButton>Confirm</ConfirmLogoutButtonText>
                </ConfirmLogoutButtons> 
            </ConfirmLogoutView>
            {storedCredentials ?
                <>
                    <TouchableOpacity onPress={() => {navigation.navigate('WhatIsStoredOnOurServers')}} style={{borderColor: colors.borderColor, borderWidth: 2, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginVertical: 20}}>
                        <Text style={{color: colors.brand, fontWeight: 'bold'}}>Learn about what data we store on our servers</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={() => {alert('Coming soon')}} style={{alignItems: 'center', flexDirection: 'column', borderColor: colors.borderColor, borderWidth: 2, marginHorizontal: '5%', width: '40%', paddingVertical: 30}}>
                            <Text style={{color: colors.tertiary, fontSize: 22, textAlign: 'center', fontWeight: 'bold', marginBottom: 10}}>Download Data</Text>
                            <Icon name="download" size={60} color={colors.tertiary}/>
                            <Text style={{color: colors.tertiary, fontSize: 12, textAlign: 'center', marginHorizontal: '5%', marginTop: 10}}>After pressing this button we will email you a link to download all of your data on our servers within 2 days of pressing the button.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setHideConfirmDeleteAccountScreen(false)}} style={{alignItems: 'center', flexDirection: 'column', borderColor: colors.borderColor, borderWidth: 2, marginHorizontal: '5%', width: '40%', paddingVertical: 30}}>
                            <Text style={{color: 'red', fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>Delete all data</Text>
                            <Icon name="exclamation" size={70} color={colors.tertiary}/>
                            <Text style={{color: colors.tertiary, fontSize: 12, textAlign: 'center', marginHorizontal: '5%', marginTop: 10}}>This will delete all of the data stored on this account on our servers forever. There will not be any way to restore your account after this button has been pressed. We will send you a confirmation email once all data has been deleted.</Text>
                        </TouchableOpacity>
                    </View>
                </>
            :
                <>
                    <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to delete or download your account data</Text>
                        <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                            <ButtonText> Login </ButtonText>
                        </StyledButton>
                        <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                                <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                        </StyledButton>
                    </View>
                </>
            }
        </>
    );
}

export default DataControl;
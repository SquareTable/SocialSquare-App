import React, { useContext } from 'react';
import { View, Text, Image, ScrollView } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { CredentialsContext } from '../components/CredentialsContext';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    StyledButton,
    ButtonText,
    SettingsItemImage,
    SettingsItemText,
    SettingsPageItemTouchableOpacity
} from './screenStylings/styling.js'
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';

const ActivityScreen = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {colors} = useTheme()
    return (
        <>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Activity</TestText>
            </ChatScreen_Title>
            {storedCredentials ?
                <ScrollView>
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("PostUpvoteDownvoteActivity", {postFormat: 'Image', voteType: 'Upvote'})}>
                        <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Image Upvotes</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("PostUpvoteDownvoteActivity", {postFormat: 'Image', voteType: 'Downvote'})}>
                        <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Image Downvotes</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                    {/*ADD VIDEO OPTIONS WHEN WE IMPLEMENT VIDEOS*/}
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("PostUpvoteDownvoteActivity", {postFormat: 'Poll', voteType: 'Upvote'})}>
                        <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Poll Upvotes</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("PostUpvoteDownvoteActivity", {postFormat: 'Poll', voteType: 'Downvote'})}>
                        <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Poll Downvotes</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("PostUpvoteDownvoteActivity", {postFormat: 'Thread', voteType: 'Upvote'})}>
                        <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Thread Upvotes</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("PostUpvoteDownvoteActivity", {postFormat: 'Thread', voteType: 'Downvote'})}>
                        <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Thread Downvotes</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                </ScrollView>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to see your activity.</Text>
                    <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                        <ButtonText> Login </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                            <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    )
}

export default ActivityScreen;

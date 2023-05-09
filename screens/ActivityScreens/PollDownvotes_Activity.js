import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { CredentialsContext } from '../../components/CredentialsContext';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    StyledButton,
    ButtonText,
    SettingsItemImage,
    SettingsItemText,
    SettingsPageItemTouchableOpacity
} from '../screenStylings/styling.js'
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext';

const PollDownvotes_Activity = ({navigation}) => {
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {colors} = useTheme()
    return (
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
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Poll Downvotes</TestText>
            </ChatScreen_Title>
        </>
    )
}

export default PollDownvotes_Activity;
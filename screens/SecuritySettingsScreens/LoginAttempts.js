import React, {useContext} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, SafeAreaView, Text, TouchableOpacity, Image} from 'react-native';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    Colors,
    StyledButton,
    ButtonText
} from '../screenStylings/styling.js';
import Icon from 'react-native-vector-icons/AntDesign';
import {CredentialsContext} from '../../components/CredentialsContext';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';

const LoginAttempts = ({navigation}) => {
    const {colors, dark} = useTheme()
    const {brand} = Colors;
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
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
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Login Attempts</TestText>
            </ChatScreen_Title>
            {storedCredentials ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: colors.tertiary}}>Coming soon :0</Text>
                    <Text style={{fontSize: 100, fontWeight: 'bold', color: colors.tertiary}}>🚧</Text>
                </View>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to check login attempts</Text>
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

export default LoginAttempts;
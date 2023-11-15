import React, {useContext} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, Text} from 'react-native';
import {
    StyledButton,
    ButtonText
} from '../screenStylings/styling.js';
import {CredentialsContext} from '../../components/CredentialsContext';
import TopNavBar from '../../components/TopNavBar.js';

const LoginAttempts = ({navigation}) => {
    const {colors, dark} = useTheme()
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    return(
        <>
            <TopNavBar screenName="Login Attempts"/>
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
import React, {useContext, useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButton, ButtonText } from './screenStylings/styling';

const DestroyingLocalDataScreen = ({navigation}) => {
    const {colors} = useTheme()
    const [message, handleMessage] = useState('')

    useEffect(() => {
        Promise.all([
            AsyncStorage.clear()
        ]).then(() => {
            navigation.replace("LoginScreen")
        }).catch(error => {
            handleMessage(error)
            console.log('Error occured while destroying all local data:', error)
        })
    }, [])
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: colors.primary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Destroying all local data...</Text>
            {message != '' ?
                <>
                    <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 20}}>An error occured: {message}</Text>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => {navigation.replace("LoginScreen")}}>
                        <ButtonText signUpButton={true} style={{color: colors.tertiary}}> Continue </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={destroyLocalData}>
                        <ButtonText signUpButton={true} style={{color: colors.tertiary}}> Retry </ButtonText>
                    </StyledButton>
                </>
            : null}
        </View>
    );
}

export default DestroyingLocalDataScreen;
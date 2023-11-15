import React, {useState, useContext} from 'react';
import {View, Text, Switch, ActivityIndicator} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
    ConfirmLogoutView,
    ConfirmLogoutText,
    ConfirmLogoutButtons,
    ConfirmLogoutButtonText
} from '../../screenStylings/styling.js';
import axios from 'axios';
import {ServerUrlContext} from '../../../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../../../components/StatusBarHeightContext.js';
import ParseErrorMessage from '../../../components/ParseErrorMessage.js';
import TopNavBar from '../../../components/TopNavBar.js';

const ActivateEmailMFA = ({navigation, route}) => {
    const {colors, dark} = useTheme();
    const {emailEnabled, SMSEnabled, authenticationAppEnabled, MFAEmail} = route.params;
    const [hideTurnOffConfirmation, setHideTurnOffConfirmation] = useState(true);
    const [turningOffEmailMFA, setTurningOffEmailMFA] = useState(false);
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const turnOffEmailMFA = () => {
        setTurningOffEmailMFA(true);
        const url = serverUrl + '/tempRoute/turnOffEmailMultiFactorAuthentication';

        axios.post(url).then(response => {
            const result = response.data;
            const {message, status} = result;

            if (status !== "SUCCESS") {
                setTurningOffEmailMFA(false);
                alert("An error occured while turning off email MFA: " + message);
            } else {
                setHideTurnOffConfirmation(true);
                setTurningOffEmailMFA(false);
                navigation.setParams({emailEnabled: false, MFAEmail: ''});
            }
        }).catch(error => {
            console.error(error);
            setTurningOffEmailMFA(false);
            alert(ParseErrorMessage(error));
        })
    }
    return (
        <>
            <ConfirmLogoutView style={{backgroundColor: colors.primary}} viewHidden={hideTurnOffConfirmation}>
                <ConfirmLogoutText style={{color: colors.tertiary, fontSize: 24}}>Are you sure you want to turn off email multi-factor authentication?</ConfirmLogoutText>
                <ConfirmLogoutText style={{color: colors.tertiary, fontSize: 14, marginTop: 0, marginHorizontal: 10}}>Once turned off, an email code will not be required to login to your account.</ConfirmLogoutText>
                {turningOffEmailMFA ? 
                    <ActivityIndicator size="large" color={colors.brand} />
                :
                    <>
                        <ConfirmLogoutButtons cancelButton={true} onPress={() => {setHideTurnOffConfirmation(true)}}>
                            <ConfirmLogoutButtonText cancelButton={true}>Cancel</ConfirmLogoutButtonText>
                        </ConfirmLogoutButtons> 
                        <ConfirmLogoutButtons confirmButton={true} onPress={turnOffEmailMFA}>
                            <ConfirmLogoutButtonText confirmButton>Confirm</ConfirmLogoutButtonText>
                        </ConfirmLogoutButtons>
                    </>
                }
            </ConfirmLogoutView>
            <StatusBar style={colors.StatusBarColor}/>   
            <TopNavBar screenName="Email MFA"/>
            <View style={{backgroundColor: colors.primary, flex: 1}}>
                <Text style={{color: colors.tertiary, fontSize: 14, textAlign: 'center', marginBottom: 10}}>With Email Multi-Factor Authentication enabled, whenever someone tries to login to your SocialSquare account, they must enter a code sent to your email along with any other steps for other multi-factor authentication options you have turned on to get into your account.</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: colors.tertiary, borderWidth: 2, padding: 10}}>
                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>Email</Text>
                    <Switch
                        trackColor={{ false: colors.primary, true: colors.brand }}
                        thumbColor={colors.tertiary}
                        ios_backgroundColor={colors.primary}
                        onValueChange={(value) => {
                            if (value == true) {
                                navigation.navigate('VerifyEmailScreen', {task: 'ActivateMFA'});
                            } else {
                                setHideTurnOffConfirmation(false)
                            }
                        }}
                        value={emailEnabled}
                        disabled={!hideTurnOffConfirmation}
                    />
                </View>
                {MFAEmail != '' && MFAEmail != null && MFAEmail != undefined &&
                    <>
                        <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginTop: 10}}>Current email being used:</Text>
                        <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center'}}>{MFAEmail}</Text>
                    </>
                }
            </View>
        </>
    )
}

export default ActivateEmailMFA;
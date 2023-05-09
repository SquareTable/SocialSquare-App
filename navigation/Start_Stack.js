import React, {useEffect, useState} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {darkModeStyling, darkModeOn, lightModeStyling} from '../screens/screenStylings/styling.js';

import {Colors} from '../screens/screenStylings/styling.js'
const {primary, tertiary} = Colors;

import LoginScreen from "../screens/LoginScreen";
import Signup from "../screens/Signup.js";

import { CredentialsContext } from "../components/CredentialsContext.js";
import Tabs from "./tabs.js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import IntroScreen from "../screens/IntroductionScreens/IntroScreen.js";
import DestroyingLocalDataScreen from "../screens/DestroyingLocalDataScreen.js";
import { ChatScreen_Stack } from "./ChatScreenStackNavigator.js";
import ForgottenPasswordScreen from "../screens/ForgottenPasswordScreen.js";
import ResetPasswordScreen from "../screens/ResetPasswordScreen.js";
import ResetPasswordAfterVerificationScreen from "../screens/ResetPasswordAfterVerificationScreen.js";
import WelcomeToSocialSquareScreen from "../screens/WelcomeScreens/WelcomeToSocialSquare.js";
import TransferFromOtherPlatformsScreen from "../screens/WelcomeScreens/TransferFromOtherPlatforms.js";
import VerifyEmailCodeScreen from "../screens/VerifyEmailCodeScreen.js";
import DeleteAccountConfirmation from "../screens/DeleteAccountConfirmation.js";
import Algorithm_HomeScreenSettings from "../screens/HomeScreenSettings/Algorithm_HomeScreenSettings.js";
import UploadsScreen from "../screens/UploadsScreen.js";
import ReportPost from "../screens/ReportPost.js";
import ReportAccount from "../screens/ReportAccount.js";
import LoginActivitySettings from "../screens/SecuritySettingsScreens/LoginActivitySettings.js";

const Stack = createStackNavigator();


const Start_Stack = () => {
    const [HasOpened, setHasOpened] = useState();
    async function GetHasOpenedSocialSquareKey() {
        var HasOpened = await AsyncStorage.getItem('HasOpenedSocialSquare');
        setHasOpened(HasOpened);
    }
    GetHasOpenedSocialSquareKey();
    console.log("HasOpened variable is " + HasOpened);
  return(
      <CredentialsContext.Consumer>
          {({storedCredentials}) => (
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: 'transparent',
                        },
                        headerShown: false,
                        headerTintColor: tertiary,
                        headerTransparent: true,
                        title: '',
                        headerLeftContainerStyle: {
                            paddingLeft: 20,
                        },
                    }}
                    initialRouteName={storedCredentials ? "Tabs" : "IntroScreen"}
                >
                    {HasOpened == 'true' ?
                    storedCredentials ? (
                        <>
                            <Stack.Screen 
                                name="Tabs" 
                                component={Tabs}
                                options={{
                                    animationEnabled: false,
                                }}
                            />
                            <Stack.Screen 
                                name="LoginScreen" 
                                component={LoginScreen}
                                options={{
                                    animationEnabled: false,
                                }}
                            />
                            <Stack.Screen name="IntroScreen" component={IntroScreen}/>
                            <Stack.Screen name="ChatScreenStack" component={ChatScreen_Stack} />
                            <Stack.Group screenOptions={{presentation: 'modal'}}>
                                <Stack.Screen name="ModalLoginScreen" component={LoginScreen}/>
                                <Stack.Screen name="ModalSignupScreen" component={Signup}/>
                            </Stack.Group>
                            <Stack.Screen name="ForgottenPasswordScreen" component={ForgottenPasswordScreen}/>
                            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
                            <Stack.Screen name="ResetPasswordAfterVerificationScreen" component={ResetPasswordAfterVerificationScreen}/>
                            <Stack.Screen name="WelcomeToSocialSquareScreen" component={WelcomeToSocialSquareScreen}/>
                            <Stack.Screen name="TransferFromOtherPlatformsScreen" component={TransferFromOtherPlatformsScreen}/>
                            <Stack.Screen name="VerifyEmailCodeScreen" component={VerifyEmailCodeScreen}/>
                            <Stack.Screen name="DeleteAccountConfirmation" component={DeleteAccountConfirmation}/>
                            <Stack.Screen name="Algorithm_HomeScreenSettings" component={Algorithm_HomeScreenSettings}/>
                            <Stack.Screen name="UploadsScreen" component={UploadsScreen}/>
                            <Stack.Screen name="ReportPost" component={ReportPost}/>
                            <Stack.Screen name="ReportAccount" component={ReportAccount}/>
                            <Stack.Screen name="LoginActivitySettings" component={LoginActivitySettings}/>
                        </>
                    ) : ( 
                        <>
                            <Stack.Screen 
                                name="LoginScreen" 
                                component={LoginScreen}
                                options={{
                                    animationEnabled: false,
                                }}
                            />
                            <Stack.Screen 
                                name="Signup" 
                                component={Signup}
                                options={{
                                    animationEnabled: false,
                                }}
                            />
                            <Stack.Screen name="Tabs" component={Tabs}/>
                            <Stack.Screen name="DestroyingLocalDataScreen" component={DestroyingLocalDataScreen}/>
                            <Stack.Screen name="IntroScreen_NoCredentials" component={IntroScreen}/>
                            <Stack.Screen name="ChatScreenStack" component={ChatScreen_Stack} />
                            <Stack.Group screenOptions={{presentation: 'modal'}}>
                                <Stack.Screen name="ModalLoginScreen" component={LoginScreen}/>
                                <Stack.Screen name="ModalSignupScreen" component={Signup}/>
                            </Stack.Group>
                            <Stack.Screen name="ForgottenPasswordScreen" component={ForgottenPasswordScreen}/>
                            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
                            <Stack.Screen name="ResetPasswordAfterVerificationScreen" component={ResetPasswordAfterVerificationScreen}/>
                            <Stack.Screen name="WelcomeToSocialSquareScreen" component={WelcomeToSocialSquareScreen}/>
                            <Stack.Screen name="TransferFromOtherPlatformsScreen" component={TransferFromOtherPlatformsScreen}/>
                            <Stack.Screen name="VerifyEmailCodeScreen" component={VerifyEmailCodeScreen}/>
                            <Stack.Screen name="DeleteAccountConfirmation" component={DeleteAccountConfirmation}/>
                            <Stack.Screen name="Algorithm_HomeScreenSettings" component={Algorithm_HomeScreenSettings}/>
                            <Stack.Screen name="LoginActivitySettings" component={LoginActivitySettings}/>
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="IntroScreen" component={IntroScreen}/>
                            <Stack.Screen name="Login_Screen" component={LoginScreen}/>
                            <Stack.Screen name="Signup" component={Signup}/>
                            <Stack.Screen name="Tabs" component={Tabs}/>
                            <Stack.Screen name="DestroyingLocalDataScreen" component={DestroyingLocalDataScreen}/>
                            <Stack.Screen name="ForgottenPasswordScreen" component={ForgottenPasswordScreen}/>
                            <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
                            <Stack.Screen name="ResetPasswordAfterVerificationScreen" component={ResetPasswordAfterVerificationScreen}/>
                            <Stack.Screen name="WelcomeToSocialSquareScreen" component={WelcomeToSocialSquareScreen}/>
                            <Stack.Screen name="TransferFromOtherPlatformsScreen" component={TransferFromOtherPlatformsScreen}/>
                            <Stack.Screen name="VerifyEmailCodeScreen" component={VerifyEmailCodeScreen}/>
                            <Stack.Screen name="Algorithm_HomeScreenSettings" component={Algorithm_HomeScreenSettings}/>
                            <Stack.Screen name="LoginActivitySettings" component={LoginActivitySettings}/>
                        </>
                    )}
                </Stack.Navigator>
          )}
      </CredentialsContext.Consumer>
  )
}




export { Start_Stack };
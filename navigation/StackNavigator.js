import React, {useContext} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import {darkModeStyling, darkModeOn, lightModeStyling} from '../screens/screenStylings/styling.js';

import {Colors} from '../screens/screenStylings/styling.js'
const {primary, tertiary} = Colors;

import { ExperimentalFeaturesEnabledContext } from "../components/ExperimentalFeaturesEnabledContext.js";

import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AccountSettings from "../screens/AccountSettings";
import Signup from "../screens/Signup.js";

import { CredentialsContext } from "../components/CredentialsContext.js";
import { NavigationContainer, useTheme } from '@react-navigation/native';
import FindScreen from "../screens/FindScreen.js";
import ProfilePages from '../screens/ProfilePages.js'

import PostScreen from '../screens/PostScreen';
import MultiMediaUploadPage from '../screens/PostScreens/MultiMediaUploadPage';
import ThreadUploadPage from '../screens/PostScreens/ThreadUploadPage';
import PollUploadPage from '../screens/PostScreens/PollUploadPage';
import AudioUploadPage from '../screens/PostScreens/AudioUploadPage';
import MultiMediaUploadPreview from '../screens/PostScreens/MultiMediaUploadPreview'
import SelectCategorySearchScreen from '../screens/SelectCategorySearchScreen'

import AccountBadges from "../screens/AccountBadges.js";
import ChangeEmailPage from "../screens/ChangeEmailPage";

import Conversations from "../screens/Conversations.js";
import RecordAudioPage from "../screens/PostScreens/RecordAudioPage.js";
import SendAudioPage from "../screens/PostScreens/SendAudioPage.js";

import AppStyling from '../screens/AppStyling.js';

import CategoryViewPage from '../screens/CategoryViewPage'
import CommentViewPage from '../screens/CommentViewPage'
import ThreadViewPage from '../screens/ThreadViewPage'
import ViewImagePostPage from '../screens/ViewImagePostPage'
import ViewPollPostPage from '../screens/ViewPollPostPage'
import CategoryHome from '../screens/CategoryHome'
import CategoryCreationPage from "../screens/CategoryCreationPage.js";
import TakeImage_Camera from "../screens/TakeImage_Camera.js";
import SecuritySettingsScreen from "../screens/SecuritySettingsScreen.js";
import LoginActivity from "../screens/SecuritySettingsScreens/LoginActivity.js";
import MultiFactorAuthentication from "../screens/SecuritySettingsScreens/MultiFactorAuthentication.js";
import WhatIsStoredOnOurServers from "../screens/SecuritySettingsScreens/WhatIsStoredOnOurServers.js";
import NotificationsSettingsScreen from "../screens/NotificationsSettingsScreen.js";
import ProfileStats from "../screens/ProfileStats.js";
import SimpleStylingMenu from "../screens/SimpleStylingScreens/SimpleStylingMenu.js";
import EditSimpleStyle from "../screens/SimpleStylingScreens/EditSimpleStyle.js";
import Simple_ColorPickerScreen from "../screens/SimpleStylingScreens/ColorPicker.js";
import BuiltInStylingMenu from "../screens/BuiltInStylingMenu.js";
import LoginAttempts from "../screens/SecuritySettingsScreens/LoginAttempts.js";
import AdvancedSettingsScreen from "../screens/AdvancedSettingsScreen.js";
import SwitchServerScreen from "../screens/AdvancedSettingsScreens/SwitchServerScreen.js";
import BadgeInfo from "../screens/BadgeInfo.js";
import NotificationsScreen from "../screens/NotificationsScreen.js";
import HomeScreenSettings from "../screens/HomeScreenSettings.js";
import Filter_HomeScreenSettings from "../screens/HomeScreenSettings/Filter_HomeScreenSettings.js";
import Algorithm_HomeScreenSettings from "../screens/HomeScreenSettings/Algorithm_HomeScreenSettings.js";
import Audio_HomeScreenSettings from "../screens/HomeScreenSettings/Audio_HomeScreenSettings.js";
import CreateConversationSelection from "../screens/CreateConversationSelection.js";
import ConversationCreationPage from "../screens/CreateConversation.js";
import ChangePasswordScreen from "../screens/ChangePasswordScreen.js";
import EditProfile from "../screens/EditProfile.js";
import AccountFollowRequestsScreen from "../screens/AccountFollowRequestsScreen.js";
import SafetySettingsScreen from "../screens/SafetySettingsScreen.js";
import BlockedAccountsScreen from "../screens/SafetySettings/BlockedAccountsScreen.js";
import ActivateEmailMFA from "../screens/SecuritySettingsScreens/MFAScreens/ActivateEmailMFA.js";
import VerifyEmailScreen from "../screens/VerifyEmailScreen.js";
import VerifyEmailCodeScreen from "../screens/VerifyEmailCodeScreen.js";
import DataControl from "../screens/SecuritySettingsScreens/DataControl.js";
import DeleteAccountConfirmation from "../screens/DeleteAccountConfirmation.js";
import ExperimentalFeatures from "../screens/ExperimentalFeatures.js";
import ActivityScreen from "../screens/ActivityScreen.js";
import PrivacySettings from "../screens/PrivacySettings.js";
import LoginActivitySettings from "../screens/SecuritySettingsScreens/LoginActivitySettings.js";
import PostUpvoteDownvoteActivity from "../screens/ActivityScreens/PostUpvoteDownvoteActivity.js";
import VotesViewPage from "../screens/VotesViewPage.js";


const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const RootStack = () => {
  const { colors } = useTheme();
  return(
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerTintColor: colors.tertiary,
            headerTransparent: true,
            title: '',
            headerLeftContainerStyle: {
                paddingLeft: 20,
            },
        }}
    >
      <Stack.Screen name="Welcome" component={ProfileScreen}/>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
      <Stack.Screen name="CommentViewPage" component={CommentViewPage}/>
      <Stack.Screen name="CategoryHome" component={CategoryHome}/>
      <Stack.Screen name="CategoryCreationPage" component={CategoryCreationPage}/>
      <Stack.Screen name="TakeImage_Camera" component={TakeImage_Camera}/>
      <Stack.Screen name="ThreadUploadPage" component={ThreadUploadPage}/>
      <Stack.Group screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: colors.tertiary,
          headerTransparent: true,
          title: '',
          headerLeftContainerStyle: {
              paddingLeft: 20,
          },
          headerLeft: null
        }}
      >
        <Stack.Screen name="BadgeInfo" component={BadgeInfo}/>
        <Stack.Screen name="ProfileStats" component={ProfileStats}/>
        <Stack.Screen name="AccountBadges" component={AccountBadges}/>
        <Stack.Screen name="ViewImagePostPage" component={ViewImagePostPage}/>
        <Stack.Screen name="ViewPollPostPage" component={ViewPollPostPage}/>
        <Stack.Screen name="ThreadViewPage" component={ThreadViewPage}/>
        <Stack.Screen name="EditProfile" component={EditProfile}/>
        <Stack.Screen name="CategoryViewPage" component={CategoryViewPage}/>
        <Stack.Screen name="ProfilePages" component={ProfilePages}/>
        <Stack.Screen name="VotesViewPage" component={VotesViewPage}/>
      </Stack.Group>
    </Stack.Navigator>
  );
};

const FindScreen_Stack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTintColor: colors.tertiary,
      headerTransparent: true,
      title: '',
      headerLeftContainerStyle: {
          paddingLeft: 20,
      },
    }}>
      <Stack.Group screenOptions={{headerLeft: null}}>
        <Stack.Screen name="FindScreen" component={FindScreen}/>
        <Stack.Screen name="ProfilePages" component={ProfilePages}/>
        <Stack.Screen name="ProfileStats" component={ProfileStats}/>
        <Stack.Screen name="AccountBadges" component={AccountBadges}/>
        <Stack.Screen name="BadgeInfo" component={BadgeInfo}/>
        <Stack.Screen name="CategoryViewPage" component={CategoryViewPage}/>
        <Stack.Screen name="SelectCategorySearchScreen" component={SelectCategorySearchScreen}/>
        <Stack.Screen name="ViewImagePostPage" component={ViewImagePostPage}/>
        <Stack.Screen name="ViewPollPostPage" component={ViewPollPostPage}/>
        <Stack.Screen name="ThreadViewPage" component={ThreadViewPage}/>
        <Stack.Screen name="VotesViewPage" component={VotesViewPage}/>
      </Stack.Group>
      <Stack.Screen name="ProfileScreen_FromFindScreenPost" component={ProfileScreen}/>
      <Stack.Screen name="CommentviewPage" component={CommentViewPage}/>
      <Stack.Screen name="ThreadUploadPage_FromCategory_FindStack" component={ThreadUploadPage}/>
      <Stack.Screen name="CommentViewPage" component={CommentViewPage}/>
      <Stack.Screen name="TakeImage_Camera" component={TakeImage_Camera}/>
    </Stack.Navigator>
  );
};

const HomeScreenStack = () => {
  const { colors } = useTheme();
  return(
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTintColor: colors.tertiary,
      headerTransparent: true,
      title: '',
      headerLeft: null,
      headerLeftContainerStyle: {
          paddingLeft: 20,
      },
    }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{gestureDirection: 'horizontal-inverted'}}/>
      <Stack.Screen name="AccountFollowRequestsScreen" component={AccountFollowRequestsScreen}/>
      <Stack.Screen name="ViewImagePostPage" component={ViewImagePostPage}/>
      <Stack.Screen name="ViewPollPostPage" component={ViewPollPostPage}/>
      <Stack.Screen name="ThreadViewPage" component={ThreadViewPage}/>
      <Stack.Screen name="ProfilePages" component={ProfilePages}/>
      <Stack.Screen name="CategoryViewPage" component={CategoryViewPage}/>
      <Stack.Screen name="VotesViewPage" component={VotesViewPage}/>
      <Stack.Screen name="ProfileStats" component={ProfileStats}/>
      <Stack.Screen name="BadgeInfo" component={BadgeInfo}/>
      <Stack.Screen name="AccountBadges" component={AccountBadges}/>
    </Stack.Navigator>
  )
}

const PostScreenStack = () => {
  const { colors } = useTheme();
  const {experimentalFeaturesEnabled, setExperimentalFeaturesEnabled} = useContext(ExperimentalFeaturesEnabledContext);
  return(
    <Stack.Navigator initialRouteName={experimentalFeaturesEnabled ? 'PostScreen' : 'MultiMediaUploadPage'} screenOptions={{
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTintColor: colors.tertiary,
      headerTransparent: true,
      title: '',
      headerLeftContainerStyle: {
        paddingLeft: 20,
      },
    }}>
      <Stack.Screen name="PostScreen" component={PostScreen}/>
      <Stack.Screen name="MultiMediaUploadPage" component={MultiMediaUploadPage}/>
      <Stack.Screen name="ThreadUploadPage" component={ThreadUploadPage}/>
      <Stack.Screen name="PollUploadPage" component={PollUploadPage}/>
      <Stack.Screen name="AudioUploadPage" component={AudioUploadPage}/>
      <Stack.Group screenOptions={{headerLeft: null}}>
        <Stack.Screen name="SendAudioPage" component={SendAudioPage}/>
        <Stack.Screen name="RecordAudioPage" component={RecordAudioPage}/>
        <Stack.Screen name="SelectCategorySearchScreen" component={SelectCategorySearchScreen}/>
      </Stack.Group>
      <Stack.Screen name="MultiMediaUploadPreview" component={MultiMediaUploadPreview}/>
      <Stack.Screen name="TakeImage_Camera" component={TakeImage_Camera}/>
      <Stack.Screen name="CategoryCreationPage" component={CategoryCreationPage}/>
    </Stack.Navigator>
  )
}

const SettingsStack = () => {
  const {colors} = useTheme();
  return(
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTintColor: colors.tertiary,
      headerTransparent: true,
      title: '',
      headerLeftContainerStyle: {
          paddingLeft: 20,
      },
      headerLeft: null
    }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
      <Stack.Screen name="ChangeEmailPage" component={ChangeEmailPage}/>
      <Stack.Screen name="AppStyling" component={AppStyling}/>
      <Stack.Screen name="DataControl" component={DataControl}/>
      <Stack.Screen name="SecuritySettingsScreen" component={SecuritySettingsScreen}/>
      <Stack.Screen name="PrivacySettingsScreen" component={PrivacySettings}/>
      <Stack.Screen name="LoginActivity" component={LoginActivity}/>
      <Stack.Screen name="MultiFactorAuthentication" component={MultiFactorAuthentication}/>
      <Stack.Screen name="WhatIsStoredOnOurServers" component={WhatIsStoredOnOurServers}/>
      <Stack.Screen name="NotificationsSettingsScreen" component={NotificationsSettingsScreen}/>
      <Stack.Screen name="SimpleStylingMenu" component={SimpleStylingMenu}/>
      <Stack.Screen name="EditSimpleStyle" component={EditSimpleStyle} options={{gestureEnabled: false}}/>
      <Stack.Screen name="Simple_ColorPickerScreen" component={Simple_ColorPickerScreen}/>
      <Stack.Screen name="BuiltInStylingMenu" component={BuiltInStylingMenu}/>
      <Stack.Screen name="LoginAttempts" component={LoginAttempts}/>
      <Stack.Screen name="AccountSettings" component={AccountSettings}/>
      <Stack.Screen name="AdvancedSettingsScreen" component={AdvancedSettingsScreen}/>
      <Stack.Screen name="SwitchServerScreen" component={SwitchServerScreen}/>
      <Stack.Screen name="HomeScreenSettings" component={HomeScreenSettings}/>
      <Stack.Screen name="Filter_HomeScreenSettings" component={Filter_HomeScreenSettings}/>
      <Stack.Screen name="Algorithm_HomeScreenSettings" component={Algorithm_HomeScreenSettings}/>
      <Stack.Screen name="Audio_HomeScreenSettings" component={Audio_HomeScreenSettings}/>
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen}/>
      <Stack.Screen name="SafetySettingsScreen" component={SafetySettingsScreen}/>
      <Stack.Screen name="BlockedAccountsScreen" component={BlockedAccountsScreen}/>
      <Stack.Screen name="ActivateEmailMFA" component={ActivateEmailMFA}/>
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen}/>
      <Stack.Screen name="VerifyEmailCodeScreen" component={VerifyEmailCodeScreen}/>
      <Stack.Screen name="ExperimentalFeatures" component={ExperimentalFeatures}/>
      <Stack.Screen name="ActivityScreen" component={ActivityScreen}/>
      <Stack.Screen name="LoginActivitySettings" component={LoginActivitySettings}/>
      <Stack.Screen name="PostUpvoteDownvoteActivity" component={PostUpvoteDownvoteActivity}/>
      <Stack.Screen name="ProfilePages" component={ProfilePages}/>
      <Stack.Screen name="VotesViewPage" component={VotesViewPage}/>
    </Stack.Navigator>
  )
}




export {
  RootStack, 
  FindScreen_Stack, 
  HomeScreenStack, 
  PostScreenStack,
  SettingsStack,
};
import React, {useContext, useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {useTheme} from "@react-navigation/native";

import {
    WelcomeContainer,
    Avatar,
    SettingsPageItemTouchableOpacity,
    SettingsItemImage,
    SettingsItemText,
    ConfirmLogoutView,
    ConfirmLogoutText,
    ConfirmLogoutButtons,
    ConfirmLogoutButtonText,
    TextLinkContent,
    TextLink,
    SettingsHorizontalView,
    ChatScreen_Title,
    Navigator_BackButton,
    StyledButton,
    ButtonText,
    TestText
} from '../screenStylings/styling.js';

import {Image, View, Text, TouchableOpacity, ScrollView, Alert, Switch} from 'react-native';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';


const Audio_HomeScreenSettings = ({navigation}) => {
    const {colors, dark} = useTheme();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);
    const [playAudioPostAudioInSilentMode, setPlayAudioPostAutoInSilentMode] = useState(false);
    const [playVideoAudioInSilentMode, setPlayVideoAudioInSilentMode] = useState(false);
    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (!hasUnsavedChanges) {
              // If we don't have unsaved changes, then we don't need to do anything
              return;
            }
    
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
            // Prompt the user before leaving the screen
            Alert.alert(
              'Discard changes?',
              'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
              [
                { text: "Don't leave", style: 'cancel', onPress: () => {} },
                {
                  text: 'Discard',
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => navigation.dispatch(e.data.action),
                },
              ]
            );
        }),
        [navigation, hasUnsavedChanges]
    );
    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary, fontSize: 18}}>Home Screen Audio Settings</TestText>
                <TouchableOpacity style={{position: 'absolute', top: StatusBarHeight + 8, right: 10}} onPress={() => {alert('Coming soon!')}}>
                    <Text style={{color: colors.brand, fontSize: 20, fontWeight: 'bold'}}>Save</Text>
                </TouchableOpacity>
            </ChatScreen_Title>
            <ScrollView>
                <Text style={{color: colors.tertiary, fontSize: 14, textAlign: 'center', marginHorizontal: '5%'}}>Control whether audio plays in silent mode</Text>
                <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>This screen has not been linked up to the backend yet and does not work.</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: '5%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginTop: 4}}>Play audio post audio in silent mode</Text>
                    <Switch
                        value={playAudioPostAudioInSilentMode}
                        onValueChange={(value) => {setPlayAudioPostAutoInSilentMode(value)}}
                        trackColor={{true: colors.brand, false: colors.primary}}
                        thumbColor={colors.tertiary}
                        ios_backgroundColor={colors.primary}
                    />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: '5%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginTop: 4}}>Play video post audio in silent mode</Text>
                    <Switch
                        value={playVideoAudioInSilentMode}
                        onValueChange={(value) => {setPlayVideoAudioInSilentMode(value)}}
                        trackColor={{true: colors.brand, false: colors.primary}}
                        thumbColor={colors.tertiary}
                        ios_backgroundColor={colors.primary}
                    />
                </View>
            </ScrollView>
        </>
    );
}

export default Audio_HomeScreenSettings;

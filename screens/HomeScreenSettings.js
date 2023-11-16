import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import {useTheme} from "@react-navigation/native";

import {
    WelcomeContainer,
    SettingsPageItemTouchableOpacity,
    SettingsItemImage,
    SettingsItemText
} from '../screens/screenStylings/styling.js';

import {View} from 'react-native';
import AppCredits from '../components/AppCredits.js';
import TopNavBar from '../components/TopNavBar.js';


const HomeScreenSettings = ({navigation}) => {
    const {colors, dark} = useTheme();
    

    return(
        <> 
            <StatusBar style={colors.StatusBarColor}/>   
            <TopNavBar screenName="Home Screen Settings"/>
            <WelcomeContainer style={{backgroundColor: colors.primary}}>                
                <View style={{marginTop: -40}}/>
                <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("Filter_HomeScreenSettings")}>
                    <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/348-filter.png')}/>
                    <SettingsItemText style={{color: colors.tertiary}}>Filter</SettingsItemText>
                </SettingsPageItemTouchableOpacity>
                <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("Algorithm_HomeScreenSettings")}>
                    <SettingsItemImage style={{tintColor: colors.tertiary}} source={require('./../assets/app_icons/settings.png')}/>
                    <SettingsItemText style={{color: colors.tertiary}}>Algorithm</SettingsItemText>
                </SettingsPageItemTouchableOpacity>
                {
                    /*
                    Audio settings will be coming back eventually.
                    We are not going to have audio or video posts when we have our initial release so this will not need to be implemented.
                    It will be implemented later though

                    
                    <SettingsPageItemTouchableOpacity style={{borderColor: colors.borderColor}} onPress={() => navigation.navigate("Audio_HomeScreenSettings")}>
                        <FontAwesome name="music" size={60} color={colors.tertiary}/>
                        <SettingsItemText style={{color: colors.tertiary}}>Audio</SettingsItemText>
                    </SettingsPageItemTouchableOpacity>
                    */
                }
                <AppCredits/>
            </WelcomeContainer>
        </>
    );
}

export default HomeScreenSettings;

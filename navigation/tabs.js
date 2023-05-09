import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';

import {ChatScreen_Stack, ProfileScreenToSettings_StackNavigation, RootStack, SettingsToBadges_StackNavigation, FindScreen_Stack, PostScreenStack, HomeScreenStack, SettingsStack} from '../navigation/StackNavigator.js'
import * as Haptics from 'expo-haptics';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext';
import { ShowAccountSwitcherContext } from '../components/ShowAccountSwitcherContext.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ExperimentalFeaturesEnabledContext } from '../components/ExperimentalFeaturesEnabledContext.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        style={{
            justifyContent: 'center',
            alignItems: 'center',
            /*... styles.shadow*/
        }}
        onPress={onPress}
    >
        <View style={{
            width: 50,
            height: 50,
            borderRadius: 35,
            backgroundColor: 'transparent',
        }}>
            {children}
        </View>
    </TouchableOpacity>
);


const Tabs = ({navigation}) => {
    const insets = useSafeAreaInsets()
    console.log('Insets:', insets)
    const [currentTab, setCurrentTab] = useState('Home')
    const {colors} = useTheme();
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
    const {showAccountSwitcher, setShowAccountSwitcher} = useContext(ShowAccountSwitcherContext)
    const {experimentalFeaturesEnabled, setExperimentalFeaturesEnabled} = useContext(ExperimentalFeaturesEnabledContext)
    const haptic_feedback_options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false
    };
    const onHomeScreenNavigate = () => {
        if (currentTab == 'Home') {
            navigation.navigate("Home");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            console.log('Home screen is focused already')
        } else {
            setCurrentTab('Home')
            navigation.navigate("Home");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }
    const onFindScreenNavigate = () => {
        if (currentTab == 'Find') {
            navigation.navigate("Find");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            console.log('Find screen is already focused')
        } else {
            setCurrentTab('Find')
            navigation.navigate("Find");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }
    const onPostScreenNavigate = () => {
        experimentalFeaturesEnabled ? navigation.replace('Post') : navigation.replace('MultiMediaUploadPage')
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrentTab('Post')
    }
    const onSettingsScreenNavigate = () => {
        if (currentTab == 'Settings') {
            navigation.navigate('Settings');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            console.log('Settings screen is already focused')
        } else {
            navigation.navigate('Settings');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentTab('Settings')
        }
    }
    const onProfileScreenNavigate = () => {
        navigation.navigate('Profile');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrentTab('Profile')
    }

    const accountSwitcher = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 100);
        setShowAccountSwitcher(true)
    }
    return(
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.primary,
                    paddingBottom: insets.bottom - 20
                }
            }}
        >
            <Tab.Screen name="Home" component={HomeScreenStack} options={{
                tabBarIcon: ({focused}) => (
                    <TouchableWithoutFeedback style={{backgroundColor: colors.primary, width: 'auto'}} onPress={() => {onHomeScreenNavigate()}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('../assets/app_icons/home.png')}
                                resizeMode = 'contain'
                                style={{
                                    width: 35,
                                    height: 35,
                                    tintColor: focused ? colors.navFocusedColor : colors.navNonFocusedColor
                                }}
                            />
                            {/*<Text style={{color: focused ? colors.navFocusedColor : colors.navNonFocusedColor, fontSize: 10}}>HOME</Text>*/}
                        </View>
                    </TouchableWithoutFeedback>
                ),
            }} />
            <Tab.Screen name="Find" component={FindScreen_Stack} options={{
                tabBarIcon: ({focused}) => (
                    <TouchableWithoutFeedback style={{backgroundColor: colors.primary, width: 'auto'}} onPress={() => {onFindScreenNavigate()}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('../assets/app_icons/find.png')}
                                resizeMode = 'contain'
                                style={{
                                    width: 35,
                                    height: 35,
                                    tintColor: focused ? colors.navFocusedColor : colors.navNonFocusedColor
                                }}
                            />
                            {/*<Text style={{color: focused ? colors.navFocusedColor : colors.navNonFocusedColor, fontSize: 10}}>FIND</Text>*/}
                        </View>
                    </TouchableWithoutFeedback>
                ),
            }} />
            <Tab.Screen name="Post" component={PostScreenStack} initialParams={{postData: null, postType: null, navigateToHomeScreen: false, imageFromRoute: null}}
            options={{
                tabBarIcon: ({focused}) => (
                    <>
                        {focused ?
                            <AntDesign name="pluscircle" size={40} color={colors.navFocusedColor}/>
                        :
                            <AntDesign name="pluscircleo" size={40} color={colors.navNonFocusedColor}/>
                        }
                    </>
                ),
                tabBarButton: (props) => (
                    <CustomTabBarButton {...props} />
                )
            }}/>
            <Tab.Screen name="Settings" component={SettingsStack} options={{
                tabBarIcon: ({focused}) => (
                    <TouchableWithoutFeedback style={{backgroundColor: colors.primary, width: 'auto'}} onPress={() => {onSettingsScreenNavigate()}}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={require('../assets/app_icons/settings.png')}
                                resizeMode = 'contain'
                                style={{
                                    width: 35,
                                    height: 35,
                                    tintColor: focused ? colors.navFocusedColor : colors.navNonFocusedColor
                                }}
                            />
                            {/*<Text style={{color: focused ? colors.navFocusedColor : colors.navNonFocusedColor, fontSize: 10}}>SETTINGS</Text>*/}
                        </View>
                    </TouchableWithoutFeedback>
                ),
            }}/>
            <Tab.Screen name="Profile" component={RootStack} options={{
                tabBarIcon: ({focused}) => (
                    <TouchableWithoutFeedback style={{backgroundColor: colors.primary, width: 'auto'}} onPress={() => {onProfileScreenNavigate()}} onLongPress={accountSwitcher}>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                source={{uri: profilePictureUri}}
                                resizeMode = 'contain'
                                style={{
                                    width: 35,
                                    height: 35,
                                    borderWidth: 3,
                                    borderColor: focused ? colors.navFocusedColor : colors.navNonFocusedColor,
                                    borderRadius: 1000,
                                }}
                            />
                            {/*<Text style={{color: focused ? colors.navFocusedColor : colors.navNonFocusedColor, fontSize: 10}}>PROFILE</Text>*/}
                        </View>
                    </TouchableWithoutFeedback>
                ),
            }}/>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#88C0D0',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.5,
        elevation: 5
    }
});

export default Tabs;
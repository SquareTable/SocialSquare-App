import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
    ProfileOptionsView
} from '../screenStylings/styling.js'
import Icon from 'react-native-vector-icons/Entypo';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import {Octicons} from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import TopNavBar from '../../components/TopNavBar.js';

const EditSimpleStyle = ({navigation, route}) => {
    const {name, indexNum, type, dark, stylingType, stylingVersion, primary, tertiary, borderColor, background, secondary, darkLight, brand, green, red, darkest, greyish, bronzeRarity, darkestBlue, StatusBarColor, navFocusedColor, navNonFocusedColor, orange, yellow, purple, slightlyLighterGrey, midWhite, slightlyLighterPrimary, descTextColor, errorColor, backToProfileScreen} = route.params;
    const [showCrossAndTick, setShowCrossAndTick] = useState(false)
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [InfoPageIsHidden, setInfoPageIsHidden] = useState(true)
    const [goBackToProfileScreen, setGoBackToProfileScreen] = useState(backToProfileScreen)

    const leaveAndSave = async () => {
        let currentSimpleStyleData = await AsyncStorage.getItem('simpleStylingData')
        currentSimpleStyleData = JSON.parse(currentSimpleStyleData)
        for (let i = 0; i < currentSimpleStyleData.length; i++) {
            console.log(currentSimpleStyleData[i].indexNum)
            console.log(currentSimpleStyleData)
            if (currentSimpleStyleData[i].name == name) {
                let tempData = currentSimpleStyleData;
                console.log(tempData)
                console.log(i)
                tempData.splice(i, 1)
                
            }
        }
        currentSimpleStyleData.push({name: name, indexNum: indexNum, stylingType: stylingType, stylingVersion: stylingVersion, dark: dark, colors: {primary: primary, tertiary: tertiary, borderColor: borderColor, background: primary, secondary: secondary, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navNonFocusedColor: navNonFocusedColor, navFocusedColor: navFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor}})
        console.log(currentSimpleStyleData)
        AsyncStorage.setItem('simpleStylingData', JSON.stringify(currentSimpleStyleData))
        navigation.navigate('SimpleStylingMenu', {ableToRefresh: true, indexNumToUse: indexNum, backToProfileScreen: goBackToProfileScreen});
    }
    const ColourInformationText = ({titleText, text}) => {
        return(
            <View style={{borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 10}}>
                <Text style={{color: tertiary, fontSize: 22, marginVertical: 5, textAlign: 'center', fontWeight: 'bold'}}>{`\u2022 ${titleText}`}</Text>
                <Text style={{color: tertiary, fontSize: 18, marginVertical: 5, textAlign: 'center'}}>{text}</Text>
            </View>
        );
    }
    return (
        <>
            <StatusBar style={StatusBarColor}/>
            <ProfileOptionsView style={{backgroundColor: primary, height: '80%', paddingBottom: 20}} viewHidden={InfoPageIsHidden}>
                <Text style={{color: tertiary, fontSize: 20, fontWeight: 'bold', marginTop: 10}}>Colour Information</Text>
                <View style={{width: '100%', backgroundColor: borderColor, minHeight: 1, maxHeight: 1}}/>
                <ScrollView>
                    <ColourInformationText titleText="Primary" text="This is the background color used for the entire app."/>
                    <ColourInformationText titleText="Secondary" text="This is the colour that is used for some text input borders."/>
                    <ColourInformationText titleText="Tertiary" text="This is the colour used for text and images. This colour should compliment the background colour so it is easy to see."/>
                    <ColourInformationText titleText="DarkLight" text="This colour is lighter than the Tertiary colour to add a feeling of depth in SocialSquare."/>
                    <ColourInformationText titleText="Brand" text="This is the light blue colour that is used for some image borders, and is also the colour for the username in the Profile Screen."/>
                    <ColourInformationText titleText="Green" text="This is the green colour used for things such as polls and poll creation."/>
                    <ColourInformationText titleText="Red" text="This is the red colour used for things such as polls and poll creation."/>
                    <ColourInformationText titleText="Orange" text="This is the orange colour used for things such as polls and poll creation."/>
                    <ColourInformationText titleText="Yellow" text="This is the yellow colour used for things such as polls and poll creation."/>
                    <ColourInformationText titleText="Purple" text="This is the purple colour used for things such as polls and poll creation."/>
                    <ColourInformationText titleText="Greyish" text="This is a greyish colour used for the background of some buttons."/>
                    <ColourInformationText titleText="BronzeRarity" text="This is the colour used to represent bronze badges that users can collect."/>
                    <ColourInformationText titleText="DarkestBlue" text="This is the colour used for the border around the post button in the post screen that you have currently selected."/>
                    <ColourInformationText titleText="StatusBarColour" text="This is the colour for the operating system's status bar (clock, battery percentage, etc. at the top of your screen). This can only be set to light or dark (white or black)."/>
                    <ColourInformationText titleText="NavFocusedColour" text="This is the colour used for the image, image border, and text for the tab bar button that is currently active at the moment (if you are on the home screen, the Home button at the bottom of the screen in the tab bar will be this colour)."/>
                    <ColourInformationText titleText="NavNonFocusedColour" text="This is the colour used for the image, image border, and text for the tab bar buttons that are not active (if you are not on the home screen, the home button in the tab bar will be this colour)."/>
                    <ColourInformationText titleText="BorderColour" text="This is the colour used for element borders, and also some image backgrounds to add a feeling of depth to SocialSquare."/>
                    <ColourInformationText titleText="SlightlyLighterGrey" text="This colour is a slightly lighter grey. It is currently not used in the app though."/>
                    <ColourInformationText titleText="MidWhite" text="This is the colour used for comment text for all posts and vote text for polls."/>
                    <ColourInformationText titleText="SlightlyLighterPrimary" text="This is the colour used for the background of posts."/>
                    <ColourInformationText titleText="descTextColour" text="This colour is used for description text."/>
                    <ColourInformationText titleText="ErrorColour" text="This is the colour used for text that comes up when an error occurs."/>
                </ScrollView>
                <View style={{width: '100%', backgroundColor: borderColor, minHeight: 1, maxHeight: 1}}/>
            </ProfileOptionsView>
            <TopNavBar screenName={'Edit ' + name} leftIconChild={showCrossAndTick === false ? undefined : <Octicons name={"x"} size={40} color={tertiary} />} rightIcon={
                showCrossAndTick != false ?
                    <TouchableOpacity onPress={leaveAndSave} style={{position: 'absolute', right: 10, top: StatusBarHeight + 2}}>
                        <Icon name="save" size={40} color={tertiary}/>
                    </TouchableOpacity>
                :
                    InfoPageIsHidden == true ?
                        <TouchableOpacity onPress={() => {setInfoPageIsHidden(false)}} style={{position: 'absolute', right: 10, top: StatusBarHeight + 2}}>
                            <Icon name="info-with-circle" size={40} color={tertiary}/>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity onPress={() => {setInfoPageIsHidden(true)}} style={{position: 'absolute', right: 17, top: StatusBarHeight}}>
                            <Octicons name={'x'} size={40} color={tertiary}/>
                        </TouchableOpacity>
            }/>
            <View style={{backgroundColor: primary}}>
                {InfoPageIsHidden == true ?
                    <ScrollView style={{height: '100%'}} contentContainerStyle={{alignItems: 'center', backgroundColor: primary}}>
                        <Text style={{backgroundColor: primary, color: tertiary}}>Styling Version V{stylingVersion || 'ERROR OCCURED'}</Text>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'primary', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Primary</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'secondary', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Secondary</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'tertiary', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Tertiary</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'darkLight', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Dark Light</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'brand', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Brand</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'green', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Green</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'red', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Red</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'orange', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Orange</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'yellow', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Yellow</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'purple', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Purple</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'greyish', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Greyish</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'bronzeRarity', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Bronze Rarity</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'darkestBlue', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Darkest Blue</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'StatusBarColor', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Status Bar Color</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'navFocusedColor', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Nav Focused Color</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'navNonFocusedColor', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Nav Non Focused Color</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'borderColor', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Border Colour</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'slightlyLighterGrey', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Slightly Lighter Grey</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'midWhite', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Mid White</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'slightlyLighterPrimary', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Slightly Lighter Primary</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%'}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'descTextColor', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Desc Text Color</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{justifyContent: 'center', borderColor: borderColor, borderWidth: 3, marginVertical: 10, borderRadius: 50, padding: 20, width: '90%', marginBottom: 100}} onPress={() => {
                            setShowCrossAndTick(false)
                            navigation.navigate('Simple_ColorPickerScreen', {name: name, indexNum: indexNum, type: 'errorColor', dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, secondary: secondary, background: background, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor, placeToNavigateBackTo: 'EditSimpleStyle'});
                        }}>
                            <Text style={{fontSize: 20, color: tertiary, fontWeight: 'bold', textAlign: 'center'}}>Error Colour</Text>
                        </TouchableOpacity>

                    </ScrollView>
                :
                        <View style={{height: '100%', backgroundColor: primary}}/>
                }
            </View>
        </>
    );
}

export default EditSimpleStyle;
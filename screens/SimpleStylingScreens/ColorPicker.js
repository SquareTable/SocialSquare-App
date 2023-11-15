import React, {createRef, useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Octicons from 'react-native-vector-icons/Octicons.js';

import ColorPicker from 'react-native-wheel-color-picker'
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import TopNavBar from '../../components/TopNavBar.js';

const Simple_ColorPickerScreen = ({navigation, route}) => {
    const {name, indexNum, type, stylingType, stylingVersion, dark, primary, tertiary, borderColor, background, secondary, darkLight, brand, green, red, darkest, greyish, bronzeRarity, darkestBlue, StatusBarColor, navFocusedColor, navNonFocusedColor, orange, yellow, purple, slightlyLighterGrey, midWhite, slightlyLighterPrimary, descTextColor, errorColor, placeToNavigateBackTo} = route.params;
    let ColorPickerRef = createRef()
    const StatusBarHeight = useContext(StatusBarHeightContext);

    function isStatusBarDarkOrLight() {
        if (type == 'StatusBarColor') {
            if (StatusBarColor == 'light') {
                return 'light';
            } else {
                return 'dark';
            }
        }
    }

    console.log(type)

    return (
        <>
            <StatusBar style={StatusBarColor}/>
            <TopNavBar screenName={'Edit ' + (type == 'primary' ? 'Background' : type == 'tertiary' ? 'Text and Image Tint' : type == 'secondary' ? 'Secondary' : type == 'darkLight' ? 'Dark Light' : type == 'brand' ? 'Brand' : type == 'green' ? 'Green' : type == 'red' ? 'Red' : type == 'orange' ? 'Orange' : type == 'yellow' ? 'yellow' : type == 'purple' ? 'Purple' : type == 'greyish' ? 'Greyish' : type == 'bronzeRarity' ? 'Bronze Badge' : type == 'darkestBlue' ? 'Darkest Blue' : type == 'navFocusedColor' ? 'Nav Focused Color' : type == 'navNonFocusedColor' ? 'Nav Non Focused Color' : type == 'borderColor' ? 'Border' : type == 'slightlyLighterGrey' ? 'Slightly Lighter Grey' : type == 'midWhite' ? 'Mid White' : type == 'slightlyLighterPrimary' ? 'Slightly Lighter Primary' : type == 'descTextColor' ? 'Description Text' : type == 'StatusBarColor' ? 'Status Bar' : type == 'errorColor' ? 'Error Colour' : 'ERROR OCCURED') + ' Color'} rightIcon={
                <TouchableOpacity onPress={() => {navigation.navigate(placeToNavigateBackTo, {name: name, indexNum: indexNum, type: null, dark: dark, stylingType: stylingType, stylingVersion: stylingVersion, primary: primary, tertiary: tertiary, borderColor: borderColor, background: background, secondary: secondary, darkLight: darkLight, brand: brand, green: green, red: red, darkest: darkest, greyish: greyish, bronzeRarity: bronzeRarity, darkestBlue: darkestBlue, StatusBarColor: StatusBarColor, navFocusedColor: navFocusedColor, navNonFocusedColor: navNonFocusedColor, orange: orange, yellow: yellow, purple: purple, slightlyLighterGrey: slightlyLighterGrey, midWhite: midWhite, slightlyLighterPrimary: slightlyLighterPrimary, descTextColor: descTextColor, errorColor: errorColor})}} style={{position: 'absolute', right: 10, top: StatusBarHeight + 2}}>
                    <Octicons name={"check"} size={40} color={tertiary} />
                </TouchableOpacity>
            }/>
            <View style={{backgroundColor: primary, height: '100%', alignItems: 'center', alignSelf: 'center', width: '100%'}}>
                {type == 'StatusBarColor' || type == 'PostScreenStatusBarColor' ?
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {navigation.setParams({StatusBarColor: 'light'})}} style={{borderColor: borderColor, borderWidth: 5, borderRadius: 10, padding: 30, marginHorizontal: 5, paddingVertical: 70, flexDirection: 'column', alignItems: 'center'}}>
                            <Text style={{color: tertiary, fontSize: 30, fontWeight: 'bold'}}>Light</Text>
                            <View style={{marginTop: 20, backgroundColor: borderColor, minHeight: 30, height: 30, maxHeight: 30, minWidth: 30, width: 30, maxWidth: 30, borderRadius: 30/2, borderColor: isStatusBarDarkOrLight() == 'light' ? brand : tertiary, borderWidth: 2, justifyContent: 'center', alignItems: 'center'}}>
                                {isStatusBarDarkOrLight() == 'light' && (
                                    <View style={{backgroundColor: tertiary, minHeight: 15, height: 15, maxHeight: 15, minWidth: 15, width: 15, maxWidth: 15, borderRadius: 15/2}}/>
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {navigation.setParams({StatusBarColor: 'dark'})}} style={{borderColor: borderColor, borderWidth: 5, borderRadius: 10, padding: 30, marginHorizontal: 5, paddingVertical: 70, flexDirection: 'column', alignItems: 'center'}}>
                            <Text style={{color: tertiary, fontSize: 30, fontWeight: 'bold'}}>Dark</Text>
                            <View style={{marginTop: 20, backgroundColor: borderColor, minHeight: 30, height: 30, maxHeight: 30, minWidth: 30, width: 30, maxWidth: 30, borderRadius: 30/2, borderColor: isStatusBarDarkOrLight() == 'dark' ? brand : tertiary, borderWidth: 2, justifyContent: 'center', alignItems: 'center'}}>
                                {isStatusBarDarkOrLight() == 'dark' && (
                                    <View style={{backgroundColor: tertiary, minHeight: 15, height: 15, maxHeight: 15, minWidth: 15, width: 15, maxWidth: 15, borderRadius: 15/2}}/>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                :
                    <>
                        <View style={{height: '85%', width: '80%'}}>
                        <ColorPicker
                                ref={ColorPickerRef}
                                color={eval(type)}
                                swatchesOnly={false}
                                onColorChange={(color) => {console.log(color)}}
                                onColorChangeComplete={(color) => {type == 'primary' ? navigation.setParams({primary: color}) : type == 'tertiary' ? navigation.setParams({tertiary: color}) : type == 'secondary' ? navigation.setParams({secondary: color}) : type == 'darkLight' ? navigation.setParams({darkLight: color}) : type == 'brand' ? navigation.setParams({brand: color}) : type == 'green' ? navigation.setParams({green: color}) : type == 'red' ? navigation.setParams({red: color}) : type == 'orange' ? navigation.setParams({orange: color}) : type == 'yellow' ? navigation.setParams({yellow: color}) : type == 'purple' ? navigation.setParams({purple: color}) : type == 'greyish' ? navigation.setParams({greyish: color}) : type == 'bronzeRarity' ? navigation.setParams({bronzeRarity: color}) : type == 'darkestBlue' ? navigation.setParams({darkestBlue: color}) : type == 'navFocusedColor' ? navigation.setParams({navFocusedColor: color}) : type == 'navNonFocusedColor' ? navigation.setParams({navNonFocusedColor: color}) : type == 'borderColor' ? navigation.setParams({borderColor: color}) : type == 'slightlyLighterGrey' ? navigation.setParams({slightlyLighterGrey: color}) : type == 'midWhite' ? navigation.setParams({midWhite: color}) : type == 'slightlyLighterPrimary' ? navigation.setParams({slightlyLighterPrimary: color}) : type == 'descTextColor' ? navigation.setParams({descTextColor: color}) : type == 'errorColor' ? navigation.setParams({errorColor: color}) : null}}
                                thumbSize={40}
                                sliderSize={40}
                                noSnap={true}
                                row={false}
                                swatchesLast={true}
                                swatches={true}
                                discrete={false}
                        />
                    </View>
                    </>
                }
            </View>
        </>
    );
}

export default Simple_ColorPickerScreen;
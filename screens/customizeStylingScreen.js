import React, { useContext } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import { useTheme } from "@react-navigation/native";
import { StatusBarHeightContext } from "../components/StatusBarHeightContext.js";
import TopNavBar from "../components/TopNavBar.js";

const customizeStylingScreen = ({navigation}) => {
    const {colors, dark} = useTheme()
    const width = Dimensions.get('window').width
    const StatusBarHeight = useContext(StatusBarHeightContext);
    return(
        <>
            <TopNavBar screenName="Customize App Styling"/>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
                <TouchableOpacity onPress={() => {navigation.navigate('BuiltInStylingMenu')}} style={{borderColor: colors.borderColor, borderWidth: 2, borderRadius: 50, padding: 40, width: width * 0.9}}>
                    <Text style={{fontSize: 30, color: colors.tertiary, fontWeight: 'bold', textAlign: 'center'}}>Built-In Styling</Text>
                </TouchableOpacity>
                <View style={{height: 50}}/>
                <TouchableOpacity onPress={() => {navigation.navigate('SimpleStylingMenu', {ableToRefresh: false, indexNumToUse: null})}} style={{borderColor: colors.borderColor, borderWidth: 2, borderRadius: 50, padding: 40, width: width * 0.9}}>
                    <Text style={{fontSize: 30, color: colors.tertiary, fontWeight: 'bold', textAlign: 'center'}}>Simple Styling</Text>
                </TouchableOpacity>
                <View style={{height: 50}}/>
                <TouchableOpacity 
                    onPress={() => {
                        //alert('Coming soon')
                        navigation.navigate('AdvancedStylingMenu', {ableToRefresh: false, indexNumToUse: null})
                    }} 
                    style={{borderColor: colors.borderColor, borderWidth: 2, borderRadius: 50, padding: 40, width: width * 0.9}}
                >
                    <Text style={{fontSize: 30, color: colors.tertiary, fontWeight: 'bold', textAlign: 'center'}}>Advanced Styling</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default customizeStylingScreen;
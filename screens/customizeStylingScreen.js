import React, { useContext } from "react";
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import { useTheme } from "@react-navigation/native";
import {
    Navigator_BackButton,
    TestText,
    ChatScreen_Title
} from './screenStylings/styling.js'
import { StatusBarHeightContext } from "../components/StatusBarHeightContext.js";

const customizeStylingScreen = ({navigation}) => {
    const {colors, dark} = useTheme()
    const width = Dimensions.get('window').width
    const StatusBarHeight = useContext(StatusBarHeightContext);
    return(
        <>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Customize App Styling</TestText>
            </ChatScreen_Title>
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
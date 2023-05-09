import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, SafeAreaView, ScrollView, FlatList} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import styled from "styled-components";
import Images from "../posts/images.js";
import Post from "../posts/post.js";
import SwitchToggle from "react-native-switch-toggle";
import {
    darkModeStyling, 
    darkModeOn, 
    lightModeStyling, 
    TestText,
    ChatScreenInformation_Title,
    BackgroundDarkColor,
    Navigator_BackButton,
    SubTitle,
    FlexRow,
    StyledButton,
    ButtonText,
    FlexRow_WithoutJustifyContent,
    Colors
} from '../screens/screenStylings/styling.js';
import MemberRow from '../components/MemberRow_ChatInformationScreen.js';


const Content = ({navigation}, props) => {
    if (darkModeOn === true) {
        var styling = darkModeStyling;
    } else {
        var styling = lightModeStyling;
    }
    const {darkest} = Colors;
    const {source_for_image} = props;
    return(
        <TouchableOpacity onPress={() => {alert("Coming soon")}}>
            <Image
                source={source_for_image || require('../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/266-question.png')}
                style={source_for_image ? {minHeight: 60, minWidth: 60, width: 60, height: 60, maxWidth: 60, maxHeight: 60, borderWidth: 8, borderColor: darkest} : {minHeight: 60, minWidth: 60, width: 60, height: 60, maxWidth: 60, maxHeight: 60}}
                resizeMode="cover"
                resizeMethod="resize"
            />
        </TouchableOpacity>
    );
};

export default Content;
import React, {useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    SubTitle,
    WelcomeContainer
} from './screenStylings/styling.js';
import {View, TouchableOpacity, Image, Text} from 'react-native';

import { useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import TopNavBar from '../components/TopNavBar.js';


const CreateConversationSelection = ({navigation}) => {
    const {colors, dark} = useTheme();
    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <TopNavBar screenName="Create a conversation"/>
            <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Select Either:</Text>
            <WelcomeContainer style={{justifyContent: 'center', backgroundColor: colors.primary}}>
                <View style={{height: '46%', width: '85%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '4%', borderRadius: 50, borderStyle: 'dashed', borderWidth: 4, borderColor: colors.borderColor}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}} onPress={() => navigation.navigate("CreateConversation", {conversationTitle: null, conversationDescription: null, sentConversationMembers: null, sentConversationNSFW: null, sentConversationNSFL: null})}>
                        <SubTitle style={{marginBottom: 0, fontSize: 22, textAlign: 'center', color: colors.tertiary}}>Create Group Conversation</SubTitle>
                    </TouchableOpacity>
                </View>
                <View style={{height: '46%', width: '85%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRadius: 50, borderStyle: 'dashed', borderWidth: 4, borderColor: colors.borderColor}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}} onPress={() => navigation.navigate("ConversationDMUserFind")}>
                        <SubTitle style={{marginBottom: 0, fontSize: 22, textAlign: 'center', color: colors.tertiary}}>Create Private Conversation</SubTitle>
                        <SubTitle style={{marginBottom: 0, fontSize: 22, textAlign: 'center', color: colors.tertiary}}>(Direct Message)</SubTitle>
                    </TouchableOpacity>
                </View>
            </WelcomeContainer>
        </>
    );
}

export default CreateConversationSelection;

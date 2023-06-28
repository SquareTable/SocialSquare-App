import React, {useContext, useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@react-navigation/native';

import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar,
    StyledContainer,
    ProfileHorizontalView,
    ProfileHorizontalViewItem,
    ProfIcons,
    ProfInfoAreaImage,
    ProfileBadgesView,
    ProfileBadgeIcons,
    ProfilePostsSelectionView,
    ProfilePostsSelectionBtns,
    ProfileGridPosts,
    ProfileFeaturedPosts,
    ProfileTopBtns,
    TopButtonIcons,
    PostTypeSelector,
    PostHorizontalView,
    PostIcons,
    PostCollectionView,
    PostMsgBox
} from '../screens/screenStylings/styling.js';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { ImageBackground, ScrollView } from 'react-native';
import OfflineNotice from '../components/OfflineNotice.js';
import { AppStylingContext } from '../components/AppStylingContext.js';

import {View, Text} from 'react-native';


const PostScreen = ({navigation, route}) => {
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const formatOnePressed = () => {
        navigation.navigate("MultiMediaUploadPage", {imageFromRoute: null, titleFromRoute: '', descriptionFromRoute: ''})
    }

    const formatTwoPressed = () => {
        navigation.navigate("ThreadUploadPage", {threadFormat: null, threadTitle: null, threadSubtitle: null, threadTags: null, categoryTitle: null, threadBody: null, imageFromRoute: null, threadImageDescription: null, threadNSFW: null, threadNSFL: null, allowScreenShots: true})
    }

    const formatThreePressed = () => {
        navigation.navigate("PollUploadPage")
    }

    const formatFourPressed = () => {
        navigation.navigate("CategoryCreationPage", {imageFromRoute: null})
    }

    const {colors, dark} = useTheme();


    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            {storedCredentials ?
                <WelcomeContainer style={{backgroundColor: colors.primary}} postScreen={true}>
                    <PageTitle style={{color: colors.brand}}>Post</PageTitle>
                    <PostCollectionView>
                        <View>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>Photos</Text>
                            <PostTypeSelector style={{borderColor: colors.brand}} onPress={formatOnePressed}>
                                <PostIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/016-camera.png')}/>
                            </PostTypeSelector>
                        </View>
                        <PostHorizontalView>
                            <View style={{marginHorizontal: 40}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>Threads</Text>
                                <PostTypeSelector style={{borderColor: colors.brand}} onPress={formatTwoPressed}>
                                    <PostIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/007-pencil2.png')}/>
                                </PostTypeSelector>
                            </View>
                            <View style={{marginHorizontal: 40}}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>Categories</Text>
                                <PostTypeSelector style={{borderColor: colors.brand, width: 96, height: 96}} onPress={formatFourPressed}>
                                    <PostIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png')}/>
                                </PostTypeSelector>
                            </View>
                        </PostHorizontalView>
                        <View>
                            <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>Polls</Text>
                            <PostTypeSelector style={{borderColor: colors.brand}} onPress={formatThreePressed}>
                                <PostIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/157-stats-bars.png')}/>
                            </PostTypeSelector>
                        </View>
                    </PostCollectionView>
                </WelcomeContainer>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to post content to SocialSquare</Text>
                    <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                        <ButtonText> Login </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                            <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    );
}

export default PostScreen;

import React, {useContext, useState} from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import {Formik} from 'formik';

import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    Colors,
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
    PostMsgBox,
    MultiMediaPostFrame,
    StyledTextInput,
    LeftIcon,
    StyledInputLabel,
    MsgBox
} from '../screenStylings/styling.js';
import {ActivityIndicator} from 'react-native';

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

// Colors
const {brand, primary, tertiary, greyish, darkLight, darkestBlue, slightlyLighterPrimary} = Colors;

// axios
import axios from 'axios';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../../components/KeyboardAvoidingWrapper';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from '../../components/CredentialsContext';
import { ImageBackground, ScrollView, Image, View, Text } from 'react-native';

//Image picker
import * as ImagePicker from 'expo-image-picker';
import { cos } from 'react-native-reanimated';

import { useTheme } from '@react-navigation/native';

import { UseUploadContext } from '../../components/UseUploadContext';

const MultiMediaUploadPreview = ({route, navigation}) => {
    const {colors, dark} = useTheme();
    const { title, description, image, screenshotsAllowed} = route.params;
    const [submitting, setSubmitting] = useState(false)
    const { uploadPost } = useContext(UseUploadContext)
    
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handleMessage =  (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    return(
        <>    
            <StatusBar style={dark ? 'light' : 'dark'}/>
            <ScrollView style={{backgroundColor: colors.primary}}>
                <MultiMediaPostFrame style={{backgroundColor: dark ? slightlyLighterPrimary : colors.borderColor}} TitleView={true}>
                    <PageTitle>MultiMedia Post Screen</PageTitle>
                    <SubTitle style={{color: darkestBlue}}>Format: Image</SubTitle>
                </MultiMediaPostFrame>
                <SubTitle style={{color: brand, alignSelf: "center"}}>Preview</SubTitle>
                <MultiMediaPostFrame style={{backgroundColor: dark ? slightlyLighterPrimary : colors.borderColor}} ImageView={true}>
                    <Image source={image} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </MultiMediaPostFrame>
                <MultiMediaPostFrame style={{backgroundColor: colors.primary}}>
                    {title !== '' && <SubTitle style={{color: colors.tertiary}}>{title}</SubTitle>}
                    {description !== '' && <SubTitle style={{fontSize: 10, color: colors.tertiary}}>{description}</SubTitle>}
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{color: colors.tertiary, fontSize: 18, marginTop: 10, marginRight: 10}}>{screenshotsAllowed == false ? 'Screen capture is not allowed' : 'Screen capture is allowed'}</Text>
                        <View style={{width: 40, height: 40, borderColor: colors.borderColor, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', textAlignVertical: 'center'}}>{screenshotsAllowed == false ? '✕' : '✓'}</Text>
                        </View>
                    </View>
                </MultiMediaPostFrame>
                {!submitting && (<StyledButton onPress={() => {
                    uploadPost(route.params, 'image')
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'PostScreen'}]
                    })
                }}>
                    <ButtonText> Post </ButtonText>
                </StyledButton>)}
                {submitting && (<StyledButton disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                </StyledButton>)}
                <MsgBox>{message}</MsgBox>
            </ScrollView>

        </>
    );
}

export default MultiMediaUploadPreview;

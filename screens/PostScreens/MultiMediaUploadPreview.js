import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    PageTitle,
    SubTitle,
    StyledButton,
    ButtonText,
    MultiMediaPostFrame
} from '../screenStylings/styling.js';

import { ScrollView, Image, View, Text } from 'react-native';

import { useTheme } from '@react-navigation/native';

import { UseUploadContext } from '../../components/UseUploadContext';

const MultiMediaUploadPreview = ({route, navigation}) => {
    const {colors, dark} = useTheme();
    const { title, description, image, screenshotsAllowed} = route.params;
    const { uploadPost } = useContext(UseUploadContext)

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <ScrollView style={{backgroundColor: colors.primary}}>
                <MultiMediaPostFrame style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor}} TitleView={true}>
                    <PageTitle>MultiMedia Post Screen</PageTitle>
                    <SubTitle style={{color: colors.darkestBlue}}>Format: Image</SubTitle>
                </MultiMediaPostFrame>
                <SubTitle style={{color: colors.brand, alignSelf: "center"}}>Preview</SubTitle>
                <MultiMediaPostFrame style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor}} ImageView={true}>
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
                <StyledButton onPress={() => {
                    uploadPost(route.params, 'image')
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'PostScreen'}]
                    })
                }}>
                    <ButtonText> Post </ButtonText>
                </StyledButton>
            </ScrollView>

        </>
    );
}

export default MultiMediaUploadPreview;

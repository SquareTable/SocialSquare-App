import React, {useState, useEffect} from 'react';
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
    MultiMediaPostFrame,
    StyledTextInput,
    LeftIcon,
    StyledInputLabel,
    MsgBox
} from '../screenStylings/styling.js';

// icons
import Octicons from 'react-native-vector-icons/Octicons.js';

import {Image, View, TouchableOpacity, Text} from 'react-native';

//Image picker
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@react-navigation/native';
import KeyboardAvoidingScrollView from '../../components/KeyboardAvoidingScrollView.js';

const UserTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    const {colors} = useTheme();
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel style={{color: colors.tertiary}}>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
        </View>
    )
}

const MultiMediaUploadPage = ({navigation, route}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [image, setImage] = useState(null);
    const [clearingImage, setClearingImage] = useState(false);
    const {imageFromRoute} = route.params ?? {imageFromRoute: null};
    const [screenshotsAllowed, setScreenshotsAllowed] = useState(false)


    useEffect(() => {
        setImage(imageFromRoute)
    }, [imageFromRoute])
    

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        });
        
        if (!result.canceled) {
            const selected = result.assets[0]
            if (selected.type == 'video') {
                alert('Sorry we do not allow uploading videos yet. That will be coming soon though :)')
            } else {
                setImage(selected);
                navigation.setParams({imageFromRoute: selected})
            }
        }
    };

        
    const OpenImgLibrary = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            } else {
                pickImage()
            }
        }
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    const {colors, dark} = useTheme()

    const checkForCameraPermissions = async () => {
        navigation.navigate('TakeImage_Camera', {locationToGoTo: 'MultiMediaUploadPage'})
    }

    return(
        <>    
            <StatusBar style={dark ? 'light' : 'dark'}/>
            <KeyboardAvoidingScrollView>
                <MultiMediaPostFrame style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor}} TitleView={true}>
                    <PageTitle>MultiMedia Post Screen</PageTitle>
                    <SubTitle style={{color: colors.darkestBlue}}>Format: Image</SubTitle>
                </MultiMediaPostFrame>
                {image?.uri && <MultiMediaPostFrame style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor}} ImageView={true}>
                    <Image source={{uri: image.uri}} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </MultiMediaPostFrame>}

                {!image?.uri && <MultiMediaPostFrame style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor}} ImageView={true}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <StyledButton style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor, borderColor: colors.tertiary}} postImage={true} onPress={OpenImgLibrary}>
                            <ButtonText style={{color: colors.tertiary}} postImage={true}>
                                +
                            </ButtonText>
                        </StyledButton>
                        <View style={{width: 20}}/>
                        <StyledButton style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor, borderColor: colors.tertiary}} postImage={true} onPress={checkForCameraPermissions}>
                            <Image
                                source={require('../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/016-camera.png')}
                                style={{height: 30, width: 30, tintColor: colors.tertiary}}
                                resizeMode="contain"
                                resizeMethod="resize"
                            />
                        </StyledButton>
                    </View>
                </MultiMediaPostFrame>}
                {image?.uri && <StyledButton style={{backgroundColor: dark ? colors.slightlyLighterPrimary : colors.borderColor, borderColor: colors.tertiary}} removeImage={true} onPress={() => {navigation.setParams({imageFromRoute: null})}}>
                    <ButtonText style={{color: colors.tertiary}} removeImage={true}>
                        X
                    </ButtonText>
                </StyledButton>}
                <InnerContainer>
                    <Formik
                        initialValues={{title: '', description: ''}}
                        onSubmit={(values) => {
                            if (image == null) {
                                handleMessage('Please add an image.');
                            } else {
                                navigation.navigate("MultiMediaUploadPreview", {title: values.title.trim(), description: values.description.trim(), image: image, screenshotsAllowed: screenshotsAllowed})
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                <UserTextInput
                                    label="Title"
                                    icon="pencil"
                                    placeholder=""
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    value={values.title}
                                    style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                />

                                <UserTextInput
                                    label="Description"
                                    icon="pencil"
                                    placeholder=""
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    value={values.description}
                                    multiline={true}
                                    style={{backgroundColor: colors.primary, color: colors.tertiary}}
                                />

                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{color: colors.tertiary, fontSize: 18, marginTop: 10, marginRight: 10}}>Allow screen capture</Text>
                                    <TouchableOpacity onPress={() => {setScreenshotsAllowed(screenshotsAllowed => !screenshotsAllowed)}} style={{width: 40, height: 40, borderColor: colors.borderColor, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', textAlignVertical: 'center'}}>{screenshotsAllowed == false ? '✕' : '✓'}</Text>
                                    </TouchableOpacity>
                                </View>

                                <MsgBox type={messageType}>{message}</MsgBox>
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText> Continue </ButtonText>
                                </StyledButton>
                            </StyledFormArea>)}
                    </Formik>
                </InnerContainer>
            </KeyboardAvoidingScrollView>

        </>
    );
}


export default MultiMediaUploadPage;

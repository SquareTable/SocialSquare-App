import React, {useState, useContext} from 'react';

import { StatusBar } from 'expo-status-bar';

// formik
import {Formik} from 'formik';

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    Colors,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    AboveButtonText,
    PostHorizontalView,
    CheckBoxForPosts,
    ChangePollOptionColorView,
    ChangePollOptionColorText,
    ChangePollOptionColorButtons,
    ChangePollOptionColorButtonText,
    RedCheckBoxForColor,
    OrangeCheckBoxForColor,
    YellowCheckBoxForColor,
    GreenCheckBoxForColor,
    PurpleCheckBoxForColor
} from '../screenStylings/styling.js';
const {brand, primary, tertiary, red, orange, yellow, green, purple} = Colors;

//From react native
import {View, Image, ActivityIndicator, ImageBackground, StyleSheet, ScrollView, Text, TouchableOpacity} from 'react-native';

import { useTheme } from '@react-navigation/native';
import KeyboardAvoidingWrapper_NoScrollview from '../../components/KeyboardAvoidingWrapper_NoScrollview.js';
import { UseUploadContext } from '../../components/UseUploadContext.js';
import KeyboardAvoidingScrollView from '../../components/KeyboardAvoidingScrollView.js';

const UserTextInput = ({
    label, 
    icon, 
    optionOneColor, 
    setOptionOneColor,
    optionOneColorChangeViewVisible,
    setOptionOneColorChangeViewVisible,
    optionTwoColor, 
    setOptionTwoColor,
    optionTwoColorChangeViewVisible,
    setOptionTwoColorChangeViewVisible,
    optionThreeColor, 
    setOptionThreeColor,
    optionThreeColorChangeViewVisible,
    setOptionThreeColorChangeViewVisible,
    optionFourColor, 
    setOptionFourColor,
    optionFourColorChangeViewVisible,
    setOptionFourColorChangeViewVisible,
    optionFiveColor, 
    setOptionFiveColor,
    optionFiveColorChangeViewVisible,
    setOptionFiveColorChangeViewVisible,
    optionSixColor, 
    setOptionSixColor,
    optionSixColorChangeViewVisible,
    setOptionSixColorChangeViewVisible,
    isOptionOne,
    isOptionTwo,
    isOptionThree,
    isOptionFour,
    isOptionFive,
    isOptionSix,
    hidePassword,
    selectedOptionForColor,
    setSelectedOptionForColor,
    ...props}) => {
        const {colors} = useTheme();
        return(
            <View>
                <LeftIcon style={{top: icon == "note" ? 35 : 33}}>
                    <Octicons name={icon} size={30} color={
                        isOptionOne ? optionOneColor !== '' ? colors[optionOneColor.toLowerCase()] : colors.brand :
                        isOptionTwo ? optionTwoColor !== '' ? colors[optionTwoColor.toLowerCase()] : colors.brand :
                        isOptionThree ? optionThreeColor !== '' ? colors[optionThreeColor.toLowerCase()] : colors.brand :
                        isOptionFour ? optionFourColor !== '' ? colors[optionFourColor.toLowerCase()] : colors.brand : 
                        isOptionFive ? optionFiveColor !== '' ? colors[optionFiveColor.toLowerCase()] : colors.brand :
                        isOptionSix ? optionSixColor !== '' ? colors[optionSixColor.toLowerCase()] : colors.brand : colors.brand
                    } />
                </LeftIcon>
                <StyledInputLabel style={{color: colors.tertiary}}>{label}</StyledInputLabel>
                <StyledTextInput {...props}/>
                {isOptionOne && (
                    <RightIcon style={{top: 33}} onPress={() => setOptionOneColorChangeViewVisible(false)}>
                        <Ionicons name={'color-palette-outline'} size={30} color={optionOneColor !== '' ? colors[optionOneColor.toLowerCase()] : brand}/>
                    </RightIcon>
                )}
                {isOptionTwo && (
                    <RightIcon style={{top: 33}} onPress={() => setOptionTwoColorChangeViewVisible(false)}>
                        <Ionicons name={'color-palette-outline'} size={30} color={optionTwoColor !== '' ? colors[optionTwoColor.toLowerCase()] : brand}/>
                    </RightIcon>
                )}
                {isOptionThree && (
                    <RightIcon style={{top: 33}} onPress={() => setOptionThreeColorChangeViewVisible(false)}>
                        <Ionicons name={'color-palette-outline'} size={30} color={optionThreeColor !== '' ? colors[optionThreeColor.toLowerCase()] : brand}/>
                    </RightIcon>
                )}
                {isOptionFour && (
                    <RightIcon style={{top: 33}} onPress={() => setOptionFourColorChangeViewVisible(false)}>
                        <Ionicons name={'color-palette-outline'} size={30} color={optionFourColor !== '' ? colors[optionFourColor.toLowerCase()] : brand}/>
                    </RightIcon>
                )}
                {isOptionFive && (
                    <RightIcon style={{top: 33}} onPress={() => setOptionFiveColorChangeViewVisible(false)}>
                        <Ionicons name={'color-palette-outline'} size={30} color={optionFiveColor !== '' ? colors[optionFiveColor.toLowerCase()] : brand}/>
                    </RightIcon>
                )}
                {isOptionSix && (
                    <RightIcon style={{top: 33}} onPress={() => setOptionSixColorChangeViewVisible(false)}>
                        <Ionicons name={'color-palette-outline'} size={30} color={optionSixColor !== '' ? colors[optionSixColor.toLowerCase()] : brand}/>
                    </RightIcon>
                )}
            </View>
        )
}


const PollUploadPage = ({navigation}) => {
    const { uploadPost } = useContext(UseUploadContext)
    const {colors, dark} = useTheme();
    const [optionOneColorChangeViewVisible, setOptionOneColorChangeViewVisible] = useState(true);
    const [optionOneColor, setOptionOneColor] = useState("");
    const [optionTwoColorChangeViewVisible, setOptionTwoColorChangeViewVisible] = useState(true);
    const [optionTwoColor, setOptionTwoColor] = useState("");
    const [optionThreeColorChangeViewVisible, setOptionThreeColorChangeViewVisible] = useState(true);
    const [optionThreeColor, setOptionThreeColor] = useState("");
    const [optionFourColorChangeViewVisible, setOptionFourColorChangeViewVisible] = useState(true);
    const [optionFourColor, setOptionFourColor] = useState("");
    const [optionFiveColorChangeViewVisible, setOptionFiveColorChangeViewVisible] = useState(true);
    const [optionFiveColor, setOptionFiveColor] = useState("");
    const [optionSixColorChangeViewVisible, setOptionSixColorChangeViewVisible] = useState(true);
    const [optionSixColor, setOptionSixColor] = useState("");
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [optionThreeVisible, setOptionThreeVisible] = useState(false);
    const [optionFourVisible, setOptionFourVisible] = useState(false);
    const [optionFiveVisible, setOptionFiveVisible] = useState(false);
    const [optionSixVisible, setOptionSixVisible] = useState(false);
    const [screenshotsAllowed, setScreenshotsAllowed] = useState(false)

    const changePollOneColorChangeView = () => {
        setOptionOneColorChangeViewVisible(true)
    }

    const changePollTwoColorChangeView = () => {
        setOptionTwoColorChangeViewVisible(true)
    }

    const changePollThreeColorChangeView = () => {
        setOptionThreeColorChangeViewVisible(true)
    }

    const changePollFourColorChangeView = () => {
        setOptionFourColorChangeViewVisible(true)
    }

    const changePollFiveColorChangeView = () => {
        setOptionFiveColorChangeViewVisible(true)
    }

    const changePollSixColorChangeView = () => {
        setOptionSixColorChangeViewVisible(true)
    }

    //change Values
    const [termsValidation, setTermsValidation] = useState(false);

    const [endLoop, setEndLoop] = useState(false);

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    return(
        <KeyboardAvoidingWrapper_NoScrollview style={{backgroundColor: colors.primary}}>
            <KeyboardAvoidingScrollView>
                <StyledContainer style={{backgroundColor: colors.primary}}>
                        <StatusBar style={dark ? 'light' : 'dark'}/>
                        <InnerContainer style={{backgroundColor: colors.primary}}>
                            <PageLogo style={{tintColor: colors.tertiary}} source={require('./../../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/157-stats-bars.png')} />
                            
                            <PageTitle>Create Poll</PageTitle>
                            <Formik
                                initialValues={{pollTitle: "", pollSubTitle: "", optionOne: "", optionOnesColor: "Not Specified", optionTwo: "", optionTwosColor: "Not Specified", optionThree: "", optionThreesColor: "Not Specified", optionFour: "", optionFoursColor: "Not Specified", optionFive: "", optionFivesColor: "Not Specified", optionSix: "", optionSixesColor: "Not Specified", totalNumberOfOptions: "Two", sentAllowScreenShots: false}}
                                onSubmit={(values, {setSubmitting}) => {
                                    if (values.pollTitle == "" || values.pollSubTitle == "" || values.optionOne == "" || values.optionTwo == "") {
                                        handleMessage('Please fill all the fields.');
                                        setSubmitting(false);
                                    } else {
                                        uploadPost(values, 'poll')
                                        navigation.reset({
                                            index: 0,
                                            routes: [{name: 'PostScreen'}]
                                        })
                                    }
                                }}
                            >
                                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                    <StyledFormArea theOutline={true}>
                                        <UserTextInput
                                            label="Poll Title"
                                            icon="note"
                                            placeholder=""
                                            placeholderTextColor={colors.tertiary}
                                            onChangeText={handleChange('pollTitle')}
                                            onBlur={handleBlur('pollTitle')}
                                            value={values.pollTitle}
                                            style={{color: colors.tertiary, backgroundColor: colors.primary}}
                                        />
                                        <UserTextInput
                                            label="Poll Subtitle"
                                            icon="note"
                                            placeholder=""
                                            placeholderTextColor={colors.tertiary}
                                            onChangeText={handleChange('pollSubTitle')}
                                            onBlur={handleBlur('pollSubTitle')}
                                            value={values.pollSubTitle}
                                            style={{color: colors.tertiary, backgroundColor: colors.primary}}
                                        />
                                        <AboveButtonText style={{color: colors.tertiary}}>Poll Options</AboveButtonText>
                                        <UserTextInput
                                            label="Option One"
                                            icon="pencil"
                                            placeholder=""
                                            placeholderTextColor={colors.tertiary}
                                            isOptionOne={true}
                                            onChangeText={handleChange('optionOne')}
                                            onBlur={handleBlur('optionOne')}
                                            value={values.optionOne}
                                            setOptionOneColor={setOptionOneColor}
                                            setOptionOneColorChangeViewVisible={setOptionOneColorChangeViewVisible}
                                            style={{borderColor: optionOneColor !== '' ? colors[optionOneColor.toLowerCase()] : brand, backgroundColor: colors.primary, color: colors.tertiary}}
                                            optionOneColor={optionOneColor}
                                        />
                                        <ChangePollOptionColorView style={{backgroundColor: colors.primary}} viewHidden={optionOneColorChangeViewVisible}>
                                            <ChangePollOptionColorText style={{color: colors.tertiary}}>Associate with color:</ChangePollOptionColorText>
                                            <PostHorizontalView>
                                                <RedCheckBoxForColor style={{borderColor: optionOneColor == 'Red' ? brand : colors.tertiary}} selectedState={optionOneColor} 
                                                onPress={() => {
                                                    if (values.optionOnesColor !== "Red") {
                                                        values.optionOnesColor = "Red"
                                                        setOptionOneColor("Red")
                                                        console.log(values.optionOnesColor)
                                                    } else {
                                                        values.optionOnesColor = "Not Specified"
                                                        setOptionOneColor("")
                                                        console.log(values.optionOnesColor)
                                                    }
                                                }}></RedCheckBoxForColor>
                                                <OrangeCheckBoxForColor style={{borderColor: optionOneColor == 'Orange' ? brand : colors.tertiary}} selectedState={optionOneColor} 
                                                onPress={() => {
                                                    if (values.optionOnesColor !== "Orange") {
                                                        values.optionOnesColor = "Orange"
                                                        setOptionOneColor("Orange")
                                                        console.log(values.optionOnesColor)
                                                    } else {
                                                        values.optionOnesColor = "Not Specified"
                                                        setOptionOneColor("")
                                                        console.log(values.optionOnesColor)
                                                    }
                                                }}></OrangeCheckBoxForColor>
                                                <YellowCheckBoxForColor style={{borderColor: optionOneColor == 'Yellow' ? brand : colors.tertiary}} selectedState={optionOneColor} 
                                                onPress={() => {
                                                    if (values.optionOnesColor !== "Yellow") {
                                                        values.optionOnesColor = "Yellow"
                                                        setOptionOneColor("Yellow")
                                                        console.log(values.optionOnesColor)
                                                    } else {
                                                        values.optionOnesColor = "Not Specified"
                                                        setOptionOneColor("")
                                                        console.log(values.optionOnesColor)
                                                    }
                                                }}></YellowCheckBoxForColor>
                                                <GreenCheckBoxForColor style={{borderColor: optionOneColor == 'Green' ? brand : colors.tertiary}} selectedState={optionOneColor} 
                                                onPress={() => {
                                                    if (values.optionOnesColor !== "Green") {
                                                        values.optionOnesColor = "Green"
                                                        setOptionOneColor("Green")
                                                        console.log(values.optionOnesColor)
                                                    } else {
                                                        values.optionOnesColor = "Not Specified"
                                                        setOptionOneColor("")
                                                        console.log(values.optionOnesColor)
                                                    }
                                                }}></GreenCheckBoxForColor>
                                                <PurpleCheckBoxForColor style={{borderColor: optionOneColor == 'Purple' ? brand : colors.tertiary}} selectedState={optionOneColor} 
                                                onPress={() => {
                                                    if (values.optionOnesColor !== "Purple") {
                                                        values.optionOnesColor = "Purple"
                                                        setOptionOneColor("Purple")
                                                        console.log(values.optionOnesColor)
                                                    } else {
                                                        values.optionOnesColor = "Not Specified"
                                                        setOptionOneColor("")
                                                        console.log(values.optionOnesColor)
                                                    }
                                                }}></PurpleCheckBoxForColor>
                                            </PostHorizontalView>
                                            <ChangePollOptionColorButtons cancelButton={true} onPress={changePollOneColorChangeView}>
                                                <ChangePollOptionColorButtonText cancelButton={true}>Close</ChangePollOptionColorButtonText>
                                            </ChangePollOptionColorButtons> 
                                        </ChangePollOptionColorView>
                                        <UserTextInput
                                            label="Option Two"
                                            icon="pencil"
                                            placeholder=""
                                            placeholderTextColor={tertiary}
                                            isOptionTwo={true}
                                            onChangeText={handleChange('optionTwo')}
                                            onBlur={handleBlur('optionTwo')}
                                            value={values.optionTwo}
                                            setOptionTwoColor={setOptionTwoColor}
                                            setOptionTwoColorChangeViewVisible={setOptionTwoColorChangeViewVisible}
                                            style={{borderColor: optionTwoColor !== '' ? colors[optionTwoColor.toLowerCase()] : brand, backgroundColor: colors.primary, color: colors.tertiary}}
                                            optionTwoColor={optionTwoColor}
                                        />
                                        <ChangePollOptionColorView style={{backgroundColor: colors.primary}} viewHidden={optionTwoColorChangeViewVisible}>
                                            <ChangePollOptionColorText style={{color: colors.tertiary}}>Associate with color:</ChangePollOptionColorText>
                                            <PostHorizontalView>
                                                <RedCheckBoxForColor style={{borderColor: optionTwoColor == 'Red' ? brand : colors.tertiary}} selectedState={optionTwoColor} 
                                                onPress={() => {
                                                    if (values.optionTwosColor !== "Red") {
                                                        values.optionTwosColor = "Red"
                                                        setOptionTwoColor("Red")
                                                        console.log(values.optionTwosColor)
                                                    } else {
                                                        values.optionTwosColor = "Not Specified"
                                                        setOptionTwoColor("")
                                                        console.log(values.optionTwosColor)
                                                    }
                                                }}></RedCheckBoxForColor>
                                                <OrangeCheckBoxForColor style={{borderColor: optionTwoColor == 'Orange' ? brand : colors.tertiary}} selectedState={optionTwoColor} 
                                                onPress={() => {
                                                    if (values.optionTwosColor !== "Orange") {
                                                        values.optionTwosColor = "Orange"
                                                        setOptionTwoColor("Orange")
                                                        console.log(values.optionTwosColor)
                                                    } else {
                                                        values.optionTwosColor = "Not Specified"
                                                        setOptionTwoColor("")
                                                        console.log(values.optionTwosColor)
                                                    }
                                                }}></OrangeCheckBoxForColor>
                                                <YellowCheckBoxForColor style={{borderColor: optionTwoColor == 'Yellow' ? brand : colors.tertiary}} selectedState={optionTwoColor} 
                                                onPress={() => {
                                                    if (values.optionTwosColor !== "Yellow") {
                                                        values.optionTwosColor = "Yellow"
                                                        setOptionTwoColor("Yellow")
                                                        console.log(values.optionTwosColor)
                                                    } else {
                                                        values.optionTwosColor = "Not Specified"
                                                        setOptionTwoColor("")
                                                        console.log(values.optionTwosColor)
                                                    }
                                                }}></YellowCheckBoxForColor>
                                                <GreenCheckBoxForColor style={{borderColor: optionTwoColor == 'Green' ? brand : colors.tertiary}} selectedState={optionTwoColor} 
                                                onPress={() => {
                                                    if (values.optionTwosColor !== "Green") {
                                                        values.optionTwosColor = "Green"
                                                        setOptionTwoColor("Green")
                                                        console.log(values.optionTwosColor)
                                                    } else {
                                                        values.optionTwosColor = "Not Specified"
                                                        setOptionTwoColor("")
                                                        console.log(values.optionTwosColor)
                                                    }
                                                }}></GreenCheckBoxForColor>
                                                <PurpleCheckBoxForColor style={{borderColor: optionTwoColor == 'Purple' ? brand : colors.tertiary}} selectedState={optionTwoColor} 
                                                onPress={() => {
                                                    if (values.optionTwosColor !== "Purple") {
                                                        values.optionTwosColor = "Purple"
                                                        setOptionTwoColor("Purple")
                                                        console.log(values.optionTwosColor)
                                                    } else {
                                                        values.optionTwosColor = "Not Specified"
                                                        setOptionTwoColor("")
                                                        console.log(values.optionTwosColor)
                                                    }
                                                }}></PurpleCheckBoxForColor>
                                            </PostHorizontalView>
                                            <ChangePollOptionColorButtons cancelButton={true} onPress={changePollTwoColorChangeView}>
                                                <ChangePollOptionColorButtonText cancelButton={true}>Close</ChangePollOptionColorButtonText>
                                            </ChangePollOptionColorButtons> 
                                        </ChangePollOptionColorView>
                                        <StyledFormArea visibility={optionThreeVisible}>
                                            <UserTextInput
                                                label="Option Three"
                                                icon="pencil"
                                                placeholder=""
                                                placeholderTextColor={tertiary}
                                                isOptionThree={true}
                                                onChangeText={handleChange('optionThree')}
                                                onBlur={handleBlur('optionThree')}
                                                value={values.optionThree}
                                                setOptionThreeColor={setOptionThreeColor}
                                                setOptionThreeColorChangeViewVisible={setOptionThreeColorChangeViewVisible}
                                                style={{borderColor: optionThreeColor !== '' ? colors[optionThreeColor.toLowerCase()] : brand, backgroundColor: colors.primary, color: colors.tertiary}}
                                                optionThreeColor={optionThreeColor}
                                            />
                                            <ChangePollOptionColorView style={{backgroundColor: colors.primary}} viewHidden={optionThreeColorChangeViewVisible}>
                                                <ChangePollOptionColorText style={{color: colors.tertiary}}>Associate with color:</ChangePollOptionColorText>
                                                <PostHorizontalView>
                                                    <RedCheckBoxForColor style={{borderColor: optionThreeColor == 'Red' ? brand : colors.tertiary}} selectedState={optionThreeColor} 
                                                    onPress={() => {
                                                        if (values.optionThreesColor !== "Red") {
                                                            values.optionThreesColor = "Red"
                                                            setOptionThreeColor("Red")
                                                            console.log(values.optionThreesColor)
                                                        } else {
                                                            values.optionThreesColor = "Not Specified"
                                                            setOptionThreeColor("")
                                                            console.log(values.optionThreesColor)
                                                        }
                                                    }}></RedCheckBoxForColor>
                                                    <OrangeCheckBoxForColor style={{borderColor: optionThreeColor == 'Orange' ? brand : colors.tertiary}} selectedState={optionThreeColor} 
                                                    onPress={() => {
                                                        if (values.optionThreesColor !== "Orange") {
                                                            values.optionThreesColor = "Orange"
                                                            setOptionThreeColor("Orange")
                                                            console.log(values.optionThreesColor)
                                                        } else {
                                                            values.optionThreesColor = "Not Specified"
                                                            setOptionThreeColor("")
                                                            console.log(values.optionThreesColor)
                                                        }
                                                    }}></OrangeCheckBoxForColor>
                                                    <YellowCheckBoxForColor style={{borderColor: optionThreeColor == 'Yellow' ? brand : colors.tertiary}} selectedState={optionThreeColor} 
                                                    onPress={() => {
                                                        if (values.optionThreesColor !== "Yellow") {
                                                            values.optionThreesColor = "Yellow"
                                                            setOptionThreeColor("Yellow")
                                                            console.log(values.optionThreesColor)
                                                        } else {
                                                            values.optionThreesColor = "Not Specified"
                                                            setOptionThreeColor("")
                                                            console.log(values.optionThreesColor)
                                                        }
                                                    }}></YellowCheckBoxForColor>
                                                    <GreenCheckBoxForColor style={{borderColor: optionThreeColor == 'Green' ? brand : colors.tertiary}} selectedState={optionThreeColor} 
                                                    onPress={() => {
                                                        if (values.optionThreesColor !== "Green") {
                                                            values.optionThreesColor = "Green"
                                                            setOptionThreeColor("Green")
                                                            console.log(values.optionThreesColor)
                                                        } else {
                                                            values.optionThreesColor = "Not Specified"
                                                            setOptionThreeColor("")
                                                            console.log(values.optionThreesColor)
                                                        }
                                                    }}></GreenCheckBoxForColor>
                                                    <PurpleCheckBoxForColor style={{borderColor: optionThreeColor == 'Purple' ? brand : colors.tertiary}} selectedState={optionThreeColor} 
                                                    onPress={() => {
                                                        if (values.optionThreesColor !== "Purple") {
                                                            values.optionThreesColor = "Purple"
                                                            setOptionThreeColor("Purple")
                                                            console.log(values.optionThreesColor)
                                                        } else {
                                                            values.optionThreesColor = "Not Specified"
                                                            setOptionThreeColor("")
                                                            console.log(values.optionThreesColor)
                                                        }
                                                    }}></PurpleCheckBoxForColor>
                                                </PostHorizontalView>
                                                <ChangePollOptionColorButtons cancelButton={true} onPress={changePollThreeColorChangeView}>
                                                    <ChangePollOptionColorButtonText cancelButton={true}>Close</ChangePollOptionColorButtonText>
                                                </ChangePollOptionColorButtons> 
                                            </ChangePollOptionColorView>
                                        </StyledFormArea>
                                        <StyledFormArea visibility={optionFourVisible}>
                                            <UserTextInput
                                                label="Option Four"
                                                icon="pencil"
                                                placeholder=""
                                                placeholderTextColor={tertiary}
                                                isOptionFour={true}
                                                onChangeText={handleChange('optionFour')}
                                                onBlur={handleBlur('optionFour')}
                                                value={values.optionFour}
                                                setOptionFourColor={setOptionFourColor}
                                                setOptionFourColorChangeViewVisible={setOptionFourColorChangeViewVisible}
                                                style={{borderColor: optionFourColor !== '' ? colors[optionFourColor.toLowerCase()] : brand, backgroundColor: colors.primary, color: colors.tertiary}}
                                                optionFourColor={optionFourColor}
                                            />
                                            <ChangePollOptionColorView style={{backgroundColor: colors.primary}} viewHidden={optionFourColorChangeViewVisible}>
                                                <ChangePollOptionColorText style={{color: colors.tertiary}}>Associate with color:</ChangePollOptionColorText>
                                                <PostHorizontalView>
                                                    <RedCheckBoxForColor style={{borderColor: optionFourColor == 'Red' ? brand : colors.tertiary}} selectedState={optionFourColor} 
                                                    onPress={() => {
                                                        if (values.optionFoursColor !== "Red") {
                                                            values.optionFoursColor = "Red"
                                                            setOptionFourColor("Red")
                                                            console.log(values.optionFoursColor)
                                                        } else {
                                                            values.optionFoursColor = "Not Specified"
                                                            setOptionFourColor("")
                                                            console.log(values.optionFoursColor)
                                                        }
                                                    }}></RedCheckBoxForColor>
                                                    <OrangeCheckBoxForColor style={{borderColor: optionFourColor == 'Orange' ? brand : colors.tertiary}} selectedState={optionFourColor} 
                                                    onPress={() => {
                                                        if (values.optionFoursColor !== "Orange") {
                                                            values.optionFoursColor = "Orange"
                                                            setOptionFourColor("Orange")
                                                            console.log(values.optionFoursColor)
                                                        } else {
                                                            values.optionFoursColor = "Not Specified"
                                                            setOptionFourColor("")
                                                            console.log(values.optionFoursColor)
                                                        }
                                                    }}></OrangeCheckBoxForColor>
                                                    <YellowCheckBoxForColor style={{borderColor: optionFourColor == 'Yellow' ? brand : colors.tertiary}} selectedState={optionFourColor} 
                                                    onPress={() => {
                                                        if (values.optionFoursColor !== "Yellow") {
                                                            values.optionFoursColor = "Yellow"
                                                            setOptionFourColor("Yellow")
                                                            console.log(values.optionFoursColor)
                                                        } else {
                                                            values.optionFoursColor = "Not Specified"
                                                            setOptionFourColor("")
                                                            console.log(values.optionFoursColor)
                                                        }
                                                    }}></YellowCheckBoxForColor>
                                                    <GreenCheckBoxForColor style={{borderColor: optionFourColor == 'Green' ? brand : colors.tertiary}} selectedState={optionFourColor} 
                                                    onPress={() => {
                                                        if (values.optionFoursColor !== "Green") {
                                                            values.optionFoursColor = "Green"
                                                            setOptionFourColor("Green")
                                                            console.log(values.optionFoursColor)
                                                        } else {
                                                            values.optionFoursColor = "Not Specified"
                                                            setOptionFourColor("")
                                                            console.log(values.optionFoursColor)
                                                        }
                                                    }}></GreenCheckBoxForColor>
                                                    <PurpleCheckBoxForColor style={{borderColor: optionFourColor == 'Purple' ? brand : colors.tertiary}} selectedState={optionFourColor} 
                                                    onPress={() => {
                                                        if (values.optionFoursColor !== "Purple") {
                                                            values.optionFoursColor = "Purple"
                                                            setOptionFourColor("Green")
                                                            console.log(values.optionFoursColor)
                                                        } else {
                                                            values.optionFoursColor = "Not Specified"
                                                            setOptionFourColor("")
                                                            console.log(values.optionFoursColor)
                                                        }
                                                    }}></PurpleCheckBoxForColor>
                                                </PostHorizontalView>
                                                <ChangePollOptionColorButtons cancelButton={true} onPress={changePollFourColorChangeView}>
                                                    <ChangePollOptionColorButtonText cancelButton={true}>Close</ChangePollOptionColorButtonText>
                                                </ChangePollOptionColorButtons> 
                                            </ChangePollOptionColorView>
                                        </StyledFormArea>
                                        <StyledFormArea visibility={optionFiveVisible}>
                                            <UserTextInput
                                                label="Option Five"
                                                icon="pencil"
                                                placeholder=""
                                                placeholderTextColor={tertiary}
                                                isOptionFive={true}
                                                onChangeText={handleChange('optionFive')}
                                                onBlur={handleBlur('optionFive')}
                                                value={values.optionFive}
                                                setOptionFiveColor={setOptionFiveColor}
                                                setOptionFiveColorChangeViewVisible={setOptionFiveColorChangeViewVisible}
                                                style={{borderColor: optionFiveColor !== '' ? colors[optionFiveColor.toLowerCase()] : brand, backgroundColor: colors.primary, color: colors.tertiary}}
                                                optionFiveColor={optionFiveColor}
                                            />
                                            <ChangePollOptionColorView style={{backgroundColor: colors.primary}} viewHidden={optionFiveColorChangeViewVisible}>
                                                <ChangePollOptionColorText style={{color: colors.tertiary}}>Associate with color:</ChangePollOptionColorText>
                                                <PostHorizontalView>
                                                    <RedCheckBoxForColor style={{borderColor: optionFiveColor == 'Red' ? brand : colors.tertiary}} selectedState={optionFiveColor} 
                                                    onPress={() => {
                                                        if (values.optionFivesColor !== "Red") {
                                                            values.optionFivesColor = "Red"
                                                            setOptionFiveColor("Red")
                                                            console.log(values.optionFivesColor)
                                                        } else {
                                                            values.optionFivesColor = "Not Specified"
                                                            setOptionFiveColor("")
                                                            console.log(values.optionFivesColor)
                                                        }
                                                    }}></RedCheckBoxForColor>
                                                    <OrangeCheckBoxForColor style={{borderColor: optionFiveColor == 'Orange' ? brand : colors.tertiary}} selectedState={optionFiveColor} 
                                                    onPress={() => {
                                                        if (values.optionFivesColor !== "Orange") {
                                                            values.optionFivesColor = "Orange"
                                                            setOptionFiveColor("Orange")
                                                            console.log(values.optionFivesColor)
                                                        } else {
                                                            values.optionFivesColor = "Not Specified"
                                                            setOptionFiveColor("")
                                                            console.log(values.optionFivesColor)
                                                        }
                                                    }}></OrangeCheckBoxForColor>
                                                    <YellowCheckBoxForColor style={{borderColor: optionFiveColor == 'Yellow' ? brand : colors.tertiary}} selectedState={optionFiveColor} 
                                                    onPress={() => {
                                                        if (values.optionFivesColor !== "Yellow") {
                                                            values.optionFivesColor = "Yellow"
                                                            setOptionFiveColor("Yellow")
                                                            console.log(values.optionFivesColor)
                                                        } else {
                                                            values.optionFivesColor = "Not Specified"
                                                            setOptionFiveColor("")
                                                            console.log(values.optionFivesColor)
                                                        }
                                                    }}></YellowCheckBoxForColor>
                                                    <GreenCheckBoxForColor style={{borderColor: optionFiveColor == 'Green' ? brand : colors.tertiary}} selectedState={optionFiveColor} 
                                                    onPress={() => {
                                                        if (values.optionFivesColor !== "Green") {
                                                            values.optionFivesColor = "Green"
                                                            setOptionFiveColor("Green")
                                                            console.log(values.optionFivesColor)
                                                        } else {
                                                            values.optionFivesColor = "Not Specified"
                                                            setOptionFiveColor("")
                                                            console.log(values.optionFivesColor)
                                                        }
                                                    }}></GreenCheckBoxForColor>
                                                    <PurpleCheckBoxForColor style={{borderColor: optionFiveColor == 'Purple' ? brand : colors.tertiary}} selectedState={optionFiveColor} 
                                                    onPress={() => {
                                                        if (values.optionFivesColor !== "Purple") {
                                                            values.optionFivesColor = "Purple"
                                                            setOptionFiveColor("Purple")
                                                            console.log(values.optionFivesColor)
                                                        } else {
                                                            values.optionFivesColor = "Not Specified"
                                                            setOptionFiveColor("")
                                                            console.log(values.optionFivesColor)
                                                        }
                                                    }}></PurpleCheckBoxForColor>
                                                </PostHorizontalView>
                                                <ChangePollOptionColorButtons cancelButton={true} onPress={changePollFiveColorChangeView}>
                                                    <ChangePollOptionColorButtonText cancelButton={true}>Close</ChangePollOptionColorButtonText>
                                                </ChangePollOptionColorButtons> 
                                            </ChangePollOptionColorView>
                                        </StyledFormArea>
                                        <StyledFormArea visibility={optionSixVisible}>
                                            <UserTextInput
                                                label="Option Six"
                                                icon="pencil"
                                                placeholder=""
                                                placeholderTextColor={tertiary}
                                                isOptionSix={true}
                                                onChangeText={handleChange('optionSix')}
                                                onBlur={handleBlur('optionSix')}
                                                value={values.optionSix}
                                                setOptionSixColor={setOptionSixColor}
                                                setOptionSixColorChangeViewVisible={setOptionSixColorChangeViewVisible}
                                                style={{borderColor: optionSixColor !== '' ? colors[optionSixColor.toLowerCase()] : brand, backgroundColor: colors.primary, color: colors.tertiary}}
                                                optionSixColor={optionSixColor}
                                            />
                                            <ChangePollOptionColorView style={{backgroundColor: colors.primary}} viewHidden={optionSixColorChangeViewVisible}>
                                                <ChangePollOptionColorText style={{color: colors.tertiary}}>Associate with color:</ChangePollOptionColorText>
                                                <PostHorizontalView>
                                                    <RedCheckBoxForColor style={{borderColor: optionSixColor == 'Red' ? brand : colors.tertiary}} selectedState={optionSixColor} 
                                                    onPress={() => {
                                                        if (values.optionSixesColor !== "Red") {
                                                            values.optionSixesColor = "Red"
                                                            setOptionSixColor("Red")
                                                            console.log(values.optionSixesColor)
                                                        } else {
                                                            values.optionSixesColor = "Not Specified"
                                                            setOptionSixColor("")
                                                            console.log(values.optionSixesColor)
                                                        }
                                                    }}></RedCheckBoxForColor>
                                                    <OrangeCheckBoxForColor style={{borderColor: optionSixColor == 'Orange' ? brand : colors.tertiary}} selectedState={optionSixColor} 
                                                    onPress={() => {
                                                        if (values.optionSixesColor !== "Orange") {
                                                            values.optionSixesColor = "Orange"
                                                            setOptionSixColor("Orange")
                                                            console.log(values.optionSixesColor)
                                                        } else {
                                                            values.optionSixesColor = "Not Specified"
                                                            setOptionSixColor("")
                                                            console.log(values.optionSixesColor)
                                                        }
                                                    }}></OrangeCheckBoxForColor>
                                                    <YellowCheckBoxForColor style={{borderColor: optionSixColor == 'Yellow' ? brand : colors.tertiary}} selectedState={optionSixColor} 
                                                    onPress={() => {
                                                        if (values.optionSixesColor !== "Yellow") {
                                                            values.optionSixesColor = "Yellow"
                                                            setOptionSixColor("Yellow")
                                                            console.log(values.optionSixesColor)
                                                        } else {
                                                            values.optionSixesColor = "Not Specified"
                                                            setOptionSixColor("")
                                                            console.log(values.optionSixesColor)
                                                        }
                                                    }}></YellowCheckBoxForColor>
                                                    <GreenCheckBoxForColor style={{borderColor: optionSixColor == 'Green' ? brand : colors.tertiary}} selectedState={optionSixColor} 
                                                    onPress={() => {
                                                        if (values.optionSixesColor !== "Green") {
                                                            values.optionSixesColor = "Green"
                                                            setOptionSixColor("Green")
                                                            console.log(values.optionSixesColor)
                                                        } else {
                                                            values.optionSixesColor = "Not Specified"
                                                            setOptionSixColor("")
                                                            console.log(values.optionSixesColor)
                                                        }
                                                    }}></GreenCheckBoxForColor>
                                                    <PurpleCheckBoxForColor style={{borderColor: optionSixColor == 'Purple' ? brand : colors.tertiary}} selectedState={optionSixColor} 
                                                    onPress={() => {
                                                        if (values.optionSixesColor !== "Purple") {
                                                            values.optionSixesColor = "Purple"
                                                            setOptionSixColor("Purple")
                                                            console.log(values.optionSixesColor)
                                                        } else {
                                                            values.optionSixesColor = "Not Specified"
                                                            setOptionSixColor("")
                                                            console.log(values.optionSixesColor)
                                                        }
                                                    }}></PurpleCheckBoxForColor>
                                                </PostHorizontalView>
                                                <ChangePollOptionColorButtons cancelButton={true} onPress={changePollSixColorChangeView}>
                                                    <ChangePollOptionColorButtonText cancelButton={true}>Close</ChangePollOptionColorButtonText>
                                                </ChangePollOptionColorButtons> 
                                            </ChangePollOptionColorView>
                                        </StyledFormArea>
                                        <PostHorizontalView centerAlign={true}>
                                            {optionSixVisible == false &&
                                                <TextLink addPollText={true} onPress={() => {
                                                    handleMessage('', 'FAILED')
                                                    if (optionThreeVisible == false) {
                                                        setOptionThreeVisible(true)
                                                        values.totalNumberOfOptions= "Three"
                                                    } else if (optionFourVisible == false) {
                                                        setOptionFourVisible(true)
                                                        values.totalNumberOfOptions= "Four"
                                                    } else if (optionFiveVisible == false) {
                                                        setOptionFiveVisible(true)
                                                        values.totalNumberOfOptions= "Five"
                                                    } else if (optionSixVisible == false) {
                                                        setOptionSixVisible(true)
                                                        values.totalNumberOfOptions= "Six"
                                                    } else {
                                                        handleMessage("Max options reached","FAILED");
                                                    }
                                                }}>
                                                    <TextLinkContent addPollText={true}>+ Add Option</TextLinkContent>
                                                </TextLink>
                                            }
                                            {optionThreeVisible == true &&
                                                <TextLink removePollText={true} onPress={() => {
                                                    handleMessage('', 'FAILED')
                                                    if (optionSixVisible == true) {
                                                        setOptionSixVisible(false)
                                                        values.totalNumberOfOptions = "Five"
                                                    } else if (optionFiveVisible == true) {
                                                        setOptionFiveVisible(false)
                                                        values.totalNumberOfOptions = "Four"
                                                    } else if (optionFourVisible == true) {
                                                        setOptionFourVisible(false)
                                                        values.totalNumberOfOptions = "Three"
                                                    } else if (optionThreeVisible == true) {
                                                        setOptionThreeVisible(false)
                                                        values.totalNumberOfOptions = "Two"
                                                    } else {
                                                        handleMessage("A poll requires a minimum of 2 options","FAILED");
                                                    }
                                                }}>
                                                    <TextLinkContent removePollText={true}>- Remove Option</TextLinkContent>
                                                </TextLink>
                                            }
                                        </PostHorizontalView>
                                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                            <Text style={{color: colors.tertiary, fontSize: 18, marginTop: 10, marginRight: 10}}>Allow screen capture</Text>
                                            <TouchableOpacity 
                                                onPress={() => {
                                                    values.sentAllowScreenShots == true ? values.sentAllowScreenShots = false : values.sentAllowScreenShots = true;
                                                    setScreenshotsAllowed(values.sentAllowScreenShots)
                                                }} 
                                                style={{width: 40, height: 40, borderColor: colors.borderColor, borderWidth: 3, justifyContent: 'center', alignItems: 'center'}}
                                            >
                                                <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', textAlignVertical: 'center'}}>{screenshotsAllowed == false ? '✕' : '✓'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <MsgBox type={messageType}>{message}</MsgBox>
                                        {!isSubmitting && (<StyledButton style={{backgroundColor: colors.brand}} onPress={handleSubmit}>
                                            <ButtonText> Submit </ButtonText>
                                        </StyledButton>)}

                                        {isSubmitting && (<StyledButton disabled={true}>
                                            <ActivityIndicator size="large" color={colors.primary} />
                                        </StyledButton>)}
                                    </StyledFormArea>)}
                            </Formik>
                        </InnerContainer>

                </StyledContainer>
            </KeyboardAvoidingScrollView>
        </KeyboardAvoidingWrapper_NoScrollview>
    );
}

const styles = StyleSheet.create({
    image: {
      flex: 1,
      justifyContent: "center"
    }
})

export default PollUploadPage;

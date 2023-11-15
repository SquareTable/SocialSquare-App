import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
    Navigator_BackButton,
    Colors,
    SearchBarArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    ProfileOptionsView,
    StyledFormArea,
    StyledButton,
    ButtonText
} from '../screenStylings/styling.js'
import Icon from 'react-native-vector-icons/Entypo';
import Constants from 'expo-constants';
import { RefreshAppStylingContext } from '../../components/RefreshAppStylingContext.js';

import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

import { Formik } from 'formik';

import KeyboardAvoidingWrapper_NoScrollview from '../../components/KeyboardAvoidingWrapper_NoScrollview.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppStylingContext } from '../../components/AppStylingContext.js';
import { SimpleStylingVersion } from '../../components/StylingVersionsFile.js';
import {CredentialsContext} from '../../components/CredentialsContext.js';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import TopNavBar from '../../components/TopNavBar.js';

const UserTextInput = ({label, icon, isPassword, ...props}) => {
    const {colors} = useTheme();
    return(
        <SearchBarArea>
            <LeftIcon style={{top: 30}}>
                <Octicons name={"pencil"} size={20} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput style={{backgroundColor: colors.primary, color: colors.tertiary, borderColor: colors.borderColor}} searchPage={true} {...props}/>
        </SearchBarArea>
    )
}

const SimpleStylingMenu = ({navigation, route}) => {
    const {dark, colors, indexNum} = useTheme()
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [NamingNewStyle, setNamingNewStyle] = useState(true);
    const [message, handleMessage] = useState('')
    const [simpleStylingData, setSimpleStylingData] = useState([])
    const [listOfDataGettingDeleted, setListOfDataGettingDeleted] = useState([])
    const [temp, setTemp] = useState()
    const {AppStylingContextState, setAppStylingContextState} = useContext(AppStylingContext);
    const {refreshAppStyling, setRefreshAppStyling} = useContext(RefreshAppStylingContext);
    const [amountOfStylesToGetUpdated, setAmountOfStylesToGetUpdated] = useState(0);
    const [stylingsThatNeedToBeUpdated, setStylingsThatNeedToBeUpdated] = useState([]);
    const [confirmUpdateScreenHidden, setConfirmUpdateScreenHidden] = useState(true)
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const [showRefreshButton, setShowRefreshButton] = useState(false);
    const [IndexNumStyleToRefresh, setIndexNumStyleToRefresh] = useState(null);
    const [refreshAppStylingAfterDelete, setRefreshAppStylingAfterDelete] = useState(false);
    const [versionMismatchScreenHidden, setVersionMismatchScreenHidden] = useState(true);
    const [versionMismatchScreenVersion, setVersionMismatchScreenVersion] = useState('');
    const [versionMismatchNewerOrOlder, setVersionMismatchNewerOrOlder] = useState(null);
    const [versionReleaseNotesHidden, setVersionReleaseNotesHidden] = useState(true);
    const [versionReleaseNotesVersion, setVersionReleaseNotesVersion] = useState(null);
    const [indexsOfStylesToUpdate, setIndexsOfStylesToUpdate] = useState([]);
    const [outdatedStyleWarningWhenEditingHidden, setOutdatedStyleWarningWhenEditingHidden] = useState(true);
    const isOnBuiltInStyling = useRef();
    if (storedCredentials) {var {displayName} = storedCredentials} else {var displayName = 'Guest'}
    const {ableToRefresh, indexNumToUse, backToProfileScreen} = route.params;
    if (IndexNumStyleToRefresh == null && indexNumToUse != null) {
        setIndexNumStyleToRefresh(indexNumToUse);
    }
    if (showRefreshButton == false && indexNumToUse != null && AppStylingContextState == indexNumToUse.toString()) {
        setShowRefreshButton(true);
    }
    if (indexNumToUse != null) {
        navigation.setParams({indexNumToUse: null});
    }
    if (ableToRefresh == true) {
        setRefreshAppStyling(true);
        navigation.setParams({ableToRefresh: false});
        async function getSimpleStylingData() {
            const data = await AsyncStorage.getItem('simpleStylingData');
            if (data != null) {
                setSimpleStylingData(JSON.parse(data));
            }
        }
        getSimpleStylingData();
    }

    if (AppStylingContextState == 'Default' || AppStylingContextState == 'Dark' || AppStylingContextState == 'Light' || AppStylingContextState == 'PureLight' || AppStylingContextState == 'PureDark') {
        isOnBuiltInStyling.current = true;
    } else {
        isOnBuiltInStyling.current = false;
    }

    const {darkLight, brand} = Colors;

    const handleNewCreation = (name) => {
        for (let i = 0; i < simpleStylingData.length; i++) {
            if (simpleStylingData[i].name == name) {
                handleMessage('You already have a simple style called ' + name + '. Please choose a different name.')
                return
            }
        }
        handleMessage('')
        setNamingNewStyle(true)
        const newStyle = {
            name, 
            indexNum: Date.now(), 
            dark: true,
            stylingType: 'simple',
            stylingVersion: 3,
            colors: {
                primary: colors.primary, 
                tertiary: colors.tertiary, 
                borderColor: colors.borderColor,
                background: colors.background,
                secondary: colors.secondary,
                darkLight: colors.darkLight,
                brand: colors.brand,
                green: colors.green,
                red: colors.red,
                darkest: colors.darkest,
                greyish: colors.greyish,
                bronzeRarity: colors.bronzeRarity,
                darkestBlue: colors.darkestBlue,
                StatusBarColor: colors.StatusBarColor,
                navFocusedColor: colors.navFocusedColor,
                navNonFocusedColor: colors.navNonFocusedColor,
                orange: colors.orange,
                yellow: colors.yellow,
                purple: colors.purple,
                slightlyLighterGrey: colors.slightlyLighterGrey,
                midWhite: colors.midWhite,
                slightlyLighterPrimary: colors.slightlyLighterPrimary,
                descTextColor: colors.descTextColor,
                errorColor: '#FF0000',
            }
        }
        setSimpleStylingData(simpleStylingData => {
            const newData = [...simpleStylingData, newStyle]
            AsyncStorage.setItem('simpleStylingData', JSON.stringify(newData))
            return newData
        })
        setTemp(temp => temp == 'abc' ? 'cba' : 'abc')
        setRefreshAppStyling(true);
    }

    useEffect(() => {
        async function getSimpleStylingData() {
            const data = await AsyncStorage.getItem('simpleStylingData');
            const data_parsed = JSON.parse(data);
            if (data != null) {
                setSimpleStylingData(data_parsed);
                calculateAmountOfStylesToUpdate(false)
            }
        }
        getSimpleStylingData()
    }, [])

    useEffect(() => {
        for (let i = 0; i < simpleStylingData.length; i++) {
            console.log(simpleStylingData[i].indexNum)
        }
    })

    const calculateAmountOfStylesToUpdate = (forceRefresh) => {
        async function getSimpleStylingData() {
            const data = await AsyncStorage.getItem('simpleStylingData');
            const data_parsed = JSON.parse(data);
            if (amountOfStylesToGetUpdated == 0 || forceRefresh == true) {
                setAmountOfStylesToGetUpdated(0)
                setTemp(temp => temp == 'abc' ? 'cba' : 'abc')
                setStylingsThatNeedToBeUpdated(stylingsThatNeedToBeUpdated => stylingsThatNeedToBeUpdated.splice(0, stylingsThatNeedToBeUpdated.length))
                setTemp(temp => temp == 'abc' ? 'cba' : 'abc')
                setIndexsOfStylesToUpdate([]);
                setTemp(temp => temp == 'abc' ? 'cba' : 'abc')
                for (let i = 0; i < data_parsed.length; i++) {
                    try {
                        if (data_parsed[i].stylingVersion < SimpleStylingVersion) {
                            setAmountOfStylesToGetUpdated(amountOfStylesToGetUpdated => amountOfStylesToGetUpdated += 1)
                            let temp_data = stylingsThatNeedToBeUpdated;
                            let temp_data_two = indexsOfStylesToUpdate;
                            temp_data.push({
                                name: data_parsed[i].name,
                                currentVersion: data_parsed[i].stylingVersion,
                                indexNum: data_parsed[i].indexNum
                            })
                            setStylingsThatNeedToBeUpdated(temp_data)
                            temp_data_two.push(data_parsed[i].indexNum.toString());
                        }
                    } catch (e) {
                        console.warn(e);
                    }
                }
                setAmountOfStylesToGetUpdated(amountOfStylesToGetUpdated => amountOfStylesToGetUpdated == 0 ? null : amountOfStylesToGetUpdated)
            }
        }
        getSimpleStylingData()
    }

    const initiateStyleUpdate = () => {
        console.log('Initiating style update');
        async function getSimpleStylingData() {
            let failedUpdates = [];
            let data = await AsyncStorage.getItem('simpleStylingData');
            let data_parsed = JSON.parse(data);
            let temp_data = [];
            for (let i = 0; i < data_parsed.length; i++) {
                if (data_parsed[i].stylingVersion == undefined) {
                    let {name, indexNum, dark, colors} = data_parsed[i];
                    let { primary, tertiary, borderColor, background, secondary, darkLight, brand, green, red, darkest, greyish, bronzeRarity, darkestBlue, StatusBarColor, navFocusedColor, navNonFocusedColor, orange, yellow, purple, slightlyLighterGrey, midWhite, slightlyLighterPrimary, descTextColor } = colors;
                    console.log(name)
                    confirmDelete(name, indexNum);
                    temp_data.push({
                        name: name,
                        indexNum: indexNum,
                        dark: dark,
                        stylingType: 'simple',
                        stylingVersion: 2,
                        colors: {
                            primary: primary,
                            tertiary: tertiary,
                            borderColor: borderColor,
                            background: background,
                            secondary: secondary,
                            darkLight: darkLight,
                            brand: brand,
                            green: green,
                            red: red,
                            darkest: darkest,
                            greyish: greyish,
                            bronzeRarity: bronzeRarity,
                            darkestBlue: darkestBlue,
                            StatusBarColor: StatusBarColor,
                            navFocusedColor: navFocusedColor,
                            navNonFocusedColor: navNonFocusedColor,
                            orange: orange,
                            yellow: yellow,
                            purple: purple,
                            slightlyLighterGrey: slightlyLighterGrey,
                            midWhite: midWhite,
                            slightlyLighterPrimary: slightlyLighterPrimary,
                            descTextColor: descTextColor,
                            errorColor: '#FF0000'
                        }
                    });
                } else if (data_parsed[i].stylingVersion == 2) {
                    let {name, indexNum, dark, colors} = data_parsed[i];
                    let { primary, tertiary, borderColor, background, secondary, darkLight, brand, green, red, darkest, greyish, bronzeRarity, darkestBlue, StatusBarColor, navFocusedColor, navNonFocusedColor, orange, yellow, purple, slightlyLighterGrey, midWhite, slightlyLighterPrimary, descTextColor, errorColor } = colors;
                    console.log(name)
                    confirmDelete(name, indexNum);
                    temp_data.push({
                        name: name,
                        indexNum: indexNum,
                        dark: dark,
                        stylingType: 'simple',
                        stylingVersion: 3,
                        colors: {
                            primary: primary,
                            tertiary: tertiary,
                            borderColor: borderColor,
                            background: background,
                            secondary: secondary,
                            darkLight: darkLight,
                            brand: brand,
                            green: green,
                            red: red,
                            darkest: darkest,
                            greyish: greyish,
                            bronzeRarity: bronzeRarity,
                            darkestBlue: darkestBlue,
                            StatusBarColor: StatusBarColor,
                            navFocusedColor: navFocusedColor,
                            navNonFocusedColor: navNonFocusedColor,
                            orange: orange,
                            yellow: yellow,
                            purple: purple,
                            slightlyLighterGrey: slightlyLighterGrey,
                            midWhite: midWhite,
                            slightlyLighterPrimary: slightlyLighterPrimary,
                            descTextColor: descTextColor,
                            errorColor: errorColor,
                        }
                    })
                }
            }
            data = await AsyncStorage.getItem('simpleStylingData');
            data_parsed = JSON.parse(data);
            for (let i = 0; i < stylingsThatNeedToBeUpdated.length; i++) {
                data_parsed.push(temp_data[i]);
            }
            AsyncStorage.setItem('simpleStylingData', JSON.stringify(data_parsed));
            setSimpleStylingData(data_parsed)
            console.log(temp_data);
            setConfirmUpdateScreenHidden(true);
            calculateAmountOfStylesToUpdate(true);
            for (let i = 0; i < failedUpdates.length; i++) {
                console.log('Error occured while trying to update style with name: ' + failedUpdates[i].name)
                alert('Error occured while trying to update style with name: ' + failedUpdates[i].name)
            }
        }
        getSimpleStylingData()
    }

    const cancelDelete = (indexNumber) => {
        for (let i = 0; i < listOfDataGettingDeleted.length; i++) {
            console.log(listOfDataGettingDeleted[i])
            if (listOfDataGettingDeleted[i] == indexNumber) {
                let tempData = listOfDataGettingDeleted;
                tempData.splice(i, 1)
                setListOfDataGettingDeleted(tempData)
                setTemp(temp => temp == 'abc' ? 'cba' : 'abc')
                calculateAmountOfStylesToUpdate(true)
                if (refreshAppStylingAfterDelete == true) {
                    setRefreshAppStyling(true);
                    setRefreshAppStylingAfterDelete(refreshAppStylingAfterDelete => refreshAppStylingAfterDelete == true ? false : false);
                    setTemp(temp => temp == 'abc' ? 'cba' : 'abc');
                }
            }
        }
    }

    const confirmDelete = async (name, indexNumber) => {
        for (let i = 0; i < simpleStylingData.length; i++) {
            console.log(simpleStylingData[i].indexNum)
            console.log(simpleStylingData)
            if (simpleStylingData[i].name == name) {
                let tempData = simpleStylingData;
                console.log(tempData)
                console.log(i)
                if (tempData[i].indexNum == AppStylingContextState) {
                    setAppStylingContextState('Default')
                    await AsyncStorage.setItem('AppStylingContextState', 'Default')
                    setRefreshAppStylingAfterDelete(true);
                }
                if (tempData[i].indexNum == IndexNumStyleToRefresh) {
                    setShowRefreshButton(false);
                }
                tempData.splice(i, 1)
                setSimpleStylingData(tempData)
                AsyncStorage.setItem('simpleStylingData', JSON.stringify(tempData))
                console.log(tempData)
                cancelDelete(indexNumber)
            }
        }
    }

    const handleForceStyleChange = (indexNum) => {
        setRefreshAppStyling(true);
        setAppStylingContextState(indexNum.toString())
        setIndexNumStyleToRefresh(null);
        AsyncStorage.setItem('App StylingContextState', indexNum.toString())
        setShowRefreshButton(showRefreshButton => showRefreshButton == true ? false : false)
        if (colors.primary != simpleStylingData[indexNum].colors.primary) {
            setRefreshAppStyling(true);
            setTemp(temp => temp == 'abc' ? 'cba' : 'abc')
        }
    }

    const handlePress = (indexNum, forceStyle) => {
        let indexNumToUse = undefined;
        for (let i = 0; i < simpleStylingData.length; i++) {
            if (simpleStylingData[i].indexNum == indexNum) {
                indexNumToUse = i
            }
        }
        if (indexNumToUse == undefined) {
            alert('An error occured. Sorry :(')
            console.warn(simpleStylingData)
            return
        }
        console.warn(simpleStylingData[indexNumToUse])
        if (forceStyle == true || SimpleStylingVersion == simpleStylingData[indexNumToUse].stylingVersion) {
            setRefreshAppStyling(true);
            setAppStylingContextState(indexNumToUse.toString())
            setIndexNumStyleToRefresh(null);
            AsyncStorage.setItem('AppStylingContextState', indexNum.toString())
            setShowRefreshButton(showRefreshButton => showRefreshButton == true ? false : false)
            if (colors.primary != simpleStylingData[indexNumToUse].colors.primary) {
                setRefreshAppStyling(true);
                setTemp(temp => temp == 'abc' ? 'cba' : 'abc');
            }
        } else if (SimpleStylingVersion < simpleStylingData[indexNumToUse].stylingVersion) {
            let stylingVersionUsed = simpleStylingData[indexNumToUse].stylingVersion;
            setVersionMismatchScreenVersion(stylingVersionUsed);
            setVersionMismatchNewerOrOlder('newer');
            setVersionMismatchScreenHidden(false);
        } else if (simpleStylingData[indexNumToUse].stylingVersion == undefined || SimpleStylingVersion > simpleStylingData[indexNumToUse].stylingVersion) {
            let stylingVersionUsed = simpleStylingData[indexNumToUse].stylingVersion;
            setVersionMismatchScreenVersion(stylingVersionUsed);
            setVersionMismatchNewerOrOlder('older');
            setVersionMismatchScreenHidden(false);
        } else {
            alert('An error occured. Sorry :(')
        }
    }

    const showVersionReleaseNotes = (version) => {
        setVersionReleaseNotesVersion(version);
        setVersionReleaseNotesHidden(false);
    }

    const showCannotEditStyleBecauseOfOutdatedStylingMessage = () => {
        setOutdatedStyleWarningWhenEditingHidden(false)
    }

    return (
        <KeyboardAvoidingWrapper_NoScrollview style={{backgroundColor: colors.primary}}>
            <>
                <TopNavBar 
                    screenName="Custom Styling"
                    leftIcon={
                        backToProfileScreen === true ? 
                            <Navigator_BackButton onPress={() => {navigation.replace('Welcome', {goToStylingMenu: false, backButtonHidden: true, imageFromRoute: null})}}>
                                <Octicons name={"x"} size={40} color={colors.tertiary}/>
                            </Navigator_BackButton>
                        : undefined
                    }
                    rightIcon={
                        confirmUpdateScreenHidden == true && versionMismatchScreenHidden == true && outdatedStyleWarningWhenEditingHidden == true &&
                        <TouchableOpacity onPress={() => {versionReleaseNotesHidden == true ? setNamingNewStyle(NamingNewStyle == true ? false : true) : setVersionReleaseNotesHidden(true)}} style={{position: 'absolute', right: versionReleaseNotesHidden == false ? 15 : NamingNewStyle == true ? 10 : 15, top: StatusBarHeight + 2}}>
                            {NamingNewStyle == true ?
                                versionReleaseNotesHidden == true ?
                                    <Icon name="plus" size={40} color={colors.tertiary}/>
                                :
                                    <Octicons name={"x"} size={40} color={colors.tertiary} />
                            :
                                <Octicons name={"x"} size={40} color={colors.tertiary} />
                            }
                        </TouchableOpacity>
                    }
                />
                <ProfileOptionsView style={{backgroundColor: colors.primary, justifyContent: 'space-around', alignItems: 'center'}} viewHidden={outdatedStyleWarningWhenEditingHidden}>
                    <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>This styling is outdated</Text>
                    <Text style={{color: colors.errorColor, fontSize: 18, textAlign: 'center'}}>You cannot edit this styling. If you want to be able to edit this style, please update it.</Text>
                    <StyledButton onPress={() => {setOutdatedStyleWarningWhenEditingHidden(true)}}>
                        <ButtonText>Go back</ButtonText>
                    </StyledButton>
                </ProfileOptionsView>
                <ProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={NamingNewStyle}>
                    <ScrollView style={{width: '92%', backgroundColor: colors.primary}}>
                        <Text style={{color: colors.tertiary, fontSize: 30, textAlign: 'center'}}>Create new styling</Text>
                        <Formik
                            initialValues={{name: ''}}
                            onSubmit={(values) => {
                                if (values.name == '') {
                                    handleMessage('Please fill all the fields.');
                                } else {
                                    handleNewCreation(values.name)
                                    values.name = ''
                                }
                            }}
                        >
                            {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                <>
                                    <View style={{marginLeft: '10%'}}>
                                        <StyledFormArea style={{width: '100%'}}>
                                            <UserTextInput
                                                placeholder="Name"
                                                placeholderTextColor={colors.tertiary}
                                                onChangeText={handleChange('name')}
                                                onBlur={handleBlur('name')}
                                                value={values.name}
                                                style={{backgroundColor: colors.primary, color: colors.tertiary, borderColor: colors.borderColor}}
                                            />
                                        </StyledFormArea>
                                    </View>
                                    <StyledButton onPress={() => {handleSubmit()}}>
                                        <ButtonText>Create</ButtonText>
                                    </StyledButton>
                                </>
                            )}
                        </Formik>
                        <Text style={{color: colors.errorColor, fontSize: 10, textAlign: 'center'}}>{message}</Text>
                    </ScrollView>
                </ProfileOptionsView>
                <ProfileOptionsView style={{backgroundColor: colors.primary, height: '80%'}} viewHidden={confirmUpdateScreenHidden}>
                    <FlatList
                        data={stylingsThatNeedToBeUpdated}
                        keyExtractor={(item, index) => 'key'+index}
                        ListHeaderComponent={
                            <View style={{borderColor: colors.borderColor, borderBottomWidth: 5, marginBottom: 10}}>
                                <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginHorizontal: 5}}>{amountOfStylesToGetUpdated == 1 ? 'Style' : 'Styles'} that {amountOfStylesToGetUpdated == 1 ? 'needs' : 'need'} to be updated</Text>
                            </View>
                        }
                        renderItem={({item, index}) => (
                            <View style={{borderColor: colors.borderColor, borderWidth: 2, borderRadius: 10, marginVertical: 5}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{item.name}</Text>
                                <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center'}}>Current version: V{item.currentVersion || ' ERROR'}</Text>
                            </View>
                        )}
                        ListFooterComponent={
                            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                {/*indexsOfStylesToUpdate.includes(AppStylingContextState)*/ isOnBuiltInStyling.current == false ? <Text style={{color: colors.errorColor ? colors.errorColor : 'red', fontSize: 14, textAlign: 'center'}}>Before the update can begin, you will have to switch to default styling.</Text> : null}
                                {isOnBuiltInStyling.current == false ? 
                                        <StyledButton onPress={() => {
                                            setAppStylingContextState('Default');
                                            AsyncStorage.setItem('AppStylingContextState', 'Default');
                                        }}>
                                            <ButtonText>Set SocialSquare to default style</ButtonText>
                                        </StyledButton>
                                :
                                <StyledButton onPress={initiateStyleUpdate}>
                                    <ButtonText>Update {amountOfStylesToGetUpdated == 1 ? 'style' : 'stylings'}</ButtonText>
                                </StyledButton>
                                }
                                <StyledButton onPress={() => {setConfirmUpdateScreenHidden(true)}}>
                                    <ButtonText>Cancel update</ButtonText>
                                </StyledButton>
                            </View>
                        }
                    />
                </ProfileOptionsView>
                <ProfileOptionsView style={{backgroundColor: colors.primary}} viewHidden={versionMismatchScreenHidden}>
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.errorColor, fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginHorizontal: 10}}>This style is version {versionMismatchScreenVersion || 'ERROR'} and this version of SocialSquare only supports custom styles with version {SimpleStylingVersion}.</Text>
                        <Text style={{color: colors.errorColor, fontSize: 16, textAlign: 'center', marginHorizontal: 10}}>{versionMismatchNewerOrOlder == 'older' ? 'Please update SocialSquare and this style to the latest version for this styling to be fully supported.' : versionMismatchNewerOrOlder == 'newer' ? 'Please update SocialSquare to the latest version for this style to be fully supported.' : 'ERROR OCCURED'}</Text>
                        <StyledButton onPress={() => {setVersionMismatchScreenHidden(true)}} style={{backgroundColor: colors.brand}}>
                            <ButtonText style={{color: colors.tertiary}}>Take me back</ButtonText>
                        </StyledButton>
                    </View>
                </ProfileOptionsView>
                <ProfileOptionsView style={{backgroundColor: colors.primary, height: '80%'}} viewHidden={versionReleaseNotesHidden}>
                    <View style={{width: '90%', height: '100%'}}>
                        <ScrollView>
                            <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>{versionReleaseNotesVersion == 2 || versionReleaseNotesVersion == undefined ? 'Release Notes for simple styling version ' + versionReleaseNotesVersion : null}</Text>
                            {versionReleaseNotesVersion == 2 ?
                                <>
                                    <Text style={{color: colors.tertiary, fontSize: 22, fontWeight: 'bold', marginBottom: 7, marginTop: 25}}>Frontend changes -</Text>
                                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginVertical: 7}}>{`\u2022 Added ability to change all app colours instead of just background, text, and border colour`}</Text>
                                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginVertical: 7}}>{`\u2022 Added Error Colour`}</Text>
                                    <Text style={{color: colors.tertiary, fontSize: 22, fontWeight: 'bold', marginVertical: 7}}>Backend changes -</Text>
                                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginVertical: 7}}>{`\u2022 Added app styling updater`}</Text>
                                </>
                            :
                                versionReleaseNotesVersion == undefined ?
                                    <>
                                        <Text style={{color: colors.tertiary, fontSize: 22, fontWeight: 'bold', marginBottom: 7, marginTop: 25}}>Frontend changes -</Text>
                                        <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginVertical: 7}}>{`\u2022 Added simple styling creation, allowing you to create your own styles and change the background, text and image, and border colour of the app`}</Text>
                                        <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginVertical: 7}}>{`\u2022 Added pure light and pure dark styles to the built-in styling menu`}</Text>
                                    </>
                                :
                                    versionReleaseNotesVersion == 3 ?
                                        <>
                                            <Text style={{color: colors.tertiary, fontSize: 22, fontWeight: 'bold', marginVertical: 7}}>Backend changes -</Text>
                                            <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginVertical: 7}}>{`\u2022 Fixed app crashing bugs that were caused from custom stylings`}</Text>
                                        </>
                                    :
                                        <Text style={{color: colors.errorColor, fontSize: 30, fontWeight: 'bold', marginHorizontal: 20, marginTop: '80%', textAlign: 'center'}}>Error occured</Text>
                            }
                        </ScrollView>
                    </View>
                </ProfileOptionsView>
                <View style={{height: '100%', backgroundColor: colors.primary}}>
                    <FlatList
                        data={simpleStylingData}
                        keyExtractor={(item, index) => 'key'+index}
                        ListHeaderComponent={
                            <>
                                {amountOfStylesToGetUpdated != null && confirmUpdateScreenHidden == true && versionMismatchScreenHidden == true && versionReleaseNotesHidden == true && amountOfStylesToGetUpdated != 0 && outdatedStyleWarningWhenEditingHidden == true && NamingNewStyle == true &&
                                    <TouchableOpacity onPress={() => {confirmUpdateScreenHidden == true ? setConfirmUpdateScreenHidden(false) : setConfirmUpdateScreenHidden(true)}} style={{padding: 5, backgroundColor: colors.primary, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderColor: colors.borderColor, borderWidth: 3, borderRadius: 10, marginBottom: 10}}>
                                        <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>{displayName || 'Cannot find name'} has {amountOfStylesToGetUpdated} {amountOfStylesToGetUpdated == 1 ? 'style' : 'stylings'} that {amountOfStylesToGetUpdated == 1 ? 'needs' : 'need'} to be updated to V{SimpleStylingVersion}</Text>
                                        <Text style={{fontSize: 16, color: colors.tertiary, textAlign: 'center'}}>Press this button to update {amountOfStylesToGetUpdated == 1 ? 'it' : 'all of them'}</Text>
                                    </TouchableOpacity>
                                }
                                {showRefreshButton == true &&
                                    <TouchableOpacity onPress={() => handlePress(IndexNumStyleToRefresh, false)} style={{padding: 5, backgroundColor: colors.primary, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderColor: colors.borderColor, borderWidth: 3, borderRadius: 10, marginBottom: 10}}>
                                        <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center', marginBottom: 5}}>Styling needs to be refreshed for your changes to take effect</Text>
                                        <Text style={{fontSize: 14, color: colors.tertiary, textAlign: 'center'}}>Please press this button for the changes to take effect</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                        ListEmptyComponent={
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '50%'}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>There are no custom stylings here.</Text>
                                <StyledButton onPress={() => {setNamingNewStyle(NamingNewStyle == true ? false : true)}}>
                                    <ButtonText>Create a new style</ButtonText>
                                </StyledButton>
                            </View>
                        }
                        renderItem={({ item, index }) => ( 
                            <>
                                {confirmUpdateScreenHidden == true && versionMismatchScreenHidden == true && versionReleaseNotesHidden == true && item && outdatedStyleWarningWhenEditingHidden == true && NamingNewStyle == true &&
                                    <View style={{borderColor: colors.borderColor, borderWidth: 3, flex: 1, paddingVertical: listOfDataGettingDeleted.includes(index) ? 0 : 15, flexDirection: 'row', borderTopWidth: index != 0 ? 1.5 : 3, borderBottomWidth: simpleStylingData.length - 1 == index ? 3 : 1.5, primaryColor: colors.primary}}>
                                        {!listOfDataGettingDeleted.includes(index) && (
                                            <>
                                                <TouchableOpacity style={{flexDirection: 'row', width: '100%'}} onPress={() => {handlePress(item.indexNum, false)}}>
                                                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold'}}>{item.name}</Text>
                                                    <TouchableOpacity onPress={() => {showVersionReleaseNotes(item.stylingVersion)}} style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                                                        <Text style={{borderColor: colors.borderColor, borderWidth: 1, borderRadius: 5, color: colors.tertiary, textAlign: 'center', marginLeft: 5, padding: 5}}>V{item.stylingVersion || ' ERROR'}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {item.stylingVersion == SimpleStylingVersion ? navigation.navigate('EditSimpleStyle', {name: item.name, indexNum: item.indexNum, type: null, dark: item.dark, stylingType: item.stylingType, stylingVersion: item.stylingVersion, primary: item.colors.primary, tertiary: item.colors.tertiary, borderColor: item.colors.borderColor, background: item.colors.background, secondary: item.colors.secondary, darkLight: item.colors.darkLight, brand: item.colors.brand, green: item.colors.green, red: item.colors.red, darkest: item.colors.darkest, greyish: item.colors.greyish, bronzeRarity: item.colors.bronzeRarity, darkestBlue: item.colors.darkestBlue, StatusBarColor: item.colors.StatusBarColor, navFocusedColor: item.colors.navFocusedColor, navNonFocusedColor: item.colors.navNonFocusedColor, orange: item.colors.orange, yellow: item.colors.yellow, purple: item.colors.purple, slightlyLighterGrey: item.colors.slightlyLighterGrey, midWhite: item.colors.midWhite, slightlyLighterPrimary: item.colors.slightlyLighterPrimary, descTextColor: item.colors.descTextColor, errorColor: item.colors.errorColor, backToProfileScreen: backToProfileScreen}) : showCannotEditStyleBecauseOfOutdatedStylingMessage()}} style={{position: 'absolute', right: 45, top: -7}}>
                                                        <Octicons name={"pencil"} size={40} color={colors.brand} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {setListOfDataGettingDeleted(listOfDataGettingDeleted => [...listOfDataGettingDeleted, index])}} style={{position: 'absolute', right: 10, top: -7}}>
                                                        <Octicons name={"x"} size={40} color={colors.brand} />
                                                    </TouchableOpacity>
                                                        {console.log('indexNum is : ' + indexNum)}
                                                        {console.log('index is : ' + index)}
                                                        {console.log('indexNum is the same as index ' + (indexNum == index))}
                                                        <View style={{backgroundColor: colors.borderColor, minHeight: 45, height: 45, maxHeight: 45, minWidth: 45, width: 45, maxWidth: 45, borderRadius: 45/2, borderColor: indexNum == index ? colors.brand : colors.tertiary, borderWidth: 2, position: 'absolute', right: 85, top: -8}}>
                                                            {indexNum == index && (
                                                                <View style={{backgroundColor: colors.tertiary, marginTop: 5, marginLeft: 5.5, minHeight: 30, height: 30, maxHeight: 30, minWidth: 30, width: 30, maxWidth: 30, borderRadius: 30/2}}/>
                                                            )}
                                                        </View>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                        {listOfDataGettingDeleted.includes(index) && (
                                            <>
                                                <TouchableOpacity onPress={() => {cancelDelete(index)}} style={{backgroundColor: 'red', width: '50%', paddingVertical: 20}}>
                                                    <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>Cancel</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {confirmDelete(item.name, index)}} style={{backgroundColor: 'green', width: '50%', paddingVertical: 20}}>
                                                    <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>Confirm</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                }
                            </>
                        )}
                    />
                </View>
            </>
        </KeyboardAvoidingWrapper_NoScrollview>
    );
}

export default SimpleStylingMenu;
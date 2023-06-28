import React, {useState, useContext} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Image, Dimensions, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/AntDesign';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    TextLink,
    TextLinkContent
} from '../screenStylings/styling.js';

const IntroScreen = ({navigation}) => {
    const styles = StyleSheet.create({
        buttonCircle: {
          width: 40,
          height: 40,
          backgroundColor: 'rgba(0, 0, 0, .2)',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
    });
    const renderNextButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Icon
              name="right"
              color={colors.tertiary}
              size={24}
            />
          </View>
        );
    };
    const renderBackButton = () => {
        return (
          <View style={styles.buttonCircle}>
            <Icon
              name="left"
              color={colors.tertiary}
              size={24}
            />
          </View>
        );
    };
    const renderSkipButton = () => {
        return(
            <View style={{borderRadius: 10, borderWidth: 1.5, borderColor: colors.tertiary, backgroundColor: colors.primary, width: 80, height: 40}}>
                <Text style={{color: colors.tertiary, textAlign: 'center', textAlignVertical: 'center', paddingTop: 10}}>Skip</Text>
            </View>
        );
    }
    const renderDoneButton = () => {
        return(
            <View style={{borderRadius: 10, borderWidth: 1.5, borderColor: colors.tertiary, backgroundColor: colors.primary, width: 80, height: 40}}>
                <Text style={{color: colors.tertiary, textAlign: 'center', textAlignVertical: 'center', paddingTop: 10}}>Done</Text>
            </View>
        );
    }
    const slides = [
        {
          key: 'one',
          title: 'Introduction',
          text: "Welcome to SocialSquare!\n\nThe open-source social media platform that doesn't mine or sell your data and is privacy-focused!",
          image: require('../../assets/NewLogo_WithBackground.png'),
          backgroundColor: '#59b2ab',
          comingSoon: false
        },
        {
          key: 'two',
          title: 'Security',
          text: 'Security and Privacy is our top priority at SocialSquare.\n\nAll chats within SocialSquare use 256-bit end-to-end encryption, making sure that only you can read your messages and no one else. Not even SocialSquare can read them.',
          image: require('../../assets/favicon.png'),
          backgroundColor: '#febe29',
          comingSoon: false
        },
        {
          key: 'three',
          title: 'Data Collection',
          text: "SocialSquare is completely transparent with it's business practices, and we do not mine user data.\n\nWe only gather the essentials to run the service, such as who follows you, who likes your posts, etc.\n\nFor more information please visit our ",
          image: require('../../assets/favicon.png'),
          backgroundColor: '#22bcb5',
          comingSoon: false
        },
        {
            key: 'four',
            title: 'Ready To Go',
            text: 'You can now use SocialSquare!\n\n\nBefore you start using the app, you may want to take a look at our ',
            image: require('../../assets/favicon.png'),
            backgroundColor: '#22bcb5',
            comingSoon: false
          }
    ];
    const {colors, dark} = useTheme();
    const windowHeight = Dimensions.get('window').height;
    const [webBrowserResult, setWebBrowserResult] = useState(null);
    const goToLink = async (linkToGoTo) => {
        let result = await WebBrowser.openBrowserAsync(linkToGoTo);
        setWebBrowserResult(result);
      };
    const renderSlide = ({item}) => {
        return (
            <SafeAreaView style={{backgroundColor: colors.primary, height: '100%'}}>
                <Text style={{color: colors.tertiary, fontWeight: 'bold', fontSize: 24, textAlign: 'center', marginTop: 30}}>{item.title}</Text>
                {item.key == "two"? <Icon name="lock" size={200} color={colors.tertiary} style={{alignSelf: 'center'}}/> :
                item.key == "three"? <Icon name="Safety" size={200} color={colors.tertiary} style={{alignSelf: 'center'}}/> :
                item.key == "four"? <Icon name="check" size={200} color={colors.tertiary} style={{alignSelf: 'center'}}/> :
                <Image source={item.image} style={{height: 200, width: 200, alignSelf: 'center'}}/>}
                <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginHorizontal: 20}}>{item.text}</Text>
                {item.key == "three" ? 
                <TextLink onPress={() => {goToLink('https://squaretable.github.io/SocialSquare-App/PrivacyPolicy')}}>
                    <TextLinkContent style={{color: colors.brand, fontSize: 18}}>Privacy Policy</TextLinkContent>
                </TextLink> : 
                item.key == "four" ? 
                <TextLink onPress={() => {goToLink('https://squaretable.github.io/social-media-platform/TermsAndConditions')}}>
                    <TextLinkContent style={{color: colors.brand, fontSize: 18}}>Terms of Service</TextLinkContent>
                </TextLink> :
                null}
                {item.comingSoon == true? 
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
                    <Icon
                        name="warning"
                        color={colors.tertiary}
                        size={60}
                    />
                    <Text style={{color: colors.tertiary, fontSize: 24, textAlign: 'center', marginHorizontal: 20, paddingTop: 17, fontWeight: 'bold'}}>COMING SOON</Text>
                </View>
                : null}
            </SafeAreaView>
        );
    }
    return(
        <AppIntroSlider 
            showSkipButton={true} 
            showPrevButton={true} 
            renderItem={renderSlide} 
            data={slides} 
            onDone={async () => {await AsyncStorage.getItem('HasOpenedSocialSquare') == 'true' ? navigation.replace('Tabs', {screen: 'Profile', params: {backButtonHidden: true, imageFromRoute: null, goToStylingMenu: false}}) : navigation.replace('Login_Screen')}}
            activeDotStyle={{backgroundColor: colors.tertiary}}
            dotStyle={{backgroundColor: colors.borderColor}}
            renderNextButton={renderNextButton}
            renderPrevButton={renderBackButton}
            renderSkipButton={renderSkipButton}
            renderDoneButton={renderDoneButton}
        />
    );
}

export default IntroScreen;
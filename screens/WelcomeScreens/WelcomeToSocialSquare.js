import React, {useRef, useContext} from 'react';
import {View, Animated, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext';

const WelcomeToSocialSquareScreen = ({navigation, route}) => {
    const {colors} = useTheme();
    const {navigateMethod, refreshTokenId} = route.params;
    const welcomeTextScale = useRef(new Animated.Value(0.7)).current;
    const algorithmTextScale = useRef(new Animated.Value(0.7)).current;
    const SocialSquareLogoScale = useRef(new Animated.Value(0.7)).current;
    const ButtonsScale = useRef(new Animated.Value(0.7)).current;
    const StatusBarHeight = useContext(StatusBarHeightContext)
    const {width: appWidth} = Dimensions.get('window');

    const runAnimations = () => {
        Animated.parallel([
            Animated.timing(welcomeTextScale, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.delay(500),
                Animated.timing(algorithmTextScale, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1000),
                Animated.timing(SocialSquareLogoScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1500),
                Animated.timing(ButtonsScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ]).start();
    }

    const goToNextScreen = () => {
        //When accounts are created the algorithm is turned off by default so you do not need to send a request to the server to turn it off
        navigation.replace('LoginActivitySettings', {navigateMethod: navigateMethod, refreshTokenId});
    }

    return (
        <View style={{alignItems: 'center', marginTop: StatusBarHeight + 20, justifyContent: 'space-between', flex: 1, marginBottom: 40}} onLayout={runAnimations}>
            <View>
                <Animated.View style={{transform: [{scale: welcomeTextScale}], opacity: welcomeTextScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]}), marginHorizontal: 10, marginBottom: 15}}>
                    <Text style={{color: colors.tertiary, fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>Welcome to SocialSquare!</Text>
                </Animated.View>
                <Animated.View style={{transform: [{scale: algorithmTextScale}], opacity: algorithmTextScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]}), marginHorizontal: 10}}>
                    <Text style={{color: colors.tertiary, textAlign: 'center', marginBottom: 8, fontSize: 18}}>Would you like the posts you see to be shown by an algorithm or shown at random?</Text>
                    <Text style={{color: colors.tertiary, textAlign: 'center'}}>You can always turn on or off the algorithm in settings at any time.</Text>
                </Animated.View>
            </View>
            <Animated.View style={{transform: [{scale: SocialSquareLogoScale}], opacity: SocialSquareLogoScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]})}}>
                <Image
                    source={require('../../assets/NewLogo_WithBackground.png')}
                    style={{width: appWidth / 2, aspectRatio: 1 / 1}}
                />
            </Animated.View>
            <Animated.View style={{height: 100, transform: [{scale: ButtonsScale}], opacity: ButtonsScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]})}}>
                <TouchableOpacity onPress={() => {navigation.replace('Algorithm_HomeScreenSettings', {navigateMethod: navigateMethod, refreshTokenId})}} style={{justifyContent: 'center', borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3, marginBottom: 20, paddingHorizontal: 15, paddingVertical: 10}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Use Algorithm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToNextScreen} style={{justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3, paddingHorizontal: 15, paddingVertical: 10}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Show Posts at Random</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

export default WelcomeToSocialSquareScreen
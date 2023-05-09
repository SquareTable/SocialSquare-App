import React, {useRef, useContext} from 'react';
import {View, Animated, Text, Image, TouchableOpacity} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext';

const TransferFromOtherPlatformsScreen = ({navigation, route}) => {
    const {colors} = useTheme();
    if (route.params) {var {navigateMethod} = route.params} else {var navigateMethod = 'reset'}
    const transferTextScale = useRef(new Animated.Value(0.7)).current;
    const smallerTransferTextScale = useRef(new Animated.Value(0.7)).current;
    const InstagramButtonScale = useRef(new Animated.Value(0.7)).current;
    const FacebookButtonScale = useRef(new Animated.Value(0.7)).current;
    const TikTokButtonScale = useRef(new Animated.Value(0.7)).current;
    const SkipButtonScale = useRef(new Animated.Value(0.7)).current;
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const runAnimations = () => {
        Animated.parallel([
            Animated.timing(transferTextScale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.delay(500),
                Animated.timing(smallerTransferTextScale, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1000),
                Animated.timing(FacebookButtonScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1200),
                Animated.timing(InstagramButtonScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1400),
                Animated.timing(TikTokButtonScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(1600),
                Animated.timing(SkipButtonScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ]).start();
    }

    const goToNextScreen = () => {
        if (navigateMethod == 'pop') {
            navigation.pop(2);
        } else {
            navigation.reset({
                index: 0,
                routes: [{name: 'Tabs'}],
            });
        }
    }

    return (
        <View style={{alignItems: 'center', marginTop: StatusBarHeight + 20, justifyContent: 'space-between', flex: 1, marginBottom: 40}} onLayout={runAnimations}>
            <View>
                <Animated.View style={{transform: [{scale: transferTextScale}], opacity: transferTextScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]}), marginHorizontal: 10, marginBottom: 15}}>
                    <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>Would you like to transfer your data from other platforms over to SocialSquare?</Text>
                </Animated.View>
                <Animated.View style={{transform: [{scale: smallerTransferTextScale}], opacity: smallerTransferTextScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]}), marginHorizontal: 10}}>
                    <Text style={{color: colors.tertiary, textAlign: 'center', marginBottom: 8, fontSize: 16}}>You can make your SocialSquare account have all of your posts from other platforms with one press of a button to make switching to SocialSquare a breeze.</Text>
                </Animated.View>
            </View>
            <View>
                <Animated.View style={{transform: [{scale: FacebookButtonScale}], opacity: FacebookButtonScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]})}}>
                    <TouchableOpacity onPress={() => {alert('Coming soon')}} style={{height: 60, paddingHorizontal: 20, borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../assets/facebook.png')} style={{width: 30, height: 30}}/>
                        <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', marginLeft: 10}}>Transfer data from Facebook</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{marginVertical: 15, transform: [{scale: InstagramButtonScale}], opacity: InstagramButtonScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]})}}>
                    <TouchableOpacity onPress={() => {alert('Coming soon')}} style={{height: 50, paddingHorizontal: 20, borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../assets/instagram.png')} style={{width: 30, height: 30}}/>
                        <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', marginLeft: 10}}>Transfer data from Instagram</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{transform: [{scale: TikTokButtonScale}], opacity: TikTokButtonScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]})}}>
                    <TouchableOpacity onPress={() => {alert('Coming soon')}} style={{height: 60, paddingHorizontal: 20, borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../../assets/tiktok.png')} style={{width: 30, height: 30}}/>
                        <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', marginLeft: 10}}>Transfer data from TikTok</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{marginTop: 15, transform: [{scale: SkipButtonScale}], opacity: SkipButtonScale.interpolate({inputRange: [0.7, 1], outputRange: [0, 1]})}}>
                    <TouchableOpacity onPress={goToNextScreen} style={{height: 60, paddingHorizontal: 20, borderRadius: 10, borderColor: colors.borderColor, borderWidth: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', marginLeft: 10}}>Skip</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            <View>
                <Text style={{color: colors.tertiary, textAlign: 'center', fontSize: 12}}>TikTok® and it's logo are registered trademarks of ByteDance Ltd.</Text>
                <Text style={{color: colors.tertiary, textAlign: 'center', fontSize: 12, marginVertical: 10}}>Instagram® and it's logo are registered trademarks of Meta Platforms Inc.</Text>
                <Text style={{color: colors.tertiary, textAlign: 'center', fontSize: 12}}>Facebook® and it's logo are registered trademarks of Meta Platforms Inc.</Text>
            </View>
        </View>
    )
}

export default TransferFromOtherPlatformsScreen;
import React, { useContext, useState } from 'react';
import {useTheme} from '@react-navigation/native';
import { ExperimentalFeaturesEnabledContext } from '../components/ExperimentalFeaturesEnabledContext';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
} from './screenStylings/styling.js';
import {View, Text, Switch, Image, TouchableOpacity} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';

const ExperimentalFeatures = ({navigation}) => {
    const {colors, dark} = useTheme();
    const {experimentalFeaturesEnabled, setExperimentalFeaturesEnabled} = useContext(ExperimentalFeaturesEnabledContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const handleValueChange = (value) => {
        AsyncStorage.setItem('ExperimentalFeaturesEnabled', String(value));
        setExperimentalFeaturesEnabled(value);
    }

    return (
        <>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Experimental Features</TestText>
            </ChatScreen_Title>
            <Text style={{color: colors.tertiary, fontSize: 16, marginVertical: 10, textAlign: 'center', marginHorizontal: 10}}>Experimental features are features that we are working on bringing to SocialSquare to bring a better experience to you. Some features may be broken, not work as intended, or may perform slowly. You can turn these features on at your own risk. Please send us feedback and report any bugs you experience on <TouchableOpacity onPress={() => {Linking.openURL('https://github.com/SquareTable/social-media-platform/issues/new?assignees=&labels=&template=bug-report.md&title=Write+Bug+Title+here')}}><Text style={{color: colors.brand, textDecorationLine: 'underline', textDecorationColor: colors.brand, fontWeight: 'bold'}}>SocialSquare's GitHub page.</Text></TouchableOpacity></Text>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Octicons name="beaker" size={100} color={colors.tertiary} />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20}}>
                    <Text style={{color: colors.tertiary, fontSize: 24, fontWeight: 'bold'}}>Experimental Features</Text>
                    <Switch
                        value={experimentalFeaturesEnabled}
                        onValueChange={(value) => {
                            handleValueChange(value);
                            alert('Please restart SocialSquare for all changes to take effect.');
                        }}
                        trackColor={{false: colors.borderColor, true: colors.darkestBlue}}
                        thumbColor={experimentalFeaturesEnabled ? dark ? colors.teritary : colors.primary : colors.teritary}
                        ios_backgroundColor={colors.borderColor}
                        style={{marginLeft: 10}}
                    />
                </View>
            </View>
        </>
    )
}

export default ExperimentalFeatures;
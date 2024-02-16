import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@react-navigation/native';

import {
    BackgroundDarkColor,
    FlexRow,
    LeftButton_AudioUploadScreen,
    RightButton_AudioUploadScreen,
    AudioUploadScreenUploadButtons,
} from '../screenStylings/styling.js';

import { Image, TouchableOpacity, Text, View } from 'react-native';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import TopNavBar from '../../components/TopNavBar.js';



const AudioUploadPage = ({navigation}) => {
    const {colors, dark} = useTheme();
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const uploadAudioSnippetFromFile = () => {
        alert("Coming soon")
    }
    alert('Audio posting functionality coming soon')
    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
                <BackgroundDarkColor style={{backgroundColor: colors.primary}}>
                    <TopNavBar screenName="Audio Post Screen"/>
                        <View style={{backgroundColor: colors.primary}}>
                            <AudioUploadScreenUploadButtons>
                                <FlexRow>
                                    <LeftButton_AudioUploadScreen>
                                        <TouchableOpacity onPress={() => {navigation.navigate("RecordAudioPage")}}>
                                            <Image
                                                style={{width: 125, height: 125}}
                                                source={dark ? require("../../assets/record_button.png") : require('../../assets/lightmode_recordbutton.png')}
                                                resizeMode="contain"
                                                resizeMethod="resize"
                                            />
                                            <Text style={{textAlign: 'center', color: colors.tertiary, fontWeight: 'bold', fontSize: 14}}>Record audio</Text>
                                        </TouchableOpacity>
                                    </LeftButton_AudioUploadScreen>
                                    <RightButton_AudioUploadScreen>
                                        <TouchableOpacity onPress={uploadAudioSnippetFromFile}>
                                            <Image
                                                style={{width: 125, height: 125, tintColor: colors.tertiary}}
                                                source={require("../../assets/app_icons/upload_arrow.png")}
                                                resizeMode="contain"
                                                resizeMethod="resize"
                                            />
                                            <Text style={{textAlign: 'center', color: colors.tertiary, fontWeight: 'bold', fontSize: 14}}>Upload audio file</Text>
                                        </TouchableOpacity>
                                    </RightButton_AudioUploadScreen>
                                </FlexRow>
                            </AudioUploadScreenUploadButtons>
                        </View>
                </BackgroundDarkColor>
        </>
    );
}

export default AudioUploadPage;

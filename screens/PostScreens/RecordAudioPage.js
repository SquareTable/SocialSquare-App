import React, {useContext, useState, useEffect, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import {
    StyledButton,
    ButtonText,
    BackgroundDarkColor,
    TestText
} from '../screenStylings/styling.js';

//credentials context
import { Image, TouchableOpacity, View, Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants'
import * as Linking from 'expo-linking';
import 'expo-intent-launcher'
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import TopNavBar from '../../components/TopNavBar.js';



const RecordAudioPage = ({navigation}) => {
     //context

        /* Start of audio recording code */
        const [timeSpentRecording, setTimeSpentRecording] = useState(null);
        const [secondsDisplay, setSecondsDisplay] = useState(null);
        const [minutesDisplay, setMinutesDisplay] = useState(null);
        const [hoursDisplay, setHoursDisplay] = useState(null);
        const [playRecording, setPlayRecording] = useState();
        const [playbackStatus, setPlaybackStatus] = useState(undefined);
        const [isAudioPlaying, setIsAudioPlaying] = useState(false);
        const [recordButtonDisabled, setRecordButtonDisabled] = useState(false);
        const [playButtonDisabled, setPlayButtonDisabled] = useState(false);

        const StatusBarHeight = useContext(StatusBarHeightContext);

        console.log(timeSpentRecording);

        const pkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package 
        : 'host.exp.exponent'

        const onChangeRecordingStatus = (status) => {
            if (status.isDoneRecording !== true) { // Prevent time spent recording being set to 0 when recording has finished
                var recordingDuration = status.durationMillis % 1000;
                recordingDuration = status.durationMillis - recordingDuration;
                recordingDuration = recordingDuration / 1000;
                console.log("Recording has gone on for " + recordingDuration);
                setTimeSpentRecording(recordingDuration);
                var d = Number(status.durationMillis / 1000);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
                console.log(status)
            
                setHoursDisplay(h > 0 ? h + (h == 1 ? m == '' ? " hour " : " hour, " : m != '' ? " hours " : " hours, ") : "")
                setMinutesDisplay(m > 0 ? m + (m == 1 ? s == '' ? " minute " : " minute, and " : s != '' ? " minutes" : "minutes, and ") : "")
                setSecondsDisplay(s > 0 ? s + (s == 1 ? " second" : " seconds") : "")
            }
        }

        const [recording, setRecording] = useState();
        const [recordingStatus, setRecordingStatus] = useState(false);

        async function startRecording() {
            try {
                setRecordButtonDisabled(true);
                if (playbackStatus && isAudioPlaying == true) {
                    alert("Stop the audio from playing before making a new recording");
                    setRecordButtonDisabled(false);
                    setRecordingStatus(false);
                    return;
                }
                console.log('Requesting permissions..');
                await Audio.requestPermissionsAsync();
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                }); 
                console.log('Starting recording..');
                setPlaybackStatus(undefined);
                setPlayRecording(undefined);
                const { recording, status } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );
                setRecording(recording);
                setRecordingStatus(true);
                recording.setOnRecordingStatusUpdate((status) => {onChangeRecordingStatus(status)});
                setRecordButtonDisabled(false);
                console.log('Recording started');
            } catch (err) {
                console.error('Failed to start recording', err);
                var {status} = await Audio.requestPermissionsAsync();
                if (status == 'denied') {
                    Alert.alert(
                        "No Microphone Permission",
                        "SocialSquare does not have microphone permissions enabled. If you want to record audio, you will have to go into Settings and enable microphone permission for SocialSquare.",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Settings",
                            onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('app-settings:')
                                } else if (Platform.OS === 'android') {
                                    IntentLauncher.startActivityAsync(
                                        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                                        { data: 'package:' + pkg },
                                    )
                                } else {
                                    alert('Platform not supported')
                                }
                          },
                        },
                      ],
                    );
                }
                setRecordButtonDisabled(false);
                setRecordingStatus(false)
            }
        }

        var [recording_uri, setRecording_uri] = useState('');
    
        async function stopRecording() {
            setRecordButtonDisabled(true);
            console.log('Stopping recording..');
            setRecording(undefined);
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            }); 
            var recording_uri = recording.getURI(); 
            console.log('Recording stopped and stored at', recording_uri);
            setRecordButtonDisabled(false);
            setRecordingStatus(false);
            setRecording_uri(recording_uri);
        }
    
        /* End of audio recording code */

        /* Start of audio play and pause code */
        
        async function playAudio(recording_uri) {
            if (playbackStatus != null && playRecording) {
                if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
                    setPlayButtonDisabled(true);
                    const status = await playRecording.playAsync()
                    setPlaybackStatus(status);
                    setIsAudioPlaying(true);
                    setPlayButtonDisabled(false);
                }
            }
            if (!playbackStatus && !playRecording) {
                setPlayButtonDisabled(true);
                var play_sound = new Audio.Sound();
                setPlayRecording(play_sound);
                let status_update_num = 0;
                try {
                    console.log("Loading sound")
                    if (recordingStatus == true) {
                        alert("Please stop the recording before playing a recording");
                        setPlayRecording(undefined);
                        setPlayButtonDisabled(false);
                        return;
                    }
                    await play_sound.loadAsync(
                        { uri: recording_uri },
                        { shouldPlay: true },
                        { progressUpdateIntervalMillis: 500 }
                    );
                    await play_sound.setVolumeAsync(1);
                    console.log('Loaded Sound');
                    console.log("Playing sound");
                    play_sound.setOnPlaybackStatusUpdate(async (status) => {
                        setPlaybackStatus(status);
                        status_update_num += 1;
                        console.log("Playback status update num = " + status_update_num);
                        console.log(status)
                        if (status.didJustFinish === true) {
                            // audio has finished!
                            console.log('Audio has finished')
                            await play_sound.unloadAsync()
                            setIsAudioPlaying(false);
                            setPlaybackStatus(undefined);
                            setPlayRecording(undefined);
                        }
                    })
                    await play_sound.playAsync();
                    setIsAudioPlaying(true);
                    setPlayButtonDisabled(false);
                    
                } catch (error) {
                    console.log("Error when playing sound:", error);
                    alert("An error has occured. " + error)
                }
            }
        }

        async function pauseAudio() {
            setPlayButtonDisabled(true);
            if (playRecording) {
                setPlayButtonDisabled(false);
                setIsAudioPlaying(false);
                await playRecording.pauseAsync();
            } else {
                setIsAudioPlaying(false);
                setPlayButtonDisabled(false);
            }
        }

        /* End of audio play and pause code */

    const [ProfileOptionsViewState, setProfileOptionsViewState] = useState(true)
    const [NotRecording_RecordIconState, setNotRecording_RecordIconState] = useState(false)
    const [Recording_RecordIconState, setRecording_RecordIconState] = useState(false)

    const changeProfilesOptionsView = () => {
        if (ProfileOptionsViewState == true) {
            setProfileOptionsViewState(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setNotRecording_RecordIconState(false);
            setRecording_RecordIconState(true);
        }else{
            console.log("Closed Confirm")
            setProfileOptionsViewState(true)
            stopRecording();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setNotRecording_RecordIconState(false);
            setRecording_RecordIconState(false);
        }
    }

    const changeRecordingState = () => {
        if (NotRecording_RecordIconState == true) {
            setNotRecording_RecordIconState(false);
            setRecording_RecordIconState(true);
            stopRecording();
        } else if (NotRecording_RecordIconState == false) {
            setNotRecording_RecordIconState(true);
            setRecording_RecordIconState(false);
            startRecording();
        } else {
            console.log("Some sort of error occured with changing recording state");
        }
    }

    const sendAudioSnippet = () => {
        if (recordingStatus == true) {
            alert("Please stop the recording before continuing")
            return;
        }
        if (playbackStatus && isAudioPlaying == true) {
            alert("Please stop the audio from playing before continuing")
            return;
        }
        recording_uri? navigation.navigate("SendAudioPage") : alert("Create a recording first");
    }

    const {colors, dark} = useTheme();

    const changeRecordingStatus = () => {
        if (recordingStatus == true) {
            setRecordingStatus(false)
            stopRecording();
        } else {
            setRecordingStatus(true)
            startRecording();
        }
    }

    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (recordingStatus != true && !recording && !playbackStatus && isAudioPlaying != true && !timeSpentRecording && !recording_uri) {
                // If we don't have unsaved changes, then we don't need to do anything
                return;
            }
            console.log('Time spent recording: ' + timeSpentRecording);
            console.log('Recording URI: ' + recording_uri);
    
            // Prevent default behavior of leaving the screen
            e.preventDefault();

            if (recordingStatus == true && recording) {
                Alert.alert(
                    'Audio is still being recorded',
                    'Audio is still being recorded. What do you want to do?',
                    [
                      { text: "Don't leave and stay recording", style: 'cancel', onPress: () => {} },
                      {
                        text: 'Stop recording and discard audio',
                        style: 'destructive',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => {
                            changeRecordingStatus();
                            navigation.dispatch(e.data.action);
                        },
                      },
                      {
                        text: 'Stay recording and leave screen (Coming Soon)',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => alert('Coming soon'),
                      },
                    ]
                );
            } else if (playbackStatus && isAudioPlaying == true) {
                Alert.alert(
                    'Audio is still playing',
                    'Audio is still playing. What do you want to do?',
                    [
                      { text: "Don't leave and continue playing", style: 'cancel', onPress: () => {} },
                      {
                        text: 'Stop playing and discard audio',
                        style: 'destructive',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => {
                            pauseAudio();
                            navigation.dispatch(e.data.action);
                        },
                      },
                      {
                        text: 'Stay playing and leave screen (Coming Soon)',
                        // If the user confirmed, then we dispatch the action we blocked earlier
                        // This will continue the action that had triggered the removal of the screen
                        onPress: () => alert('Coming soon'),
                      },
                    ]
                );
            } else if (timeSpentRecording && recording_uri) {
                Alert.alert(
                    'Audio is still in memory',
                    'Audio is still in memory. What do you want to do?',
                    [
                        { text: "Don't leave and keep audio", style: 'cancel', onPress: () => {} },
                        {
                            text: 'Delete audio and go back',
                            style: 'destructive',
                            // If the user confirmed, then we dispatch the action we blocked earlier
                            // This will continue the action that had triggered the removal of the screen
                            onPress: () => {
                                navigation.dispatch(e.data.action);
                            }
                        },
                    ]
                );
            }
        }),
        [navigation, recordingStatus, recording, playbackStatus, isAudioPlaying, timeSpentRecording, recording_uri]
    );
    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
                <BackgroundDarkColor style={{backgroundColor: colors.primary}}>
                    <TopNavBar screenName="Record Audio"/>
                    <View>
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity disabled={recordButtonDisabled} onPress={changeRecordingStatus}>
                                <Image style={{width: 100, height: 100}} source={recordingStatus == false? 
                                    dark? require('../../assets/record_button.png') : require('../../assets/lightmode_recordbutton.png') 
                                    : dark? require('../../assets/recording_icon.png') : require('../../assets/lightmode_recordingicon.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        {!recording_uri && !recording && !recordingStatus && hoursDisplay == null && minutesDisplay == null && secondsDisplay == null ? <TestText style={{marginTop: 20, color: colors.tertiary}}>Press the recording button to get started</TestText> : null}
                        <TestText style={{color: colors.tertiary, marginTop: 20}}>{hoursDisplay == null & minutesDisplay == null & secondsDisplay == null ? null : "Recording for " + hoursDisplay + minutesDisplay + secondsDisplay}</TestText>
                        <View style={{alignItems: 'center', marginVertical: 20}}>
                            {recording_uri ?
                                !recording && !recordingStatus ?
                                    isAudioPlaying == true?
                                        <TouchableOpacity disabled={playButtonDisabled} onPress={pauseAudio}>
                                            <Icon name="pausecircleo" color={colors.tertiary} size={80}/>
                                        </TouchableOpacity> 
                                        :
                                        <TouchableOpacity disabled={playButtonDisabled} onPress={() => recording_uri? playAudio(recording_uri) : alert("Create a recording first")}>
                                            <Icon name="playcircleo" color={colors.tertiary} size={80}/>
                                        </TouchableOpacity> 
                                    : null 
                                : null
                            }
                        </View>
                        {recording_uri? 
                            !recordingStatus && !recording ?
                                <StyledButton onPress={sendAudioSnippet}>
                                    <ButtonText>Send Audio Snippet</ButtonText>
                                </StyledButton> 
                            : null
                        : null
                        }
                    </View>
                </BackgroundDarkColor>
        </>
    );
}

export default RecordAudioPage;

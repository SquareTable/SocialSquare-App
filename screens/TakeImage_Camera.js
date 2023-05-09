import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions, Alert, Platform} from 'react-native';
import {Camera} from 'expo-camera';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants'
import * as Linking from 'expo-linking';

const TakeImage_Camera = ({navigation, route}) => {
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [cameraIsReady, setCameraIsReady] = useState(false)
    const [cameraIsInPreview, setCameraIsInPreview] = useState(false)
    const [showCamera, setShowCamera] = useState(true)
    const [image, setImage] = useState(null)
    const [cameraPermissionsAreGranted, setCameraPermissionsAreGranted] = useState(null);
    const [microphonePermissionsAreGranted, setMicrophonePermissionsAreGranted] = useState(null);
    const [showContinueWithoutMicButton, setShowContinueWithoutMicButton] = useState(false);
    const [allowVideoSound, setAllowVideoSound] = useState(false)
    const [temp, setTemp] = useState('abc')
    const cameraRef = useRef()
    const {locationToGoTo} = route.params;
    console.log('Camera Is ready value is ' + cameraIsReady)

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 1, base64: false };
            const data = await cameraRef.current.takePictureAsync(options);
            console.log(data)
            setImage(data)

            if (data) {
                setCameraIsInPreview(true);
            }
        }
    };

    const retakeImage = async () => {
        setCameraIsInPreview(false)
    }

    const chooseImage = () => {
        console.log('Choosing image')
        if (image) {
            navigation.navigate(locationToGoTo, {imageFromRoute: image, backButtonHidden: true})
        } else {
            alert('An error occured')
        }
    }

    const isFocused = useIsFocused()
    isFocused ? showCamera ? null : setShowCamera(true) : showCamera ? setShowCamera(false) : null

    useEffect(() => {
        const checkForCameraPermissions = async () => {
            var { status } = await Camera.getCameraPermissionsAsync();
            setCameraPermissionsAreGranted(status === 'granted');
            var { status } = await Camera.getMicrophonePermissionsAsync();
            setMicrophonePermissionsAreGranted(status === 'granted');
            if (microphonePermissionsAreGranted == true && cameraPermissionsAreGranted == true) {
                setContinueToCamera(true)
                setAllowVideoSound(true)
            }
        }
        checkForCameraPermissions()
    }, [])

    const pkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package 
        : 'host.exp.exponent'

    const requestPermissions = async (type) => {
        if (type == 'camera') {
            var { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermissionsAreGranted(status === 'granted');
            if (status == 'denied') {
                Alert.alert(
                    "No Camera Permission",
                    "SocialSquare does not have camera permissions enabled. If you want to take photos or videos with your camera, please go into your device settings and enable camera permission for SocialSquare.",
                    [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Settings",
                        onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:')
                            } else if (Platform.OS === 'android') {
                                import ('expo-intent-launcher').then(IntentLauncher => {
                                    IntentLauncher.startActivityAsync(
                                        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                                        { data: 'package:' + pkg },
                                    )
                                })
                            } else if (Platform.OS === 'web') {
                                window.open('app-settings:')
                            } else {
                                alert('Platform not supported yet.')
                            }
                        }
                    },
                    ]
                );
            }
        } else if (type == 'microphone') {
            var { status } = await Camera.requestMicrophonePermissionsAsync();
            setMicrophonePermissionsAreGranted(status === 'granted');
            if (status == 'denied') {
                Alert.alert(
                    "No Microphone Permission",
                    "SocialSquare does not have microphone permissions enabled. If you want to record video with sound, please go into your device settings and allow SocialSquare to use your microphone",
                    [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Settings",
                        onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:')
                            } else if (Platform.OS == 'android') {
                                import ('expo-intent-launcher').then(IntentLauncher => {
                                    IntentLauncher.startActivityAsync(
                                        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                                        { data: 'package:' + pkg },
                                    )
                                })
                            } else if (Platform.OS == 'web') {
                                window.open('app-settings:')
                            } else {
                                alert('Platform not supported yet.')
                            }
                        }
                    },
                    ]
                );
            }
        }
    }

    const Space = ({space}) => {
        return(
            <View style={{height: space, minHeight: space, maxHeight: space}}/>
        )
    }
    
    return(
        <>
            {cameraPermissionsAreGranted == null || microphonePermissionsAreGranted == null ?
                <View style={{width: '100%', height: '100%', backgroundColor: 'black'}}/>
            :
                cameraPermissionsAreGranted == false || microphonePermissionsAreGranted == false ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
                        {cameraPermissionsAreGranted == false ? <TouchableOpacity onPress={() => {requestPermissions('camera')}}><Text style={{color: '#88C0D0', fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#88C0D0'}}>Enable camera permissions</Text></TouchableOpacity> : <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Camera permissions enabled ✓</Text>}
                        <Space space={30}/>
                        {microphonePermissionsAreGranted == false ? <TouchableOpacity onPress={() => {requestPermissions('microphone')}}><Text style={{color: '#88C0D0', fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#88C0D0'}}>Enable microphone permissions</Text></TouchableOpacity> : <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Microphone permissions enabled ✓</Text>}
                        {cameraPermissionsAreGranted == true && microphonePermissionsAreGranted == false &&
                            <>
                                <Space space={80}/>
                                <TouchableOpacity onPress={() => {
                                    setMicrophonePermissionsAreGranted(true)
                                    setAllowVideoSound(false)
                                }}>
                                    <Text style={{color: '#88C0D0', fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#88C0D0', textAlign: 'center'}}>Continue without microphone</Text>
                                    <Text style={{color: '#88C0D0', fontSize: 20, textAlign: 'center'}}>(Video will be muted)</Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                :
                    showCamera == true ?
                        <>
                            <View style={{height: screenHeight / 4, minHeight: screenHeight / 4, maxHeight: screenHeight / 4, backgroundColor: 'black'}}/>
                            {cameraIsInPreview == false ?
                                <Camera style={{flex: 1, width: screenWidth, minWidth: screenWidth, maxWidth: screenWidth, height: screenWidth, minHeight: screenWidth, maxHeight: screenWidth}} type={cameraType} ratio={'1:1'} onCameraReady={() => {setCameraIsReady(true)}} ref={cameraRef}/>
                            :
                                <Image style={{width: screenWidth, height: screenWidth}} source={{uri: image.uri}}/>
                            }
                            <View style={{flex: 1, backgroundColor: 'black', flexDirection: 'row'}}>
                                {cameraIsInPreview == false &&
                                    <>
                                        <TouchableOpacity 
                                            disabled={!cameraIsReady}
                                            onPress={() => {
                                                setCameraType(
                                                    cameraType === Camera.Constants.Type.back
                                                    ? Camera.Constants.Type.front
                                                    : Camera.Constants.Type.back
                                                );
                                            }}
                                            style={{flex: 0.3, alignSelf: 'flex-end', alignItems: 'center', paddingBottom: 25}}
                                        >
                                            <MaterialIcons name='flip-camera-ios' size={50} color='white' />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={!cameraIsReady}
                                            onPress={takePicture}
                                            style={{flex: 0.4, alignSelf: 'flex-end', alignItems: 'center'}}
                                        >
                                            <Image source={require('../assets/TakePhotoImg.png')} style={{width: 100, height: 100}}/>
                                        </TouchableOpacity>
                                    </>
                                }
                                {cameraIsInPreview == true &&
                                    <>
                                        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row', margin: 20}}>
                                            <TouchableOpacity 
                                                onPress={retakeImage}
                                                style={{flex: 0.5, alignSelf: 'flex-end', alignItems: 'center'}}
                                            >
                                                <View style={{width: 80, height: 80, backgroundColor: 'black', borderRadius: 10000, borderWidth: 1, borderColor: 'black', padding: 10, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 50}}>❌</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={chooseImage}
                                                style={{flex: 0.5, alignSelf: 'flex-end', alignItems: 'center'}}
                                            >
                                                <View style={{width: 80, height: 80, backgroundColor: 'black', borderRadius: 10000, borderWidth: 1, borderColor: 'black', padding: 10, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 50}}>✅</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                }
                            </View>
                        </>
                    :
                        <View style={{height: '100%', backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'red', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 30}}>Camera was disabled for security reasons because you left this screen.</Text>
                            <Text style={{color: 'red', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Camera will be re-enabled shortly.</Text>
                        </View>
            }
        </>
    );
}

export default TakeImage_Camera;
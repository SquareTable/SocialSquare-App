import 'react-native-get-random-values';
import Constants from 'expo-constants';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { Text, View, TouchableOpacity, Platform, Image, Animated, Vibration, AppState, Dimensions, FlatList, useColorScheme, ActivityIndicator, Alert} from 'react-native';
import styled from "styled-components";
import LoginScreen from './screens/LoginScreen.js';
import { Start_Stack } from './navigation/Start_Stack.js';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { CredentialsContext } from './components/CredentialsContext';
import { AdIDContext } from './components/AdIDContext.js';
import { AppStylingContext } from './components/AppStylingContext.js';
import { RefreshAppStylingContext } from './components/RefreshAppStylingContext.js';
import { SimpleStylingVersion } from './components/StylingVersionsFile.js';
import SocialSquareLogo_B64_png from './assets/SocialSquareLogo_Base64_png.js';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import { io } from 'socket.io-client';
import { 
  Avatar,
  ButtonText

} from './screens/screenStylings/styling.js';
import { ProfilePictureURIContext } from './components/ProfilePictureURIContext.js';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import { LockSocialSquareContext } from './components/LockSocialSquareContext.js';
import { ShowPlaceholderSceeenContext } from './components/ShowPlaceholderScreenContext.js';
import * as LocalAuthentication from 'expo-local-authentication';
import { OpenAppContext } from './components/OpenAppContext.js';
import { ShowAccountSwitcherContext } from './components/ShowAccountSwitcherContext.js';
import { AllCredentialsStoredContext } from './components/AllCredentialsStoredContext.js';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { navigationRef } from './components/ReactNavigationRef.js';
import * as AppNavigation from './components/ReactNavigationRef.js';
import { ServerUrlContext } from './components/ServerUrlContext.js';
import { BadgeEarntNotificationContext } from './components/BadgeEarntNotificationContext.js';
import { OnlineContext } from './components/conversationOnlineHandler.js';
import { SocketContext } from './components/socketHandler.js';
import { ReconnectPromptContext } from './components/reconnectPrompt.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IOSADID, ANDROIDADID, EXPOPROJECTID} from '@dotenv';
import * as SplashScreen from 'expo-splash-screen';
import { ExperimentalFeaturesEnabledContext } from './components/ExperimentalFeaturesEnabledContext.js';
import {setAuthAsHeaders} from './jwtHandler';
import ErrorBoundary from './components/ErrorBoundary.js';
import { UseUploadContext } from './components/UseUploadContext.js';
import useUpload from './hooks/useUpload.js';
import { StatusBarHeightContext } from './components/StatusBarHeightContext.js';
import {Logout} from './components/HandleLogout';
import {storeJWT} from './jwtHandler';
import mobileAds, { MaxAdContentRating, TestIds } from 'react-native-google-mobile-ads';
import { SERVER_URL } from './defaults.js';
import ParseErrorMessage from './components/ParseErrorMessage.js';

mobileAds()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,

    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => mobileAds().initialize())
  .then(adapterStatuses => {
    console.log('Ads successfully initialized')
  })
  .catch(error => {
    console.warn('Error initializing ads:', error)
  })

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const App = () => {
  const ActualStatusBarHeight = Constants.statusBarHeight;
  const [StatusBarHeight, setStatusBarHeight] = useState(ActualStatusBarHeight)
  const [AppStylingContextState, setAppStylingContextState] = useState(null)
  const [showPlaceholderScreen, setShowPlaceholderScreen] = useState(null)
  const [lockSocialSquare, setLockSocialSquare] = useState(null)
  const [refreshAppStyling, setRefreshAppStyling] = useState(false);
  const [profilePictureUri, setProfilePictureUri] = useState(SocialSquareLogo_B64_png)
  const [AsyncStorageSimpleStylingData, setAsyncStorageSimpleStylingData] = useState()
  const [currentSimpleStylingData, setCurrentSimpleStylingData] = useState()
  const testID = TestIds.BANNER;
  const productionID = Platform.OS == 'ios' ? IOSADID : ANDROIDADID;
  // Is a real device and running in production.
  const adUnitID = Device.isDevice && !__DEV__ ? productionID : testID;
  const [AdID, setAdID] = useState(adUnitID);
  const previousStylingState = useRef(null)
  const AsyncSimpleStyling_ParsedRef = useRef(null)
  // Check App State code
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current)
  const [previousAppStateVisible, setPreviousAppStateVisible] = useState('justStarted')
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [openApp, setOpenApp] = useState(false);
  const [biometricsEnrolled, setBiometricsEnrolled] = useState(false)
  const [AppOwnershipValue, setAppOwnershipValue] = useState(undefined)
  const [biometricsCanBeUsed, setBiometricsCanBeUsed] = useState(false)
  const [showSocialSquareLockedWarning, setShowSocialSquareLockedWarning] = useState(false)
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const appHeight = Dimensions.get('window').height;
  const [allCredentialsStoredList, setAllCredentialsStoredList] = useState([])
  const [AccountSwitcherHeight, setAccountSwitcherHeight] = useState(0)
  const DismissAccountSwitcherBoxActivated = useRef(new Animated.Value(0)).current;
  const [serverUrl, setServerUrl] = useState(SERVER_URL)
  const [badgeEarntNotification, setBadgeEarntNotification] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState('');
  const [reconnectPrompt, setReconnectPrompt] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [checkingConnectionPopUp, setCheckingConnectionPopUp] = useState(false)
  const socketRefForEventListeners = useRef(socket)
  const onlineUsersRef = useRef(onlineUsers)
  const [timeOutId, setTimeOutId] = useState(null)
  const [popUpForCoversations, setPopUpForCoversations] = useState(null)
  const [isReady, setIsReady] = useState(false);
  const scheme = useColorScheme() || 'light'; // Get user preffered color scheme and if it gets returned as null make it default to light mode
  let DisconnectedFromInternetBoxY = useRef(new Animated.Value(0)).current;
  let AccountSwitcherY = useRef(new Animated.Value(500)).current;
  let AccountSwitchedBoxY = useRef(new Animated.Value(0)).current;
  let BadgeEarntBoxY = useRef(new Animated.Value(StatusBarHeight - 200)).current;
  const popUpTimeoutLength = useRef(new Animated.Value(Dimensions.get('window').width * 0.9)).current;
  const [experimentalFeaturesEnabled, setExperimentalFeaturesEnabled] = useState(false)
  const [uploadPost, retryUpload, cancelRetry, numPostsUploading, numUploadErrors, postsToUpload, postsUploading, uploadErrors] = useUpload(serverUrl, storedCredentials)
  const JWTExpired = useRef(false)

  console.log('Status Bar Height:', StatusBarHeight)

  function handleInvalidRefreshToken() {
    if (!JWTExpired.current) {
      JWTExpired.current = true;
      let alertTitle = 'You Have Been Logged Out'; 
      let alertMessage, resolveText;

      if (allCredentialsStoredList.length > 1) {
          alertMessage = 'You have been logged out of this account. To use this account, please log back in. For now, you have switched to a different account.'
          resolveText = 'OK'
      } else {
          alertMessage = 'You have been logged out of this account. To use this account, please log back in.'
          resolveText = 'Login'
      }

      Alert.alert(
          alertTitle,
          alertMessage,
          [
              {
                  resolveText,
                  onPress: () => {
                    JWTExpired.current = false;
                    Logout(storedCredentials, setStoredCredentials, allCredentialsStoredList, setAllCredentialsStoredList, navigationRef, setProfilePictureUri);
                  }
              }
          ]
      );
    }
  }

  useEffect(() => {
    if (storedCredentials?._id) {
      setAuthAsHeaders(storedCredentials._id)
    }
  }, [storedCredentials?._id])

  useEffect(() => {
    axios.interceptors.response.use((response) => {
      //console.log("Response:")
      //console.log(response)
      return response //let continue as normal
    }, (error) => {
      const status = error.response?.status || 500;
      if (status == 401) {
        console.log("No JWT passed?")
        //setAuthAsHeaders() // why not // cant do anymore since userid is used in the keys for multiple accounts
      } else if (status == 403 && error?.response?.config?.url !== `${serverUrl}/tempRoute/logoutdevice`) {
        if (ParseErrorMessage(error) == "Token generated.") {
          console.log("New token generated.")
          //refresh occured so repeat last request
          let token = error.response.data.token;
          const forAsync = async () => {
            await storeJWT({webToken: token, refreshToken: "", refreshTokenId: ""}, error.response.data.userId)
            let configOfOriginal = error.config;
            //console.log("Config of og:")
            //console.log(configOfOriginal)
            delete configOfOriginal.headers["auth-web-token"]; // it will use from defaults so the new one bc the await above
            //console.log("Config of og new header:")
            //console.log(configOfOriginal)
            let response = axios.request(configOfOriginal).then(response => {
                return response;
            })
            return response;
          }
          let response = forAsync()
          return response;
        } else if (error?.response?.data?.logout !== true) {
            return Promise.reject(error) //let continue as normal since the user has not been logged out (refresh token hasn't expired)
        } else {
          console.log("Invalid refresh token, should only be refresh token that sends this as a response so new login required.")
          handleInvalidRefreshToken()
          return Promise.reject(error) // for now
          //for logout or smth
        }
      } else {
        return Promise.reject(error) //let continue as normal
      }
    });
  }, [])

  useEffect(() => {
    if (numPostsUploading == 0 && numUploadErrors == 0) {
      if (StatusBarHeight !== ActualStatusBarHeight) setStatusBarHeight(ActualStatusBarHeight)
    } else {
      if (StatusBarHeight !== 10) setStatusBarHeight(10)
    }
  }, [numPostsUploading, numUploadErrors])

  //Encryption Stuff
    
  async function saveDeviceUUID(key, value) {
    await SecureStore.setItemAsync(key, value); 
  }
  
  async function getDeviceUUID(key) {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
          return result;
      } else {
          return null
      }
  }

  const checkAndCreateDeviceUUID = (callback) => {
      async function forAsync() {
          const checkingDeviceUUID = await getDeviceUUID("device-uuid")
          if (checkingDeviceUUID == null) {
              let uuid = uuidv4();
              saveDeviceUUID("device-uuid", JSON.stringify(uuid))
              console.log(`device uuid ${uuid}`)
              return callback(uuid);
          } else {
              console.log(`found device uuid ${checkingDeviceUUID}`)
              return callback(checkingDeviceUUID);
          }
      }
      forAsync()
  }

  const createSocketConnection = async () => {
    checkAndCreateDeviceUUID(function(uuidOfDevice) {
      if (uuidOfDevice == "" || uuidOfDevice == null || uuidOfDevice == undefined || typeof uuidOfDevice == "undefined") {
          console.log(`Error with uuid (${uuidOfDevice}) of device.`)
      } else {
          const uuidWithOutDouble = uuidOfDevice.replace(/(^"|"$)/g, '')
          console.log(`UUID sent with socket ${uuidOfDevice}`)
          setSocket(io((serverUrl + "/"), { query: { idSentOnConnect: storedCredentials._id, uuidOfDevice: uuidWithOutDouble }}))
      }
    })
  }

  useEffect(() => {
    if (storedCredentials == '' || storedCredentials == null) {
        //no credentials
        socket != '' && socket.disconnect()
        setSocket('')
    } else {
        if (socket == '') {
            createSocketConnection()
        }
        AsyncStorage.getItem(`deviceNotificationKey-${storedCredentials._id}`).then((result) => {
            if (result !== null) {
                setExpoPushToken(result);
                console.log('deviceNotificationKey: ' + result);

                // This listener is fired whenever a notification is received while the app is foregrounded
                notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                  console.log("Notification recieved while in app.")
                  console.log(notification)
                  setNotification(notification);
                });

                // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
                responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                  console.log("Notification recieved and interacted with.")
                  console.log(response);
                  navigationRef.navigate("NotificationsScreen", response)
                });
            } else {
                registerForPushNotificationsAsync().then(async token => {
                    if (token !== undefined) {
                        try {
                          const refreshTokenId = await SecureStore.getItemAsync(storedCredentials._id + '-auth-refresh-token-id');
                          const url = serverUrl + "/tempRoute/sendnotificationkey";
    
                          axios.post(url, {keySent: token, refreshTokenId}).then((response) => {
                              const result = response.data;
                              const {message, status, data} = result;
    
                              if (status !== 'SUCCESS') {
                                  console.log(`${status}: ${message}`)
                              } else {
                                  setExpoPushToken(token)
                                  AsyncStorage.setItem(`deviceNotificationKey-${storedCredentials._id}`, token)
                                  .then(() => {
                                      setExpoPushToken(token);
                                      console.log('deviceNotificationKey: ' + token);
                                      // This listener is fired whenever a notification is received while the app is foregrounded
                                      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                                        console.log("Notification recieved while in app.")
                                        console.log(notification)
                                        setNotification(notification);
                                      });
    
                                      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
                                      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                                        console.log("Notification recieved and interacted with.")
                                        console.log(response);
                                        navigationRef.navigate("NotificationsScreen", response)
                                      });
                                  })
                                  .catch((error) => {
                                      console.log(error);
                                      console.log('Error Setting Notification Key');
                                  })
                              }
                          }).catch(error => {
                              console.log('Error while sending push notif key ', error);
                          })
                        } catch (error) {
                          console.error('An error occurred while getting auth-refresh-token-id for user:', error)
                        }
                    }
                });
            }
      }).catch((error) => console.log(error));
    }

    return () => {
      if (typeof notificationListener.current == "undefined" || notificationListener.current == undefined) {
        //Undefined
      } else {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }

      if (typeof responseListener.current == "undefined" || responseListener.current == undefined) {
        //Undefined
      } else {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [storedCredentials?._id])

  useEffect(() => {
    if (notification !== false) {
        popUpTimeoutLength.stopAnimation()
        if (timeOutId !== null) {
            clearTimeout(timeOutId)
            setTimeOutId(null)
        }
        popUpTimeoutLength.setValue(Dimensions.get('window').width * 0.9)
        Animated.timing(popUpTimeoutLength, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: false
        }).start()
        var tempTimeOutId = setTimeout(() => {
            setNotification(false)
        },4000)
        setTimeOutId(tempTimeOutId)
    }
  }, [notification])

  useEffect(() => {
    if (socket == '') {
        if (storedCredentials == '' || storedCredentials == null) {
            //no credentials
        } else {
            const forAsync = async () => {
                checkAndCreateDeviceUUID(function(uuidOfDevice) {
                    if (uuidOfDevice == "" || uuidOfDevice == null || uuidOfDevice == undefined || typeof uuidOfDevice == "undefined") {
                        console.log(`Error with uuid (${uuidOfDevice}) of device.`)
                    } else {
                        const uuidWithOutDouble = uuidOfDevice.replace(/(^"|"$)/g, '')
                        console.log(`UUID sent with socket ${uuidOfDevice}`)
                        setSocket(io((serverUrl + "/"), { query: { idSentOnConnect: storedCredentials._id, uuidOfDevice: uuidWithOutDouble }}))
                    }
                })
            }
            forAsync()
        }
    } else {
        socketRefForEventListeners.current = socket

        console.log("Change in socket")
        socket.on("client-connected", () => {
            setReconnectPrompt(false)
            setCheckingConnectionPopUp(false)
            console.log("Connected to socket")
        });

        socket.on("fully-set-online", () => {
            console.log("Fully set online")
        })
        
        socket.on("fully-set-offline", () => {
            console.log("Fully set offline")
        })

        socket.on("error-setting-online-status", () => {
            console.log("Error setting online status")
        })

        socket.on("error-setting-offline-status", () => {
            console.log("Error setting offline status")
        })

        socket.on("sent-to-users-out-of-convo", () => {
            console.log("Sent to users out of convo")
        })

        socket.on('timed-out-from-app-state', () => {
            //setReconnectPrompt(true) Already does in disconnect
        })

        socket.on("disconnect", (reason) => {
            if (reason === "io server disconnect") {
              // the disconnection was initiated by the server, you need to reconnect manually
              setTimeout(() => {
                socket.connect()
              }, (2000 * (Math.random() + 0.3)))
            }
            if (reconnectPrompt !== true) {
              setReconnectPrompt(true)
            }
            console.log(`Disconnected ${reason}`)
        });

        
    }
  }, [socket])

  var socketAutoReconnectInterval = null

  useEffect(() => {
    console.log('Reconnect prompt:', reconnectPrompt)
    if (reconnectPrompt != false) {
      Animated.timing(DisconnectedFromInternetBoxY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(DisconnectedFromInternetBoxY, {
        toValue: 250,
        duration: 100,
        useNativeDriver: true
      }).start();
    }
  }, [reconnectPrompt])

  useEffect(() => {
    if (socket !== '') {
        //can change when following is implemented
        socket.on("user-in-conversation-online", (userThatCameOnlinePubId) => {
            console.log(`${storedCredentials.secondId}: ${userThatCameOnlinePubId} came online.`)
            //console.log(`onlineUsers: ${onlineUsers}, user that came online ${userThatCameOnlinePubId}`)
            try {
                var upToDateOU;
                setOnlineUsers(currentState => { // Do not change the state by getting the updated state
                    upToDateOU = currentState;
                    return currentState;
                })
                if (upToDateOU.includes(userThatCameOnlinePubId)) {
                    console.log("usersPubId already found in upToDateOU")
                } else {
                    setOnlineUsers((prev) => [...prev, userThatCameOnlinePubId])
                }
            } catch (err) {
                console.log(`Error with setting convo user online: ${err}`)
            }
        })

        socket.on("user-in-conversation-offline", (userThatWentOfflinePubId) => {
            console.log("A user went offline")
            console.log(`${storedCredentials.secondId}: ${userThatWentOfflinePubId} went offline.`)
            try {
                var upToDateOU;
                setOnlineUsers(currentState => { // Do not change the state by getting the updated state
                    upToDateOU = currentState;
                    return currentState;
                })
                var indexIfFound = upToDateOU.findIndex(x => x == userThatWentOfflinePubId)
                if (indexIfFound !== -1) {
                    toChange = upToDateOU.slice()
                    toChange.splice(indexIfFound, 1)
                    console.log("toChange upToDateOU spliced:")
                    console.log(toChange)
                    setOnlineUsers(toChange)
                } else {
                    console.log("User to set offline already not in online users.")
                }
            } catch (err) {
                console.log(`Error with setting convo user online: ${err}`)
            }
        })
    } else {
        if (storedCredentials == '' || storedCredentials == null) {
            //No credentials
        } else {
            setCheckingConnectionPopUp(true)
        }
    }
  }, [socket])


  useEffect(() => {
      const subscription = AppState.addEventListener("change", _handleAppStateChange);

      return () => {
        subscription.remove()
      };
  }, []);

  useEffect(() => {
    if (showAccountSwitcher == true) {
      Animated.timing(DismissAccountSwitcherBoxActivated, { toValue: 1, duration: 1, useNativeDriver: true }).start();
      Animated.timing(AccountSwitcherY, {
        toValue: -AccountSwitcherHeight + 60,
        duration: 100,
        useNativeDriver: true,
        }).start();
        setShowAccountSwitcher(false)
    }
  }, [showAccountSwitcher])

  /*useEffect(() => {  --- No longer needed as disconnected warning shows up when socket is disconnected ---
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected == false) {
        Animated.timing(DisconnectedFromInternetBoxY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(DisconnectedFromInternetBoxY, {
          toValue: 250,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });

    return unsubscribe;
  }, []);*/

  const _handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App has come to the foreground!");
      } else {
        console.log('App is not in the foreground')
        setOpenApp(false)
      }
      setPreviousAppStateVisible(appState.current)
      appState.current = nextAppState;
      setAppStateVisible(appState.current)
      console.log("AppState", appState.current);

      if (appState == 'active') {
        if (socketRefForEventListeners.current !== '') {
            try {
                socketRefForEventListeners.current.emit('app-state-active')
                console.log(`Emitted app state change active`)
            } catch (err) {
                console.log(err)
            }
        }
    } else {
        console.log("This")
        console.log(`socket: ${socketRefForEventListeners}`)
        if (socketRefForEventListeners.current !== '') {
            console.log("This Two")
            try {
                console.log("This Three")
                socketRefForEventListeners.current.emit('app-state-not-active')
                console.log(`Emitted app state not active.`)
            } catch (err) {
                console.log(`Emitting app state change socket err: ${err}`)
            }
        }
    }
  };
  //End of check app state code

  console.log(scheme + " from App.js");
  const AppDarkTheme = {
    indexNum: -1,
    dark: true,
    colors: {
      primary: '#3b4252',
      background: '#3b4252',
      secondary: '#88c0d0',
      tertiary: '#eceff4',
      darkLight: '#4c566a',
      brand: '#88c0d0',
      green: '#A3BE8C',
      red: '#BF616A',
      darkest: '#2e3440',
      greyish: '#D8DEE9',
      bronzeRarity: '#b08d57',
      darkestBlue: '#5E81AC',
      StatusBarColor: 'light',
      navFocusedColor: '#88C0D0',
      navNonFocusedColor: '#ECEFF4',
      borderColor: '#2E3440',
      orange: '#D08770',
      yellow: '#EBCB8B',
      purple: '#B48EAD',
      slightlyLighterGrey: '#434C5E',
      midWhite: '#E5E9F0',
      slightlyLighterPrimary: '#424a5c',
      descTextColor: '#abafb8',
      errorColor: '#FF0000', //red,
      darkerPrimary: '#252f42'
    },
  };
  const AppLightTheme = {
    indexNum: -2,
    dark: false,
    colors: {
      primary: '#eceff4',
      background: '#eceff4',
      secondary: '#88c0d0',
      tertiary: '#3b4252',
      darkLight: '#4c566a',
      brand: '#81A1C1',
      green: '#A3BE8C',
      red: '#BF616A',
      darkest: '#2e3440',
      greyish: '#D8DEE9',
      bronzeRarity: '#b08d57',
      darkestBlue: '#5E81AC',
      StatusBarColor: 'dark',
      navFocusedColor: '#5E81AC',
      navNonFocusedColor: '#2E3440',
      borderColor: '#D8DEE9',
      orange: '#D08770',
      yellow: '#EBCB8B',
      purple: '#B48EAD',
      slightlyLighterGrey: '#434C5E',
      midWhite: '#E5E9F0',
      slightlyLighterPrimary: '#424a5c',
      descTextColor: '#abafb8',
      errorColor: '#FF0000', //red,
      darkerPrimary: '#DFE2E7'
    }
  };
  const AppPureDarkTheme = {
    indexNum: -3,
    dark: true,
    colors: {
      primary: 'black',
      background: 'black',
      secondary: '#88c0d0',
      tertiary: 'white',
      darkLight: '#4c566a',
      brand: '#81A1C1',
      green: '#A3BE8C',
      red: '#BF616A',
      darkest: '#2e3440',
      greyish: '#D8DEE9',
      bronzeRarity: '#b08d57',
      darkestBlue: '#5E81AC',
      StatusBarColor: 'light',
      navFocusedColor: '#81A1C1',
      navNonFocusedColor: 'white',
      borderColor: '#D8DEE9',
      orange: '#D08770',
      yellow: '#EBCB8B',
      purple: '#B48EAD',
      slightlyLighterGrey: '#434C5E',
      midWhite: '#E5E9F0',
      slightlyLighterPrimary: '#424a5c',
      descTextColor: '#abafb8',
      errorColor: '#FF0000', //red,
      darkerPrimary: '4D4D4D'
    }
  };
  const AppPureLightTheme = {
    indexNum: -4,
    dark: false,
    colors: {
      primary: 'white',
      background: 'white',
      secondary: '#88c0d0',
      tertiary: 'black',
      darkLight: '#4c566a',
      brand: '#81A1C1',
      green: '#A3BE8C',
      red: '#BF616A',
      darkest: '#2e3440',
      greyish: '#D8DEE9',
      bronzeRarity: '#b08d57',
      darkestBlue: '#5E81AC',
      StatusBarColor: 'dark',
      navFocusedColor: '#5E81AC',
      navNonFocusedColor: '#2E3440',
      borderColor: '#D8DEE9',
      orange: '#D08770',
      yellow: '#EBCB8B',
      purple: '#B48EAD',
      slightlyLighterGrey: '#434C5E',
      midWhite: '#E5E9F0',
      slightlyLighterPrimary: '#424a5c',
      descTextColor: '#abafb8',
      errorColor: '#FF0000', //red,
      darkerPrimary: 'D9D9D9'
    }
  };

  useEffect(() => {
    async function getAsyncSimpleStyling() {
      let AsyncSimpleStyling = await AsyncStorage.getItem('simpleStylingData')
      let AsyncSimpleStyling_Parsed = JSON.parse(AsyncSimpleStyling)
      if (AsyncSimpleStyling_Parsed != AsyncSimpleStyling_ParsedRef.current) {
        setAsyncStorageSimpleStylingData(AsyncSimpleStyling_Parsed)
        AsyncSimpleStyling_ParsedRef.current = AsyncSimpleStyling_Parsed
        console.log('Setting Async Storage Data in App.js')
      }
      console.log('AsyncSimpleStyling is: ' + AsyncSimpleStyling_Parsed)
    }
    getAsyncSimpleStyling()
  }, [])

  useEffect(() => {
    async function firstTime_getAsyncSimpleStyling() {
      let AsyncSimpleStyling = await AsyncStorage.getItem('simpleStylingData')
      let AsyncSimpleStyling_Parsed = JSON.parse(AsyncSimpleStyling)
      setAsyncStorageSimpleStylingData(AsyncSimpleStyling_Parsed)
      AsyncSimpleStyling_ParsedRef.current = AsyncSimpleStyling_Parsed
    }
    firstTime_getAsyncSimpleStyling()
  }, [])
 

  const setCurrentSimpleStylingDataToStyle = (SimpleAppStyleIndexNum) => {
    const simpleStylingData = AsyncStorageSimpleStylingData;
    console.log(simpleStylingData);
    try {
      for (let i = 0; i < simpleStylingData.length; i++) {
        if (simpleStylingData[i].indexNum == parseInt(SimpleAppStyleIndexNum)) {
            let dataToUse = simpleStylingData[i]
            const hexToRgb = hex =>
              hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                        ,(m, r, g, b) => '#' + r + r + g + g + b + b)
                .substring(1).match(/.{2}/g)
                .map(x => parseInt(x, 16))
            const darkerPrimaryBeforeDarken = hexToRgb(dataToUse.colors.primary)
            const shadeFactor = 0.3 //Will darken RGB by 30%
            const darkR = darkerPrimaryBeforeDarken[0] * (1 - shadeFactor)
            const darkG = darkerPrimaryBeforeDarken[1] * (1 - shadeFactor)
            const darkB = darkerPrimaryBeforeDarken[2] * (1 - shadeFactor)
            function RGBToHex(r,g,b) {
              r = r.toString(16);
              g = g.toString(16);
              b = b.toString(16);
            
              if (r.length == 1)
                r = "0" + r;
              if (g.length == 1)
                g = "0" + g;
              if (b.length == 1)
                b = "0" + b;
            
              return "#" + r + g + b;
            }
            dataToUse.colors.darkerPrimary = RGBToHex(Math.round(darkR), Math.round(darkG), Math.round(darkB))
            setCurrentSimpleStylingData(dataToUse)
            console.log(dataToUse)
            previousStylingState.current = SimpleAppStyleIndexNum
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  console.log('App Styling Context State is: ' + AppStylingContextState)
  console.log('App is currently using this style: ' + currentSimpleStylingData)

  if (refreshAppStyling == true) {
    console.warn('Refreshing app styling')
    async function getAsyncSimpleStyling() {
      let AsyncSimpleStyling = await AsyncStorage.getItem('simpleStylingData')
      let AsyncSimpleStyling_Parsed = JSON.parse(AsyncSimpleStyling)
      setAsyncStorageSimpleStylingData(AsyncSimpleStyling_Parsed)
      AsyncSimpleStyling_ParsedRef.current = AsyncSimpleStyling_Parsed
    }
    setRefreshAppStyling(false)
    getAsyncSimpleStyling()
    setCurrentSimpleStylingDataToStyle(AppStylingContextState)
  }

  var appTheme = AppStylingContextState == 'Default' ? scheme === 'dark' ? AppDarkTheme : AppLightTheme : AppStylingContextState == 'Dark' ? AppDarkTheme : AppStylingContextState == 'Light' ? AppLightTheme : AppStylingContextState == 'PureDark' ? AppPureDarkTheme : AppStylingContextState == 'PureLight' ? AppPureLightTheme : currentSimpleStylingData;

  const NotificationBox = () => {
    const route = navigationRef?.current?.getCurrentRoute();
    const routeName = route ? route.name : '';
    if (notification !== false && notification?.request?.content?.title && notification?.request?.content?.body && routeName != 'WelcomeToSocialSquareScreen' && routeName != 'IntroScreen') {
      return (
        <View style={{position: 'absolute', opacity: 0.9, backgroundColor: appTheme.colors.darkerPrimary, top: Dimensions.get('window').height * 0.05, zIndex: 110, width: Dimensions.get('window').width * 0.9, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
            <Animated.View style={{width: popUpTimeoutLength, backgroundColor: appTheme.colors.brand, height: 3 }}>
            </Animated.View>
            <View style={{flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width * 0.9, paddingVertical: 10}}>
                <TouchableOpacity style={{width: '85%', flexDirection: 'row'}} onPress={() => {
                  console.log("In app notif pressed.")
                  navigationRef.navigate("NotificationsScreen", notification.request.content.data)
                }}>
                    <View style={{marginLeft: 10, marginRight: 5, width: '20%', aspectRatio: 1/1, justifyContent: 'center', alignContent: 'center'}}>
                        <Image style={{width: '100%', height: '100%', borderRadius: 500, borderWidth: 2, borderColor: appTheme.colors.secondary}} source={{uri: SocialSquareLogo_B64_png}}/>
                    </View>
                    <View style={{width: '72%'}}>
                        {notification.request.content.title !== "" && (
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{color: appTheme.colors.tertiary, textAlignVertical: 'center', flex: 1, textAlign: 'left', fontSize: 14, lineHeight: 20}}>{notification.request.content.title}</Text>
                        )}
                        {notification.request.content.body !== "" && (
                            <Text numberOfLines={2} ellipsizeMode='tail' style={{color: appTheme.colors.tertiary, textAlignVertical: 'center', flex: 1, textAlign: 'left', fontSize: 18, lineHeight: 20}}>{notification.request.content.body}</Text>
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: '8%', aspectRatio: 1/1, marginRight: 10, marginLeft: 5, justifyContent: 'center', alignContent: 'center'}} onPress={() => {
                    console.log("Closing Pop Up")
                    setNotification(false)
                }}>
                    <Image style={{width: '100%', height: '100%', tintColor: appTheme.colors.tertiary}} source={require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/270-cancel-circle.png')}/>
                </TouchableOpacity>
            </View>
            <Animated.View style={{width: popUpTimeoutLength, backgroundColor: appTheme.colors.brand, height: 3 }}>
            </Animated.View>            
        </View>
      )
    } else {
      return null
    }
  }

  const route = navigationRef?.current?.getCurrentRoute();
  const routeName = route ? route.name : '';

  const DisconnectedFromInternetBox = () => {
    const onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: DisconnectedFromInternetBoxY,
          },
        },
      ],
      { useNativeDriver: true }
    );
    const onHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        if (event.nativeEvent.absoluteY > appHeight - 140) {
          Animated.timing(DisconnectedFromInternetBoxY, {
            toValue: 250,
            duration: 200,
            useNativeDriver: true
          }).start();
        } else {
          Animated.timing(DisconnectedFromInternetBoxY, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          }).start();
        }
      }
    }
    const onBoxPress = () => {
      Animated.timing(DisconnectedFromInternetBoxY, {
        toValue: 250,
        duration: 200,
        useNativeDriver: true
      }).start();
    }

    console.log('Current Route Name:', routeName)
    if (routeName == 'WelcomeToSocialSquareScreen' || routeName == 'IntroScreen' || routeName == 'LoginScreen' || routeName == 'Signup' || routeName == 'ModalLoginScreen' || routeName == 'ModalSignupScreen' || routeName == 'SwitchServerScreen') {
      Animated.timing(DisconnectedFromInternetBoxY, {
        toValue: 250,
        duration: 1,
        useNativeDriver: true
      }).start();
      return null
    } else {
      return(
        <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <Animated.View style={{backgroundColor: 'rgba(255, 0, 0, 0.7)', height: 60, width: '90%', position: 'absolute', zIndex: 999, top: appHeight - 140, marginHorizontal: '5%', flexDirection: 'row', borderColor: 'black', borderRadius: 15, borderWidth: 1, transform: [{translateY: DisconnectedFromInternetBoxY}], justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={onBoxPress}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Lost connection</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      )
    }
  }

  const AccountSwitcher = () => {
    const onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: AccountSwitcherY,
          },
        },
      ],
      { useNativeDriver: true }
    );
    const onHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        if (event.nativeEvent.absoluteY > appHeight - 80 - AccountSwitcherHeight) {
          Animated.timing(DismissAccountSwitcherBoxActivated, { toValue: 0, duration: 1, useNativeDriver: true }).start();
          Animated.timing(AccountSwitcherY, {
            toValue: 250,
            duration: 200,
            useNativeDriver: true
          }).start();
        } else {
          Animated.timing(AccountSwitcherY, {
            toValue: 60 - AccountSwitcherHeight,
            duration: 100,
            useNativeDriver: true
          }).start();
        }
      }
    }
    const onBoxPress = () => {
      Animated.timing(AccountSwitcherY, {
        toValue: 250,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
    const AddNewAccount = () => {
      AppNavigation.navigate('ModalLoginScreen', {modal: true});
      Animated.timing(DismissAccountSwitcherBoxActivated, { toValue: 0, duration: 1, useNativeDriver: true }).start();
      Animated.timing(AccountSwitcherY, {
        toValue: 250,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
    const goToAccount = (account) => {
      setProfilePictureUri(account.profilePictureUri);
      setStoredCredentials(account);
      AsyncStorage.setItem('socialSquareCredentials', JSON.stringify(account));
      Animated.timing(DismissAccountSwitcherBoxActivated, { toValue: 0, duration: 1, useNativeDriver: true }).start();
      Animated.timing(AccountSwitcherY, {
        toValue: 250,
        duration: 200,
        useNativeDriver: true
      }).start();
      AppNavigation.reset('Tabs', 0);
    }
    return(
      <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', height: 'auto', width: '90%', position: 'absolute', zIndex: 1000, top: appHeight - 140, marginHorizontal: '5%', flexDirection: 'column', borderColor: 'black', borderRadius: 15, borderWidth: 1, transform: [{translateY: AccountSwitcherY}], alignSelf: 'center', maxHeight: appHeight / 2}} onLayout={e => setAccountSwitcherHeight(e.nativeEvent.layout.height)}>
          {storedCredentials ?
            <>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start', height: 60, alignItems: 'flex-start'}}>
                <Avatar style={{width: 40, height: 40, marginLeft: 15}} resizeMode="cover" source={{uri: profilePictureUri}}/>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 16, position: 'absolute', left: 71}}>{storedCredentials.displayName || storedCredentials.name}</Text>
              </View>
              <View style={{width: '100%', backgroundColor: 'white', height: 3, borderColor: 'white', borderWidth: 1, borderRadius: 20, width: '96%', alignSelf: 'center'}}/>
              <FlatList
                data={allCredentialsStoredList}
                renderItem={({item}) => (
                  <>
                    {item.secondId != storedCredentials.secondId ?
                      <TouchableOpacity onPress={() => {goToAccount(item)}} style={{flexDirection: 'row', justifyContent: 'flex-start', height: 60, alignItems: 'flex-start'}}>
                        <Avatar style={{width: 40, height: 40, marginLeft: 15}} resizeMode="cover" source={{uri: item.profilePictureUri}}/>
                        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 16, position: 'absolute', left: 71}}>{item.displayName || item.name}</Text>
                      </TouchableOpacity>
                    : null}
                  </>
                )}
                keyExtractor={(item, index) => 'key'+index}
              />
              <TouchableOpacity onPress={AddNewAccount} style={{flexDirection: 'row', justifyContent: 'flex-start', height: 60}}>
                <EvilIcons name="plus" size={60} color="white" style={{marginLeft: 6, marginTop: 4}}/>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 5, marginTop: 16}}>Add New Account</Text>
              </TouchableOpacity>
            </>
          :
            <TouchableOpacity onPress={AddNewAccount} style={{flexDirection: 'row', justifyContent: 'flex-start', height: 60}}>
              <EvilIcons name="plus" size={60} color="white" style={{marginLeft: 6, marginTop: 4}}/>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 5, marginTop: 16}}>Add New Account</Text>
            </TouchableOpacity>
          }
        </Animated.View>
      </PanGestureHandler>
    )
  }

  const AccountSwitchedBox = () => {
    const {colors} = useTheme()
    const onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: AccountSwitchedBoxY,
          },
        },
      ],
      { useNativeDriver: true }
    );
    const onHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        if (event.nativeEvent.absoluteY > appHeight - 140) {
          Animated.timing(AccountSwitchedBoxY, {
            toValue: 250,
            duration: 200,
            useNativeDriver: true
          }).start();
        } else {
          Animated.timing(AccountSwitchedBoxY, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          }).start();
        }
      }
    }
    const onBoxPress = () => {
      Animated.timing(AccountSwitchedBoxY, {
        toValue: 250,
        duration: 200,
        useNativeDriver: true
      }).start();
    }

    const route = navigationRef?.current?.getCurrentRoute();
    const routeName = route ? route.name : '';

    if (routeName == 'WelcomeToSocialSquareScreen' || routeName == 'IntroScreen') {
      Animated.timing(AccountSwitchedBoxY, {
        toValue: 250,
        duration: 200,
        useNativeDriver: true
      }).start();
      return null
    } else {
      return(
        <>
          {storedCredentials && routeName != 'WelcomeToSocialSquareScreen' && routeName != 'IntroScreen' ?
            <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onHandlerStateChange}>
              <Animated.View style={{backgroundColor: (colors.primary + 'CC'), height: 60, width: '90%', position: 'absolute', zIndex: 999, top: appHeight - 140, marginHorizontal: '5%', flexDirection: 'row', borderColor: 'black', borderRadius: 15, borderWidth: 1, transform: [{translateY: AccountSwitchedBoxY}], justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={onBoxPress} style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Avatar style={{width: 40, height: 40, marginLeft: 15}} source={{uri: profilePictureUri}}/>
                  <Text style={{color: colors.tertiary, fontSize: 16, marginTop: 20, marginLeft: 15, fontWeight: 'bold'}}>{'Switched to ' + (storedCredentials.displayName || storedCredentials.name)}</Text>
                </TouchableOpacity>
              </Animated.View>
            </PanGestureHandler>
          : null}
        </>
      )
    }
  }

  useEffect(() => {
    try {
      if (allCredentialsStoredList) {
        if (allCredentialsStoredList.length == 0 || allCredentialsStoredList.length == 1) {
          Animated.timing(AccountSwitchedBoxY, {
            toValue: 250,
            duration: 1,
            useNativeDriver: true
          }).start();
        }
      }
      if (storedCredentials && allCredentialsStoredList) {
        if (allCredentialsStoredList.length > 1) {
          Animated.timing(AccountSwitchedBoxY, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          }).start()
          setTimeout(() => {
            Animated.timing(AccountSwitchedBoxY, {
              toValue: 250,
              duration: 100,
              useNativeDriver: true
            }).start()
          }, 3000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [storedCredentials])

  const handleAppAuth = () => {  
    const authenticate = async () => {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to unlock SocialSquare',
        disableDeviceFallback: false,
        fallbackLabel: "Unlock with password"
      });
      checkIfAuthenticationWasASuccess(biometricAuth)
    }
    const checkIfAuthenticationWasASuccess = (authenticationObject) => {
      if (authenticationObject.success == false) {
        setOpenApp(false)
        setShowSocialSquareLockedWarning(true)
      } else {
        setOpenApp(true)
        setShowSocialSquareLockedWarning(false)
      }
    }
    authenticate()
  }

  //If app goes into the background and then comes back into the foreground, if SocialSquare automatic locking is enabled, this will start biometric authentication
  useEffect(() => {
    if (previousAppStateVisible === 'inactive' && appStateVisible === 'active') {
      setOpenApp(true)
    } else if ((previousAppStateVisible == 'background' || previousAppStateVisible == 'justStarted') && openApp == false && lockSocialSquare == true && LocalAuthentication.SecurityLevel != 0 && AppOwnershipValue !== 'expo' && appStateVisible == 'active' && showSocialSquareLockedWarning == false) {
      handleAppAuth()
    } else {
      console.log('Biometrics are not available')
    }
  }, [appStateVisible])
  //If app gets quit and then reopened again and SocialSquare automatic locking is enabled, this will start biometric authentication
  useEffect(() => {
    async function checkToSeeIfAppShouldAthenticateOnLaunch() {
      if (await AsyncStorage.getItem('LockSocialSquare') == 'true' && appStateVisible == 'active' && LocalAuthentication.SecurityLevel != 0 && Constants.appOwnership !== 'expo') {
        handleAppAuth()
      } else if (appStateVisible == 'active' && await AsyncStorage.getItem('LockSocialSquare') == 'true') {
        setOpenApp(true)
        alert('Error happened with biometric/password automatic locking')
      } else if (appStateVisible == 'active') {
        setOpenApp(true)
      }
    }
    checkToSeeIfAppShouldAthenticateOnLaunch()
  }, [])

  const BadgeEarntBox = () => {
    const onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationY: BadgeEarntBoxY,
          },
        },
      ],
      { useNativeDriver: true }
    );
    const BoxPressed = () => {
      Animated.timing(BadgeEarntBoxY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true
      }).start();
    }
    const onHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        if (event.nativeEvent.absoluteY < StatusBarHeight) {
          Animated.timing(BadgeEarntBoxY, {
            toValue: -100,
            duration: 100,
            useNativeDriver: true
          }).start();
        } else {
          Animated.sequence([
            Animated.timing(BadgeEarntBoxY, {
              toValue: StatusBarHeight - 40,
              duration: 100,
              useNativeDriver: true
            }),
            Animated.delay(3000),
            Animated.timing(BadgeEarntBoxY, {
              toValue: -100,
              duration: 100,
              useNativeDriver: true
            })
          ]).start();
        }
      }
    }
    return(
      <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={{backgroundColor: 'rgba(0, 0, 0, 0.8)', height: 60, width: '90%', position: 'absolute', zIndex: 1000, top: 40, marginHorizontal: '5%', flexDirection: 'row', borderColor: 'black', borderRadius: 15, borderWidth: 1, transform: [{translateY: BadgeEarntBoxY.interpolate({inputRange: [0, 10], outputRange: [0, 10]})}]}}>
          <TouchableOpacity onPress={BoxPressed}>
            {badgeEarntNotification != 'Badge already earnt.' ?
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '20%', minWidth: '20%', maxWidth: '20%', justifyContent: 'center', alignItems: 'center'}}>
                  {getBadgeEarntNotificationIcon(badgeEarntNotification)}
                </View>
                <View style={{width: '80%', minWidth: '80%', maxWidth: '80%'}}>
                  <Text numberOfLines={1} style={{color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 15}}>Badge Earnt!</Text>
                  <Text numberOfLines={2} style={{color: 'white', fontSize: 14, marginTop: 2, marginRight: 15}}>{getBadgeEarntNotificationDescription(badgeEarntNotification)}</Text>
                </View>
              </View>
            :
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '20%', minWidth: '20%', maxWidth: '20%', justifyContent: 'center', alignItems: 'center'}}>
                  {getBadgeEarntNotificationIcon(badgeEarntNotification)}
                </View>
                <View style={{width: '80%', minWidth: '80%', maxWidth: '80%'}}>
                  <Text numberOfLines={1} style={{color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 15}}>Badge has already been earnt!</Text>
                  <Text numberOfLines={2} style={{color: 'white', fontSize: 14, marginTop: 2, marginRight: 15}}>This badge has already been earnt.</Text>
                </View>
              </View>
            }
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    )
  }

  useEffect(() => {
    if (badgeEarntNotification != '') {
      Vibration.vibrate(500)
      Animated.sequence([
        Animated.timing(BadgeEarntBoxY, {
          toValue: StatusBarHeight - 40,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.delay(3000),
        Animated.timing(BadgeEarntBoxY, {
          toValue: -100,
          duration: 100,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [badgeEarntNotification])

  const getBadgeEarntNotificationIcon = (badge) => {
    if (badge == 'HomeScreenLogoEasterEgg') {
      return (
        <MaterialCommunityIcons name="egg-easter" size={65} color={'white'} style={{marginTop: -3}}/>
      )
    } else {
      return <AntDesign name="exclamation" size={65} color={'white'} style={{marginTop: -3}}/>
    }
  }

  const getBadgeEarntNotificationDescription = (badge) => {
    if (badge == 'HomeScreenLogoEasterEgg') {
      return (
        'Congratulations! You have found the Home Screen Easter Egg!'
      )
    }
  }

  const Uploads = () => {
    if (numUploadErrors > 0 || numPostsUploading > 0) return (
      <TouchableOpacity onPress={() => navigationRef.navigate("UploadsScreen")} style={{paddingTop: ActualStatusBarHeight, backgroundColor: appTheme.colors.darkerPrimary, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingBottom: 10}}>
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{fontSize: 20, color: appTheme.colors.tertiary, fontWeight: 'bold', textAlign: 'center', maxWidth: '80%'}}>{numPostsUploading > 0 && numUploadErrors == 0 ? `Uploading ${numPostsUploading} ${numPostsUploading == 1 ? 'post' : 'posts'}` : numPostsUploading == 0 && numUploadErrors > 0 ? `${numUploadErrors} ${numUploadErrors == 1 ? 'upload' : 'uploads'} failed. Tap for more info.` : `Uploading ${numPostsUploading} ${numPostsUploading == 1 ? 'post' : 'posts'}. ${numUploadErrors} ${numUploadErrors == 1 ? 'upload' : 'uploads'} failed. Tap for more info.`}</Text>
        {numPostsUploading == 0 && numUploadErrors > 0 ? null : <ActivityIndicator color={appTheme.colors.brand} size="small" style={{marginLeft: 10}}/>}
      </TouchableOpacity>
    )

    return null;
  }

  useEffect(() => {
    async function cacheResourcesAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        AsyncStorage.getItem('socialSquareCredentials').then((result) => {
          if (result !== null) {
            setStoredCredentials(JSON.parse(result));
          } else {
            setStoredCredentials('');
          }
          async function refreshProfilePictureContext(credentials) {
            const getProfilePicture = () => {
              const url = `${serverUrl}/tempRoute/getProfilePic/${credentials.name}`;
      
              axios.get(url).then((response) => {
                  const result = response.data;
                  const {message, status, data} = result;
      
                  if (status !== 'SUCCESS') {
                      console.log('GETTING PROFILE PICTURE FOR ProfilePictureUriContext WAS NOT A SUCCESS')
                      console.log(status)
                      console.log(message)
                  } else {
                      console.log(status)
                      console.log(message)
                      axios.get(`${serverUrl}/getImage/${data}`)
                      .then((response) => {
                          const result = response.data;
                          const {message, status, data} = result;
                          console.log(status)
                          console.log(message)
                          console.log(data)
                          //set image
                          if (message == 'No profile image.' && status == 'FAILED') {
                              console.log('Setting logo to SocialSquare logo')
                              setProfilePictureUri(SocialSquareLogo_B64_png)
                          } else if (data) {
                                //convert back to image
                                console.log('Setting logo in tab bar to profile logo')
                                var base64Icon = `data:image/jpg;base64,${data}`
                                setProfilePictureUri(base64Icon)
                          } else {
                              console.log('Setting logo to SocialSquare logo')
                              setProfilePictureUri(SocialSquareLogo_B64_png)
                          }
                      })
                      .catch(function (error) {
                          console.log("Image not recieved")
                          console.log(error);
                      });
                  }
                  //setSubmitting(false);
      
              }).catch(error => {
                  console.error(error);
                  //setSubmitting(false);
                  handleMessage(ParseErrorMessage(error));
              })
            }
            let credentialsListObject = await AsyncStorage.getItem('socialSquare_AllCredentialsList');
            if (credentialsListObject == null && credentials) {
              setStoredCredentials('');
              setAllCredentialsStoredList([]);
            } else {
              let parsedCredentialsListObject = JSON.parse(credentialsListObject);
              setAllCredentialsStoredList(parsedCredentialsListObject);
              if (credentials && parsedCredentialsListObject[credentials.indexLength].profilePictureUri != null && parsedCredentialsListObject[credentials.indexLength].profilePictureUri != undefined) {
                console.log('Setting ProfilePictureUri context to profile picture in Async Storage')
                setProfilePictureUri(parsedCredentialsListObject[credentials.indexLength].profilePictureUri)
              } else {
                NetInfo.fetch().then(state => {
                  console.log("Connection type", state.type);
                  console.log("Is connected?", state.isConnected);
                  if (state.isConnected == true) {
                    if (credentials) {
                      console.log('There is no profile picture in AsyncStorage. Loading profile picture for ProfilePictureUri Context using internet connection')
                      getProfilePicture()
                    } else {
                      console.log('There is no stored credentials and no profile picture in Async Storage. Setting ProfilePictureUri to SocialSquareB64Logo')
                      setProfilePictureUri(SocialSquareLogo_B64_png)
                    }
                  } else {
                    console.log('There is no internet connection and no saved profile picture in Async Storage. Setting ProfilePictureUri to SocialSquareB64Logo')
                    setProfilePictureUri(SocialSquareLogo_B64_png)
                  }
                });
              }
            }
          }
          console.log('Getting profile picture for ProfilePictureUriContext')
          refreshProfilePictureContext(JSON.parse(result))
        }).catch((error) => console.error(error));
        await AsyncStorage.getItem('AppStylingContextState').then((result) => {
          if (result == null) {
            setAppStylingContextState('Default')
            AsyncStorage.setItem('AppStylingContextState', 'Default')
          } else if (result == 'Default') {
            setAppStylingContextState('Default')
          } else if (result == 'Dark') {
            setAppStylingContextState('Dark')
          } else if (result == 'Light') {
            setAppStylingContextState('Light')
          } else {
            setAppStylingContextState(result)
          }
        }).catch((error) => {console.error(error)})
        const images = [
          require('./assets/img/Logo.png'),
          require('./assets/app_icons/3dots.png'),
          require('./assets/app_icons/settings.png'),
          require('./assets/app_icons/find.png'),
          require('./assets/app_icons/home.png'),
          require('./assets/app_icons/chat.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/016-camera.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/007-pencil2.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/157-stats-bars.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/018-music.png'),
          require("./assets/record_button.png"),
          require("./assets/recording_icon.png"),
          require("./assets/app_icons/upload_arrow.png"),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/114-user.png'),
          require('./assets/app_icons/back_arrow.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/269-info.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/266-question.png'),
          require('./assets/lightmode_recordbutton.png'),
          require('./assets/lightmode_recordingicon.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/035-file-text.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png'),
          require('./assets/Splash_Screen.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/348-filter.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/115-users.png'),
          require('./assets/NewLogo.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/084-calendar.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/020-film.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/277-exit.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/207-eye.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/265-notification.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/113-bubbles4.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png'),
          require('./assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/387-share2.png'),
          require('./assets/img/ThreeDots.png'),

        ];

        const LockSocialSquareValue = await AsyncStorage.getItem('LockSocialSquare')
        const ShowPlaceholderScreenValue = await AsyncStorage.getItem('ShowPlaceholderScreen')
        const ExperimentalFeaturesEnabled = await AsyncStorage.getItem('ExperimentalFeaturesEnabled')

        if (LockSocialSquareValue != 'true') {
          setOpenApp(true)
        }

        if (LockSocialSquareValue == null) {
          setLockSocialSquare(false)
          AsyncStorage.setItem('LockSocialSquare', 'false')
        } else if (LockSocialSquareValue == 'true') {
          setLockSocialSquare(true)
        } else if (LockSocialSquareValue == 'false') {
          setLockSocialSquare(false)
        } else {
          console.error('LockSocialSquareValue is not what it is supposed to be: ' + LockSocialSquareValue)
        }

        if (ShowPlaceholderScreenValue == null) {
          setShowPlaceholderScreen(false)
          AsyncStorage.setItem('ShowPlaceholderScreen', 'false')
        } else if (ShowPlaceholderScreenValue == 'true') {
          setShowPlaceholderScreen(true)
        } else if (ShowPlaceholderScreenValue == 'false') {
          setShowPlaceholderScreen(false)
        }

        if (ExperimentalFeaturesEnabled == null) {
          setExperimentalFeaturesEnabled(false)
          AsyncStorage.setItem('ExperimentalFeaturesEnabled', 'false')
        } else if (ExperimentalFeaturesEnabled == 'true') {
          setExperimentalFeaturesEnabled(true)
        } else if (ExperimentalFeaturesEnabled == 'false') {
          setExperimentalFeaturesEnabled(false)
        } else {
          console.error('ExperimentalFeaturesEnabled is not what it is supposed to be: ' + ExperimentalFeaturesEnabled)
        }

        const compatibleWithBiometrics = await LocalAuthentication.hasHardwareAsync();
        const enrolledForBiometrics = await LocalAuthentication.isEnrolledAsync()
        const AppEnvironment = Constants.appOwnership
        setBiometricSupported(compatibleWithBiometrics);
        setBiometricsEnrolled(enrolledForBiometrics)
        setAppOwnershipValue(AppEnvironment)
        if (LocalAuthentication.SecurityLevel == 0 || AppEnvironment == 'expo') {
          setBiometricsCanBeUsed(false)
          setLockSocialSquare(false)
          AsyncStorage.setItem('LockSocialSquare', 'false')
          if (LockSocialSquareValue == 'true') {
            alert('Biometric locking has been turned off because SocialSquare cannot access biometric scanning. Please check that SocialSquare has biometric permissions and that your device has biometric profiles.')
          }
          setOpenApp(true)
        } else {
          setBiometricsCanBeUsed(true)
          if (LockSocialSquareValue === 'true') {
            handleAppAuth()
          }
        }

        await AsyncStorage.getItem('SocialSquareServerUrl').then(async value => {
          await AsyncStorage.getItem('SocialSquareServerUrlSetManually').then(urlSetManually => {
            if (urlSetManually === 'true') {
              setServerUrl(value)
            } else {
              setServerUrl(SERVER_URL)
            }
          }).catch(error => {
            alert("An error occurred while checking if server url was set manually. Server URL will be set to SocialSquare's default servers")
            console.error('An error occurred while getting key SocialSquareServerUrlSetManually from AsyncStorage:', error)
          })
        }).catch(error => {
          alert("An error occurred while getting your preferred SocialSquare server URL. The server URL will be set to SocialSqusre's default servers")
          console.error('An error occurred while getting key SocialSquareServerUrl from AsyncStorage:', error)
        })
    
        const cacheImages = images.map(image => {
          return Asset.fromModule(image).downloadAsync();
        }); 
        return Promise.all(cacheImages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsReady(true);
      }
    }
    cacheResourcesAsync();
  }, []);

  if (isReady == false) {
    return null
  } else {
    return (
      <CredentialsContext.Provider value={{storedCredentials, setStoredCredentials}}>
        <AdIDContext.Provider value={{AdID, setAdID}}>
          <AppStylingContext.Provider value={{AppStylingContextState, setAppStylingContextState}}>
            <RefreshAppStylingContext.Provider value={{refreshAppStyling, setRefreshAppStyling}}>
              <ProfilePictureURIContext.Provider value={{profilePictureUri, setProfilePictureUri}}>
                <ShowPlaceholderSceeenContext.Provider value={{showPlaceholderScreen, setShowPlaceholderScreen}}>
                  <LockSocialSquareContext.Provider value={{lockSocialSquare, setLockSocialSquare}}>
                    <OpenAppContext.Provider value={{openApp, setOpenApp}}>
                      <ShowAccountSwitcherContext.Provider value={{showAccountSwitcher, setShowAccountSwitcher}}>
                        <AllCredentialsStoredContext.Provider value={{allCredentialsStoredList, setAllCredentialsStoredList}}>
                          <ServerUrlContext.Provider value={{serverUrl, setServerUrl}}>
                            <BadgeEarntNotificationContext.Provider value={{badgeEarntNotification, setBadgeEarntNotification}}>
                              <OnlineContext.Provider value={{onlineUsers, setOnlineUsers}}>
                                <SocketContext.Provider value={{socket, setSocket}}>
                                  <ReconnectPromptContext.Provider value={{reconnectPrompt, setReconnectPrompt}}>
                                    <ExperimentalFeaturesEnabledContext.Provider value={{experimentalFeaturesEnabled, setExperimentalFeaturesEnabled}}>
                                      <UseUploadContext.Provider value={{uploadPost, retryUpload, cancelRetry, numPostsUploading, numUploadErrors, postsToUpload, postsUploading, uploadErrors}}>
                                        <StatusBarHeightContext.Provider value={StatusBarHeight}>
                                          <GestureHandlerRootView style={{flex: 1}}>
                                            {AppStylingContextState != 'Default' && AppStylingContextState != 'Light' && AppStylingContextState != 'Dark' && AppStylingContextState != 'PureDark' && AppStylingContextState != 'PureLight' ? previousStylingState.current != AppStylingContextState ? setCurrentSimpleStylingDataToStyle(AppStylingContextState) : null : null}
                                            <NavigationContainer ref={navigationRef} theme={appTheme} onStateChange={() => {console.log('Screen changed')}} onReady={() => {
                                              setTimeout(() => {
                                                // DOCS SAY TO USE ONLAYOUT ON A VIEW TO MAKE SURE THAT AS SOON AS CONTENT LOADS THE SPLASH SCREEN WILL HIDE
                                                // BUT BECAUSE WE DO NOT HAVE A PARENT VIEW LOADING I CANNOT SEE HOW THAT WOULD BE POSSIBLE
                                                // PR TO FIX THIS WOULD BE GREATLY APPRECIATED :)
                                                SplashScreen.hideAsync(); // Use setTimeout to prevent showing nothing while content loads
                                              }, 500);
                                            }}>
                                              {lockSocialSquare == false ?
                                                showPlaceholderScreen == true && (appStateVisible == 'background' || appStateVisible == 'inactive') &&
                                                    <Image source={require('./assets/Splash_Screen.png')} resizeMode="cover" style={{width: '100%', height: '100%', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 100, backgroundColor: '#3B4252', borderWidth: 0}}/>
                                                :
                                                  showSocialSquareLockedWarning == false ?
                                                    previousAppStateVisible == 'inactive' || previousAppStateVisible == 'background' ?
                                                      biometricsCanBeUsed == false ? null :
                                                        openApp == false ?
                                                            <Image source={require('./assets/Splash_Screen.png')} resizeMode="cover" style={{width: '100%', height: '100%', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 100, backgroundColor: '#3B4252', borderWidth: 0}}/>
                                                        : null
                                                    : appStateVisible == 'inactive' || appStateVisible == 'background' ?
                                                          <Image source={require('./assets/Splash_Screen.png')} resizeMode="cover" style={{width: '100%', height: '100%', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 100, backgroundColor: '#3B4252', borderWidth: 0}}/>
                                                      : openApp == false ? biometricsCanBeUsed == false ? null :
                                                          <Image source={require('./assets/Splash_Screen.png')} resizeMode="cover" style={{width: '100%', height: '100%', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 100, backgroundColor: '#3B4252', borderWidth: 0}}/>
                                                      : null
                                                  :
                                                    <View style={{position: 'absolute', height: '100%', width: '100%', top: 0, right: 0, backgroundColor: '#3B4252', zIndex: 1000, alignItems: 'center', paddingTop: StatusBarHeight}}>
                                                      <Image style={{width: 200, height: 200, zIndex: 1001}} source={{uri: SocialSquareLogo_B64_png}}/>
                                                      <Text style={{color: '#eceff4', fontSize: 30, position: 'absolute', right: '10%', textAlign: 'center', fontWeight: 'bold', top: StatusBarHeight + 230, zIndex: 1001, width: '80%'}}>SocialSquare is currently locked</Text>
                                                      <TouchableOpacity onPress={handleAppAuth} style={{position: 'absolute', top: 400, right: '25%', zIndex: 1001, width: '50%'}}>
                                                        <Text style={{color: '#88c0d0', fontSize: 24, fontWeight: 'bold', textDecorationLine: 'underline', textDecorationColor: '#88c0d0', textAlign: 'center'}}>Unlock now</Text>
                                                      </TouchableOpacity>
                                                    </View>
                                              }
                                              <BadgeEarntBox/>
                                              <NotificationBox/>
                                              <Animated.View style={{position: 'absolute', height: '100%', width: '100%', top: 0, right: 0, zIndex: DismissAccountSwitcherBoxActivated.interpolate({inputRange: [0, 1], outputRange: [-10, 997]})}}>
                                                <TouchableOpacity style={{height: '100%', width: '100%'}} onPress={() => {
                                                    console.log('Account Switcher Dismiss Box pressed')
                                                    Animated.timing(DismissAccountSwitcherBoxActivated, { toValue: 0, duration: 1, useNativeDriver: true }).start();
                                                    Animated.timing(AccountSwitcherY, {toValue: 250, duration: 100, useNativeDriver: true}).start()
                                                  }}
                                                />
                                              </Animated.View>
                                              {checkingConnectionPopUp !== false && (
                                                  <View style={{zIndex: 10, position: 'absolute', height: Dimensions.get('window').height, width: Dimensions.get('window').width}}>
                                                      <View style={{width: Dimensions.get('window').width * 0.8, top: Dimensions.get('window').height * 0.5, marginTop: Dimensions.get('window').height * -0.1, backgroundColor: appTheme.colors.primary, alignSelf: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 3, borderColor: appTheme.colors.tertiary}}>
                                                          <ButtonText style={{marginTop: 25, textAlign: 'center', color: appTheme.colors.tertiary, fontWeight: 'bold'}}> Checking Connection </ButtonText>
                                                          <View style={{width: Dimensions.get('window').width * 0.6, marginLeft: Dimensions.get('window').width * 0.1}}>
                                                              <ActivityIndicator size={30} color={appTheme.colors.brand} style={{marginBottom: 25}}/>
                                                          </View>
                                                      </View>
                                                  </View>
                                              )}
                                              <DisconnectedFromInternetBox/>
                                              <AccountSwitcher/>
                                              <AccountSwitchedBox/>
                                              <Uploads/>
                                              <Start_Stack />
                                            </NavigationContainer>
                                          </GestureHandlerRootView>
                                        </StatusBarHeightContext.Provider>
                                      </UseUploadContext.Provider>
                                    </ExperimentalFeaturesEnabledContext.Provider>
                                  </ReconnectPromptContext.Provider>
                                </SocketContext.Provider>
                              </OnlineContext.Provider>
                            </BadgeEarntNotificationContext.Provider>
                          </ServerUrlContext.Provider>
                        </AllCredentialsStoredContext.Provider>
                      </ShowAccountSwitcherContext.Provider>
                    </OpenAppContext.Provider>
                  </LockSocialSquareContext.Provider>
                </ShowPlaceholderSceeenContext.Provider>
              </ProfilePictureURIContext.Provider>
            </RefreshAppStylingContext.Provider>
          </AppStylingContext.Provider>
        </AdIDContext.Provider>
      </CredentialsContext.Provider>

    );
  }
};

const ExportApp = () => {
  return (
      <ErrorBoundary>
        <App/>
      </ErrorBoundary>
  )
}

export default ExportApp;

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        }
      }
    );
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: EXPOPROJECTID
    })).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


import SocialSquareLogo_B64_png from "../assets/SocialSquareLogo_Base64_png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";

function deleteHeaders() {
    delete axios.defaults.headers.common['auth-web-token'];
    delete axios.defaults.headers.common['auth-refresh-token'];
}

export function Logout(storedCredentials, setStoredCredentials, allCredentialsStoredList, setAllCredentialsStoredList, navigation, setProfilePictureUri) {
    deleteHeaders()
    if (storedCredentials && allCredentialsStoredList) {
        if (allCredentialsStoredList.length == 1 || allCredentialsStoredList.length == 0 || allCredentialsStoredList == undefined || allCredentialsStoredList == null) {
            console.log('Running logout code for when allCredentialsStoredLists length is 1 or 0');
            setProfilePictureUri(SocialSquareLogo_B64_png);
            AsyncStorage.removeItem('socialSquareCredentials').then(() => {
                setStoredCredentials(null)
            })
            AsyncStorage.removeItem('socialSquare_AllCredentialsList').then(() => {
                setAllCredentialsStoredList(null)
            })
            Promise.all([
                SecureStore.deleteItemAsync(storedCredentials._id + '-auth-web-token'),
                SecureStore.deleteItemAsync(storedCredentials._id + '-auth-refresh-token'),
            ]).then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                });
            }).catch(error => {
                console.error(error)
                alert('An error occurred while logging out:' + error)
            })
        } else {
            const userIndex = allCredentialsStoredList.findIndex(x => x._id == storedCredentials._id)
            console.log('Running logout code for when allCredentialsStoredLists length is not 1 or 0')
            allCredentialsStoredList.splice(userIndex, 1);
            AsyncStorage.setItem('socialSquare_AllCredentialsList', JSON.stringify(allCredentialsStoredList)).then(() => {
                setAllCredentialsStoredList(allCredentialsStoredList)
            });
            AsyncStorage.setItem('socialSquareCredentials', JSON.stringify(allCredentialsStoredList[0])).then(() => {
                setProfilePictureUri(allCredentialsStoredList[0].profilePictureUri)
                setStoredCredentials(allCredentialsStoredList[0])
            });
            Promise.all([
                SecureStore.deleteItemAsync(storedCredentials._id + '-auth-web-token'),
                SecureStore.deleteItemAsync(storedCredentials._id + '-auth-refresh-token'),
            ]).then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs' }],
                })
            }).catch(error => {
                console.error(error)
                alert('An error occurred while logging out:' + error)
            })
        }
    } else {
        setProfilePictureUri(SocialSquareLogo_B64_png);
        AsyncStorage.removeItem('socialSquareCredentials').then(() => {
            setStoredCredentials(null)
        })
        AsyncStorage.removeItem('socialSquare_AllCredentialsList').then(() => {
            setAllCredentialsStoredList(null)
        })
        Promise.all([
            SecureStore.deleteItemAsync(storedCredentials._id + '-auth-web-token'),
            SecureStore.deleteItemAsync(storedCredentials._id + '-auth-refresh-token'),
        ]).then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            });
        }).catch(error => {
            console.error(error)
            alert('An error occurred while logging out:' + error)
        })
    }
}

export async function LogoutOfAllAccounts(allCredentialsStoredList, setStoredCredentials, setAllCredentialsStoredList, navigation, setProfilePictureUri) {
    deleteHeaders()
    setStoredCredentials(null)
    setAllCredentialsStoredList(null)
    setProfilePictureUri(SocialSquareLogo_B64_png);
    await AsyncStorage.removeItem('socialSquareCredentials')
    await AsyncStorage.removeItem('socialSquare_AllCredentialsList')


    if (allCredentialsStoredList) {
        const operations = [
            ...allCredentialsStoredList.map(credentials => {
                return SecureStore.deleteItemAsync(credentials._id + '-auth-web-token')
            }),
            ...allCredentialsStoredList.map(credentials => {
                return SecureStore.deleteItemAsync(credentials._id + '-auth-refresh-token')
            })
        ]

        Promise.all(operations).then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            });
        }).catch(error => {
            console.error(error)
            alert('An error occurred while logging out:' + error)
        })
    } else {
        navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
        });
    }
}
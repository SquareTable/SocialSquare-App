import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

export const setAuthAsHeaders = async (userId) => {
    console.log("Setting auth as header")
    let AUTH_TOKEN = await SecureStore.getItemAsync(userId + '-auth-web-token')
    let REFRESH_TOKEN = await SecureStore.getItemAsync(userId + '-auth-refresh-token')
    if (AUTH_TOKEN) {
        console.log("auth token:")
        console.log(AUTH_TOKEN)
        axios.defaults.headers.common['auth-web-token'] = AUTH_TOKEN;
    } else {
        console.log("Error with getting auth token.")
    }
    if (REFRESH_TOKEN) {
        console.log("refresh token:")
        console.log(REFRESH_TOKEN)
        axios.defaults.headers.common['auth-refresh-token'] = REFRESH_TOKEN;
    } else {
        console.log("Error with getting refresh token.")
    }
}

export const storeJWT = async (tokens, userId) => {
    if (tokens.webToken !== "") {
        await SecureStore.setItemAsync(userId + '-auth-web-token', tokens.webToken)
        console.log("Set: " + userId + '-auth-web-token'+ JSON.stringify(tokens.webToken))
    }
    if (tokens.refreshToken !== "") {
        await SecureStore.setItemAsync(userId + "-auth-refresh-token", tokens.refreshToken)
        console.log("Set: " + userId + "-auth-refresh-token" + JSON.stringify(tokens.refreshToken))
    }
    await setAuthAsHeaders(userId)
    return
}

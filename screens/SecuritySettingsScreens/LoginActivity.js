import React, {useContext, useState, useEffect, Component} from 'react';
import { useTheme } from '@react-navigation/native';
import {View, SafeAreaView, Text, TouchableOpacity, Image, ActivityIndicator, FlatList} from 'react-native';
import {
    StyledButton,
    ButtonText
} from '../screenStylings/styling.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CredentialsContext} from '../../components/CredentialsContext';
import { StatusBarHeightContext } from '../../components/StatusBarHeightContext.js';
import axios from 'axios';
import { ServerUrlContext } from '../../components/ServerUrlContext.js';
import { getTimeFromUTCMS } from '../../libraries/Time.js';
import ParseErrorMessage from '../../components/ParseErrorMessage.js';
import TopNavBar from '../../components/TopNavBar.js';

class RefreshTokenItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        console.log(this.props.refreshToken)
        return (
            <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingVertical: 5}}>
                <View style={{flexDirection: 'column'}}>
                    <Text style={{color: this.props.colors.tertiary, fontSize: 20}}>Device: {this.props.refreshToken.deviceType || 'Unknown device'}</Text>
                    <Text style={{color: this.props.colors.tertiary, fontSize: 20}}>IP: {this.props.refreshToken.IP || 'Unknown IP'}</Text>
                    <Text style={{color: this.props.colors.tertiary, fontSize: 20}}>Location: {this.props.refreshToken.location || 'Unknown location'}</Text>
                    <Text style={{color: this.props.colors.tertiary, fontSize: 20}}>Time of Login: {getTimeFromUTCMS(new Date(this.props.refreshToken.loginTime).getTime()) || 'Unknown time'}</Text>
                    {this.props.refreshToken.currentDevice && <Text style={{color: this.props.colors.green, fontSize: 20, fontWeight: 'bold'}}>This Device</Text>}
                </View>
                <View style={{marginRight: 10}}>
                    <TouchableOpacity onPress={() => this.props.logDeviceOut(this.props.refreshToken.refreshTokenId)} style={{justifyContent: 'center', alignItems: 'center', borderColor: this.props.colors.borderColor, borderWidth: 3, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5}}>
                        <Text style={{color: this.props.colors.tertiary, fontSize: 16, fontWeight: 'bold'}}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const LoginActivity = ({navigation}) => {
    const {colors, dark} = useTheme()
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const [error, setError] = useState(null)
    const [refreshTokens, setRefreshTokens] = useState([])
    const [loading, setLoading] = useState(false)
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)

    const logDeviceOut = (tokenId) => {
        const url = serverUrl + '/tempRoute/logoutdevice'
        const toSend = {
            tokenToLogout: tokenId
        }

        axios.post(url, toSend).then(response => {
            const result = response.data;
            const {status, message} = result;

            if (status !== 'SUCCESS') {
                alert(message)
            } else {
                setRefreshTokens(tokens => {
                    const newTokens = [...tokens]
                    const index = newTokens.findIndex(token => token.refreshTokenId === tokenId)

                    if (index !== -1) {
                        newTokens.splice(index, 1);
                        return newTokens;
                    }

                    return tokens;
                })
            }
        }).catch(error => {
            alert(ParseErrorMessage(error))
        })
    }

    const loadRefreshTokens = () => {
        if (!loading) {
            setError(null)
            setLoading(true)
            const url = serverUrl + '/tempRoute/loginactivity'
            axios.get(url).then(response => {
                const result = response.data;
                const {status, message, data} = result;

                if (status !== 'SUCCESS') {
                    setError(message || 'An unknown error occurred. Please try again.')
                } else {
                    setRefreshTokens(data)
                }

                setLoading(false)
            }).catch(error => {
                console.error(error)
                setError(ParseErrorMessage(error))
                setLoading(false)
            })
        }
    }

    const logoutOtherDevices = () => {
        const indexOfCurrentDevice = refreshTokens.findIndex(token => token.currentDevice)

        const url = serverUrl + '/tempRoute/logoutallotherdevices'
        const toSend = {
            tokenIdNotToLogout: indexOfCurrentDevice !== -1 ? refreshTokens[indexOfCurrentDevice].refreshTokenId : null
        }

        axios.post(url, toSend).then(response => {
            const result = response.data;
            const {status, message} = result;

            if (status !== 'SUCCESS') {
                alert(message || 'An unknown error occurred. Please try again.')
            } else {
                setRefreshTokens(tokens => {
                    if (indexOfCurrentDevice === -1) {
                        return []
                    }

                    return tokens.splice(indexOfCurrentDevice, 1)
                })
            }
        }).catch(error => {
            console.error(error)
            alert(ParseErrorMessage(error))
        })
    }

    useEffect(() => {
        loadRefreshTokens()
    }, [])

    return(
        <>
            <TopNavBar screenName="Login Activity"/>
            {storedCredentials ?
                <>
                    <TouchableOpacity onPress={() => {navigation.navigate('LoginActivitySettings')}} style={{borderColor: colors.borderColor, borderWidth: 2, justifyContent: 'center', alignItems: 'center', paddingVertical: 10}}>
                        <Text style={{color: colors.brand, fontWeight: 'bold'}}>Open Login Activity Settings</Text>
                    </TouchableOpacity>
                    {
                        error ?
                            <TouchableOpacity onPress={loadRefreshTokens} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center'}}>{error}</Text>
                                <Ionicons name="reload" size={50} color={colors.errorColor} />
                            </TouchableOpacity>
                        : loading ?
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <ActivityIndicator size="large" color={colors.brand}/>
                            </View>
                        :
                            <>
                                <TouchableOpacity onPress={logoutOtherDevices} style={{justifyContent: 'center', alignItems: 'center', borderColor: colors.red, borderWidth: 3, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, margin: 10}}>
                                    <Text style={{color: colors.tertiary, fontSize: 16, fontWeight: 'bold'}}>Logout all other devices</Text>
                                </TouchableOpacity>
                                <FlatList
                                    data={refreshTokens}
                                    renderItem={({item, index}) => <RefreshTokenItem colors={colors} refreshToken={item} logDeviceOut={logDeviceOut}/>}
                                    ItemSeparatorComponent={() => <View style={{minHeight: 2, height: 2, maxHeight: 2, backgroundColor: colors.tertiary}}/>}
                                    ListHeaderComponent={() => <View style={{minHeight: 2, height: 2, maxHeight: 2, backgroundColor: colors.tertiary}}/>}
                                    ListFooterComponent={() => <View style={{minHeight: 2, height: 2, maxHeight: 2, backgroundColor: colors.tertiary}}/>}
                                />
                            </>
                    }
                </>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to check login activity</Text>
                    <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                        <ButtonText> Login </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                            <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    );
}

export default LoginActivity;
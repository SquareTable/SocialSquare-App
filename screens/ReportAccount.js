import React, {useState, useContext} from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText,
    ReportProfileOptionsViewButtons,
    ReportProfileOptionsViewButtonsText,
    ReportProfileOptionsViewSubtitleText
} from './screenStylings/styling';
import axios from 'axios';
import { CredentialsContext } from '../components/CredentialsContext';
import { useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import { ServerUrlContext } from '../components/ServerUrlContext';
import ParseErrorMessage from '../components/ParseErrorMessage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReportAccount = ({navigation, route: routeData}) => {
    const { colors } = useTheme();
    const [route, setRoute] = useState(null)
    const [sendingReport, setSendingReport] = useState(false)
    const [error, setError] = useState(null)
    const {storedCredentials} = useContext(CredentialsContext)
    const StatusBarHeight = useContext(StatusBarHeightContext)
    const {reportedAccountPubId} = routeData.params;
    const [reportSent, setReportSent] = useState(false)
    const [lastReportType, setLastReportType] = useState(null)
    const {serverUrl} = useContext(ServerUrlContext)

    const submitReportOfAccount = (reportType) => {
        if (storedCredentials) {
            if (reportType !== lastReportType) {
                setLastReportType(reportType)
            }
            setSendingReport(true)
            setError(null)
            axios.post(serverUrl + '/tempRoute/reportUser', {reportType: reportType || lastReportType, reporteePubId: reportedAccountPubId}).then(response => {
                const result = response.data;
                const { message, status } = result;
                
                if (status !== "SUCCESS") {
                    console.log("FAILED: " + message)
                    setError(message)
                    setSendingReport(false)
                } else {
                    setSendingReport(false)
                    setError(null)
                    setReportSent()
                    setReportSent(true)
                }
    
            }).catch(error => {
                console.log("An error occured while reporting user.")
                console.error(error)
                setSendingReport(false)
                setError(ParseErrorMessage(error))
            })
        } else {
            navigation.navigate('ModalLoginScreen', {modal: true})
        }
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
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Report Account</TestText>
            </ChatScreen_Title>
            {
                reportSent ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Report Sent</Text>
                        <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center'}}>Thank you for helping SocialSquare be a better platform.</Text>
                        <TouchableOpacity onPress={navigation.goBack} style={{borderColor: colors.tertiary, paddingVertical: 15, paddingHorizontal: 10, borderWidth: 2, borderRadius: 10, marginTop: 20}}>
                            <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                :
                sendingReport ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Loading...</Text>
                        <ActivityIndicator color={colors.brand} size="large"/>
                    </View>
                : error ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>{error}</Text>
                        <TouchableOpacity onPress={() => submitReportOfAccount(lastReportType)}>
                            <Ionicons name="reload" size={50} color={colors.errorColor} />
                        </TouchableOpacity>
                    </View>
                :
                    <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                        {
                            route == null ?
                                <>
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => setRoute('inappropriate-content')}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is posting content that should not be on SocialSquare</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => setRoute('underaged')}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is run by someone under 13</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => setRoute('impersonation')}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be someone they're not</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                </>
                            : route == 'inappropriate-content' ?
                                <>
                                    <ReportProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>What content are you trying to report?</ReportProfileOptionsViewSubtitleText>
                                    <ReportProfileOptionsViewButtons padding={true} paddingAmount={'100px'} greyButton={true} onPress={() => setRoute(null)}>
                                        <ReportProfileOptionsViewButtonsText greyButton={true}>Back</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Spam"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>It's spam</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Nudity/Sexual"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Nudity or sexual activity</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Don't Like"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>I just don't like it</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Hate"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Hate speech or symbols</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "SelfHarm"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Suicide, self-injury or eating disorders</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Illegal/Regulated goods"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Sale of illegal or regulated goods</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Violence/Dangerous"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Violence or dangerous organizations</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Bullying/Harassment"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Bullying or harassment</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Intellectual property violation"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Intellectual property violation</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "Scam/Fraud"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Scam or fraud</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Content", subTopic: "False Info"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>False information</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                </>
                            : route == 'underaged' ?
                                <>
                                    <ReportProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>User May Be Under 13</ReportProfileOptionsViewSubtitleText>
                                    <ReportProfileOptionsViewButtons greyButton={true} onPress={() => setRoute(null)}>
                                        <ReportProfileOptionsViewButtonsText greyButton={true}>Back</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                    <Text style={{color: colors.tertiary, fontSize: 18, textAlign: 'center', marginTop: 25, marginBottom: 10}}>Everyone must be at least 13 to have a SocialSquare account. In some jurisdictions, this age limit may be higher. If you would like to report an account because it belongs to someone under the age of 13, or someone is impresonating your child who's under 13, please press the report button.</Text>
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Age", subTopic: "Underage"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>Send report</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                </>
                            : route == 'impersonation' ?
                                <>
                                    <ReportProfileOptionsViewSubtitleText style={{color: colors.tertiary}}>User Is Pretending To Be Someone Else</ReportProfileOptionsViewSubtitleText>
                                    <ReportProfileOptionsViewButtons greyButton={true} onPress={() => setRoute(null)}>
                                        <ReportProfileOptionsViewButtonsText greyButton={true}>Back</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Impersonation", subTopic: "Of Reporter"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be me</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Impersonation", subTopic: "Of Someone Reporter Knows"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be someone I know</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Impersonation", subTopic: "Celebrity/Public"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be a celebrity or public figure</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons> 
                                    <ReportProfileOptionsViewButtons redButton={true} onPress={() => submitReportOfAccount({topic: "Impersonation", subTopic: "Business/Organisation"})}>
                                        <ReportProfileOptionsViewButtonsText redButton={true}>This account is pretending to be a business or organisation</ReportProfileOptionsViewButtonsText>
                                    </ReportProfileOptionsViewButtons>
                                </>
                            :
                                <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', fontWeight: 'bold'}}>An error occured. This is a bug.</Text>
                        }
                        <View style={{height: 50}}/>
                    </ScrollView>
                }
        </>
    )
}

export default ReportAccount;
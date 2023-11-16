import React, {useContext, useState, forwardRef, useRef} from 'react';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import {
    StyledFormArea,
    StyledButton,
    ButtonText,
    StyledInputLabel,
    LeftIcon,
    StyledTextInput
} from './screenStylings/styling';
import { Text, Image, ScrollView, TouchableOpacity, View, Keyboard, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import useIsKeyboardVisible from '../hooks/useIsKeyboardVisible';
import { Formik } from 'formik';
import {Octicons} from '@expo/vector-icons';
import axios from 'axios';
import { ServerUrlContext } from '../components/ServerUrlContext';
import ParseErrorMessage from '../components/ParseErrorMessage';
import TopNavBar from '../components/TopNavBar';


const ReportPost = ({navigation, route}) => {
    const StatusBarHeight = useContext(StatusBarHeightContext)
    const {postId, postFormat} = route.params;
    const {colors} = useTheme()
    const otherReasonRef = useRef();
    const [sendingReport, setSendingReport] = useState(false);
    const [error, setError] = useState(null);
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [reportSent, setReportSent] = useState(false)
    const [previousReason, setPreviousReason] = useState(null)
    const [otherReasonShowing, setOtherReasonShowing] = useState(false);

    const keyboardVisible = useIsKeyboardVisible();

    const ReportButton = (props) => {
        const onPress = props.onPress ? props.onPress : () => sendReport(props.children)
        return (
            <TouchableOpacity style={{color: colors.borderColor, borderTopWidth: 3, borderBottomWidth: 3}} onPress={onPress}>
                <Text style={{color: colors.tertiary, fontSize: 20, paddingVertical: 10, fontWeight: 'bold'}}>{props.children}</Text>
            </TouchableOpacity>
        )
    }

    const sendReport = (reason) => {
        Keyboard.dismiss()
        setSendingReport(true)
        setError(null)
        setPreviousReason(reason)

        const url = serverUrl + '/tempRoute/reportPost'
        const toSend = {
            postId,
            postFormat,
            reason
        }

        axios.post(url, toSend).then(response => {
            const {message, status} = response.data;

            if (status !== 'SUCCESS') {
                setError(message)
            } else {
                setReportSent(true)
            }
        }).catch(error => {
            console.error(error)
            setError(ParseErrorMessage(error))
        })
    }

    return (
        <>
            <TopNavBar screenName="Report Post"/>

            {reportSent ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Report Sent</Text>
                    <Text style={{color: colors.tertiary, fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center'}}>Thank you for helping SocialSquare be a better platform.</Text>
                    <TouchableOpacity onPress={navigation.goBack} style={{borderColor: colors.tertiary, paddingVertical: 15, paddingHorizontal: 10, borderWidth: 2, borderRadius: 10, marginTop: 20}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            :
                <ScrollView keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag' style={{flex: 1, height: '100%'}}>
                    <Formik
                        initialValues={{reason: ''}}
                        onSubmit={(values, {setSubmitting}) => {
                            if (values.reason.trim().length == 0) {
                                alert('Please add a reason')
                                setSubmitting(false);
                            } else {
                                sendReport(values.reason)
                            }
                        }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea style={otherReasonShowing ? {alignSelf: 'center'} : {position: 'absolute', top: 3000, zIndex: -3}}>
                                <UserTextInput
                                    icon="comment-discussion"
                                    placeholder="Reason for report goes here"
                                    placeholderTextColor={colors.tertiary}
                                    onChangeText={handleChange('reason')}
                                    onBlur={(props) => {
                                        handleBlur('reason')(props);
                                        setOtherReasonShowing(false)
                                    }}
                                    value={values.reason}
                                    style={{backgroundColor: colors.primary, color: colors.tertiary, height: 100}}
                                    multiline
                                    ref={otherReasonRef}
                                    colors={colors}
                                    onFocus={() => setOtherReasonShowing(true)}
                                />

                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText> Submit Report </ButtonText>
                                </StyledButton>

                                <TouchableOpacity onPress={Keyboard.dismiss} style={{borderColor: colors.tertiary, paddingVertical: 15, paddingHorizontal: 10, borderWidth: 2, borderRadius: 10, marginTop: 20}}>
                                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Cancel</Text>
                                </TouchableOpacity>
                            </StyledFormArea>
                        )}
                    </Formik>
                    {error ?
                        <>
                            <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                            <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', marginTop: 10, textAlign: 'center'}}>{error}</Text>
                            <TouchableOpacity onPress={navigation.goBack} style={{borderColor: colors.errorColor, paddingVertical: 15, paddingHorizontal: 10, borderWidth: 2, borderRadius: 10, marginTop: 20}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => sendReport(previousReason)} style={{borderColor: colors.tertiary, paddingVertical: 15, paddingHorizontal: 10, borderWidth: 2, borderRadius: 10, marginTop: 20}}>
                                <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Retry</Text>
                            </TouchableOpacity>
                        </>
                    : sendingReport ?
                        <>
                            <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>Sending report...</Text>
                            <ActivityIndicator color={colors.brand} size="large"/>
                        </>
                    :
                        !otherReasonShowing ?
                            <>
                                <ReportButton>Scam or fraud</ReportButton>
                                <ReportButton>Hate speech or symbols</ReportButton>
                                <ReportButton>Nudity or Sexual Activity</ReportButton>
                                <ReportButton>Bullying or harassment</ReportButton>
                                <ReportButton>Suicide or self-injury</ReportButton>
                                <ReportButton>Violence or dangerous organisations</ReportButton>
                                <ReportButton>Sale of illegal or regulated goods</ReportButton>
                                <ReportButton onPress={() => otherReasonRef.current.focus()}>Something else</ReportButton>
                            </>
                        : null
                    }
                </ScrollView>
            }
        </>
    )
}

 const UserTextInput = forwardRef(({label, icon, colors, ...props}, ref) => {
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} ref={ref}/>
        </View>
    )
})

export default ReportPost;
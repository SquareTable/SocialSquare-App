import React, {useContext, useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    SubTitle,
    Avatar,
    StyledContainer,
    StyledInputLabel,
    StyledTextInput,
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling';

//axios
import axios from 'axios';


import { View, Image, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import ParseErrorMessage from '../components/ParseErrorMessage';
import usePostReducer from '../hooks/usePostReducer';
import ThreadPost from '../components/Posts/ThreadPost';
import Comments from '../components/Comments/Comments';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';

const ThreadViewPage = ({navigation, route}) => {
    const [postReducer, dispatch] = usePostReducer();
    const [deleted, setDeleted] = useState(false);
    const {colors, dark, colorsIndexNum} = useTheme()
    const {threadId, creatorPfpB64} = route.params;
    
    //ServerStuff
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    //change stuff
    const [limitRefresh, setLimitRefresh] = useState(false)
    const [threadCategory, setThreadCategory] = useState("Finding")
    const [creatorDisplayName, setCreatorDisplayName] = useState("Finding")
    const [creatorName, setCreatorName] = useState("Finding")
    const [categoryImageB64, setCategoryImageB64] = useState("Finding")
    // Server stuff
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const StatusBarHeight = useContext(StatusBarHeightContext);

    //any image honestly
    async function getImageWithKey(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    //Refresh All Values
    const refreshAllValues = () => {
        const changeValues = async (data) => {
            let imageB64Var = null
            if (data.threadImageKey !== "") {
                console.log(data.threadImageKey)
                imageB64Var = await getImageWithKey(data.threadImageKey)
            }

            data.creatorImageB64 = creatorPfpB64
            data.imageInThreadB64 = imageB64Var

            dispatch({type: 'addPosts', posts: [data]})
            setCreatorDisplayName(data.creatorDisplayName)
            setCreatorName(data.creatorName)

            //Get category image
            let categoryB64Var = null
            if (data.categoryImageKey !== "") {
                console.log(data.categoryImageKey)
                categoryB64Var = await getImageWithKey(data.categoryImageKey)
            } 
            setCategoryImageB64(categoryB64Var)
            setThreadCategory(data.threadCategory)
        }
        const url = `${serverUrl}/tempRoute/getthreadbyid`;
        const toSend = {
            threadId
        }
        
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;
    
            if (status !== 'SUCCESS') {
                console.log("Failed")
                handleMessage(message, status);
            } else {
                console.log("SUCCESS getting thread by ID")
                changeValues(data);
            }
            //setSubmitting(false);
        }).catch(error => {
            console.error(error);
            //setSubmitting(false);
            handleMessage(ParseErrorMessage(error));
        })
    }

    if (limitRefresh == false) {
        setLimitRefresh(true);
        refreshAllValues();
    }

    const isFocused = useIsFocused();

    const onDeleteCallback = () => {
        if (isFocused) {
            navigation.goBack();
        } else {
            setDeleted(true)
        }
    }

    useEffect(() => {
        if (isFocused && deleted) navigation.goBack();
    }, [isFocused])

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <ChatScreen_Title style={{backgroundColor: dark ? colors.darkest : colors.greyish, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{creatorDisplayName ? creatorDisplayName : creatorName}'s thread</TestText>
            </ChatScreen_Title>
            <View style={{width: '100%', backgroundColor: dark ? colors.darkest : colors.greyish, alignItems: 'center', paddingBottom: 2, paddingTop: 0}}>
                <Avatar style={{height: 70, width: 70, marginBottom: 0}} source={{uri: categoryImageB64 == null || categoryImageB64 == "Finding" ? SocialSquareLogo_B64_png : categoryImageB64}}/>
                <SubTitle style={{marginBottom: 0, color: colors.tertiary}}>Category: {threadCategory}</SubTitle>
            </View>
            {postReducer.posts.length > 0 ?
                <KeyboardAvoidingScrollView>
                    <ThreadPost post={postReducer.posts[0]} colors={colors} colorsIndexNum={colorsIndexNum} dispatch={dispatch} index={0} onDeleteCallback={onDeleteCallback}/>
                    <Comments postId={postReducer.posts[0]._id} postFormat="Thread"/>
                </KeyboardAvoidingScrollView>
            :
                <ScrollView>
                    <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Loading thread... (At some point we should put a loading animation here)</Text>
                    <ActivityIndicator color={colors.brand} size="large"/>
                </ScrollView>
            }
        </>
    );
}

export default ThreadViewPage;
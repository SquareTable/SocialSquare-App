import React, {useContext, useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    SubTitle,
    Avatar
} from './screenStylings/styling';

//axios
import axios from 'axios';


import { View, TouchableOpacity } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import usePostReducer from '../hooks/usePostReducer';
import ThreadPost from '../components/Posts/ThreadPost';
import Comments from '../components/Comments/Comments';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';
import TopNavBar from '../components/TopNavBar.js';

const ThreadViewPage = ({navigation, route}) => {
    const [postReducer, dispatch] = usePostReducer();
    const [deleted, setDeleted] = useState(false);
    const {colors, dark, colorsIndexNum} = useTheme()

    const {post} = route.params;

    useEffect(() => {
        dispatch({type: 'addPosts', posts: [post]})
    }, [])
    

    //change stuff
    const [categoryImageB64, setCategoryImageB64] = useState("Finding")
    // Server stuff
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    useEffect(() => {
        const abortController = new AbortController();

        if (post.categoryImageKey && post.categoryImageKey !== "") {
            const url = serverUrl + '/getImageOnServer/' + post.categoryImageKey;
            axios.get(url, {signal: abortController.signal}).then(res => {
                setCategoryImageB64('data:image/jpeg;base64,' + res.data)
            }).catch(error => {
                console.error('Error loading image:', error)
            })
        }

        return () => {
            abortController.abort();
        }
    }, [])

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

    const navigateToCategoryViewPage = () => {
        navigation.navigate('CategoryViewPage', {categoryId: post.categoryId, categoryTitle: post.threadCategory})
    }

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <TopNavBar screenName={(postReducer.posts.length > 0 ? (postReducer.posts[0].creatorDisplayName || postReducer.posts[0].creatorName) : 'Finding') + "'s thread"} extraStyles={{backgroundColor: dark ? colors.darkest : colors.greyish}}/>
            <View style={{width: '100%', backgroundColor: dark ? colors.darkest : colors.greyish, alignItems: 'center', paddingBottom: 2, paddingTop: 0}}>
                <TouchableOpacity onPress={navigateToCategoryViewPage}>
                    <Avatar style={{height: 70, width: 70, marginBottom: 0}} source={{uri: categoryImageB64 == null || categoryImageB64 == "Finding" ? SocialSquareLogo_B64_png : categoryImageB64}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToCategoryViewPage}>
                    <SubTitle style={{marginBottom: 0, color: colors.tertiary}}>{postReducer.posts.length > 0 ? 'Category: ' + post.threadCategory : ''}</SubTitle>
                </TouchableOpacity>
            </View>
            {postReducer.posts.length > 0 ?
                <KeyboardAvoidingScrollView>
                    <ThreadPost post={postReducer.posts[0]} colors={colors} colorsIndexNum={colorsIndexNum} dispatch={dispatch} index={0} onDeleteCallback={onDeleteCallback}/>
                    <Comments postId={postReducer.posts[0]._id} postFormat="Thread"/>
                </KeyboardAvoidingScrollView>
            : null}
        </>
    );
}

export default ThreadViewPage;
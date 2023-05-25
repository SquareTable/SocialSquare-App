import React, {useState, useContext, Component, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import {Formik} from 'formik';

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';


import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar,
    Colors,
    StyledContainer,
    ProfileHorizontalView,
    ProfileHorizontalViewItem,
    ProfIcons,
    ProfInfoAreaImage,
    ProfileBadgesView,
    ProfileBadgeIcons,
    ProfilePostsSelectionView,
    ProfilePostsSelectionBtns,
    ProfileGridPosts,
    ProfileFeaturedPosts,
    ProfileTopBtns,
    TopButtonIcons,
    ProfileSelectMediaTypeItem,
    ProfileSelectMediaTypeHorizontalView,
    ProfileSelectMediaTypeIcons,
    ProfileSelectMediaTypeIconsBorder,
    PollPostFrame,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    PollPostTitle,
    PollPostSubTitle,
    PollBarOutline,
    PollBarItem,
    PollKeyViewOne,
    PollKeyViewTwo,
    PollKeyViewThree,
    PollKeyViewFour,
    PollKeyViewFive,
    PollKeyViewSix,
    PollKeysCircle,
    PollPostHorizontalView,
    PollPostIcons,
    AboveBarPollPostHorizontalView,
    BottomPollPostHorizontalView,
    LikesView,
    CommentsView,
    PollBottomItem,
    ViewScreenPollPostFrame,
    PollHorizontalViewItem,
    PollHorizontalViewItemCenter,
    ViewScreenPollPostCommentsFrame,
    CommentsContainer,
    CommenterName,
    CommenterIcon,
    CommentsHorizontalView,
    CommentsVerticalView,
    CommentText,
    CommentIcons,
    CommentsHorizontalViewItem,
    VoteText,
    MsgBox,
    VoteTextBox,
    MultiMediaPostFrame,
    ImagePostFrame,
    PostCreatorIcon,
    PostsHorizontalView,
    PostsVerticalView,
    PostHorizontalView,
    PostsIcons,
    PostsIconFrame,
    ImagePostTextFrame,
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling';

// Colors
const {brand, primary, tertiary, greyish, darkLight, slightlyLighterPrimary, descTextColor} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

import { View, ImageBackground, ScrollView, SectionList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';

import { useIsFocused, useTheme } from '@react-navigation/native';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import usePostReducer from '../hooks/usePostReducer';
import ImagePost from '../components/Posts/ImagePost';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';


const ViewImagePostPage = ({route, navigation}) => {
    const [postState, dispatchPost] = usePostReducer()
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var { name } = storedCredentials} else {var { name } = {name: 'SSGUEST'}}
    const [pfpB64, setpfpB64] = useState('./../assets/img/Logo.png')
    const {post, isOwner} = route.params;
    //Comment stuff
    const [ifCommentText, setIfCommentText] = useState("No comments found")
    const [changeSections, setChangeSections] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [limitSearch, setLimitSearch] = useState(false)
    const [commentLoadMax, setCommentLoadMax] = useState(10)
    const [commentsLength , setCommentsLength] = useState("Loading")
    const [loadingMoreComments, setLoadingMoreComments] = useState(false)
    //upvotes
    const [imageUpOrDownVotes, setImageUpOrDownVotes] = useState("Finding")
    const [imageUpOrDownVoted, setImageUpOrDownVoted] = useState("Finding")
    const [initialImageUpOrDownVoted, setInitialImageUpOrDownVoted] = useState("Finding")
    const [deleted, setDeleted] = useState(false)
    //Server stuff
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const StatusBarHeight = useContext(StatusBarHeightContext);

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    useEffect(() => {
        dispatchPost({type: 'addPosts', posts: [post]})
    }, [])

    const {colors, indexNum} = useTheme()

    //PFP
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext);

    //profile image of commenter
    async function getImageInPfpComments(commentData, index) {
        return axios.get(`${serverUrl}/getImageOnServer/${commentData[index].profileImageKey}`)
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }
    
    const Item = ({commentId, commenterName, commenterDisplayName, commentsText, commentUpVotes, commentReplies, datePosted, commenterImageB64}) => (
        <CommentsContainer>
            <CommentsHorizontalView>
                <CommentsVerticalView alongLeft={true}>
                    <TouchableOpacity>
                        <CommenterIcon source={{uri: commenterImageB64}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/322-circle-up.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <VoteText style={{color: colors.tertiary}}>
                            {commentUpVotes}
                        </VoteText>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <CommentIcons downVoteButton={true} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/324-circle-down.png')}/>
                    </TouchableOpacity>
                </CommentsVerticalView>
                <CommentsVerticalView>
                    <TouchableOpacity>
                        <CommenterName style={{color: colors.tertiary}} displayName={true}>{commenterDisplayName}</CommenterName>
                        <CommenterName>@{commenterName}</CommenterName>
                    </TouchableOpacity>
                    <CommentText style={{color: colors.tertiary}}>{commentsText}</CommentText>
                </CommentsVerticalView>
            </CommentsHorizontalView>
            <CommentsHorizontalView bottomIcons={true}>
                <CommentsVerticalView alongLeft={true}>
                    <TouchableOpacity>
                        <CommentIcons source={require('./../assets/img/ThreeDots.png')}/>
                    </TouchableOpacity>
                </CommentsVerticalView>
                <CommentsVerticalView datePosted={true}>
                    <VoteText style={{color: colors.tertiary}}>
                        {datePosted}
                    </VoteText>
                    <TouchableOpacity onPress={() => {navigation.navigate("CommentViewPage", {commentId: commentId, postId: post.imageKey, postFormat: "Image"})}}>
                        <VoteText style={{color: brand}}>
                            {commentReplies} replies
                        </VoteText>
                    </TouchableOpacity>
                </CommentsVerticalView>
                <CommentsVerticalView alongLeft={true}>
                    <TouchableOpacity>
                        <CommentIcons source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/107-reply.png')}/>
                    </TouchableOpacity>
                </CommentsVerticalView>
            </CommentsHorizontalView>
        </CommentsContainer>
    );

    const prepareComments = () => {
        setIfCommentText("No comments found")
        const layoutComments = (data) => {
            setIfCommentText("Poll Comments:")
            var imageData = data.data
            var commentData = imageData
            console.log(commentData)
            setCommentsLength(commentData.length)
            setChangeSections([])
            console.log(commentData.length)
            var tempSections = []
            var itemsProcessed = 0;
            if (storedCredentials) {
                commentData.forEach(function (item, index) {
                    if (index+1 <= commentLoadMax) {
                        var displayName = commentData[index].commenterDisplayName
                        if (displayName == "") {
                            displayName = commentData[index].commenterName
                        }
                        //get pfp
                        if (commentData[index].profileImageKey !== "" || data !== null) {
                            async function getImageWithAwait() {
                                const pfpB64 = await getImageInPfpComments(imageData, index)
                                var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, commentReplies: commentData[index].commentReplies, datePosted: commentData[index].datePosted, commenterImageB64: pfpB64}]}
                                tempSections.push(tempSectionsTemp)
                                itemsProcessed++;
                                if(itemsProcessed === imageData.length) {
                                    console.log(tempSections)
                                    setLoadingMoreComments(false)
                                    setChangeSections(tempSections) 
                                }
                            }
                            getImageWithAwait();
                        } else {
                            //add to list
                            var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, commentReplies: commentData[index].commentReplies, datePosted: commentData[index].datePosted, commenterImageB64: require("./../assets/img/Logo.png")}]}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === imageData.length) {
                                console.log(tempSections)
                                setLoadingMoreComments(false)
                                setChangeSections(tempSections)
                            }
                        }
                    }
                });
            }
        }

        const urlTwo = `${serverUrl}/tempRoute/getimagepostcomments`;
        const toSend = {
            postId: post._id
        }
        setLoadingMoreComments(true)
        axios.post(urlTwo, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setLoadingMoreComments(false)
                if (message == 'No Comments') {
                    setCommentsLength(0)
                }
            } else {
                layoutComments({data});
            }
            //setSubmitting(false);

        }).catch(error => {
            console.error(error);
            setLoadingMoreComments(false)
            //setSubmitting(false);
            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
        })
    }

    if (limitSearch == false) {
        setLimitSearch(true);
        prepareComments();
    }
    
    const handleCommentPost = (commentProperties, setSubmitting) => {
        handleMessage(null);
        const url = serverUrl + "/tempRoute/imagepostcomment";

        axios.post(url, commentProperties).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                handleMessage("Comment Uploaded", "SUCCESS");
                prepareComments()
                //persistLogin({...data[0]}, message, status);
            }
            setSubmitting(false);

        }).catch(error => {
            console.error(error);
            setSubmitting(false);
            handleMessage(error?.response?.data?.message || "An error occured. Try checking your network connection and retry.");
        })
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
            <ThreeDotMenuActionSheet dispatch={dispatchPost} threeDotsMenu={postState.threeDotsMenu}/>
            <StatusBar style={colors.StatusBarColor}/>
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                        source={require('../assets/app_icons/back_arrow.png')}
                        style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                        resizeMode="contain"
                        resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>{post.creatorDisplayName ? post.creatorDisplayName : post.creatorName}'s post</TestText>
            </ChatScreen_Title>
                <ScrollView style={{height: '100%', backgroundColor: colors.primary}}>
                    {postState.posts.length > 0 ? <ImagePost post={postState.posts[0]} index={0} isOwner={isOwner} colors={colors} dispatch={dispatchPost} colorsIndexNum={indexNum} onDeleteCallback={onDeleteCallback}/> : null}
                    {storedCredentials ?
                        <ViewScreenPollPostCommentsFrame style={{width: '100%', marginLeft: 0, marginRight: 0}}>
                            <PollPostTitle commentsTitle={true}>Comments</PollPostTitle>
                            <CommentsHorizontalView writeCommentArea={true}>
                                <Formik
                                    initialValues={{comment: '', userName: name, imageId: post._id}}
                                    onSubmit={(values, {setSubmitting}) => {
                                        if (values.comment == "") {
                                            handleMessage('You cant post and empty comment');
                                            setSubmitting(false);
                                        } else {
                                            handleCommentPost(values, setSubmitting);
                                            values.comment = ""
                                        }
                                    }}
                                >
                                    {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                        <View>
                                            <CommentsHorizontalView>
                                                <CommentsHorizontalViewItem>
                                                    <CommenterName>Img/GIF</CommenterName>
                                                </CommentsHorizontalViewItem>
                                                <CommentsHorizontalViewItem>
                                                    <CommenterName>Text</CommenterName>
                                                </CommentsHorizontalViewItem>
                                                <CommentsHorizontalViewItem>
                                                    <CommenterName>Short Video</CommenterName>
                                                </CommentsHorizontalViewItem>
                                            </CommentsHorizontalView>
                                            <CommentsHorizontalView writeCommentArea={true}>
                                                <CommentsVerticalView alongLeft={true}>
                                                    <CommenterIcon source={{uri: profilePictureUri}}/>
                                                </CommentsVerticalView>
                                                <CommentsVerticalView>
                                                    <UserTextInput
                                                        placeholder="Post a comment"
                                                        placeholderTextColor={darkLight}
                                                        onChangeText={handleChange('comment')}
                                                        onBlur={handleBlur('comment')}
                                                        value={values.comment}
                                                        multiline={true}
                                                        style={{backgroundColor: colors.primary, borderColor: colors.borderColor, color: colors.tertiary}}
                                                    />
                                                </CommentsVerticalView>
                                            </CommentsHorizontalView>
                                            <CommentsHorizontalView belowWriteCommentArea={true}>
                                                <CommentsVerticalView postComment={true}>
                                                    {!isSubmitting && (<StyledButton style={{backgroundColor: colors.primary}} postComment={true} onPress={handleSubmit}>
                                                        <ButtonText postComment={true}> Post </ButtonText>
                                                    </StyledButton>)}
                                                    <MsgBox type={messageType}>{message}</MsgBox>
                                                    {isSubmitting && (<StyledButton disabled={true}>
                                                        <ActivityIndicator size="large" color={colors.primary} />
                                                    </StyledButton>)}
                                                </CommentsVerticalView>
                                            </CommentsHorizontalView>
                                        </View>
                                        )}
                                </Formik>
                            </CommentsHorizontalView>
                            <PollPostSubTitle>{ifCommentText}</PollPostSubTitle>
                            <SectionList
                                sections={changeSections}
                                keyExtractor={(item, index) => item + index}
                                renderItem={({ item }) => <Item commentId={item.commentId} commenterName={item.commenterName} commenterDisplayName={item.commenterDisplayName} commentsText={item.commentsText}  commentUpVotes={item.commentUpVotes} commentReplies={item.commentReplies} datePosted={item.datePosted} commenterImageB64={item.commenterImageB64}/>}
                            />
                            {loadingMoreComments == true && (
                                <ActivityIndicator size="small" color={brand} />  
                            )}
                        </ViewScreenPollPostCommentsFrame>
                    :
                        <View style={{marginTop: 20}}>
                            <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to post comments on this post</Text>
                            <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                                <ButtonText> Login </ButtonText>
                            </StyledButton>
                            <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true})}>
                                    <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                            </StyledButton>
                        </View>
                    }
                </ScrollView>
        </>
    );
}

const UserTextInput = ({label, icon, isPassword, ...props}) => {
    return(
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput postComment={true} {...props}/>
        </View>
    )
}

export default ViewImagePostPage;
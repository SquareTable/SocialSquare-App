import React, {useState, useContext, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import {Formik} from 'formik';

// icons
import Octicons from 'react-native-vector-icons/Octicons'

import {
    SubTitle,
    StyledButton,
    ButtonText,
    WelcomeContainer,
    ProfIcons,
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
    AboveBarPollPostHorizontalView,
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
    PostHorizontalView,
    PostsIconFrame,
    PostsIcons,
    PostsHorizontalView,
    PostsVerticalView,
    PostCreatorIcon
} from './screenStylings/styling';

// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// API client
import axios from 'axios';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

import { View, ImageBackground, ScrollView, SectionList, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { ProfilePictureURIContext } from '../components/ProfilePictureURIContext';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext';
import ParseErrorMessage from '../components/ParseErrorMessage';
import { getTimeFromUTCMS } from '../libraries/Time';
import PollWithVotes from '../components/Posts/PollWithVotes';
import usePostReducer from '../hooks/usePostReducer';
import ThreeDotMenuActionSheet from '../components/Posts/ThreeDotMenuActionSheet';
import KeyboardAvoidingScrollView from '../components/KeyboardAvoidingScrollView';
import TopNavBar from '../components/TopNavBar.js';


const ViewPollPostPage = ({route, navigation}) => {
    const [postReducer, dispatch] = usePostReducer();
    const [deleted, setDeleted] = useState(false)
    const {colors, dark, colorsIndexNum} = useTheme();
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    if (storedCredentials) {var {name } = storedCredentials} else {var {name } = {name: 'SSGUEST'}};
    const { post, isOwner } = route.params;
    //Comment stuff
    const [ifCommentText, setIfCommentText] = useState("No comments found")
    const [changeSections, setChangeSections] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [limitSearch, setLimitSearch] = useState(false)
    const [commentLoadMax, setCommentLoadMax] = useState(10)
    const [commentsLength , setCommentsLength] = useState("Loading")
    const [loadingMoreComments, setLoadingMoreComments] = useState(false)
    //PFP
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)
    //Server stuff
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);

    const StatusBarHeight = useContext(StatusBarHeightContext);

    useEffect(() => {
        dispatch({type: 'addPosts', posts: [post]})
    }, [])

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
                    <TouchableOpacity onPress={() => {navigation.navigate("CommentViewPage", {commentId: commentId, postId: post._id, postFormat: "Poll"})}}>
                        <VoteText style={{color: colors.brand}}>
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
        const layoutPollComments = (data) => {
            setIfCommentText("Poll Comments:")
            var pollData = data.data
            var commentData = pollData
            console.log(commentData)
            setCommentsLength(commentData.length)
            setChangeSections([])
            console.log(commentData.length)
            var tempSections = []
            var itemsProcessed = 0;
            commentData.forEach(function (item, index) {
                if (index+1 <= commentLoadMax) {
                    var displayName = commentData[index].commenterDisplayName
                    if (displayName == "") {
                        displayName = commentData[index].commenterName
                    }
                    //get pfp
                    if (commentData[index].profileImageKey !== "" || data !== null) {
                        async function getImageWithAwait() {
                            const pfpB64 = await getImageInPfpComments(pollData, index)
                            var tempSectionsTemp = {data: [{commentId: commentData[index].commentId, commenterName: commentData[index].commenterName, commenterDisplayName: displayName, commentsText: commentData[index].commentText, commentUpVotes: commentData[index].commentUpVotes, commentReplies: commentData[index].commentReplies, datePosted: commentData[index].datePosted, commenterImageB64: pfpB64}]}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === pollData.length) {
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
                        if(itemsProcessed === pollData.length) {
                            console.log(tempSections)
                            setLoadingMoreComments(false)
                            setChangeSections(tempSections)
                        }
                    }
                }
            });
        }

        const url = `${serverUrl}/tempRoute/searchforpollcomments`;
        const toSend = {
            pollId: post._id
        }
        setLoadingMoreComments(true)
        axios.post(url, toSend).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
                setLoadingMoreComments(false)
            } else {
                layoutPollComments({data});
            }
            //setSubmitting(false);

        }).catch(error => {
            console.error(error);
            //setSubmitting(false);
            setLoadingMoreComments(false)
            handleMessage(ParseErrorMessage(error));
        })
    }

    if (limitSearch == false) {
        setLimitSearch(true);
        prepareComments();
    }
    
    const handleCommentPost = (commentProperties, setSubmitting) => {
        handleMessage(null);
        const url = serverUrl + "/tempRoute/pollpostcomment";

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
            handleMessage(ParseErrorMessage(error));
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
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
            <ThreeDotMenuActionSheet dispatch={dispatch} threeDotsMenu={postReducer.threeDotsMenu}/>
            <StatusBar style={colors.StatusBarColor}/>
            <TopNavBar screenName={((post.creatorDisplayName ? post.creatorDisplayName : post.creatorName) || 'ERROR') + "'s poll"}/>
            <KeyboardAvoidingScrollView>
                {postReducer.posts.length > 0 ? <PollWithVotes colors={colors} dispatch={dispatch} index={0} post={postReducer.posts[0]} isOwner={isOwner} colorsIndexNum={colorsIndexNum} onDeleteCallback={onDeleteCallback}/> : null}
                {storedCredentials ?
                    <ViewScreenPollPostCommentsFrame style={{width: '100%'}}>
                        <PollPostTitle commentsTitle={true}>Comments</PollPostTitle>
                        <CommentsHorizontalView writeCommentArea={true}>
                            <Formik
                                initialValues={{comment: '', userName: name, pollId: post._id}}
                                onSubmit={(values, {setSubmitting}) => {
                                    if (values.comment == "") {
                                        handleMessage('You cant post and empty comment');
                                        setSubmitting(false);
                                    } else {
                                        handleCommentPost(values, setSubmitting);
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
                                                    placeholderTextColor={colors.darkLight}
                                                    onChangeText={handleChange('comment')}
                                                    onBlur={handleBlur('comment')}
                                                    value={values.comment}
                                                    multiline={true}
                                                    style={{backgroundColor: colors.primary, color: colors.tertiary, borderColor: colors.borderColor}}
                                                    scrollEnabled={false}
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
                        <PollPostSubTitle style={{color: colors.tertiary}}>{ifCommentText}</PollPostSubTitle>
                        <SectionList
                            sections={changeSections}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item }) => <Item commentId={item.commentId} commenterName={item.commenterName} commenterDisplayName={item.commenterDisplayName} commentsText={item.commentsText}  commentUpVotes={item.commentUpVotes} commentReplies={item.commentReplies} datePosted={item.datePosted} commenterImageB64={item.commenterImageB64}/>}
                        />
                        {loadingMoreComments == true && (
                            <ActivityIndicator size="small" color={colors.brand} />  
                        )}
                    </ViewScreenPollPostCommentsFrame>
                :
                    <View style={{flex: 1, justifyContent: 'center', marginTop: 20}}>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to comment on this poll</Text>
                        <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                            <ButtonText> Login </ButtonText>
                        </StyledButton>
                        <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true})}>
                                <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                        </StyledButton>
                    </View>
                }
            </KeyboardAvoidingScrollView>
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

export default ViewPollPostPage;
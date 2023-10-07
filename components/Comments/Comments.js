import { View, Text, ActivityIndicator, SectionList, TouchableOpacity } from "react-native";
import { useContext, useEffect } from "react";
import axios from "axios";
import useCommentReducer from "../../hooks/useCommentReducer";
import { ServerUrlContext } from "../ServerUrlContext";
import ParseErrorMessage from "../ParseErrorMessage";
import { Formik } from "formik";
import {
    CommentsHorizontalView,
    CommentsHorizontalViewItem,
    CommenterName,
    CommenterIcon,
    StyledButton,
    StyledTextInput,
    CommentsVerticalView,
    ButtonText,
    StyledInputLabel,
    PollPostSubTitle,
    ViewScreenPollPostCommentsFrame,
    PollPostTitle
} from "../../screens/screenStylings/styling";
import { useTheme } from "@react-navigation/native";
import { CredentialsContext } from "../CredentialsContext";
import { ProfilePictureURIContext } from "../ProfilePictureURIContext";
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function Comments({postId, postFormat}) {
    const {colors} = useTheme();
    const [reducer, dispatch] = useCommentReducer()
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext)
    const {name} = storedCredentials;
    const {profilePictureUri, setProfilePictureUri} = useContext(ProfilePictureURIContext)

    const loadComments = () => {
        dispatch({type: 'startLoad'})
        const urls = {
            'Image': 'getimagepostcomments',
            'Poll': 'searchforpollcomments',
            'Thread': 'searchforthreadcomments'
        }

        if (!Object.keys(urls).includes(postFormat)) throw new Error('Comments component received invalid postFormat: ' + postFormat)

        const url = serverUrl + '/tempRoute/' + urls[postFormat]
        const toSend = {postId}

        axios.post(url, toSend).then(response => {
            const {data} = response;

            Promise.allSettled(
                data.map(item => {
                    return new Promise(async (resolve, reject) => {
                        let pfpB64 = null;
                        try {
                            if (item.profileImageKey !== "") {
                                pfpB64 = 'data:image/jpeg;base64,' + (await axios.get(`${serverUrl}/getImageOnServer/${item.profileImageKey}`)).data
                            }
                        } catch (error) {
                            reject(error)
                        }

                        resolve({
                            commentId: item.commentId,
                            commenterName: item.commenterName,
                            commenterDisplayName: item.commenterDisplayName || item.commenterName,
                            commentsText: item.commentText,
                            commentUpVotes: item.commentUpVotes,
                            commentReplies: item.commentReplies,
                            datePosted: item.datePosted,
                            commenterImageB64: pfpB64
                        })
                    })
                })
            ).then(items => {
                dispatch({type: 'addComments', comments: items})
            })
        }).catch(error => {
            const parsedError = ParseErrorMessage(error)
            console.error('Raw error:', error, `\nParsed error:`, parsedError)
            dispatch({type: 'error', error: parsedError})
        })
    }

    useEffect(() => {
        loadComments()
    }, [])

    const ListFooter = () => {
        if (reducer.loadingFeed) {
            return <ActivityIndicator color={colors.brand}/>
        }

        if (reducer.error) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10}}>
                    <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center', marginVertical: 20}}>{reducer.error}</Text>
                    <TouchableOpacity onPress={loadComments}>
                        <Ionicons name="reload" size={50} color={colors.errorColor} />
                    </TouchableOpacity>
                </View>
            )
        }

        return null
    }

    return (
        <View>
            <ViewScreenPollPostCommentsFrame style={{width: '100%', marginLeft: 0, marginRight: 0}}>
                <PollPostTitle commentsTitle={true}>Comments</PollPostTitle>
                <CommentsHorizontalView writeCommentArea={true}>
                    <Formik
                        initialValues={{comment: '', userName: name, postId}}
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
                                            placeholderTextColor={colors.darkLight}
                                            onChangeText={handleChange('comment')}
                                            onBlur={handleBlur('comment')}
                                            value={values.comment}
                                            multiline={true}
                                            style={{backgroundColor: colors.primary, borderColor: colors.borderColor, color: colors.tertiary}}
                                            scrollEnabled={false}
                                        />
                                    </CommentsVerticalView>
                                </CommentsHorizontalView>
                                <CommentsHorizontalView belowWriteCommentArea={true}>
                                    <CommentsVerticalView postComment={true}>
                                        {!isSubmitting && (<StyledButton style={{backgroundColor: colors.primary}} postComment={true} onPress={handleSubmit}>
                                            <ButtonText postComment={true}> Post </ButtonText>
                                        </StyledButton>)}
                                        {isSubmitting && (<StyledButton disabled={true}>
                                            <ActivityIndicator size="large" color={colors.primary} />
                                        </StyledButton>)}
                                    </CommentsVerticalView>
                                </CommentsHorizontalView>
                            </View>
                            )}
                    </Formik>
                </CommentsHorizontalView>
                <PollPostSubTitle>{reducer.loadingFeed ? 'Loading...' : reducer.error ? 'Error Occurred' : reducer.comments.length === 0 ? 'No Comments' : 'Comments:'}</PollPostSubTitle>
                <SectionList
                    sections={reducer.comments}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => {/*Coming soon-<Item commentId={item.commentId} commenterName={item.commenterName} commenterDisplayName={item.commenterDisplayName} commentsText={item.commentsText}  commentUpVotes={item.commentUpVotes} commentReplies={item.commentReplies} datePosted={item.datePosted} commenterImageB64={item.commenterImageB64}/>*/}}
                    ListFooterComponent={ListFooter}
                />
            </ViewScreenPollPostCommentsFrame>
            <Text style={{color: 'white', fontSize: 24}}>postId is {postId} and postFormat is {postFormat}</Text>
        </View>
    )
}

const UserTextInput = ({label, icon, isPassword, ...props}) => {
    return(
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput postComment={true} {...props}/>
        </View>
    )
}
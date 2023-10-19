import React, {useRef, useEffect, useContext} from "react";
import ActionSheet from 'react-native-actionsheet';
import axios from "axios";
import { ServerUrlContext } from "../ServerUrlContext";
import { useNavigation } from "@react-navigation/native";
import ParseErrorMessage from "../ParseErrorMessage";

const NotOwnerOptions = [
    'Report',
    'Cancel'
];

const OwnerOptions = [
    'Delete',
    'Cancel'
]

const ThreeDotMenuActionSheet = ({dispatch, threeDotsMenu}) => {
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext)
    const notOwnerActionSheet = useRef();
    const ownerActionSheet = useRef();
    const navigation = useNavigation();

    const menuToShow = threeDotsMenu?.menuToShow
    const postId = threeDotsMenu?.postId
    const postIndex = threeDotsMenu?.postIndex
    const postFormat = threeDotsMenu?.postFormat
    const onDeleteCallback = threeDotsMenu?.onDeleteCallback

    const handleHideMenu = () => {
        dispatch({type: 'hideMenu'})
    }

    useEffect(() => {
        if (threeDotsMenu != null) {
            if (menuToShow == 'NotOwner') {
                notOwnerActionSheet.current.show()
            } else if (menuToShow == 'Owner') {
                ownerActionSheet.current.show()
            }
        }
    }, [threeDotsMenu])

    const deleteImage = () => {
        dispatch({type: 'startDeletePost', postIndex})
        const url = serverUrl + '/tempRoute/deleteimage';
        const toSend = {postId}
        console.log(toSend)
        axios.post(url, toSend).then((response) => { 
            const result = response.data;
            const {message, status, data} = result;
            if (status !== 'SUCCESS') {
                alert('An error occured while deleting the image post: ' + String(message))
                dispatch({type: 'stopDeletePost', postIndex})
            } else {
                dispatch({type: 'deletePost', postIndex})
                onDeleteCallback();
            }
        }).catch(error => {
            console.error(error)
            alert('An error occurred while deleting image post: ' + ParseErrorMessage(error))
            dispatch({type: 'stopDeletePost', postIndex})
        })
    }

    const deletePoll = () => {
        dispatch({type: 'startDeletePost', postIndex})
        const url = serverUrl + '/tempRoute/deletepoll';
        const toSend = {pollId: postId}
        console.log(toSend)
        axios.post(url, toSend).then((response) => { 
            const result = response.data;
            const {message, status, data} = result;
            if (status !== 'SUCCESS') {
                alert('An error occured while deleting the poll post: ' + String(message))
                dispatch({type: 'stopDeletePost', postIndex})
            } else {
                dispatch({type: 'deletePost', postIndex})
            }
        }).catch(error => {
            console.error(error)
            alert('An error occurred while deleting poll post: ' + ParseErrorMessage(error))
            dispatch({type: 'stopDeletePost', postIndex})
        })
    }

    const deleteThread = () => {
        dispatch({type: 'startDeletePost', postIndex})
        const url = serverUrl + '/tempRoute/deletethread';
        const toSend = {threadId: postId}
        console.log(toSend)
        axios.post(url, toSend).then((response) => { 
            const result = response.data;
            const {message, status, data} = result;
            if (status !== 'SUCCESS') {
                alert('An error occured while deleting the thread post: ' + String(message))
                dispatch({type: 'stopDeletePost', postIndex})
            } else {
                dispatch({type: 'deletePost', postIndex})
            }
        }).catch(error => {
            console.error(error)
            alert('An error occurred while deleting thread post: ' + ParseErrorMessage(error))
            dispatch({type: 'stopDeletePost', postIndex})
        })
    }

    const deleteComment = () => {
        dispatch({type: 'startDeleteComment', commentIndex: postIndex})
        const url = serverUrl + '/tempRoute/deletecomment';
        const toSend = {commentId: postId}
        console.log(toSend)
        axios.post(url, toSend).then(() => { 
            dispatch({type: 'deleteComment', commentIndex: postIndex})
        }).catch(error => {
            console.error(error)
            alert('An error occurred while deleting comment: ' + ParseErrorMessage(error))
            dispatch({type: 'stopDeleteComment', commentIndex: postIndex})
        })
    }

    const handleDelete = () => {
        if (postFormat == 'Image') {
            deleteImage()
        } else if (postFormat == 'Poll') {
            deletePoll()
        } else if (postFormat == 'Thread') {
            deleteThread()
        } else if (postFormat === "Comment") {
            deleteComment()
        } else {
            throw new Error(`${postFormat} is not a supported post format to delete for ThreeDotMenuActionSheet`)
        }
    }

    return (
        <>
            <ActionSheet
                ref={notOwnerActionSheet}
                title={'Post Actions'}
                options={NotOwnerOptions}
                // Define cancel button index in the option array
                // This will take the cancel option in bottom
                // and will highlight it
                cancelButtonIndex={1}
                // Highlight any specific option
                destructiveButtonIndex={0}
                onPress={(index) => {
                    if (index == 0) {
                        navigation.navigate('ReportPost', {postId, postFormat})
                        handleHideMenu()
                    } else if (index == 1) {
                        console.log('Cancelling post actions actionsheet...')
                        handleHideMenu()
                    }
                }}
            />
            <ActionSheet
                ref={ownerActionSheet}
                title={'Post Actions'}
                options={OwnerOptions}
                // Define cancel button index in the option array
                // This will take the cancel option in bottom
                // and will highlight it
                cancelButtonIndex={1}
                // Highlight any specific option
                destructiveButtonIndex={0}
                onPress={(index) => {
                    if (index == 0) {
                        handleDelete()
                    } else if (index == 1) {
                        console.log('Cancelling post actions actionsheet...')
                        handleHideMenu()
                    }
                }}
            />
        </>
    )
}

export default ThreeDotMenuActionSheet;
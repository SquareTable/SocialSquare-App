import { useState } from 'react';
import axios from 'axios';

const useUpload = (serverUrl, storedCredentials) => {
    const [posts, setPosts] = useState({})
    const [postsUploading, setPostsUploading] = useState([])
    const [uploadErrors, setUploadErrors] = useState([])
    if (storedCredentials) var {_id} = storedCredentials;
    const validPostTypes = ['image', 'poll', 'thread_text', 'thread_image', 'category'] //Video coming soon

    const uploadPost = (post, postType) => {
        if (typeof post === 'object' && !Array.isArray(post) && post !== null) {
            if (!storedCredentials && !_id) {
                throw new Error('Could not find user id')
            }
            //Upload new post
            if (validPostTypes.includes(postType)) {
                console.log('Uploading post')
                const uploadId = Date.now()
                const uploadObj = {
                    postType,
                    post,
                    uploadId
                }

                setPostsUploading(array => [...array, uploadId])
                setPosts(posts => {
                    const newPosts = {...posts}
                    newPosts[uploadId] = uploadObj
                    return newPosts
                })

                upload(uploadObj)
            } else {
                throw new Error('Wrong post type was provided to useUpload hook')
            }
        } else {
            throw new Error('No post value was provided to uploadPost in useUpload hook')
        }
    }

    const retryUpload = (uploadId) => {
        const toUpload = posts[uploadId]
        if (toUpload === undefined) throw new Error(`Post with provided uploadId could not be found (${uploadId})`)

        setUploadErrors(array => array.filter(uploadObj => uploadObj.uploadId !== uploadId))

        setPostsUploading(array => [...array, uploadId])

        upload(toUpload)
    }

    const cancelRetry = (uploadObj) => {
        const uploadId = uploadObj.uploadId

        setPosts(object => {
            const newPosts = {...object}
            delete newPosts[objectId]
            return newPosts
        })

        setUploadErrors(array => array.filter(uploadObj => uploadObj.uploadId !== uploadId))
    }

    handleError = (error, uploadId) => {
        console.error(error)
        setUploadErrors(errors => [...errors, {uploadId, error}])

        setPostsUploading(array => array.filter(uploadIdInArray => uploadIdInArray !== uploadId))
    }

    handleUploadComplete = (postId) => {
        console.log(`Successfully uploaded post with uploadId ${postId}`)

        setPosts(object => {
            const newObject = {...object}
            delete newObject[postId]
            return newObject
        })

        setPostsUploading(array => array.filter(uploadIdInArray => uploadIdInArray !== postId))
    }

    const postMultiMedia = (postObj) => { // Creating multimedia post
        const {post: postData, uploadId} = postObj
        const formData = new FormData();
        formData.append("image", {
            name: postData.image.uri.substr(postData.image.uri.lastIndexOf('/') + 1),
            uri: postData.image.uri,
            type: 'image/jpg'
        })
        formData.append("title", postData.title)
        formData.append("description", postData.description)
        formData.append("sentAllowScreenShots", postData.screenshotsAllowed)

        const url = serverUrl + '/tempRoute/postImage';

        axios.post(url, formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }}).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleError(message, uploadId)
            } else {
                handleUploadComplete(uploadId)
            }

        }).catch(error => {
            handleError(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection.', uploadId)
        })
    }

    const postPoll = (postObj) => { // Creating poll post
        const {post: pollValues, uploadId} = postObj;
        const url = serverUrl + '/tempRoute/createpollpost';

        axios.post(url, pollValues).then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleError(message, uploadId)
            } else {
                handleUploadComplete(uploadId)
            }

        }).catch(error => {
            handleError(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection.', uploadId)
        })
    }

    const postThread = (postObj, selectFormat) => { // Creating thread post
        const {post: credentials, uploadId} = postObj;
        if (selectFormat == "Text") {
            console.log("Text Format")
            const url = serverUrl + '/tempRoute/posttextthread';
            var toSend = {threadTitle: credentials.threadTitle, threadSubtitle: credentials.threadSubtitle, threadTags: credentials.threadTags, threadCategory: credentials.selectedCategory, threadBody: credentials.threadBody, threadNSFW: credentials.threadNSFW, threadNSFL: credentials.threadNSFL, sentAllowScreenShots: credentials.sentAllowScreenShots}
            console.log(toSend)
            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    handleError(message, uploadId)
                } else {
                    handleUploadComplete(uploadId)
                }

            }).catch(error => {
                handleError(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection.', uploadId)
            })
        } else if (selectFormat == "Images") {
            //Set up formdata
            console.log("Image format")
            const formData = new FormData();
            formData.append("image", {
                name: credentials.image.uri.substr(credentials.image.uri.lastIndexOf('/') + 1),
                uri: credentials.image.uri,
                type: 'image/jpg'
            })
            formData.append("threadTitle", credentials.threadTitle)
            formData.append("threadSubtitle", credentials.threadSubtitle)
            formData.append("threadTags", credentials.threadTags)
            formData.append("threadCategory", credentials.selectedCategory)
            formData.append("threadImageDescription", credentials.threadImageDescription)
            formData.append("threadNSFW", credentials.threadNSFW)
            formData.append("threadNSFL", credentials.threadNSFL)
            formData.append("sentAllowScreenShots", credentials.sentAllowScreenShots)
            console.log("FormData:")
            console.log(formData);
            
            //post
            const url = serverUrl + '/tempRoute/postimagethread';
            axios.post(url, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                }}).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                
                if (status !== 'SUCCESS') {
                    handleError(message, uploadId)
                } else {
                    handleUploadComplete(uploadId)
                }

            }).catch(error => {
                handleError(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection.', uploadId)
            })
        }
    }

    const createCategory = (postObj) => {
        const {post: credentials, uploadId} = postObj;
        if (credentials.image !== null) {
            const formData = new FormData();
            formData.append("image", {
                name: credentials.image.uri.substr(credentials.image.uri.lastIndexOf('/') + 1),
                uri: credentials.image.uri,
                type: 'image/jpg'
            })
            formData.append("categoryTitle", credentials.categoryTitle)
            formData.append("categoryDescription", credentials.categoryDescription)
            formData.append("categoryTags", credentials.categoryTags)
            formData.append("categoryNSFW", credentials.categoryNSFW)
            formData.append("categoryNSFL", credentials.categoryNSFL)
            formData.append("sentAllowScreenShots", credentials.sentAllowScreenShots)
            console.log(formData);

            const url = serverUrl + '/tempRoute/postcategorywithimage';
            
            axios.post(url, formData, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                }}).then((response) => {
                const result = response.data;
                const {message, status, data} = result;
                
                if (status !== 'SUCCESS') {
                    handleError(message, uploadId)
                } else {
                    handleUploadComplete(uploadId)
                }

            }).catch(error => {
                handleError(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection.', uploadId)
            })
        } else {
            const url = serverUrl + '/tempRoute/postcategorywithoutimage';
            const toSend = {categoryTitle: credentials.categoryTitle, categoryDescription: credentials.categoryDescription, categoryTags: credentials.categoryTags, categoryNSFW: credentials.categoryNSFW, categoryNSFL: credentials.categoryNSFL, sentAllowScreenShots: credentials.sentAllowScreenShots}
            console.log(toSend)
            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if (status !== 'SUCCESS') {
                    handleError(message, uploadId)
                } else {
                    handleUploadComplete(uploadId)
                }

            }).catch(error => {
                handleError(error?.response?.data?.message || 'An unknown error occurred. Please check your internet connection.', uploadId)
            })
        }
    }

    const upload = (postObj) => {
        if (postObj.postType === 'image') postMultiMedia(postObj)
        if (postObj.postType === 'poll') postPoll(postObj)
        if (postObj.postType === 'thread_text') postThread(postObj, 'Text')
        if (postObj.postType === 'thread_image') postThread(postObj, 'Images')
        if (postObj.postType === 'category') createCategory(postObj)
    }

    return [uploadPost, retryUpload, cancelRetry, postsUploading.length, uploadErrors.length, posts, postsUploading, uploadErrors]
}

export default useUpload;
import React, { useContext } from 'react';
import { View, Image, Text, ActivityIndicator, TouchableOpacity, SectionList } from 'react-native';
import { UseUploadContext } from '../components/UseUploadContext.js';
import { useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import {CredentialsContext} from '../components/CredentialsContext.js'
import TopNavBar from '../components/TopNavBar.js';

const UploadsScreen = ({navigation}) => {
    const { retryUpload: retryUploadFunc, cancelRetry, postsToUpload, postsUploading, uploadErrors } = useContext(UseUploadContext)
    const { colors } = useTheme()
    const postsToDisplay = Object.values(postsToUpload)
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {storedCredentials} = useContext(CredentialsContext)

    const retryUpload = (uploadId, uploadsDisabled) => {
        if (uploadsDisabled) return alert('Login to the account that started this upload to be able to retry the upload')

        retryUploadFunc(uploadId)
    }

    const SectionsData = [
        {
            sectionNumber: 1,
            data: postsToDisplay.filter(obj => storedCredentials?._id && obj.accountId === storedCredentials?._id)
        },
        {
            sectionNumber: 2,
            data: postsToDisplay.filter(obj => !(storedCredentials?._id && obj.accountId === storedCredentials?._id))
        }
    ]

    const renderUploadItem = ({item, section: {sectionNumber}}) => {
        const uploading = postsUploading.includes(item.uploadId)
        const uploadsDisabled = sectionNumber === 2
        return (
            <View style={{borderColor: colors.tertiary, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 5, opacity: uploadsDisabled ? 0.5 : 1}}>
                {item.postType === 'image' ?
                    <>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                                <Image source={item.post.image} style={{height: 50, width: 50, borderRadius: 5}}/>
                                <Text style={{fontSize: 16, color: colors.tertiary, marginLeft: 10}}>{uploading ? 'Uploading...' : 'Upload Failed'}</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row'}}>
                                {uploading ?
                                    <ActivityIndicator color={colors.brand} size="large"/>
                                :
                                    <>
                                        <TouchableOpacity onPress={() => {retryUpload(item.uploadId, uploadsDisabled)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
                                            <Text style={{fontSize: 16, color: colors.green}}>Retry</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => cancelRetry(item.uploadId)} style={{borderRadius: 10, borderColor: colors.errorColor, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15}}>
                                            <Text style={{fontSize: 16, color: colors.errorColor}}>Cancel</Text>
                                        </TouchableOpacity>
                                    </>
                                }
                            </View>
                        </View>
                        {!uploading && <Text style={{fontSize: 16, color: colors.errorColor, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>{uploadErrors.find(uploadObj => uploadObj.uploadId === item.uploadId).error || 'Failed to find error message'}</Text>}
                    </>
                : item.postType === 'poll' ?
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontWeight: 'bold', fontSize: 20}}>Poll</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>Title: {item.post.pollTitle}</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 10}}>Subtitle: {item.post.pollSubTitle}</Text>
                        <Text style={{fontSize: 16, color: colors.tertiary, marginLeft: 10}}>{uploading ? 'Uploading...' : 'Upload Failed'}</Text>
                        {!uploading && <Text style={{fontSize: 16, color: colors.errorColor, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>{uploadErrors.find(uploadObj => uploadObj.uploadId === item.uploadId).error || 'Failed to find error message'}</Text>}
                        <View style={{flexDirection: 'row'}}>
                            {uploading ?
                                <ActivityIndicator color={colors.brand} size="large"/>
                            :
                                <>
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId, uploadsDisabled)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
                                        <Text style={{fontSize: 16, color: colors.green}}>Retry</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => cancelRetry(item.uploadId)} style={{borderRadius: 10, borderColor: colors.errorColor, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15}}>
                                        <Text style={{fontSize: 16, color: colors.errorColor}}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </View>
                : item.postType === 'thread_text' ?
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontWeight: 'bold', fontSize: 20}}>Text Thread</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>Title: {item.post.threadTitle}</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>Subtitle: {item.post.threadSubtitle || 'None Provided'}</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginVertical: 10}}>Body: {item.post.threadBody}</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 10}}>Category: {item.post.selectedCategory}</Text>
                        <Text style={{fontSize: 16, color: colors.tertiary, marginLeft: 10}}>{uploading ? 'Uploading...' : 'Upload Failed'}</Text>
                        {!uploading && <Text style={{fontSize: 16, color: colors.errorColor, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>{uploadErrors.find(uploadObj => uploadObj.uploadId === item.uploadId).error || 'Failed to find error message'}</Text>}
                        <View style={{flexDirection: 'row'}}>
                            {uploading ?
                                <ActivityIndicator color={colors.brand} size="large"/>
                            :
                                <>
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId, uploadsDisabled)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
                                        <Text style={{fontSize: 16, color: colors.green}}>Retry</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => cancelRetry(item.uploadId)} style={{borderRadius: 10, borderColor: colors.errorColor, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15}}>
                                        <Text style={{fontSize: 16, color: colors.errorColor}}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </View>
                : item.postType === 'thread_image' ?
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontWeight: 'bold', fontSize: 20}}>Image Thread</Text>
                        <Image style={{height: 100, width: 100}} source={item.post.image}/>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>Title: {item.post.threadTitle}</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center'}}>Subtitle: {item.post.threadSubtitle || 'None Provided'}</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginVertical: 10}}>Body: {item.post.threadBody}</Text>
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 10}}>Category: {item.post.selectedCategory}</Text>
                        <Text style={{fontSize: 16, color: colors.tertiary, marginLeft: 10}}>{uploading ? 'Uploading...' : 'Upload Failed'}</Text>
                        {!uploading && <Text style={{fontSize: 16, color: colors.errorColor, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>{uploadErrors.find(uploadObj => uploadObj.uploadId === item.uploadId).error || 'Failed to find error message'}</Text>}
                        <View style={{flexDirection: 'row'}}>
                            {uploading ?
                                <ActivityIndicator color={colors.brand} size="large"/>
                            :
                                <>
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId, uploadsDisabled)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
                                        <Text style={{fontSize: 16, color: colors.green}}>Retry</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => cancelRetry(item.uploadId)} style={{borderRadius: 10, borderColor: colors.errorColor, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15}}>
                                        <Text style={{fontSize: 16, color: colors.errorColor}}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </View>
                : item.postType === 'category' ?
                    <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: colors.tertiary, fontWeight: 'bold', fontSize: 20}}>Category</Text>
                        {item.post.image && <Image source={item.post.image} style={{height: 100, width: 100}}/>}
                        <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 10}}>Title: {item.post.categoryTitle}</Text>
                        <Text style={{fontSize: 16, color: colors.tertiary, marginLeft: 10}}>{uploading ? 'Uploading...' : 'Upload Failed'}</Text>
                        {!uploading && <Text style={{fontSize: 16, color: colors.errorColor, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>{uploadErrors.find(uploadObj => uploadObj.uploadId === item.uploadId).error || 'Failed to find error message'}</Text>}
                        <View style={{flexDirection: 'row'}}>
                            {uploading ?
                                <ActivityIndicator color={colors.brand} size="large"/>
                            :
                                <>
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId, uploadsDisabled)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
                                        <Text style={{fontSize: 16, color: colors.green}}>Retry</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => cancelRetry(item.uploadId)} style={{borderRadius: 10, borderColor: colors.errorColor, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15}}>
                                        <Text style={{fontSize: 16, color: colors.errorColor}}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </View>
                :
                    <Text style={{color: colors.errorColor, fontSize: 24}}>Unknown Post Type</Text>
                }
            </View>
        )
    }

    return (
        <>
            <TopNavBar screenName="Uploads"/>
            {
                Object.keys(postsToUpload).length == 0 ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, color: colors.tertiary, fontWeight: 'bold'}}>All posts have been successfully uploaded</Text>
                    </View>
                :
                    <SectionList
                        sections={SectionsData}
                        renderItem={renderUploadItem}
                        keyExtractor={item => item.uploadId}
                        renderSectionHeader={({section: {sectionNumber, data}}) => {
                            if (sectionNumber === 2 && data.length > 0) {
                                return (
                                    <View style={{backgroundColor: colors.primary}}>
                                        <View style={{opacity: 0.5}}>
                                            <Text style={{color: colors.tertiary, fontSize: 16}}>Cannot Restart Upload At This Time</Text>
                                            <Text style={{color: colors.tertiary, fontSize: 10}}>Switch to the account that started these uploads to be able to restart these uploads</Text>
                                        </View>
                                    </View>
                                )
                            }
                            
                            return null
                        }}
                    />
            }
        </>
    )
}

export default UploadsScreen;
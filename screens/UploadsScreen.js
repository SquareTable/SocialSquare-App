import React, { useContext } from 'react';
import { View, Image, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import {
    ChatScreen_Title,
    Navigator_BackButton,
    TestText
} from './screenStylings/styling.js';
import { UseUploadContext } from '../components/UseUploadContext.js';
import { useTheme } from '@react-navigation/native';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';

const UploadsScreen = ({navigation}) => {
    const { retryUpload, cancelRetry, postsToUpload, postsUploading, uploadErrors } = useContext(UseUploadContext)
    const { colors } = useTheme()
    const postsToDisplay = Object.values(postsToUpload)
    const StatusBarHeight = useContext(StatusBarHeightContext);

    const renderUploadItem = ({item}) => {
        const uploading = postsUploading.includes(item.uploadId)
        return (
            <View style={{borderColor: colors.tertiary, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 5}}>
                {item.postType === 'image' ?
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <Image source={item.post.image} style={{height: 50, width: 50, borderRadius: 5}}/>
                            <Text style={{fontSize: 16, color: colors.tertiary, marginLeft: 10}}>{uploading ? 'Uploading...' : 'Upload Failed'}</Text>
                            {!uploading && <Text style={{fontSize: 16, color: colors.errorColor, fontWeight: 'bold', textAlign: 'center', marginVertical: 10}}>{uploadErrors.find(uploadObj => uploadObj.uploadId === item.uploadId).error || 'Failed to find error message'}</Text>}
                        </View>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row'}}>
                            {uploading ?
                                <ActivityIndicator color={colors.brand} size="large"/>
                            :
                                <>
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
                                        <Text style={{fontSize: 16, color: colors.green}}>Retry</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => cancelRetry(item.uploadId)} style={{borderRadius: 10, borderColor: colors.errorColor, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15}}>
                                        <Text style={{fontSize: 16, color: colors.errorColor}}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                    </View>
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
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
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
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
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
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
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
                                    <TouchableOpacity onPress={() => {retryUpload(item.uploadId)}} style={{borderRadius: 10, borderColor: colors.green, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 15, marginRight: 15}}>
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
            <ChatScreen_Title style={{backgroundColor: colors.primary, borderWidth: 0, paddingTop: StatusBarHeight + 10}}>
                <Navigator_BackButton style={{paddingTop: StatusBarHeight + 2}} onPress={() => {navigation.goBack()}}>
                    <Image
                    source={require('../assets/app_icons/back_arrow.png')}
                    style={{minHeight: 40, minWidth: 40, width: 40, height: 40, maxWidth: 40, maxHeight: 40, borderRadius: 40/2, tintColor: colors.tertiary}}
                    resizeMode="contain"
                    resizeMethod="resize"
                    />
                </Navigator_BackButton>
                <TestText style={{textAlign: 'center', color: colors.tertiary}}>Uploads</TestText>
            </ChatScreen_Title>
            {
                Object.keys(postsToUpload).length == 0 ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 20, color: colors.tertiary, fontWeight: 'bold'}}>All posts have been successfully uploaded</Text>
                    </View>
                :
                    <FlatList
                        data={postsToDisplay}
                        renderItem={renderUploadItem}
                        keyExtractor={item => item.uploadId}
                    />
            }
        </>
    )
}

export default UploadsScreen;
import React, {useContext, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    StyledInputLabel,
    StyledTextInput,
    SearchBarArea,
    LeftIcon
} from '../screens/screenStylings/styling.js';

// icons
import Octicons from 'react-native-vector-icons/Octicons.js';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { View, FlatList, SafeAreaView, Image, TouchableOpacity, Text, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';

// formik
import {Formik} from 'formik';

//axios
import axios from 'axios';
import { useTheme } from '@react-navigation/native';

import { ServerUrlContext } from '../components/ServerUrlContext.js';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import CategoryItem from '../components/Posts/CategoryItem.js';
import useCategoryReducer from '../hooks/useCategoryReducer.js';

const SelectCategorySearchScreen = ({route, navigation}) => {
    const {colors, dark} = useTheme()
    const {threadFormat, threadTitle, threadSubtitle, threadTags, threadCategory, threadBody, threadImage, threadImageDescription, threadNSFW, threadNSFL} = route.params;
    const {serverUrl, setServerUrl} = useContext(ServerUrlContext);
    const [categories, dispatch] = useCategoryReducer()
    const searchText = useRef('')

    const onPressFunction = (categoryTitle, allowScreenShots, categoryId) => {
        navigation.navigate("ThreadUploadPage", {threadFormat: threadFormat, threadTitle: threadTitle, threadSubtitle: threadSubtitle, threadTags: threadTags, categoryTitle: categoryTitle, threadBody: threadBody, threadImage: threadImage, threadImageDescription: threadImageDescription, threadNSFW: threadNSFW, threadNSFL: threadNSFL, allowScreenShots: (allowScreenShots != undefined ? allowScreenShots : true), categoryId})
    }

    async function getImageInCategory(imageKey) {
        return axios.get(`${serverUrl}/getImageOnServer/${imageKey}`)
        .then(res => res.data)
        .catch(error => {
            console.error(error)
            return SocialSquareLogo_B64_png
        })
    }

    const handleCategorySearch = (val, force) => {
        if (!categories.noMoreCategories || force) {
            if (val === "") return dispatch({type: "resetCategories"})

            if (force) {
                dispatch({type: 'startReload'})
            } else {
                dispatch({type: 'startLoad'})
            }

            const layoutCategoriesFound = (data, noMoreCategories) => {
                var allData = data
                console.log(allData)
                console.log(allData.length)
                var tempSections = []
                var itemsProcessed = 0;
                allData.forEach(function (item, index) {
                    if (allData[index].imageKey !== "") {
                        async function asyncFunctionForImages() {
                            const imageB64 = `data:image/jpg;base64,${await getImageInCategory(allData[index].imageKey)}`
                            var tempSectionsTemp = {categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: imageB64, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots, categoryId: allData[index].categoryId}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === allData.length) {
                                dispatch({type: 'addCategories', categories: tempSections})
                                if (noMoreCategories) dispatch({type: 'noMoreCategories'})
                            }
                        }
                        asyncFunctionForImages()
                    } else {
                        var tempSectionsTemp = {categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: null, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots, categoryId: allData[index].categoryId}
                        tempSections.push(tempSectionsTemp)
                        itemsProcessed++;
                        if(itemsProcessed === allData.length) {
                            dispatch({type: 'addCategories', categories: tempSections})
                            if (noMoreCategories) dispatch({type: 'noMoreCategories'})
                        }
                    }
                });
            }


            const url = `${serverUrl}/tempRoute/searchpagesearchcategories`;
            const toSend = {
                val,
                lastCategoryId: categories.categories.length ? categories.categories[categories.categories.length - 1].categoryId : undefined
            }
            axios.post(url, toSend).then((response) => {
                const result = response.data;
                const {data} = result;

                const {categories, noMoreCategories} = data;

                if (categories?.length === 0) return dispatch({type: 'noMoreCategories'})

                console.log(categories)
                layoutCategoriesFound(categories, noMoreCategories)
                console.log('Search complete.')

            }).catch(error => {
                console.error(error);
                dispatch({type: 'error', error: error?.response?.data?.message ? String(error?.response?.data?.message) : 'An unknown error occurred. Please try checking your network connection and try again.'})
            })
        }
    }

    const handleChange = (val) => {
        searchText.current = val;
        handleCategorySearch(val, true)
    }

    return(
        <>    
            <StatusBar style={colors.StatusBarColor}/>
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <SafeAreaView style={{alignItems: 'center', marginBottom: -30, flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => {navigation.goBack()}}>
                        <Image
                            source={require('../assets/app_icons/back_arrow.png')}
                            style={{minHeight: 45, minWidth: 45, width: 45, height: 45, maxWidth: 45, maxHeight: 45, tintColor: colors.tertiary, marginBottom: 15}}
                        />
                    </TouchableOpacity>
                    <SearchBarArea>
                        <UserTextInput
                            placeholder="Search"
                            placeholderTextColor={colors.darkLight}
                            onChangeText={(val) => handleChange(val)}
                            style={{backgroundColor: colors.primary, borderColor: colors.tertiary, color: colors.tertiary}}
                        />
                    </SearchBarArea>
                </SafeAreaView>
            </TouchableWithoutFeedback>
            <FlatList
                data={categories.categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <CategoryItem categoryTitle={item.categoryTitle} categoryDescription={item.categoryDescription} members={item.members} categoryTags={item.categoryTags} image={item.image} NSFW={item.NSFW} NSFL={item.NSFL} datePosted={item.datePosted} allowScreenShots={item.allowScreenShots} categoryId={item.categoryId} onPressFunction={onPressFunction}/>}
                ListFooterComponent={
                    categories.loadingFeed ? 
                        <ActivityIndicator color={colors.brand} size="large" style={{marginTop: 10}}/> 
                    : categories.error ?
                        <Text style={{color: colors.errorColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>{String(categories.error)}</Text>
                    : categories.categories.length === 0 && !categories.loadingFeed ?
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>No results</Text>
                    : categories.noMoreCategories ?
                        <Text style={{color: colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>No more categories</Text>
                    :
                        null
                }
                onEndReachedThreshold={3}
                onEndReached = {({distanceFromEnd})=>{
                    if (distanceFromEnd > 0) {
                        console.log('End of the categories feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                        if (categories.loadingFeed === false) {
                            handleCategorySearch(searchText.current)
                        }
                    }
                }}
                style={{height: '100%', width: '100%'}}
            />

        </>
    );
}

const UserTextInput = ({label, icon, isPassword, ...props}) => {
    const {colors} = useTheme();
    return(
        <SearchBarArea>
            <LeftIcon searchIcon={true}>
                <Octicons name={"search"} size={20} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput searchPage={true} {...props}/>
        </SearchBarArea>
    )
}

export default SelectCategorySearchScreen;

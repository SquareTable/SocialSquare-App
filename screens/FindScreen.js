import React, {useContext, useEffect, useState, useRef, memo, PureComponent} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    SubTitle,
    StyledButton,
    ButtonText,
    Avatar,
    StyledInputLabel,
    StyledTextInput,
    SearchBarArea,
    LeftIcon,
    PostIcons
} from './screenStylings/styling.js';

// icons
import Octicons from 'react-native-vector-icons/Octicons.js';

//credentials context
import { CredentialsContext } from '../components/CredentialsContext';
import { View, ActivityIndicator, Text, Keyboard, FlatList, useWindowDimensions } from 'react-native';

//axios
import axios, { CanceledError } from 'axios';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { useTheme } from '@react-navigation/native';
import SocialSquareLogo_B64_png from '../assets/SocialSquareLogo_Base64_png.js';
import { ServerUrlContext } from '../components/ServerUrlContext.js';
import { ExperimentalFeaturesEnabledContext } from '../components/ExperimentalFeaturesEnabledContext.js';
import { StatusBarHeightContext } from '../components/StatusBarHeightContext.js';
import CategoryItem from '../components/Posts/CategoryItem.js';
import useCategoryReducer from '../hooks/useCategoryReducer.js';
import ParseErrorMessage from '../components/ParseErrorMessage.js';

class UserItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        /* OLD DESIGN
            <SearchFrame onPress={() => navigation.navigate("ProfilePages", {profilesName: name, profilesDisplayName: displayName, following: following, followers: followers, totalLikes: totalLikes, profileKey: profileKey != null ? `data:image/jpg;base64,${profileKey}` : SocialSquareLogo_B64_png, badges: badges})}>
                {profileKey !== null && (
                    <Avatar resizeMode="cover" searchPage={true} source={{uri: profileKey}} />
                )}
                {profileKey == null && (
                    <Avatar resizeMode="cover" searchPage={true} source={require('./../assets/img/Logo.png')} />
                )}
                <SubTitle style={{color: colors.tertiary}} searchResTitle={true}>{name}</SubTitle>
                <SubTitle searchResTitleDisplayName={true} style={{color: brand}}>@{displayName}</SubTitle>
                <SearchHorizontalView>
                    <SearchHorizontalViewItem>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> Following </SearchSubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> {following.length} </SearchSubTitle>
                    </SearchHorizontalViewItem>

                    <SearchHorizontalViewItemCenter>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> Followers </SearchSubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/274-checkmark2.png')}/>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> {followers.length} </SearchSubTitle>
                    </SearchHorizontalViewItemCenter>

                    <SearchHorizontalViewItem>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> Total Likes </SearchSubTitle>
                        <ProfIcons style={{tintColor: colors.tertiary}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/273-checkmark.png')}/>
                        <SearchSubTitle style={{color: colors.tertiary}} welcome={true}> {totalLikes} </SearchSubTitle>
                    </SearchHorizontalViewItem>
                </SearchHorizontalView>
            </SearchFrame>
        */
        const data = {
            profilesName: this.props.name,
            profilesDisplayName: this.props.displayName,
            following: this.props.following,
            followers: this.props.followers,
            totalLikes: this.props.totalLikes,
            profileKey: this.props.profileKey != null ? this.props.profileKey : SocialSquareLogo_B64_png,
            badges: this.props.badges,
            bio: this.props.bio,
            privateAccount: this.props.privateAccount
        }

        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ProfilePages", {paramsProfileData: data, pubId: this.props.pubId})} style={{borderColor: this.props.colors.darkLight, flexDirection: 'row', width: '100%', padding: 5}}>
                <View style={{alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'row'}}>
                    <Avatar style={{width: 60, height: 60, marginBottom: 5, marginTop: 5}} resizeMode="cover" searchPage={true} source={{uri: this.props.profileKey != null ? this.props.profileKey : SocialSquareLogo_B64_png}} />
                    <SubTitle style={{color: this.props.colors.tertiary, marginTop: 24, marginLeft: 10}} searchResTitle={true}>{this.props.displayName || this.props.name}</SubTitle>
                </View>
            </TouchableOpacity>
        )
    }
}

const FindScreen = ({navigation}) => {
    const {colors, dark} = useTheme();
     //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {experimentalFeaturesEnabled, setExperimentalFeaturesEnabled} = useContext(ExperimentalFeaturesEnabledContext)
    const [filterFormatSearch, setFilterFormatSearch] = useState("Users")
    const [foundAmount, setFoundAmount] = useState();
    const [changeSectionsOne, setChangeSectionsOne] = useState([])
    const [loadingOne, setLoadingOne] = useState(false)
    const [noResults, setNoResults] = useState(false);
    const [errorOccured, setErrorOccured] = useState(null)
    const searchValue = useRef(null);
    const {serverUrl, setServerurl} = useContext(ServerUrlContext);
    const StatusBarHeight = useContext(StatusBarHeightContext);
    const {height, width} = useWindowDimensions();
    const userListHeight = useRef(null);
    const debounceTimeout = useRef(null);
    const abortControllerRef = useRef(new AbortController())
    const [categoriesReducer, dispatchCategories] = useCategoryReducer();

    useEffect(() => {
        if (typeof userListHeight.current === 'number' && height > userListHeight.current && !noResults && filterFormatSearch === "Users" && searchValue.current !== "" && searchValue.current !== null) {
            handleUserSearch(searchValue.current)
        }
    }, [height, changeSectionsOne, filterFormatSearch])

    useEffect(() => {
        return () => {
            if (abortControllerRef.current instanceof AbortController) {
                abortControllerRef.current.abort();
                console.warn('Aborted as Find Screen was unmounted')
            }
        }
    }, [])

    //any image honestly
    async function getImageWithKeyOne(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { signal: abortControllerRef.current.signal})
        .then(res => 'data:image/jpeg;base64,' + res.data)
        .catch(error => {
            if (!(error instanceof CanceledError)) {
                console.error(error)
                return SocialSquareLogo_B64_png
            }
        })
    }

    const handleUserSearch = (val, clear) => {
        if (loadingOne && clear) {
            abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();
        }

        setNoResults(false)

        if (val !== "") {
            const layoutUsersFound = (data) => {
                setFoundAmount("Poll Comments:")
                var allData = data
                console.log(allData)
                console.log(allData.length)
                const tempSections = clear ? [] : [...changeSectionsOne];
                var itemsProcessed = 0;
                allData.forEach(function (item, index) {
                    if (allData[index].profileKey !== "") {
                        async function asyncFunctionForImages() {
                            const displayName = allData[index].displayName === "" ? allData[index].name : allData[index].displayName
                            let imageInPfpB64
                            try {
                                imageInPfpB64 = await getImageWithKeyOne(allData[index].profileKey)
                            } catch (error) {
                                if (error instanceof CanceledError) {
                                    console.warn('Cancelled intentionally')
                                } else {
                                    console.error(error)
                                }
                            }
                            var tempSectionsTemp = {name: allData[index].name, displayName: displayName, followers: allData[index].followers, following: allData[index].following, totalLikes: allData[index].totalLikes, profileKey: imageInPfpB64, badges: allData[index].badges, pubId: allData[index].pubId, bio: allData[index].bio, privateAccount: allData[index].privateAccount}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === allData.length) {
                                setLoadingOne(false)
                                setChangeSectionsOne(tempSections)
                            }
                        }
                        asyncFunctionForImages()
                    } else {
                        const displayName = allData[index].displayName === "" ? allData[index].name : allData[index].displayName
                        var tempSectionsTemp = {name: allData[index].name, displayName: displayName, followers: allData[index].followers, following: allData[index].following, totalLikes: allData[index].totalLikes, profileKey: null, badges: allData[index].badges, pubId: allData[index].pubId, bio: allData[index].bio, privateAccount: allData[index].privateAccount}
                        tempSections.push(tempSectionsTemp)
                        itemsProcessed++;
                        if(itemsProcessed === allData.length) {
                            setLoadingOne(false)
                            setChangeSectionsOne(tempSections)
                        }
                    }
                });
            }

            setLoadingOne(true)
            setErrorOccured(null);
            const url = serverUrl + '/tempRoute/searchpageusersearch';
            const toSend = {
                val,
                skip: clear ? 0 : changeSectionsOne.length
            }
            axios.post(url, toSend, {signal: abortControllerRef.current.signal}).then((response) => {
                const result = response.data;
                const {data} = result;
                const {items, noMoreItems} = data;

                setLoadingOne(false)

                layoutUsersFound(items)

                if (noMoreItems) setNoResults(true)
            }).catch(error => {
                if (error instanceof CanceledError) {
                    console.warn('Cancelled intentionally')
                } else {
                    console.error(error);
                    setLoadingOne(false)
                    setErrorOccured(ParseErrorMessage(error));
                    setNoResults(false)
                }
            })
        } else {
            console.log('Empty search')
            setNoResults(false)
            setChangeSectionsOne([])
            setLoadingOne(false)
        }
    }

    async function getImageInCategory(imageKey) {
        return axios.get((serverUrl + '/getImageOnServer/' + imageKey), { signal: abortControllerRef.current.signal})
        .then(res => 'data:image/jpeg;base64,' + res.data);
    }

    const handleCategorySearch = (val, clear) => {
        if (!categoriesReducer.noMoreCategories || clear) {
            if (categoriesReducer.loadingFeed && clear) {
                abortControllerRef.current.abort();
                abortControllerRef.current = new AbortController();
            }
    
            if (val !== "") {
                dispatchCategories({type: clear ? 'startReload' : 'startLoad'})
    
                const layoutCategoriesFound = (data, noMoreCategories) => {
                    if (data.length === 0) {
                        return dispatchCategories({type: 'noMoreCategories'})
                    }

                    var allData = data
                    console.log(allData)
                    console.log(allData.length)
                    var tempSections = []
                    var itemsProcessed = 0;
                    allData.forEach(function (item, index) {
                        if (allData[index].imageKey !== "") {   
                            async function asyncFunctionForImages() {
                                const imageB64 = await getImageInCategory(allData[index].imageKey)
                                var tempSectionsTemp = {categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: imageB64, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots, categoryId: allData[index].categoryId}
                                tempSections.push(tempSectionsTemp)
                                itemsProcessed++;
                                if(itemsProcessed === allData.length) {
                                    dispatchCategories({type: 'addCategories', categories: tempSections, noMoreCategories})
                                }
                            }
                            asyncFunctionForImages()
                        } else {     
                            var tempSectionsTemp = {categoryTitle: allData[index].categoryTitle, categoryDescription: allData[index].categoryDescription, members: allData[index].members, categoryTags: allData[index].categoryTags, image: null, NSFW: allData[index].NSFW, NSFL: allData[index].NSFL, datePosted: allData[index].datePosted, allowScreenShots: allData[index].allowScreenShots, categoryId: allData[index].categoryId}
                            tempSections.push(tempSectionsTemp)
                            itemsProcessed++;
                            if(itemsProcessed === allData.length) {
                                dispatchCategories({type: 'addCategories', categories: tempSections, noMoreCategories})
                            }
                        }
                    });
                }
    
    
                const url = serverUrl + '/tempRoute/searchpagesearchcategories'
                const toSend = {
                    val,
                    lastCategoryId: clear ? undefined : categoriesReducer.categories.length ? categoriesReducer.categories[categoriesReducer.categories.length - 1].categoryId : undefined
                }
                axios.post(url, toSend, {signal: abortControllerRef.current.signal}).then((response) => {
                    const result = response.data;
                    const {data} = result;
    
                    const {categories, noMoreCategories} = data;
    
                    console.log(data)
                    layoutCategoriesFound(categories, noMoreCategories)
                    console.log('Category search was a success')
    
                }).catch(error => {
                    if (error instanceof CanceledError) {
                        console.warn('Intentionally failed request')
                    } else {
                        console.error(error);
                        dispatchCategories({type: 'error', error: ParseErrorMessage(error)})
                    }
                })
            } else {
                console.log('Empty category search')
                dispatchCategories({type: 'resetCategories'})
                dispatchCategories({type: 'stopLoad'})
            }
        }
    }

    const handleChange = (val) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
            abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();
        }

        debounceTimeout.current = setTimeout(() => {
            searchValue.current = val;
            if (filterFormatSearch == "Users") {
                console.log(val)
                handleUserSearch(val, true)
            } else if (filterFormatSearch == "Categories") {
                console.log(val)
                handleCategorySearch(val, true)
            } 
        }, 200)
    }

    useEffect(() => {
        if (searchValue.current !== "" && searchValue.current !== null) {
            setNoResults(false)
            if (filterFormatSearch == "Users") {
                handleUserSearch(searchValue.current)
            } else if (filterFormatSearch == "Categories") {
                handleCategorySearch(searchValue.current, true)
            }
        }
    }, [filterFormatSearch])
    return(
        <>
            <StatusBar style={colors.StatusBarColor}/>
            {storedCredentials ?
                <>
                    <TouchableWithoutFeedback style={{paddingTop: StatusBarHeight - 15, borderColor: colors.borderColor, borderBottomWidth: 1, paddingBottom: 5}} onPress={() => {Keyboard.dismiss()}}>
                        <MemoSearchInput colors={colors} handleChange={handleChange}/>
                        {experimentalFeaturesEnabled && (
                            <>
                                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: -20}}>
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <SubTitle style={{marginBottom: 0, fontSize: 15, fontWeight: 'normal', color: colors.tertiary}}>Users</SubTitle>
                                        {filterFormatSearch == "Users" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: colors.brand, borderWidth: 3, padding: 10, backgroundColor: dark ? colors.darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/035-file-text.png')}/>
                                            </TouchableOpacity>
                                        )}
                                        {filterFormatSearch !== "Users" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: colors.slightlyLighterGrey, borderWidth: 3, padding: 10, backgroundColor: dark ? colors.darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                                abortControllerRef.current.abort();
                                                abortControllerRef.current = new AbortController()
                                                setChangeSectionsOne([])
                                                setFilterFormatSearch("Users")  
                                            }}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/035-file-text.png')}/>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <SubTitle style={{marginBottom: 0, fontSize: 15, fontWeight: 'normal', color: colors.tertiary}}>Categories</SubTitle>
                                        {filterFormatSearch == "Categories" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: colors.brand, borderWidth: 3, padding: 10, backgroundColor: dark ? colors.darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png')}/>
                                            </TouchableOpacity>
                                        )}
                                        {filterFormatSearch !== "Categories" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: colors.slightlyLighterGrey, borderWidth: 3, padding: 10, backgroundColor: dark ? colors.darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                                abortControllerRef.current.abort();
                                                abortControllerRef.current = new AbortController();
                                                dispatchCategories({type: 'resetCategories'})
                                                setFilterFormatSearch("Categories");
                                            }}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/093-drawer.png')}/>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <SubTitle style={{marginBottom: 0, fontSize: 15, fontWeight: 'normal', color: colors.tertiary}}>Images</SubTitle>
                                        {filterFormatSearch == "Images" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: colors.brand, borderWidth: 3, padding: 10, backgroundColor: dark ? colors.darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png')}/>
                                            </TouchableOpacity>
                                        )}
                                        {filterFormatSearch !== "Images" && (
                                            <TouchableOpacity style={{width: 50, height: 50, borderRadius: 30, borderColor: colors.slightlyLighterGrey, borderWidth: 3, padding: 10, backgroundColor: dark ? colors.darkLight : colors.borderColor, alignItems: 'center', justifyContent: 'center'}} onPress={() => {
                                                //setChangeSections([])
                                                //setFilterFormatSearch("Images")
                                                alert('This feature is coming soon')
                                            }}>
                                                <PostIcons style={{width: '100%', height: '100%', resizeMode: 'contain'}} source={require('./../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/015-images.png')}/>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </>
                        )}
                    </TouchableWithoutFeedback>
                    {filterFormatSearch == "Users" ? (
                        <FlatList
                            data={changeSectionsOne}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item, index }) => <UserItem name={item.name} displayName={item.displayName} followers={item.followers}  following={item.following} totalLikes={item.totalLikes} profileKey={item.profileKey} badges={item.badges} index={index} pubId={item.pubId} bio={item.bio} privateAccount={item.privateAccount} colors={colors} navigation={navigation}/>}
                            ListFooterComponent={
                                <>
                                    {noResults === true ? (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.errorColor, textAlign: 'center'}}>{changeSectionsOne.length > 0 ? 'No more results' : 'No results'}</Text>
                                        </View>
                                    ) : null}
                                    {errorOccured !== null ? (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.errorColor, textAlign: 'center'}}>{errorOccured}</Text>
                                        </View>
                                    ) : null}
                                    {loadingOne == true ? (
                                        <View style={{marginTop: 20}}>
                                            <ActivityIndicator size="large" color={colors.brand} />
                                        </View>
                                    ) : null}
                                </>
                            }
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            onEndReachedThreshold={3}
                            onEndReached = {({distanceFromEnd})=>{
                                if (distanceFromEnd > 0) {
                                    console.log('End of the feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                    if (!noResults && searchValue.current !== "" && searchValue.current !== null && errorOccured === null) {
                                        handleUserSearch(searchValue.current)
                                    }
                                }
                            }}
                            onContentSizeChange={(contentWidth, contentHeight) => {
                                userListHeight.current = contentHeight;
                            }}
                            extraData={noResults}
                        />
                    ) : null}
                    {filterFormatSearch == "Categories" ? (
                        <FlatList
                            data={categoriesReducer.categories}
                            keyExtractor={(item) => item.categoryId}
                            renderItem={({ item }) => <CategoryItem categoryTitle={item.categoryTitle} categoryDescription={item.categoryDescription} members={item.members} categoryTags={item.categoryTags} image={item.image} NSFW={item.NSFW} NSFL={item.NSFL} datePosted={item.datePosted} allowScreenShots={item.allowScreenShots} categoryId={item.categoryId}/>}
                            ListFooterComponent={
                                <>
                                    <View style={{marginVertical: 20}}>
                                        {categoriesReducer.loadingFeed == true ?
                                            <ActivityIndicator size="large" color={colors.brand} />     
                                        : categoriesReducer.categories.length === 0 && categoriesReducer.noMoreCategories ?
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>No categories</Text>
                                        : categoriesReducer.error ?
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.errorColor, textAlign: 'center'}}>{String(categoriesReducer.error)}</Text>
                                        : categoriesReducer.noMoreCategories ?
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>There are no more categories to show</Text>
                                        : null}
                                    </View>
                                </>
                            }
                            ListHeaderComponent={
                                <>
                                    {noResults == true && (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.tertiary, textAlign: 'center'}}>No results found</Text>
                                        </View>
                                    )}
                                    {errorOccured !== null && (
                                        <View style={{marginTop: 20}}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.errorColor, textAlign: 'center'}}>{errorOccured}</Text>
                                        </View>
                                    )}
                                </>
                            }
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            onEndReachedThreshold={3}
                            onEndReached = {({distanceFromEnd})=>{
                                if (distanceFromEnd > 0) {
                                    console.log('End of the categories feed was reached with ' + distanceFromEnd + ' pixels from the end.')
                                    if (categoriesReducer.loadingFeed === false && !categoriesReducer.noMoreCategories) {
                                        handleCategorySearch(searchValue.current)
                                    }
                                }
                            }}
                            extraData={noResults}
                        />
                    ) : null}
                    {filterFormatSearch == "Images" ? (
                        <View style={{alignSelf: 'center', textAlign: 'center'}}>
                            <SubTitle style={{alignSelf: 'center', textAlign: 'center', color: colors.tertiary}}>This feature is not out yet...</SubTitle>
                        </View>
                    ) : null}
                </>
            :
                <View style={{flex: 1, justifyContent: 'center', marginHorizontal: '2%'}}>
                    <Text style={{color: colors.tertiary, fontSize: 20, textAlign: 'center', marginBottom: 20}}>Please login to search</Text>
                    <Text style={{color: colors.tertiary, fontSize: 14, textAlign: 'center', marginBottom: 20, fontStyle: 'italic'}}>This is done to protect user privacy</Text>
                    <StyledButton onPress={() => {navigation.navigate('ModalLoginScreen', {modal: true})}}>
                        <ButtonText> Login </ButtonText>
                    </StyledButton>
                    <StyledButton style={{backgroundColor: colors.primary, color: colors.tertiary}} signUpButton={true} onPress={() => navigation.navigate('ModalSignupScreen', {modal: true, Modal_NoCredentials: true})}>
                            <ButtonText signUpButton={true} style={{color: colors.tertiary, top: -9.5}}> Signup </ButtonText>
                    </StyledButton>
                </View>
            }
        </>
    );
}

const UserTextInput = ({label, icon, isPassword, colors, ...props}) => {
    return(
        <SearchBarArea>
            <LeftIcon searchIcon={true}>
                <Octicons name={"search"} size={20} color={colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput style={{backgroundColor: colors.primary, color: colors.tertiary, borderColor: colors.borderColor}} searchPage={true} {...props}/>
        </SearchBarArea>
    )
}

const SearchInput = ({colors, handleChange}) => {
    return(
        <SearchBarArea style={{alignSelf: 'center'}}>
            <UserTextInput
                placeholder="Search"
                placeholderTextColor={colors.tertiary}
                onChangeText={(val) => handleChange(val)}
                colors={colors}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </SearchBarArea>
    );
}

const MemoSearchInput = memo(SearchInput);

export default FindScreen;
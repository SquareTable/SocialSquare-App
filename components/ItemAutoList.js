import { useContext, useEffect, useRef } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import axios, { CanceledError } from "axios";
import { ServerUrlContext } from "./ServerUrlContext";
import ParseErrorMessage from "./ParseErrorMessage";
import Ionicons from 'react-native-vector-icons/Ionicons';

const defaultKeyExtractor = item => item._id

export default function ItemAutoList({noItemsFoundText, centreIfNoItems, url, extraPOSTData = {}, DisplayComponent, extraProps = {}, state, dispatch, noMoreItemsText, keyExtractor = defaultKeyExtractor}) {
    const {colors} = useTheme();
    const {serverUrl} = useContext(ServerUrlContext);
    const AbortControllerRef = useRef(new AbortController());

    function loadItems(reload) {
        if ((!state.noMoreItems || reload) && !state.loading && !state.reloading) {
            dispatch({type: reload ? 'startReload' : 'startLoad'})

            const urlToUse = serverUrl + url;
            const toSend = {
                lastItemId: reload ? undefined : state.items[state.items.length - 1]?.pubId,
                ...extraPOSTData
            }
    
            axios.post(urlToUse, toSend, {signal: AbortControllerRef.current.signal}).then(response => {
                const {items, noMoreItems} = response.data.data;
    
                dispatch({type: 'addItems', items, noMoreItems})
            }).catch(error => {
                if (error instanceof CanceledError) {
                    return dispatch({type: 'error', error: 'Network request was cancelled because list was unmounted.'})
                }

                dispatch({type: 'error', error: ParseErrorMessage(error)})
                console.error(error)
                console.error(ParseErrorMessage(error))
            })
        }
    }

    useEffect(() => {
        loadItems()

        return () => {
            console.warn('Aborting network requests from ItemAutoList as component is getting unmounted.')
            AbortControllerRef.current.abort();
            AbortControllerRef.current = new AbortController();
        }
    }, [dispatch])

    return (
        <>
            {
                state.items.length === 0 && !state.reloading ?
                    <View style={centreIfNoItems ? {flex: 1, justifyContent: 'center', alignItems: 'center'} : {}}>
                        {
                            state.noMoreItems ?
                                <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: colors.tertiary}}>{noItemsFoundText}</Text>
                            : state.error ?
                                <>
                                    <Text style={{color: colors.errorColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>An error occured:</Text>
                                    <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: colors.errorColor}}>{state.error}</Text>
                                    <TouchableOpacity onPress={() => loadItems()}>
                                        <Ionicons name="reload" size={50} color={colors.errorColor} />
                                    </TouchableOpacity>
                                </>
                            : state.loading ? 
                                <ActivityIndicator color={colors.brand} size="large"/>
                            : <Text style={{color: colors.errorColor, fontSize: 20, textAlign: 'center'}}>An unknown error occurred. No items to center.</Text>
                        }
                    </View>
                :
                    <FlatList
                        data={state.items}
                        refreshControl={
                            <RefreshControl
                                refreshing={state.reloading}
                                onRefresh={() => {
                                    loadItems(true)
                                }}
                            />
                        }
                        renderItem={({item, index}) => <DisplayComponent item={item} index={index}/>}
                        keyExtractor={keyExtractor}
                        onEndReachedThreshold={3}
                        onEndReached = {({distanceFromEnd})=>{
                            if (distanceFromEnd > 0) {
                                if (!state.loading && !state.reloading && !state.noMoreItems) {
                                    loadItems(false)
                                }
                            }
                        }}
                        {...extraProps}
                        style={{flex: 1}}
                        ListFooterComponent={
                            <>
                                {
                                    state.loading ?
                                        <ActivityIndicator size="large" color={colors.brand}/>
                                    : state.noMoreItems ?
                                        <Text style={{fontSize: 20, color: colors.tertiary, textAlign: 'center'}}>{noMoreItemsText}</Text>
                                    : state.error ?
                                        <>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: colors.errorColor}}>An error occurred: {state.error}</Text>
                                            <TouchableOpacity onPress={() => loadItems()} style={{padding: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.tertiary, marginTop: 10}}>
                                                <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: colors.tertiary}}>Retry</Text>
                                            </TouchableOpacity>
                                        </>
                                    : null
                                }
                            </>
                        }
                    />
            }
        </>
    )
}
import { useContext, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import useItemReducer from "../hooks/useItemReducer";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import axios from "axios";
import { ServerUrlContext } from "./ServerUrlContext";
import ParseErrorMessage from "./ParseErrorMessage";

export default function ItemAutoList({noItemsFoundText, centreIfNoItems, url, extraPOSTData = {}, DisplayComponent, extraProps = {}}) {
    const [state, dispatch] = useItemReducer();
    const {colors} = useTheme();
    const {serverUrl} = useContext(ServerUrlContext)

    function loadItems(reload) {
        dispatch({type: reload ? 'startReload' : 'startLoad'})

        const urlToUse = serverUrl + url;
        const toSend = {
            lastItemId: reload ? undefined : state.items[state.items.length - 1]?._id,
            ...extraPOSTData
        }

        axios.post(urlToUse, toSend).then(response => {
            const {items, noMoreItems} = response.data;

            dispatch({type: 'addItems', items, noMoreItems})
        }).catch(error => {
            dispatch({type: 'error', error: ParseErrorMessage(error)})
            console.error(error)
        })
    }

    useEffect(loadItems, [])

    if (centreIfNoItems && state.items.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {
                    state.noMoreItems || state.error ?
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: state.error ? colors.errorColor : colors.tertiary}}>{state.error ? state.error : noItemsFoundText}</Text>
                    : state.loading ? 
                        <ActivityIndicator color={colors.brand} size="large"/>
                    : null
                }
            </View>
        )
    }

    return (
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
            renderItem={(item, index) => <DisplayComponent item={item} index={index}/>}
            keyExtractor={item => item._id}
            onEndReachedThreshold={3}
            onEndReached = {({distanceFromEnd})=>{
                if (distanceFromEnd > 0) {
                    if (!state.loading && !state.reloading && !state.noMoreItems) {
                        loadItems(false)
                    }
                }
            }}
            {...extraProps}
        />
    )
}
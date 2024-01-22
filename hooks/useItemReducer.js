import { useReducer } from "react";

function returnReducer(extensions) {
    return (state, action) => {
        if (action.type === 'startLoad') {
            return {
                ...state,
                loading: true
            }
        }

        if (action.type === 'startReload') {
            return {
                ...state,
                reloading: true,
                error: null,
                items: [],
                noMoreItems: false,
                loading: false
            }
        }
    
        if (action.type === 'addItems') {
            if (Array.isArray(action.items) && action.items.length > 0) {
                return {
                    ...state,
                    items: state.items.concat(action.items),
                    noMoreItems: action.noMoreItems,
                    loading: false,
                    reloading: false,
                    error: null
                }
            }
            
            return {
                ...state,
                noMoreItems: true,
                loading: false,
                reloading: false,
                error: null
            }
        }
    
        if (action.type === 'error') {
            return {
                ...state,
                error: action.error,
                loading: false,
                reloading: false
            }
        }
    
        throw new Error(`Unrecognized action type given to useItemRuducer: ${action.type}`)
    }
}

const initialState = {
    items: [],
    noMoreItems: false,
    loading: false,
    reloading: false,
    error: null
}

const useItemReducer = (extensions) => {
    const reducer = returnReducer(extensions);

    return useReducer(reducer, initialState)
}

export default useItemReducer
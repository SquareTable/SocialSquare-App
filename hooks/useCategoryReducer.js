import { useReducer } from "react";

const reducer = (state, action) => {
    console.log('Action Type:', action.type, ' | Post Index:', action.postIndex)


    if (action.type === 'addCategories') {
        console.warn('Adding categories')
        if (action.categories) {
            const newState = {
                ...state,
                categories: state.categories.concat(action.categories),
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            }
            
            if (typeof action.noMoreCategories === 'boolean') {
                newState.noMoreCategories = action.noMoreCategories
            } else {
                console.warn('noMoreCategories is not a boolean')
            }

            return newState;
        } else {
            console.error('No posts were given to reducer')
            return {
                ...state,
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            };
        }
    }

    if (action.type === 'noMoreCategories') {
        return {
            ...state,
            noMoreCategories: true,
            reloadingFeed: false,
            loadingFeed: false
        }
    }

    if (action.type === 'startLoad') {
        return {
            ...state,
            loadingFeed: true,
            error: null
        }
    }

    if (action.type === 'startReload') {
        return {
            ...state,
            loadingFeed: true,
            reloadingFeed: true,
            categories: [],
            error: null,
            noMoreCategories: false
        };
    }

    if (action.type === 'stopLoad') {
        return {
            ...state,
            loadingFeed: false,
            reloadingFeed: false
        }
    }

    if (action.type === 'resetCategories') {
        return {
            ...state,
            categories: [],
            error: null,
            noMoreCategories: false
        }
    }

    if (action.type === 'error') {
        if (action.error == undefined) throw new Error('error was dispatched to useCategoryReducer but no error was provided.')

        return {
            ...state,
            loadingFeed: false,
            reloadingFeed: false,
            error: action.error
        }
    }

    throw new Error('Wrong action type was passed to useCategoryReducer. Action passed:' + action.type)
}

const initialState = {
    loadingFeed: false,
    reloadingFeed: false,
    categories: [],
    error: null,
    noMoreCategories: false
}

const useCategoryReducer = () => {
    return useReducer(reducer, initialState)
}

export default useCategoryReducer
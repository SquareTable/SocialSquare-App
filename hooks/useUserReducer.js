import { useReducer } from "react";

const reducer = (state, action) => {
    console.log('Action Type:', action.type, ' | Post Index:', action.postIndex)


    if (action.type === 'addUsers') {
        console.warn('Adding users')
        if (action.users) {
            return {
                ...state,
                users: state.users.concat(action.users),
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            }
        } else {
            console.error('No users were given to reducer')
            return {
                ...state,
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            };
        }
    }

    if (action.type === 'removeUser') {
        if (typeof action.userIndex !== "number") throw new Error(`Invalid type passed to removeUser action for useUserReducer: ${typeof action.userIndex}`)

        const newUsers = [...state.users];

        newUsers.splice(action.userIndex, 1)

        return {
            ...state,
            users: newUsers
        }
    }

    if (action.type === 'noMoreUsers') {
        return {
            ...state,
            noMoreUsers: true,
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
    users: [],
    error: null,
    loadingFeed: false,
    reloadingFeed: false,
    noMoreUsers: false
}

const useUserReducer = () => {
    return useReducer(reducer, initialState)
}

export default useUserReducer
import { useReducer } from "react";

const reducer = (state, action) => {
    if (action.type === 'addNotifications') {
        const newNotifications = state.notifications.concat(action.notifications)

        return {
            ...state,
            notifications: newNotifications,
            error: null,
            loadingFeed: false,
            reloadingFeed: false
        }
    }

    if (action.type === 'startLoadingNotifications') {
        return {
            ...state,
            loadingFeed: true,
            error: null
        }
    }

    if (action.type === 'startReloadingNotifications') {
        return {
            ...state,
            loadingFeed: true,
            reloadingFeed: true,
            error: null
        }
    }

    if (action.type === 'errorLoadingNotifications') {
        return {
            ...state,
            loadingFeed: false,
            reloadingFeed: false,
            error: action.error
        }
    }

    if (action.type === 'startClearingNotifications') {
        return {
            ...state,
            clearing: true,
            errorClearing: null
        }
    }

    if (action.type === 'clearedNotifications') {
        return {
            ...state,
            clearing: false,
            notifications: [],
            errorClearing: null
        }
    }

    if (action.type === 'errorClearingNotifications') {
        return {
            ...state,
            clearing: false,
            errorClearing: action.error
        }
    }

    if (action.type === 'startDeletingNotification') {
        if (typeof action.index !== 'number') throw new Error(`Expected action.index for useNotificationReducer for startDeletingNotification action to be a number. Received: ${typeof action.index}`)
        const newNotifications = [...state.notifications];

        newNotifications[action.index] = {
            ...newNotifications[action.index],
            errorDeleting: null,
            deleting: true
        }

        return {
            ...state,
            notifications: newNotifications
        }
    }

    if (action.type === 'errorDeletingNotification') {
        if (typeof action.index !== 'number') throw new Error(`Expected action.index for useNotificationReducer for errorDeletingNotification action to be a number. Received: ${typeof action.index}`)
        const newNotifications = [...state.notifications];

        newNotifications[action.index] = {
            ...newNotifications[action.index],
            deleting: false,
            errorDeleting: error
        }

        return {
            ...state,
            notifications: newNotifications
        }
    }

    if (action.type === 'deletedNotification') {
        if (typeof action.index !== 'number') throw new Error(`Expected action.index for useNotificationReducer for deletedNotification action to be a number. Received: ${typeof action.index}`)

        const newNotifications = [...state.notifications];

        newNotifications.splice(action.index, 1)

        return {
            ...state,
            notifications: newNotifications
        }
    }

    throw new Error(`Unknown action type was given to useNotificationReducer: ${action.type}`)
}

const initialState = {
    notifications: [],
    error: null,
    loadingFeed: false,
    reloadingFeed: false,
    errorClearing: null,
    clearing: false
}

const useNotificationReducer = () => {
    return useReducer(reducer, initialState)
}

export default useNotificationReducer;
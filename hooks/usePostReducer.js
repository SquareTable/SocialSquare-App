import { useReducer } from "react";

const reducer = (state, action) => {
    console.log('Action Type:', action.type, ' | Post Index:', action.postIndex)
    if (action.type === 'upVote') {
        if (typeof action.postIndex === 'number') {
            if (typeof state.posts[action.postIndex] === 'object') {
                state.posts[action.postIndex] = {
                    ...state.posts[action.postIndex],
                    changingVote: false,
                    upvoted: true,
                    downvoted: false,
                    votes: state.posts[action.postIndex].initialVotes + 1
                }

                return {...state};
            } else {
                throw new Error(`Item at state.posts[${action.postIndex}] has a typeof ${typeof state.posts[action.postIndex]}. Expected object.`)
            }
        } else {
            throw new Error('postIndex was not provided to upVote image in usePostReducer')
        }
    }


    if (action.type === 'downVote') {

        if (typeof action.postIndex === 'number') {
            if (typeof state.posts[action.postIndex] === 'object') {
                state.posts[action.postIndex] = {
                    ...state.posts[action.postIndex],
                    changingVote: false,
                    upvoted: false,
                    downvoted: true,
                    votes: state.posts[action.postIndex].initialVotes - 1
                }

                return {...state};
            } else {
                throw new Error(`Item at state.posts[${action.postIndex}] has a typeof ${typeof state.posts[action.postIndex]}. Expected object.`)
            }
        } else {
            throw new Error('postIndex was not provided to downVote image in usePostReducer')
        }
    }

    if (action.type === 'neutralVote') {
        if (typeof action.postIndex === 'number') {
            if (typeof state.posts[action.postIndex] === 'object') {
                state.posts[action.postIndex] = {
                    ...state.posts[action.postIndex],
                    changingVote: false,
                    upvoted: false,
                    downvoted: false,
                    votes: state.posts[action.postIndex].initialVotes
                }

                return {...state}
            } else {
                throw new Error(`Item at state.posts[${action.postIndex}] has a typeof ${typeof state.posts[action.postIndex]}. Expected object.`)
            }
        } else {
            throw new Error('postIndex was not provided to neutralVote image in usePostReducer')
        }
    }

    if (action.type === 'startChangingVote') {
        if (typeof action.postIndex === 'number') {
            const newPostData = {
                ...state.posts[action.postIndex],
                changingVote: true
            }

            state.posts[action.postIndex] = newPostData;
            return {...state};
        }

        throw new Error('Post index provided to startChangingVote in usePostReducer is not a number')
    }

    if (action.type === 'stopChangingVote') {
        if (typeof action.postIndex === 'number') {
            const newPostData = {
                ...state.posts[action.postIndex],
                changingVote: false
            }

            state.posts[action.postIndex] = newPostData;
            return {...state}
        }

        throw new Error('Post index provided to stopChangingVote in usePostReducer is not a number')
    }


    if (action.type === 'addPosts') {
        console.warn('Adding posts')
        if (action.posts) {
            console.log('HELLO')
            const newPosts = action.posts.map(post => {
                post.initialVotes = post.upvoted ? post.votes - 1 : post.downvoted ? post.votes + 1 : post.votes;
                post.changingVote = false;
                post.deleting = false;
                return post;
            })
            return {
                ...state,
                posts: state.posts.concat(newPosts),
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            }
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

    if (action.type === 'noMorePosts') {
        return {
            ...state,
            noMorePosts: true,
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
            posts: [],
            error: null
        };
    }

    if (action.type === 'stopLoad') {
        return {
            ...state,
            loadingFeed: false,
            reloadingFeed: false
        }
    }

    if (action.type === 'resetPosts') {
        return {
            ...state,
            posts: [],
            error: null
        }
    }


    if (action.type === 'hideMenu') {
        return {
            ...state,
            threeDotsMenu: null
        }
    }

    if (action.type === 'showMenu') {
        if (action.postId == undefined) throw new Error('PostId was not provided to usePostReducer')
        if (action.isOwner == undefined && action.menuToShow == undefined) throw new Error('Neither isOwner nor menuToShow was provided to usePostReducer')
        if (action.postIndex == undefined) throw new Error('Post index was not provided to usePostReducer')
        if (action.postFormat == undefined) throw new Error('postFormat was not provided to usePostReducer')

        return {
            ...state,
            threeDotsMenu: {
                postId: action.postId,
                menuToShow: action.menuToShow || action.isOwner ? 'Owner' : 'NotOwner', //Opening extra menus from the ThreeDots menu is possible
                postIndex: action.postIndex,
                postFormat: action.postFormat,
                onDeleteCallback: action.onDeleteCallback
            }
        }
    }

    if (action.type === 'startDeletePost') {
        if (action.postIndex == undefined) throw new Error('PostIndex was not provided to usePostReducer')

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            deleting: true
        }

        return {
            ...state,
            threeDotsMenu: null
        }
    }

    if (action.type === 'stopDeletePost') {
        if (action.postIndex == undefined) throw new Error('PostIndex was not provided to usePostReducer')

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            deleting: false
        }

        return {...state}
    }

    if (action.type === 'deletePost') {
        if (action.postIndex == undefined) throw new Error('PostIndex was not provided to usePostReducer')

        const tempPosts = [...state.posts]
        tempPosts.splice(action.postIndex, 1)

        return {
            ...state,
            posts: tempPosts
        }
    }

    if (action.type === 'error') {
        if (action.error == undefined) throw new Error('error was dispatched to usePostReducer but no error was provided.')

        return {
            ...state,
            loadingFeed: false,
            reloadingFeed: false,
            error: action.error
        }
    }

    throw new Error('Wrong action type was passed to usePostReducer')
}

const initialState = {
    loadingFeed: false,
    reloadingFeed: false,
    posts: [],
    threeDotsMenu: null,
    error: null,
    noMorePosts: false
}

const usePostReducer = () => {
    return useReducer(reducer, initialState)
}

export default usePostReducer
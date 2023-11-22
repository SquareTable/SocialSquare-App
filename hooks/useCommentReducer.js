import { useReducer } from "react";

const reducer = (state, action) => {
    console.log('Action Type:', action.type, ' | Post Index:', action.commentIndex)
    if (action.type === 'upVote') {
        if (typeof action.commentIndex === 'number') {
            if (typeof state.comments[action.commentIndex] === 'object') {
                state.comments[action.commentIndex] = {
                    ...state.comments[action.commentIndex],
                    changingVote: false,
                    upvoted: true,
                    downvoted: false,
                    votes: state.comments[action.commentIndex].initialVotes + 1
                }

                return {...state};
            } else {
                throw new Error(`Item at state.comments[${action.commentIndex}] has a typeof ${typeof state.comments[action.commentIndex]}. Expected object.`)
            }
        } else {
            throw new Error('commentIndex was not provided to upVote image in useCommentReducer')
        }
    }


    if (action.type === 'downVote') {

        if (typeof action.commentIndex === 'number') {
            if (typeof state.comments[action.commentIndex] === 'object') {
                state.comments[action.commentIndex] = {
                    ...state.comments[action.commentIndex],
                    changingVote: false,
                    upvoted: false,
                    downvoted: true,
                    votes: state.comments[action.commentIndex].initialVotes - 1
                }

                return {...state};
            } else {
                throw new Error(`Item at state.comments[${action.commentIndex}] has a typeof ${typeof state.comments[action.commentIndex]}. Expected object.`)
            }
        } else {
            throw new Error('commentIndex was not provided to downVote image in useCommentReducer')
        }
    }

    if (action.type === 'neutralVote') {
        if (typeof action.commentIndex === 'number') {
            if (typeof state.comments[action.commentIndex] === 'object') {
                state.comments[action.commentIndex] = {
                    ...state.comments[action.commentIndex],
                    changingVote: false,
                    upvoted: false,
                    downvoted: false,
                    votes: state.comments[action.commentIndex].initialVotes
                }

                return {...state}
            } else {
                throw new Error(`Item at state.comments[${action.commentIndex}] has a typeof ${typeof state.comments[action.commentIndex]}. Expected object.`)
            }
        } else {
            throw new Error('commentIndex was not provided to neutralVote image in useCommentReducer')
        }
    }

    if (action.type === 'startChangingVote') {
        if (typeof action.commentIndex === 'number') {
            const newPostData = {
                ...state.comments[action.commentIndex],
                changingVote: true
            }

            state.comments[action.commentIndex] = newPostData;
            return {...state};
        }

        throw new Error('Comment index provided to startChangingVote in useCommentReducer is not a number')
    }

    if (action.type === 'stopChangingVote') {
        if (typeof action.commentIndex === 'number') {
            const newPostData = {
                ...state.comments[action.commentIndex],
                changingVote: false
            }

            state.comments[action.commentIndex] = newPostData;
            return {...state}
        }

        throw new Error('Comment index provided to stopChangingVote in useCommentReducer is not a number')
    }


    if (action.type === 'addComments') {
        console.warn('Adding comments')
        if (action.comments) {
            console.log('HELLO')
            const newComments = action.comments.map(comment => {
                comment.initialVotes = comment.upvoted ? comment.votes - 1 : comment.downvoted ? comment.votes + 1 : comment.votes;
                comment.changingVote = false;
                comment.deleting = false;
                return comment;
            })
            
            return {
                ...state,
                comments: state.comments.concat(newComments),
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            }
        } else {
            console.error('No comments were given to reducer')
            return {
                ...state,
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            };
        }
    }

    if (action.type === 'addCommentsToStart') {
        if (action.comments) {
            const newComments = action.comments.map(comment => {
                comment.initialVotes = comment.upvoted ? comment.votes - 1 : comment.downvoted ? comment.votes + 1 : comment.votes;
                comment.changingVote = false;
                comment.deleting = false;
                return comment;
            })

            return {
                ...state,
                comments: newComments.concat(state.comments),
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            }
        } else {
            console.error('No comments were given to reducer')
            return {
                ...state,
                loadingFeed: false,
                reloadingFeed: false,
                error: null
            };
        }
    }

    if (action.type === 'noMoreComments') {
        return {
            ...state,
            noMoreComments: true,
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
            comments: [],
            error: null,
            noMorePosts: false
        };
    }

    if (action.type === 'stopLoad') {
        return {
            ...state,
            loadingFeed: false,
            reloadingFeed: false
        }
    }

    if (action.type === 'resetComments') {
        return {
            ...state,
            comments: [],
            error: null,
            noMoreComments: false
        }
    }


    if (action.type === 'hideMenu') {
        return {
            ...state,
            threeDotsMenu: null
        }
    }

    if (action.type === 'showMenu') {
        if (action.postId == undefined) throw new Error('PostId was not provided to useCommentReducer')
        if (action.isOwner == undefined && action.menuToShow == undefined) throw new Error('Neither isOwner nor menuToShow was provided to useCommentReducer')
        if (action.commentIndex == undefined) throw new Error('commentIndex was not provided to useCommentReducer')
        if (action.postFormat == undefined) throw new Error('postFormat was not provided to useCommentReducer')

        return {
            ...state,
            threeDotsMenu: {
                postId: action.postId,
                menuToShow: action.menuToShow || action.isOwner ? 'Owner' : 'NotOwner', //Opening extra menus from the ThreeDots menu is possible
                postIndex: action.commentIndex,
                postFormat: action.postFormat,
                onDeleteCallback: action.onDeleteCallback
            }
        }
    }

    if (action.type === 'startDeleteComment') {
        if (action.commentIndex == undefined) throw new Error('commentIndex was not provided to useCommentReducer')

        state.comments[action.commentIndex] = {
            ...state.comments[action.commentIndex],
            deleting: true
        }

        return {
            ...state,
            threeDotsMenu: null
        }
    }

    if (action.type === 'stopDeleteComment') {
        if (action.commentIndex == undefined) throw new Error('commentIndex was not provided to useCommentReducer')

        state.comments[action.commentIndex] = {
            ...state.comments[action.commentIndex],
            deleting: false
        }

        return {...state}
    }

    if (action.type === 'deleteComment') {
        if (action.commentIndex == undefined) throw new Error('commentIndex was not provided to useCommentReducer')

        const tempComments = [...state.comments]
        tempComments.splice(action.commentIndex, 1)

        return {
            ...state,
            comments: tempComments
        }
    }

    if (action.type === 'error') {
        if (action.error == undefined) throw new Error('error was dispatched to useCommentReducer but no error was provided.')

        return {
            ...state,
            loadingFeed: false,
            reloadingFeed: false,
            error: action.error
        }
    }

    if (action.type === 'changeReplyCount') {
        //Currently unused but will be in the future
        if (typeof action.changeCount !== 'number') throw new Error(`changeReplyCount is expecting action.changeCount to be a number. Received: ${typeof action.changeCount}.`)
        if (typeof action.commentIndex !== 'number') throw new Error(`changeReplyCount is expecting action.commentIndex to be a number. Received: ${typeof action.commentIndex}.`)

        state.comments[action.commentIndex] = {
            ...state.comments[action.commentIndex],
            replies: state.comments[action.commentIndex].replies + action.changeCount
        }

        return {...state}
    }

    if (action.type === 'softDeleteComment') {
        if (typeof action.commentIndex !== 'number') throw new Error(`softDeleteComment is expecting action.commentIndex to be a number. Received: ${typeof action.commentIndex}.`)

        state.comments[action.commentIndex] = {
            ...state.comments[action.commentIndex],
            deleted: true
        }

        return {...state}
    }

    throw new Error(`Wrong action type was passed to useCommentReducer: ${action.type}`)
}

const initialState = {
    loadingFeed: false,
    reloadingFeed: false,
    comments: [],
    threeDotsMenu: null,
    error: null,
    noMorePosts: false
}

const useCommentReducer = () => {
    return useReducer(reducer, initialState)
}

export default useCommentReducer;
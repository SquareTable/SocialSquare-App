import { useReducer } from "react";

//
//
//
//
// THIS FILE'S CONTENTS HAS BEEN COPIED FROM usePostReducer
// THE CONTENTS OF THIS FILE HAS MOSTLY BEEN UNCHANGED FROM THE ORIGINAL
// THIS FILE WILL EVENTUALLY ONLY HAVE COMMENT-RELATED FUNCTIONALITY AND ALL POST FUNCTIONALITY WILL BE REMOVED
//
//
//
//

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
            throw new Error('postIndex was not provided to upVote image in useCommentReducer')
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
            throw new Error('postIndex was not provided to downVote image in useCommentReducer')
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
            throw new Error('postIndex was not provided to neutralVote image in useCommentReducer')
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

        throw new Error('Post index provided to startChangingVote in useCommentReducer is not a number')
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

        throw new Error('Post index provided to stopChangingVote in useCommentReducer is not a number')
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

    if (action.type === 'resetPosts') {
        return {
            ...state,
            posts: [],
            error: null,
            noMorePosts: false
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
        if (action.postIndex == undefined) throw new Error('Post index was not provided to useCommentReducer')
        if (action.postFormat == undefined) throw new Error('postFormat was not provided to useCommentReducer')

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
        if (action.postIndex == undefined) throw new Error('PostIndex was not provided to useCommentReducer')

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
        if (action.postIndex == undefined) throw new Error('PostIndex was not provided to useCommentReducer')

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            deleting: false
        }

        return {...state}
    }

    if (action.type === 'deletePost') {
        if (action.postIndex == undefined) throw new Error('PostIndex was not provided to useCommentReducer')

        const tempPosts = [...state.posts]
        tempPosts.splice(action.postIndex, 1)

        return {
            ...state,
            posts: tempPosts
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

    if (action.type === 'startPollVoteChange') {
        if (typeof action.postIndex !== 'number') throw new Error('postIndex was not provided to startPollVoteChange action of useCommentReducer')

        if (typeof state.posts[action.postIndex] !== 'object' || Array.isArray(state.posts[action.postIndex]) || state.posts[action.postIndex] === null) throw new Error(`Post at index ${action.postIndex} is not an object`)

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            pollVoteChanging: true
        }

        return {...state};
    }

    if (action.type === 'stopPollVoteChange') {
        if (typeof action.postIndex !== 'number') throw new Error('postIndex was not provided to stopPollVoteChange action of useCommentReducer')

        if (typeof state.posts[action.postIndex] !== 'object' || Array.isArray(state.posts[action.postIndex]) || state.posts[action.postIndex] === null) throw new Error(`Post at index ${action.postIndex} is not an object`)

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            pollVoteChanging: false
        }

        return {...state};
    }

    if (action.type === 'voteOnPoll') {
        if (typeof action.postIndex !== 'number') throw new Error('postIndex was not provided to voteOnPoll action of useCommentReducer')
        if (typeof state.posts[action.postIndex] !== 'object' || Array.isArray(state.posts[action.postIndex]) || state.posts[action.postIndex] === null) throw new Error(`Post at index ${action.postIndex} is not an object`)

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            votedFor: action.optionSelected
        }

        return {...state}
    }

    if (action.type === 'removeVoteOnPoll') {
        if (typeof action.postIndex !== 'number') throw new Error('postIndex was not provided to removeVoteOnPoll action of useCommentReducer')
        if (typeof state.posts[action.postIndex] !== 'object' || Array.isArray(state.posts[action.postIndex]) || state.posts[action.postIndex] === null) throw new Error(`Post at index ${action.postIndex} is not an object`)

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            votedFor: 'None'
        }

        return {...state}
    }

    if (action.type === 'openPollVoteMenu') {
        if (typeof action.postIndex !== 'number') throw new Error('postIndex was not provided to openPollVoteMenu action of useCommentReducer')
        if (typeof state.posts[action.postIndex] !== 'object' || Array.isArray(state.posts[action.postIndex]) || state.posts[action.postIndex] === null) throw new Error(`Post at index ${action.postIndex} is not an object`)

        state.posts[action.postIndex] = {
            ...state.posts[action.postIndex],
            openPollVoteMenu: state.posts[action.postIndex].openPollVoteMenu === action.openPollVoteMenu ? "None" : action.openPollVoteMenu
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
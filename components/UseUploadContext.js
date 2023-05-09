//This context makes the data from useUpload hook accessible globally and have the same state
import { createContext } from "react";

export const UseUploadContext = createContext({
    uploadPost: () => {},
    retryUpload: () => {},
    cancelRetry: () => {},
    numPostsUploading: 0,
    numUploadErrors: 0,
    postsToUpload: {},
    postsUploading: [],
    uploadErrors: []
})
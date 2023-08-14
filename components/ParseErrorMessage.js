export default function ParseErrorMessage(error) {
    return error?.response?.data?.message ? String(error?.response?.data?.message) : 'An unknown error occurred. Please check your network connection and try again.'
}
import { useState, useEffect } from "react";
import { Keyboard, Platform } from "react-native";

const useIsKeyboardVisible = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const keyboardShowListener = Platform.OS == 'ios' ? Keyboard.addListener('keyboardWillShow', () => setVisible(true)) : Keyboard.addListener('keyboardDidShow', () => setVisible(true))
        const keyboardHideListener = Platform.OS == 'ios' ? Keyboard.addListener('keyboardWillHide', () => setVisible(false)) : Keyboard.addListener('keyboardDidHide', () => setVisible(false))

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        }
    }, [])

    return visible;
}

export default useIsKeyboardVisible;
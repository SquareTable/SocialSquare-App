import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "@react-navigation/native";

export default KeyboardAvoidingScrollView = ({children}) => {
    const {colors} = useTheme();
    return (
        <KeyboardAwareScrollView style={{height: '100%', backgroundColor: colors.primary}} enableOnAndroid keyboardOpeningTime={0}>
            {children}
        </KeyboardAwareScrollView>
    )
}
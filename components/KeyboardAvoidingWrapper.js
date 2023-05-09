import React from 'react';
import { useTheme } from '@react-navigation/native';

// keyboard avoiding view
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';

import {Colors} from '../screens/screenStylings/styling.js';
const {primary} = Colors;

const KeyboardAvoidingWrapper = ({children}) => {
    const { colors } = useTheme();
    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: colors.primary}}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper;
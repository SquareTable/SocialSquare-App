import React from 'react';

// keyboard avoiding view
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';

import {Colors} from '../screens/screenStylings/styling.js';
const {primary} = Colors;

const KeyboardAvoidingWrapper_NoScrollview = ({children}) => {
    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: primary}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {children}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper_NoScrollview;
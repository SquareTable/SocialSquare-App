import React from "react";
import { TouchableOpacity, View } from "react-native";

const RadioButton = ({selected, colors, onPress, disabled = false}) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
            <View style={{marginTop: 20, backgroundColor: colors.borderColor, minHeight: 30, height: 30, maxHeight: 30, minWidth: 30, width: 30, maxWidth: 30, borderRadius: 30/2, borderColor: selected ? colors.brand : colors.tertiary, borderWidth: 2, justifyContent: 'center', alignItems: 'center'}}>
                {selected && (
                    <View style={{backgroundColor: colors.tertiary, minHeight: 15, height: 15, maxHeight: 15, minWidth: 15, width: 15, maxWidth: 15, borderRadius: 15/2}}/>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default RadioButton;
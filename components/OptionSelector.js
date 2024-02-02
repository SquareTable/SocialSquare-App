import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export default function OptionSelector({options, selected, setOption}) {
    const {colors} = useTheme();

    return (
        <View style={{flexDirection: 'row'}}>
            {
                options.map((option, index) => {
                    const optionSelected = selected === option
                    return (
                        <TouchableOpacity key={index} onPress={() => setOption(option)} style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', borderColor: optionSelected ? colors.brand : colors.tertiary, borderBottomWidth: 2}}>
                            <Text style={{color: optionSelected ? colors.brand : colors.tertiary, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{option.toUpperCase()}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}
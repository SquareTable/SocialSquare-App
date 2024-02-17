import { PureComponent, useContext } from "react";
import { View, Image, Text } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { ServerUrlContext } from "../ServerUrlContext";
import { TouchableOpacity } from "react-native";

class UserItemClass extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {this.props.navigation.push('ProfilePages', {pubId: this.props.item.pubId})}} style={{minHeight: 70, maxHeight: 70, borderColor: this.props.colors.borderColor, borderTopWidth: this.props.index === 0 ? 1 : 0, borderBottomWidth: 1}}>
                <View style={{flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 5, flexDirection: 'row'}}>
                    <Image source={{uri: `${this.props.serverUrl}/getRawImageOnServer/${this.props.item.profileImageKey}`}} style={{minHeight: 60, minWidth: 60, borderColor: this.props.colors.borderColor, borderWidth: 2, borderRadius: 1000}}/>
                    <Text style={{fontSize: 16, color: this.props.colors.tertiary, marginLeft: 10}}>{this.props.item.displayName || this.props.item.name || 'Error'}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default function UserItem({item, index}) {
    const {colors, colorsIndexNum} = useTheme();
    const {serverUrl} = useContext(ServerUrlContext);
    const navigation = useNavigation();

    const props = {
        item,
        index,
        colors,
        colorsIndexNum,
        serverUrl,
        navigation
    }

    return <UserItemClass {...props}/>
}
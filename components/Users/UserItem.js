import { PureComponent } from "react";
import { View, Image, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

class UserItemClass extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{height: 70}}>
                <View style={{flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 5}}>
                    <Image source={{uri: this.props.profileImageB64}} style={{height: 60}}/>
                    <Text style={{fontSize: 16, color: this.props.colors.tertiary, marginLeft: 10}}>{this.props.displayName || this.props.username || 'Error'}</Text>
                </View>
            </View>
        )
    }
}

export default function UserItem({profileImageB64, username, displayName, pubId}) {
    const {colors, colorsIndexNum} = useTheme();

    const props = {
        profileImageB64,
        username,
        displayName,
        pubId,
        colors,
        colorsIndexNum
    }

    return <UserItemClass {...props}/>
}
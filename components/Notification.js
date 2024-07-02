import { useNavigation, useTheme } from "@react-navigation/native";
import { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";

class Notification extends Component {
    constructor(props) {
        super(props);
        this.touchDisabled = !props.notification.profilePublicId && !(props.notification.postId && props.notification.postFormat)
    }

    shouldComponentUpdate(nextProps, nextState) {
        const colorsAreSame = this.props.colorsIndexNum === nextProps.colorsIndexNum;

        if (colorsAreSame) return false

        return true
    }

    handlePress = () => {
        if (this.props.notification.profilePublicId) {
            return this.props.navigation.navigate('ProfilePages', {pubId: this.props.notification.profilePublicId})
        }

        if (this.props.notification.postId && this.props.notification.postFormat) {
            return
        }

        alert('handlePress should not be getting called. This is a bug.')
    }

    render() {
        return (
            <TouchableOpacity disabled={this.touchDisabled} onPress={this.handlePress} style={{borderColor: this.props.colors.tertiary, borderTopWidth: this.props.index === 0 ? 2 : 0, borderBottomWidth: 2, padding: 5}}>
                <Text style={{color: this.props.colors.tertiary, fontSize: 20, textAlign: 'center'}}>{this.props.notification.text}</Text>
            </TouchableOpacity>
        )
    }
}

const NotificationFunction = (props) => {
    const {colors, colorsIndexNum} = useTheme();
    const navigation = useNavigation();

    const notificationProps = {
        notification: props.notification,
        navigation,
        colors,
        colorsIndexNum,
        index: props.index
    }

    return <Notification {...notificationProps}/>
}

export default NotificationFunction;
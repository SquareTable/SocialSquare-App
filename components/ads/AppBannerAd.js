import { useTheme } from "@react-navigation/native";
import { Component, useContext } from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { AdIDContext } from "../AdIDContext";

class AppBannerAdClass extends Component {
    constructor(props) {
        super(props)
    }

    static getDerivedStateFromError(error) {
        console.error(error)

        return {
            error: true
        }
    }

    render() {
        if (this.state.error) return (
            <View style={{height: 300, width: 300, borderColor: this.props.colors.errorColor, borderWidth: 1, borderStyle: 'dashed'}}/>
        )

        return (
            <BannerAd
                unitId={this.props.AdID}
                size={BannerAdSize.MEDIUM_RECTANGLE}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdFailedToLoad={(error) => console.warn('An error occured while loading ad:', error)}
            />
        )
    }
}

function AppBannerAd(props) {
    const {colors} = useTheme();
    const {AdID, setAdID} = useContext(AdIDContext);

    return <AppBannerAdClass colors={colors} AdID={AdID} {...props}/>
}

export default AppBannerAd;
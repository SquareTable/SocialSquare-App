import React from 'react';
import { Image} from 'react-native';
import {useTheme} from "@react-navigation/native";
import {
    TestText,
    FlexRow_NOJustifyContent
} from '../screens/screenStylings/styling.js';


const MemberRow = ({navigation}, props) => {
    const { username, user_profile_pic } = props;
    const { colors } = useTheme();
    return(
        <FlexRow_NOJustifyContent style={{marginBottom: 15}}>
            <Image
                source={user_profile_pic || require('../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/266-question.png')}
                style={{minHeight: 50, minWidth: 50, width: 50, height: 50, maxWidth: 50, maxHeight: 50, borderRadius: 70/2}}
                resizeMode="contain"
                resizeMethod="resize"
            />
            <TestText style={{marginLeft: 15, marginTop: 13, color: colors.tertiary}}>{username? username : "Couldn't get name"}</TestText>
        </FlexRow_NOJustifyContent>
    );
};

export default MemberRow;
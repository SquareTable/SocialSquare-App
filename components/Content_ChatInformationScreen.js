import React from 'react';
import { Image, TouchableOpacity} from 'react-native';

import { useTheme } from '@react-navigation/native';


const Content = ({navigation}, props) => {
    const {colors} = useTheme();
    const {source_for_image} = props;
    return(
        <TouchableOpacity onPress={() => {alert("Coming soon")}}>
            <Image
                source={source_for_image || require('../assets/icomoon-icons/IcoMoon-Free-master/PNG/64px/266-question.png')}
                style={source_for_image ? {minHeight: 60, minWidth: 60, width: 60, height: 60, maxWidth: 60, maxHeight: 60, borderWidth: 8, borderColor: colors.darkest} : {minHeight: 60, minWidth: 60, width: 60, height: 60, maxWidth: 60, maxHeight: 60}}
                resizeMode="cover"
                resizeMethod="resize"
            />
        </TouchableOpacity>
    );
};

export default Content;
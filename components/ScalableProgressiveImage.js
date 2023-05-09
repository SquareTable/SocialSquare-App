import Image from 'react-native-scalable-image';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
      container: {
        backgroundColor: '#e1e4e8',
      },
});

class ScalableProgressiveImage extends React.Component {
    render() {
        return (
            <View style={Styles.container}>
                <Image {...this.props} />
            </View>
        );
    }
}

export default ScalableProgressiveImage;

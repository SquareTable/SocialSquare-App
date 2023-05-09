import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet, Animated } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get('window');


class OfflineNotice extends PureComponent {
  state = {
    isConnected: true
  };

  unsubscribe = NetInfo.addEventListener(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
    var isConnected = state.isConnected;
    this.setState({ isConnected });
  });

  componentDidMount() {

  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {
        bottom,
        ...props
    } = this.props;
    if (!this.state.isConnected) {
        if (bottom == true) {
            return (
                <View style={{
                    backgroundColor: '#b52424',
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width,
                    zIndex: 1000,
                    position: 'absolute',
                    bottom: 0
                }}>
                    <Text style={{color: '#fff'}}>No Internet Connection</Text>
                </View>
            );
        } else {
            return (
                <View style={{
                    backgroundColor: '#b52424',
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width,
                    zIndex: 1000,
                    position: 'absolute',
                }}>
                    <Text style={{color: '#fff'}}>No Internet Connection</Text>
                </View>
            );
        }
    }
    return null;
  }
}

export default OfflineNotice;
'use strict';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text
 } from 'react-native';

class Navigation extends Component {
    render() {
        return (
            <View>
                <Text  style={styles.container}>
                    This is the navbar!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'darkgray',
  },
});

export default Navigation;
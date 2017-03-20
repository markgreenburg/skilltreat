'use strict';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text
 } from 'react-native';
 import Navigation from './Navigation';
 import ElectiveGrid from './ElectiveGrid';

class ViewContainer extends Component {
    render() {
        return (
            <View  style={styles.container}>
                <Navigation />
                <ElectiveGrid />
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default ViewContainer;
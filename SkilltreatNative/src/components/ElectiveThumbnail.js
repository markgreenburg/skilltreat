'use strict';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text
 } from 'react-native';

class ElectiveThumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <View>
                <Text  style={styles.container}>
                    This is a Thumbnail of all the electives
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

export default ElectiveThumbnail;
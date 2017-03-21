'use strict';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text,
    Button,
} from 'react-native';
import Elective from './Elective';

class ElectiveThumbnail extends Component {

    render() {
        return (
            <View>
                <Text style={this.styles}>
                    {this.props.elective.name}
                </Text>
                <Button
                    onPress={() => this.props.navigate}
                    title="View"
                />
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
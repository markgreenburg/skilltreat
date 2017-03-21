import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

class Elective extends React.Component {

    render() {
        return (<View>
                    <Text>{this.props.elective.name}</Text>
                </View>
        );
    }
}

export default Elective;
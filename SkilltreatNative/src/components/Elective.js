import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

class Elective extends React.Component {

    render() {
        const { params } = this.props.navigation.state;
        return (<View>
                    <Text>{params.elective.name}</Text>
                </View>
        );
    }
}

export default Elective;
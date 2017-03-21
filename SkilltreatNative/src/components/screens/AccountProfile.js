'use strict';
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';

class AccountProfile extends React.Component {
    constructor() {
        super();
        this.state = { user: {}, }
    }

    // componentDidMount() {
    //     // 1. Get the token
    //     // 2. Fetch user using the token
    //     // 3. Set results to state

    // }

    render() {
        return <Text>Account Profile Screen</Text>;
    }
}

export default AccountProfile;


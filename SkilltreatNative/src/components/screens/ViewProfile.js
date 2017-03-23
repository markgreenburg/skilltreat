'use strict';

/**
 * Displays the account profile, or login screen if not auth'd
 */
import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, } from 'react-native';
import { Button, } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { getToken, setToken, removeToken } from '../../Authentication';

class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            token: "",
        };
        // Bind Helpers
        this.logOut = this.logOut.bind(this);
    }

    // componentDidMount() {
    //     if (!token) { return; }
    //     const baseUrl = 'https://skilltreats.com/api/user/load';

    //     // Load user data
    //     // Save to state
    //     console.log("Account Tab Mounted");
    // }

    logOut() {
        console.log("logging out");
        AsyncStorage
            // Remove token from local storage
            .removeItem("auth_token")
            // Navigate back out of the account profile
            .then(() => {
                this.props.navigation.navigate('Login');
            }).catch((err) => console.log(err));
    }

    // componentDidMount() {
    //     // 1. Get the token
    //     // 2. Fetch user using the token
    //     // 3. Set results to state

    // }

    render() {
        return (
            <ScrollView>
                <Button
                    title="Log Out"
                    onPress={this.logOut}
                />
            </ScrollView>
        );
    }
}

export default ViewProfile;


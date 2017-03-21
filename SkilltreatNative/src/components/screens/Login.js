'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { FormLabel, FormInput } from 'react-native-elements'

class Login extends React.Component {
    // constructor() {
    //     this.submitLogin = this.submitLogin.bind(this);
    // }
    
    // submitLogin() {
    //     console.log("submitted!");
    //     // Do some shit here to POST the login form
    //     // Handle success, rejection
    // }
    
    render() {
        return (
            <View>
                <FormLabel>Email</FormLabel>
                <FormInput/>
                <FormLabel>Password</FormLabel>
                <FormInput/>
                {/*<Button
                    title="Log In"
                    onPress={submitLogin}
                />*/}
                <Text>Wee!</Text>
            </View>
        );
    }
}

export default Login;
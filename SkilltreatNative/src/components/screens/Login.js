'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { setToken } from '../../Authentication';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loginFailed: false,
            errors: {
                email: false,
                password: false
            },
        };

        // Bind event functions
        this.submitLogin = this.submitLogin.bind(this);
        this.validateState = this.validateState.bind(this);
    }
    
    /* Validates that email and password are present */
    validateState() {
        let errors = this.state.errors;
        if (!this.state.email) { errors.email = true }
        if (!this.state.password) { errors.password = true }
        if (this.state.email) { errors.email = false }
        if (this.state.password) { errors.password = false }
        this.setState({ errors: errors });
    }

    /* Posts state info to login route, sets token, redirects user */
    submitLogin() {
        // Validate the login info from state
        if (!this.state.email || !this.state.email) {
            return this.validateState();
        }
        const baseUrl = "https://skilltreats.com/api/user/login";
        // POST to /login with the validated info
        fetch(baseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        // Set token if login successful
        }).then((res) => {
            console.log("Got a response");
            return res.json()
        }).then((jsonified) => {
            if (!jsonified.data.token) {
                return Promise.reject("Login Failed");
            }
            return setToken(jsonified.data.token);
        // Navigate to the cart list if login successful
        }).then(() => {
            this.props.navigation.navigate('AccountProfile');
        // Handle errors
        }).catch((err) => {
            console.log(err);
            this.setState({ loginFailed: true });
        });
    }
    
    render() {
        let errorMessage;
        if (this.state.loginFailed) {
            errorMessage = "Login Failed, please try again"; 
        }
        return (
            <View>
                {/*<Text>{errorMessage}</Text>*/}
                <FormLabel>Email</FormLabel>
                <FormInput 
                    onChangeText={ (text) => {
                        this.setState({email: text});
                    }}
                />
                <FormLabel>Password</FormLabel>
                <FormInput
                    secureTextEntry
                    onChangeText={ (text) => this.setState({password: text}) }
                />
                <Button
                    title="Log In"
                    onPress={this.submitLogin}
                />
                <Text>Wee!</Text>
            </View>
        );
    }
}

export default Login;
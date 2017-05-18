'use strict';

import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    ScrollView,
    Text,
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
const initState = {
            fName: "",
            lName: "",
            email: "",
            password: "",
            passwordConf: "",
            fNameError: false,
            lNameError: false,
            emailError: false,
            passwordError: false,
            passwordConfError: false,
            passwordMatchError: false,
            accountCreated: false,
        };

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.createAccount = this.createAccount.bind(this);
    }

    createAccount() {
        // Validate input
        if (!this.state.fName) {
            this.setState({fNameError: true});
            return;
        }
        if (!this.state.lName) {
            this.setState({lNameError: true});
            return;
        }
        if (!this.state.email) {
            this.setState({emailError: true});
            return;
        }
        if (!this.state.password) {
            this.setState({passwordError: true});
            return;
        }
        if (!this.state.passwordConf) {
            this.setState({passwordConfError: true});
            return;
        }
        if (this.state.password !== this.state.passwordConf) {
            this.setState({passwordMatchError: true});
            return;
        }
        // Submit POST
        const baseUrl = "https://skilltreats.com/api/user/register"
        const reqHeaders = new Headers({
            "Content-Type": "application/json"
        });
        const reqOptions = {
            method: "POST",
            headers: reqHeaders,
            body: JSON.stringify({
                fName: this.state.fName,
                lName: this.state.lName,
                email: this.state.email,
                password: this.state.password
            })
        }
        fetch(baseUrl, reqOptions)
        .then((result) => result.json())
        .then((jsonified) => {
            if (!jsonified.success) {
                console.log(jsonified);
                return Promise.reject(new Error("Something went wrong"));
            }
            this.setState({accountCreated: true});
            this.setState({accountCreated: true});
        }).catch((err) => {
            console.log(err);
            return;
        });

    }

    render() {
        const { navigate } = this.props.navigation;
        if (!this.state.accountCreated) {
            return (
            <ScrollView>
                <FormLabel>First Name</FormLabel>
                <FormInput 
                    onChangeText={ (text) => this.setState({fName: text}) }
                />
                <FormLabel>Last Name</FormLabel>
                <FormInput
                    onChangeText={ (text) => this.setState({lName: text}) }
                />
                <FormLabel>Email</FormLabel>
                <FormInput
                    onChangeText={ (text) => this.setState({email: text}) }
                />
                <FormLabel>Password</FormLabel>
                <FormInput
                    secureTextEntry
                    onChangeText={ (text) => this.setState({password: text}) }
                />
                <FormLabel>Confirm Password</FormLabel>
                <FormInput
                    secureTextEntry
                    onChangeText={ (text) => {
                        this.setState({passwordConf: text});
                    }}
                />
                <Button
                    title="Create Account"
                    backgroundColor="#5492f3"
                    onPress={this.createAccount}
                    icon={{name: "check-circle"}}
                    iconRight
                    raised
                />
            </ScrollView>
            );
        }
        // Once account creation succeeds, display action queue
        return (
            <ScrollView>
                <Text style={styles.heading}>Thanks for signing up!</Text>
                <Text style={styles.body}>Please check your email to verify your account</Text>
                <Button
                    title="Log In"
                    style={styles.button}
                    onPress={() => navigate('ViewProfile')}
                />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 34,
        textAlign: 'center'
    },
    body: {
        fontSize: 18,
        textAlign: 'center',
    }
});

export default Register;
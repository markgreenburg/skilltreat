'use strict';

/**
 * Displays the account profile, or login screen if not auth'd
 */
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { getToken, setToken, removeToken } from '../../Authentication';
const Promise = require('bluebird');

const stateInit = {
    user: {},
    token: "",
    email: "",
    password: "",
    errors: {
        email: false,
        password: false,
        auth: false,
    },
};


class ViewProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = stateInit;
        // Bind Helpers
        this.validateInputs = this.validateInputs.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
        this.touchTest = this.touchTest.bind(this);
    }

    componentDidMount() {
        getToken()
        .then((token) => {
            if (!token) {
                console.log("View Profile Mounted");
                return Promise.reject("No Token Found");
            }
            this.setState({token: token});
            const baseUrl = 'https://skilltreats.com/api/user/load';
            const reqHeaders = new Headers({
                "x-access-token": token,
            });
            return fetch(baseUrl, {
                method: "GET",
                headers: reqHeaders
            });
        }).then((result) => result.json())
        .then((jsonified) => {
            if (!jsonified.success) {
                return Promise.reject("User fetch failed");
            }
            this.setState({user: jsonified.data});
            console.log("Account Tab Mounted");
        }).catch((err) => {console.log(err)});
    }

    validateInputs() {
        let errors = this.state.errors;
        if (!this.state.email) { errors.email = true }
        if (!this.state.password) { errors.password = true }
        if (this.state.email) { errors.email = false }
        if (this.state.password) { errors.password = false }
        this.setState({ errors: errors });
    }

    logIn() {
        // Validate the login info from state
        if (!this.state.email || !this.state.password) {
            return this.validateInputs();
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
            return res.json()
        }).then((jsonified) => {
            if (!jsonified.data.token) {
                let newErrors = this.state.errors;
                newErrors.auth = true;
                this.setState({errors: newErrors});
                return Promise.reject("Login Failed");
            }
            return setToken(jsonified.data.token);
        // Navigate to the cart list if login successful
        }).then(() => {
            this.props.navigation.navigate('ViewProfile');
        // Handle errors
        }).catch((err) => {
            console.log(err);
            let newErrors = this.state.errors;
            newErrors.auth = true;
            this.setState({ errors: newErrors });
        });
    }

    logOut() {
        removeToken()
        .then(() => this.setState(stateInit))
        .catch((err) => console.log(err));
    }

    touchTest() {
        console.log("You're touching me!");
        navigate('Regsiter');
    }

    render() {
        const { navigate } = this.props.navigation;
        // If token isn't present, render the Login form
        if (!this.state.token) {
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
                    onPress={this.logIn}
                />
                <Text>Or</Text>
                <Button
                    title="Sign Up"
                    onPress={() => navigate('Register')}
                />
            </View>
            );
        }
        // if token is present, render the account profile
        return (
            <ScrollView>
                <Text>{this.state.user.fName}</Text>
                <Text>{this.state.user.lName}</Text>
                <Text>{this.state.user.email}</Text>
                <Button
                    title="Edit Profile"
                    style={styles.button}
                    onPress={() => navigate('EditProfile')}
                />
                <Button
                    title="View Orders"
                    style={styles.button}
                    onPress={() => navigate('OrderList')}
                />
                <Button
                    title="Log Out"
                    style={styles.button}
                    onPress={this.logOut}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    signup: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        paddingTop: 20,
    },
    button: {
        margin: 20
    }
});



export default ViewProfile;


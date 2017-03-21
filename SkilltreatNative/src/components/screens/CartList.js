'use strict';
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import { getToken } from '../../Authentication';

/* Custom components */
import Login from './Login';

class CartList extends React.Component {
    constructor() {
        super();
        this.state = { cartItems: [], token: "" }
    }

    componentDidMount() {
        // 1. Get the token from storage
        console.log("getting token...");
        getToken()
        // 2. Fetch cart using the token
        .then((token) => {
            if (!token) {
                console.log("No token found");
                return;
            }
            console.log("token found");
            // Set options
            const baseUrl = 'https://skilltreats.com/api/cart';
            const reqHeader = new Headers({
                "x-access-token": token,
            });
            const reqOptions = {
                method: "GET",
                headers: reqHeader,
            };
            const cartRequest = new Request(baseUrl, reqOptions);
            return fetch(cartRequest);
        // 3. Set results to state
        }).then((cartItems) => {
            return cartItems.json()
        }).then((jsonified) => {
            this.setState({cartItems: jsonified.data});
            console.log("this.state.cartItems");
            console.log(this.state.cartItems);
        }).catch((err) => console.log(err));
    }

    render() {
        const { navigate } = this.props.navigation;
        if (!this.state.token) {
            return <Login />
        }
        if (!this.state.cartItems.length) {
            return (
                <Text>There are no items in your cart</Text>
            );
        }
        return (
            <ScrollView>
                <List>
                {
                    this.state.cartItems.maps((item) => {
                        return (
                            <ListItem 
                                key={item.id}>
                                <Text>
                                    Name: {item.elective.name}
                                </Text>
                                <Text>
                                    Date: {item.elective.date}
                                </Text>
                                <Text>
                                    Quantity: {item.quantity}
                                </Text>
                            </ListItem>
                        );
                    })
                }
                </List>
            </ScrollView>
        );
    }
}

export default CartList;
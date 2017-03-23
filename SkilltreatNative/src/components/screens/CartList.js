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
const Promie = require('bluebird');

class CartList extends React.Component {
    constructor() {
        super();
        this.state = { cartItems: [], token: "" }

        this.removeFromCart = this.removeFromCart.bind(this);
    }

    componentDidMount() {
        // 1. Get the token from storage
        getToken()
        // 2. Fetch cart using the token
        .then((token) => {
            if (!token) {
                console.log("Cart Tab Mounted");
                return;
            }
            // Set token to state since we'll need it again later
            this.setState({token: token});
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
            console.log("Cart Tab Mounted");
        }).catch((err) => console.log(err));
    }

    removeFromCart(id) {
        console.log("removing!");
        // Set up the fetch
        const baseUrl = 'https://skilltreats.com/api/cart/delete';
        const reqOptions = { 
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cartId: id,
                token: this.state.token
            })
        };
        const removeReq = new Request(baseUrl, reqOptions);
        // Post to API
        fetch(removeReq)
        // Parse results
        .then((result) => result.json())
        // Remove list item from state on success
        .then((jsonified) => {
            if (!jsonified.success) {
                console.log(jsonified);
                return Promise.reject("Failed to remove item from cart");
            }
            const newCart = this.state.cartItems.filter((item) => {
                return (item.id != id);
            });
            this.setState({cartItems: newCart});
        }).catch((err) => console.log(err))
    }

    render() {
        if (!this.state.cartItems.length) {
            return (
                <Text>There are no items in your cart</Text>
            );
        }
        return (
            <ScrollView>
                <List>
                {
                    this.state.cartItems.map((item) => {
                        return (
                            <ListItem
                                title={item.elective.name}
                                key={item.id}
                                rightIcon={{name: 'remove-shopping-cart'}}
                                onPress={() => this.removeFromCart(item.id)}>
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
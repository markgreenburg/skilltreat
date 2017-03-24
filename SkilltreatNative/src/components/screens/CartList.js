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
        this.state = { cartItems: [], total: 0, token: "" }
        this.removeFromCart = this.removeFromCart.bind(this);
    }

    componentDidMount() {
        // 1. Get the token from storage
        getToken()
        // 2. Fetch cart using the token
        .then((token) => {
            if (!token) {
                console.log("Cart List Mounted");
                return Promise.reject("No Token Found");
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
            const cartList = jsonified.data;
            this.setState({cartItems: cartList});
            const total = cartList.reduce((acc, item) => {
                return acc + parseFloat(item.elective.price);
            }, 0);
            this.setState({total: total});
            console.log("Cart Tab Mounted");
        }).catch((err) => console.log(err));
    }

    removeFromCart(id) {
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
            const newTotal = newCart.reduce((acc, item) => {
                return acc + parseFloat(item.elective.price);
            }, 0);
            this.setState({cartItems: newCart});
            this.setState({total: newTotal});
        }).catch((err) => console.log(err))
    }
    
    render() {
        const { navigate } = this.props.navigation;
        // If user not logged in, prompt login
        if (!this.state.token) {
            return (
                <View>
                    <Text>You must be logged in to view your cart</Text>
                    <Button
                        title="Log In"
                        onPress={() => navigate('ViewProfile')}
                    />
                </View>
            );
        }
        // If uesr logged in, but has no items in cart
        if (!this.state.cartItems.length) {
            return (
                <Text>There are no items in your cart</Text>
            );
        }
        // If user logged in and has items in cart
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        });
        const formattedTotal = formatter.format(this.state.total);
        return (
            <ScrollView>
                <List>
                {
                    this.state.cartItems.map((item) => {
                        return (
                            <ListItem
                                title={item.elective.name + " | $" + item.elective.price}
                                key={item.id}
                                rightIcon={{name: 'remove-shopping-cart'}}
                                onPress={() => this.removeFromCart(item.id)}>
                            </ListItem>
                        );
                    })
                }
                </List>
                <Text>Total: {formattedTotal}</Text>
                <Button
                    title="Check Out"
                    onPress={() => navigate('Order', { 
                        total: this.state.total,
                        token: this.state.token,
                     })}
                />
            </ScrollView>
        );
    }
}

export default CartList;
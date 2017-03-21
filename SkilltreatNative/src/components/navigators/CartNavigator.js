'use strict';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import CartList from '../screens/CartList'
import Login from '../screens/Login'

/* Define the nested Navigator for this tab */
const CartNavigator = StackNavigator({
    CartList: { screen: CartList },
    Login: { screen: Login },
});

export default CartNavigator;
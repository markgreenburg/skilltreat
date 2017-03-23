'use strict';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import CartList from '../screens/CartList'
import Order from '../screens/Order'

/* Define the nested Navigator for this tab */
const CartNavigator = StackNavigator(
    {
        CartList: { screen: CartList },
        Order: { screen: Order },
    }, {
        navigationOptions: {
            header: {
                visible: false,
            },
        },
    });

export default CartNavigator;
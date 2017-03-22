'use strict';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import CartList from '../screens/CartList'

/* Define the nested Navigator for this tab */
const CartNavigator = StackNavigator(
    {
        CartList: { screen: CartList }
    }, {
        navigationOptions: {
            header: {
                visible: false,
            },
        },
    });

export default CartNavigator;
'use strict';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import ViewProfile from '../screens/ViewProfile';
import EditProfile from '../screens/EditProfile';
import Register from '../screens/Register';
import OrderList from '../screens/OrderList';

/* Define the nested Navigator for this tab */
const AccountNavigator = StackNavigator(
    {
        ViewProfile: { screen: ViewProfile },
        EditProfile: { screen: EditProfile },
        Register: { screen: Register },
        OrderList: { screen: OrderList },
    }, {
        navigationOptions: {
            header: {
                visible: false,
            },
        },
    });

export default AccountNavigator;
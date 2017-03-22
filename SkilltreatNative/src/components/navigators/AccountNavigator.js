'use strict';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import AccountProfile from '../screens/AccountProfile';
import Login from '../screens/Login'

/* Define the nested Navigator for this tab */
const AccountNavigator = StackNavigator(
    {
        AccountProfile: { screen: AccountProfile },
        Login: { screen: Login },
    }, {
        navigationOptions: {
            header: {
                visible: false,
            },
        },
    });

export default AccountNavigator;
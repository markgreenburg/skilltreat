'use strict';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import ViewProfile from '../screens/ViewProfile';
import Login from '../screens/Login'

/* Define the nested Navigator for this tab */
const AccountNavigator = StackNavigator(
    {
        ViewProfile: { screen: AccountProfile },
        Register: { screen: Register },
        EditProfile: { screen: EditProfile },
    }, {
        navigationOptions: {
            header: {
                visible: false,
            },
        },
    });

export default AccountNavigator;
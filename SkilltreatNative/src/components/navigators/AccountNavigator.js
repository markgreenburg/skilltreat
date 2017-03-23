'use strict';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import ViewProfile from '../screens/ViewProfile';
import Register from '../screens/Register'

/* Define the nested Navigator for this tab */
const AccountNavigator = StackNavigator(
    {
        ViewProfile: { screen: ViewProfile },
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
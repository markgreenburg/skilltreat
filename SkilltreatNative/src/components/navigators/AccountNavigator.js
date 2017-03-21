'use strict';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

/* Required subcomponents */
import AccountProfile from '../screens/AccountProfile';

/* Define the nested Navigator for this tab */
const AccountNavigator = StackNavigator({
    AccountProfile: { screen: AccountProfile },
});

export default AccountNavigator;
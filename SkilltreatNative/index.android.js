/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { TabNavigator } from 'react-navigation';

/* Custom Modules */
import ElectiveNavigator from './src/components/navigators/ElectiveNavigator';
import CartNavigator from './src/components/navigators/CartNavigator';
import AccountNavigator from './src/components/navigators/AccountNavigator';


/* App layout is contained within a 3-tab react-native-navigation comopnent */
const SkilltreatNative = TabNavigator({
    Treats: { screen: ElectiveNavigator },
    Cart: { screen: CartNavigator },
    Account: { screen: AccountNavigator },
});

/* Uncomment if Test Pack Deleted */
AppRegistry.registerComponent('SkilltreatNative', () => SkilltreatNative);
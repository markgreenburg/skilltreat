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
import ElectiveNavigator from './src/components/ElectiveNavigator';
import ElectiveGrid from './src/components/ElectiveGrid';
import Cart from './src/components/Cart';
import Account from './src/components/Account';

const SkilltreatNative = TabNavigator({
  Upcoming: { screen: ElectiveNavigator },
  Cart: { screen: Cart },
  Account: { screen: Account },
});

AppRegistry.registerComponent('SkilltreatNative', () => SkilltreatNative);

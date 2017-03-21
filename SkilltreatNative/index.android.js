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
import { StackNavigator, TabNavigator } from 'react-navigation';

/* Custom Modules */
import ElectiveGrid from './src/components/ElectiveGrid';
import Cart from './src/components/Cart';
import Account from './src/components/Account';

const SkilltreatNative = TabNavigator({
  Upcoming: { screen: ElectiveGrid },
  Cart: { screen: Cart },
  Account: { screen: Account },
});

AppRegistry.registerComponent('SkilltreatNative', () => SkilltreatNative);

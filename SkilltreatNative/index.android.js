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
  View
} from 'react-native';
import ViewContainer from './src/components/ViewContainer';

export default class SkilltreatNative extends Component {
  render() {
    return (
      <ViewContainer>
      </ViewContainer>
    );
  }
}

AppRegistry.registerComponent('SkilltreatNative', () => SkilltreatNative);

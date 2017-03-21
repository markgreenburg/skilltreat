'use strict';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

/* Required Subcomponents */
import ElectiveGrid from './ElectiveGrid';
import Elective from './Elective';

let ElectiveNavigator = StackNavigator({
    ElectiveGrid: { screen: ElectiveGrid },
    Elective: { screen: Elective },
});

export default ElectiveNavigator;
'use strict';
import { StackNavigator } from 'react-navigation';

/* Required Subcomponents */
import ElectiveList from '../screens/ElectiveList';
import Elective from '../screens/Elective';

/* Define the nested Navigator for this tab */
const ElectiveNavigator = StackNavigator(
    {
        ElectiveList: { screen: ElectiveList },
        Elective: { screen: Elective },
    }, {
        navigationOptions: {
            header: {
                visible: false,
            },
        },
    });

export default ElectiveNavigator;
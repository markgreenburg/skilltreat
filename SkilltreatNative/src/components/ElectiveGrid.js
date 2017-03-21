'use strict';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text,
    ScrollView,
 } from 'react-native';
 import { StackNavigator } from 'react-navigation';
import { List, ListItem } from 'react-native-elements';

 /* Import Elective Components */
 import ElectiveThumbnail from './ElectiveThumbnail';
 import Elective from './Elective';

class ElectiveGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            electiveList: [],
        };
    }

    componentDidMount() {
        fetch('https://skilltreats.com/api/elective')
            .then(electives => electives.json())
            .then((jsonifiedElectives) => {
                let electiveList = jsonifiedElectives.data.map((row) => {
                    return {
                        id: row.id,
                        name: row.name,
                        image: row.image,
                        description: row.description,
                        date: row.date,
                        startTime: row.startTime,
                        endTime: row.endTime
                    }
                });
                this.setState({ electiveList: electiveList });
            }).catch((err) => {
                console.log(err);
            });
    }

    static navigationOptions = {
        title: "Browse Treats",
    };

    render() {
        const { navigate } = this.props.navigation;
        console.log("this.state.electiveList:");
        console.log(this.state.electiveList);
        if (!this.state.electiveList.length) {
            return (
                <Text>Loading fresh electives...</Text>
            );
        } else {
            return (
                <ScrollView>
                    {
                        this.state.electiveList.map((elective) => {
                            return (
                                <ElectiveThumbnail
                                    elective={elective}
                                    key={elective.id}
                                    navigate={navigate('Elective')}
                                />
                            );
                        })
                    }
                </ScrollView>
            );
        }
    }
}

const ElectiveNavigator = StackNavigator({
    ElectiveGrid: { screen: ElectiveGrid },
    Elective: { screen: Elective },
})

export default ElectiveGrid;
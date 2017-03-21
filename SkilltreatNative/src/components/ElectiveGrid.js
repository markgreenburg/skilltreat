'use strict';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text,
    ScrollView,
 } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements';

 /* Import Elective Components */
 import ElectiveThumbnail from './ElectiveThumbnail';

class ElectiveGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            electives: [],
        };
    }

    componentDidMount() {
        fetch('https://skilltreats.com/api/elective')
            .then(electives => electives.json())
            .then(jsonified => this.setState({ electives: jsonified.data}))
            .catch(err => console.log(err));
    }

    render() {
        const { navigate } = this.props.navigation;
        console.log("this.state.electives:");
        console.log(this.state.electives);
        if (!this.state.electives.length) {
            return (
                <Text>Loading fresh electives...</Text>
            );
        } else {
            return (
                <ScrollView>
                    {
                        this.state.electives.map((elective) => {
                            return (
                                <Card
                                    image={{uri: elective.image}}
                                    title={elective.name}
                                    key={elective.id}
                                >
                                    <Text>
                                        {elective.description}
                                    </Text>
                                    <Button
                                        title="View"
                                        onPress={() => {
                                            navigate('Elective', {
                                                elective: elective
                                            })
                                        }}
                                    />
                                </Card>
                            );
                        })
                    }
                </ScrollView>
            );
        }
    }
}

export default ElectiveGrid;
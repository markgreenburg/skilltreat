'use strict';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text,
    ScrollView,
 } from 'react-native';
import { Card, Button } from 'react-native-elements';

class ElectiveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { electives: [], };
    }

    componentDidMount() {
        fetch('https://skilltreats.com/api/elective')
            .then(electives => electives.json())
            .then(jsonified => this.setState({ electives: jsonified.data}))
            .catch(err => console.log(err));
    }

    static navigationOptions = {
        title: "All Upcoming Treats"
    }

    render() {
        const { navigate } = this.props.navigation;
        if (!this.state.electives.length) {
            return (
                <Text>Loading fresh electives...</Text>
            );
        } else {
            return (
                // TO-DO: refactor using ListView for faster loading
                // TO-DO: extract Card to own component for reusability
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

export default ElectiveList;
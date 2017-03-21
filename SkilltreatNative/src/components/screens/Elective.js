import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  Image,
} from 'react-native';

class Elective extends React.Component {

    static navigationOptions = {
        title: ({ state }) => state.params.elective.name
    }
    render() {
        const { params } = this.props.navigation.state;
        console.log("params.elective");
        console.log(params.elective);
        return (<ScrollView>
                    <Image
                        source={{uri: params.elective.image}}
                        style={styles.image}
                    />
                    <Text>
                        {params.elective.description}
                    </Text>
                </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 300
    }
})

export default Elective;
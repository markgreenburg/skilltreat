import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { Button } from 'react-native-elements';
const moment = require('moment');
import MapView from 'react-native-maps';
import { getToken } from '../../Authentication';
const Promise = require('bluebird');

class Elective extends React.Component {
    constructor(props) {
        super(props);
        
        this.addToCart = this.addToCart.bind(this);
    }

    addToCart() {
        // Get token
        getToken()
        // Set up Fetch
        .then((token) => {
            if (!token) { return Promise.reject("No Token Found") }
            const baseUrl = "https://skilltreats.com/api/cart/add";
            return fetch(baseUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    electiveId: this.props.navigation.state.params.elective.id,
                    quantity: 1,
                    token: token
                })
            });
        }).then((results) => {
            if (!results) { return Promise.reject("No response") }
            return results.json();
        }).then((jsonified) => {
            if (!jsonified.success) {
                return Promise.reject("Add to cart failed");
            }
            // Do something to the 'add to cart' button: gray out + change title
            console.log("Item added to cart");
            this.props.navigation.navigate('CartList');
        }).catch((err) => console.log(err));
    }

    render() {
        const { params } = this.props.navigation.state;
        const date = moment(params.elective.startTime).format("dddd, MMMM Do");
        const startTime = moment(params.elective.startTime).format("h:mm a");
        const endTime = moment(params.elective.endTime).format("h:mm a");
        const coordinate = {
            latitude: parseFloat(params.elective.venue.lat),
            longitude: parseFloat(params.elective.venue.lng)
        };
        return (
            <ScrollView>
                <Text style={styles.heading}>{params.elective.name}</Text>
                <Image
                    source={{uri: params.elective.image}}
                    style={styles.image}
                />
                <Text style={styles.description}>
                    {params.elective.description}
                </Text>
                <Text style={styles.subheading}>When:</Text>
                <Text style={styles.time}>{date}</Text>
                <Text style={styles.time}>{startTime} - {endTime}</Text>
                <Text style={styles.subheading}>Where:</Text>
                <MapView 
                    style={styles.map}
                    initialRegion={{
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}>
                    {/*<MapView.Marker
                        coordinate={coordinate}
                        title={params.elective.venue.name}/>*/}
                </MapView>
                {/* TO-DO: Gray out button if not logged in */}
                <Button
                    title={"Add To Cart ($" + params.elective.price + ")"}
                    onPress={this.addToCart}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 300
    },
    heading: {
        fontSize: 34,
        textAlign: 'center',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    subheading: {
        fontSize: 24,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    time: {
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 20
    },
    description: {
        fontSize: 18,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    map: {
        height: 300,
        width: '80%'
    }
})

export default Elective;
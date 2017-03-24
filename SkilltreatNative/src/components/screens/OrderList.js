'use strict';

import React, { Component } from 'react';
import { 
    Text,
    ScrollView,
    StyleSheet,
 } from 'react-native';
 import {
     List,
     ListItem
 } from 'react-native-elements';
import { getToken } from '../../Authentication';

class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            orderItems: [],
        };
    }

    componentDidMount() {
        // Get token from storage
        getToken()
        .then((token) => {
            if (!token) {
                console.log("Orders Mounted");
                return Promise.reject("No Token Found");
            }
            this.setState({token: token});
            // Fetch user's orders
            const baseUrl = "https://skilltreats.com/api/orders";
            const reqHeaders = new Headers({
                "Content-Type": "application/json",
                "x-access-token": token,
            });
            return fetch(baseUrl, {
                method: "GET",
                headers: reqHeaders
            });
        }).then((orders) => orders.json())
        .then((jsonified) => {
            if (!jsonified.data) {
                return Promise.reject("No orders found for user");
            }
            console.log("jsonified.data");
            console.log(jsonified.data);
            this.setState({orderItems: jsonified.data});
        }).catch((err) => console.log(err));
    }

    render() {
        if (!this.state.orderItems) {
            return <Text style={styles.heading}>Order History</Text>;
        }
        const formatter = new Intl.NumberFormat('en-US', {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        });
        return (
            <ScrollView>
                <List>
                    {this.state.orderItems.map((order) => {
                        const formattedTotal = formatter.format(order.total);
                        return (
                            <ListItem
                                title={order.id + " - " + formattedTotal}
                                key={order.id}
                            />
                        );
                    })}
                </List>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 34,
        textAlign: "center",
    }
})

export default OrderList;
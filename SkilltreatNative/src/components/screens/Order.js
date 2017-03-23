'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { LiteCreditCardInput } from 'react-native-credit-card-input';
const StripeTestPubKey = "pk_test_WKycIUji5mk5u1Ej1dw4HG1s"

const initState = {
    status: {},
    valid: false,
    values: {}
};

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.updateValues = this.updateValues.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
    }

    updateValues(resultObject) {
        const slimResult = {
            status: resultObject.status,
            valid: resultObject.valid,
            values: resultObject.values
        };
        this.setState(slimResult);
    }

    submitOrder() {
        console.log("submitting order!");
        // Submit fetch to Stripe with CC details to get tokenized card info
        const cardDetails = {
            "card[number]": this.state.values.number,
            "card[exp_month]": this.state.values.expiry.slice(0, 2),
            "card[exp_year]": this.state.values.expiry.slice(3, 5),
            "card[cvc]": this.state.values.cvc
        };
        let formBody = [];
        for (var property in cardDetails) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(cardDetails[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        const stripeUrl = 'https://api.stripe.com/v1/';
        fetch(stripeUrl + 'tokens', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + StripeTestPubKey,
            },
            body: formBody
        }).then((result) => result.json())
        .then((jsonified) => {
            console.log(jsonified);
        }).catch((err) => console.log(err));

    }

    render() {
        const { params } = this.props.navigation.state;
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        });
        const formattedTotal = formatter.format(params.total);
        return (
        <View>
            <Text style={styles.heading}>Enter Card Details</Text>
            <View style={styles.container}>
                <LiteCreditCardInput
                    autoFocus
                    inputStyle={styles.input}
                    validColor={"black"}
                    invalidColor={"red"}
                    placeholderColor={"darkgray"}
                    onChange={(newValues) => {this.updateValues(newValues)}}
                />
            </View>
            <Button
                style={styles.button}
                title={"Charge Card " + formattedTotal}
                disabled={(!this.state.valid)}
                onPress={this.submitOrder}
                icon={{name: 'chevron-right'}}
                iconRight
            />
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 40,
    marginBottom: 40
  },
  heading: {
    marginTop: 20,
    fontSize: 34,
    textAlign: "center",
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

export default Order;
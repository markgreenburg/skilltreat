'use strict';
/**
 * Contains functionality for sending verification emails through AWS SES
 */
const nodeMailer = require('nodemailer');
const path = require('path');

// Configure AWS SES stuff...
let aws = require('aws-sdk');
aws.config.loadFromPath(path.join(__dirname, '..', 'config', 'awsConfig.json'));

// Create a promisified nodemailer SES transport
const Promise = require('bluebird');
const transporter = Promise.promisifyAll(nodeMailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01',
    }),
}));

module.exports = transporter;

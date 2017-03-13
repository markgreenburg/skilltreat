/**
 * Contains functionality for sending verification emails through AWS SES
 */
const nodeMailer = require('nodemailer');

// Configure AWS SES stuff...
let aws = require('aws-sdk');
aws.config.loadFromPath('../config/emailConfig.json');

// Create a promisified nodemailer SES transport
const Promise = require('bluebird');
const transport = Promise.promisifyAll(nodeMailer.createTransport({}));

// Configure AWS SDK

// Create SES transport




module.exports = transporter;

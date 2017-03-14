'use strict';
/**
 * Contains functionality for sending verification emails through AWS SES
 */
const nodeMailer = require('nodemailer');
// const path = require('path');
const config = require('../config/awsConfig');

// Create a promisified nodemailer SES transport
const Promise = require('bluebird');
const transporter = Promise.promisifyAll(nodeMailer.createTransport(config));

module.exports = transporter;

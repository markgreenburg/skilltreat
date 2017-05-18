/**
 * Contains functionality for sending verification emails through AWS SES
 */
const nodeMailer = require('nodemailer');
// const path = require('path');
const config = require('../config/config');
const Promise = require('bluebird');

// Create a promisified nodemailer SES transport
const transporter = Promise.promisifyAll(
        nodeMailer.createTransport(config.smtpConfig));

module.exports = transporter;

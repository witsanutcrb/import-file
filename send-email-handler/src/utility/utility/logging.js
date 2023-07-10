/* eslint-disable no-param-reassign */
const AWS_REGION = process.env.AWS_REGION || 'ap-southeast-1';
const TIMEZONE = 'Asia/Bangkok';
const DATETIMEFORMAT = 'YYYY-MM-DD HH:mm:ss';

const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const moment = require('moment-timezone');
const OBGenerator = require('../helper/OBGenerator');

const obGenerator = new OBGenerator();
const sqs = new AWS.SQS({ region: AWS_REGION });

const sendSqs = (accountId, activity) => {
  const url = `https://sqs.${AWS_REGION}.amazonaws.com/${accountId}/activity`;
  return new Promise((resolve, reject) => {
    sqs.sendMessage(
      {
        QueueUrl: url,
        MessageBody: JSON.stringify(activity),
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      },
    );
  });
};

class ActivityLogger {
  constructor(accountId) {
    this.accountId = accountId;
  }

  async log(
    activity = {
      partnerTransactionReference: null, // Ex. Sign up session ID
      transactionType: null, // Ex. Sign up
      customerId: null,
      customerName: null,
      partnerCode: null,
      status: null, // Success, Unsuccess, Reverted
      httpStatusCode: null, // API response HTTP status code
      responseCode: null, // API response code
      responseData: null, // API response body
      requestID: null,
      language: null,
      action: null, // Inquiry, Unlock, Unbind, Request, Confirm, Generate, Validate
      entity: null, // in NonFinancialService mapped to partner_group
      location: null,
    },
  ) {
    if (activity.accountReference) {
      activity.transactionReference = obGenerator.obGenerator(
        activity.accountReference,
      );
    } else {
      activity.transactionReference = obGenerator.obGenerator(uuid());
    }
    const ts = moment().tz(TIMEZONE).format(DATETIMEFORMAT);
    activity.DateTime = ts;
    activity.responseDateTime = ts;
    activity.initiateBy = activity.initiateBy || activity.customerName;
    console.log('Log reference:', activity.transactionReference);
    await sendSqs(this.accountId, activity).catch((error) => {
      console.error('Activity logging error', error);
    });
  }
}

module.exports = { ActivityLogger };

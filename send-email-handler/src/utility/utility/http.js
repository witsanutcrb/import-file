const mmtz = require('moment-timezone');
const { v4: uuid } = require('uuid');
const https = require('https');
const Encryption = require('../security/encryption');

const enc = new Encryption();

const TIMEZONE = 'Asia/Bangkok';
const DATE_FORMAT = 'yyyy-MM-DDTHH:mm:ss';

const getHeader = (headers, name) =>
  headers[
    Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase())
  ];

const getXrayTraceHeaders = (headers) => {
  const traceId = getHeader(headers, 'X-Amzn-Trace-Id');
  if (traceId) {
    return {
      'X-Amzn-Trace-Id': traceId,
    };
  }
  return {};
};

const createEkycAuthHeaders = (aesKeyBuffer, apiKey, partnerCode, apiGwId) => {
  const timestamp = mmtz().tz(TIMEZONE).format(DATE_FORMAT);
  return {
    'Content-Type': 'application/json',
    'x-apigw-api-id': apiGwId,
    'partner-code': partnerCode,
    'partner-secret': enc.encryptEkyc(
      JSON.stringify({
        partner_code: partnerCode,
        api_key: apiKey,
        date_time: timestamp,
        salt: uuid(),
      }),
      aesKeyBuffer,
    ),
  };
};

const getAgentKeepAlive = (config) => {
  return new https.Agent({
    rejectUnauthorized: false,
    requestCert: false,
    keepAlive: true,
    timeout: 600,
    ...config,
  });
};

module.exports = {
  getHeader,
  getXrayTraceHeaders,
  createEkycAuthHeaders,
  getAgentKeepAlive,
};

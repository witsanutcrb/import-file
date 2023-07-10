const momenttimezone = require('moment-timezone');
const axios = require('axios');
const { getAgentKeepAlive } = require('../utility/http');

const EN = 'EN';
const TH = 'TH';

process.env.ERROR_CODE_ENDPOINT = process.env.ERROR_CODE_ENDPOINT
  ? process.env.ERROR_CODE_ENDPOINT
  : 'https://api-dev.tcrb-onlinebanking.com/api/translation/v1/error-code';
process.env.X_API_KEY = process.env.X_API_KEY
  ? process.env.X_API_KEY
  : 'X_API_KEY';
process.env.API_ID_ERROR_CODE = process.env.API_ID_ERROR_CODE
  ? process.env.API_ID_ERROR_CODE
  : '1wbqzfckw4';

const _validateLanguage = (headers) => {
  return headers && new RegExp(/th/, 'i').test(headers['x-api-language'])
    ? TH
    : EN;
};

const _validateErrorCode = async (url, params) => {
  const request = axios({
    method: 'GET',
    url,
    timeout: process.env.TIMEOUT * 1000,
    responseType: 'json',
    httpsAgent: getAgentKeepAlive(),
    headers: {
      'x-api-key': process.env.X_API_KEY,
      'x-apigw-api-id': process.env.API_ID_ERROR_CODE,
    },
    params,
  }).then((response) => {
    return Promise.resolve(response.data);
  });
  return await request;
};

const _validateHTTPStatusCode = async (obj) => {
  if (!obj.statusCode.toString().includes('20')) {
    const responsebody = JSON.parse(obj.body);
    responsebody.responseData = {};
    obj.body = JSON.stringify(responsebody);
  }
  return obj;
};
class BuildResponse {
  async Build(
    status,
    headers,
    responsecode,
    userMessage,
    developerMessage,
    responseobject,
    isRequest = true,
  ) {
    if (headers && typeof headers === 'object') {
      delete headers['X-Forwarded-For'];
    }
    let errorCodeResponse = {};
    console.log('Buildresponse.Build Header :', headers);
    const language = _validateLanguage(headers);
    const buildParams = {
      error_code: responsecode,
      language,
    };
    if (isRequest == true) {
      try {
        errorCodeResponse = (
          await _validateErrorCode(process.env.ERROR_CODE_ENDPOINT, buildParams)
        ).responseData;
      } catch (error) {
        console.log(
          'Error BuildResponse call service :',
          process.env.ERROR_CODE_ENDPOINT,
          process.env.API_ID_ERROR_CODE,
        );
        errorCodeResponse.error_code = responsecode;
        errorCodeResponse.business_message = userMessage;
        errorCodeResponse.developer_message = developerMessage;
      }
      let objresponse = {
        isBase64Encoded: false,
        statusCode: status,
        headers,
        body: JSON.stringify({
          responseCode: errorCodeResponse.error_code,
          userMessage: errorCodeResponse.business_message,
          developerMessage: errorCodeResponse.developer_message,
          responseDateTime: momenttimezone(new Date())
            .tz(process.env.TIMEZONE)
            .format(process.env.DATETIMEFORMAT),
          responseData: responseobject,
        }).replace(/\\\\n/g, '\\n'),
      };
      objresponse = await _validateHTTPStatusCode(objresponse);
      return objresponse;
    }
    errorCodeResponse.error_code = responsecode;
    errorCodeResponse.business_message = userMessage;
    errorCodeResponse.developer_message = developerMessage;
    let objresponse = {
      isBase64Encoded: false,
      statusCode: status,
      headers,
      body: JSON.stringify({
        responseCode: errorCodeResponse.error_code,
        userMessage: errorCodeResponse.business_message,
        developerMessage: errorCodeResponse.developer_message,
        responseDateTime: momenttimezone(new Date())
          .tz(process.env.TIMEZONE)
          .format(process.env.DATETIMEFORMAT),
        responseData: responseobject,
      }).replace(/\\\\n/g, '\\n'),
    };
    objresponse = await _validateHTTPStatusCode(objresponse);
    return objresponse;
  }
}

module.exports = BuildResponse;

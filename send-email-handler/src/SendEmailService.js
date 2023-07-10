/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const { ActivityLogger } = require('./utility/utility/logging');
const EmailRepo = require('../../messaging-repository/src/EmailMessageRepository');

AWS.config.update({ region: 'ap-southeast-1' });
const { AWS_ACCOUNT_ID } = process.env;

const logger = new ActivityLogger(AWS_ACCOUNT_ID);

const _getFileFromS3 = (s3, params) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        console.error('err', err);
        reject(err);
      } else {
        resolve(data.Body);
      }
    });
  });
};

const _replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace);
};
const _replaceMessage = (body, messageTemplate) => {
  for (const key in body) {
    const element = body[key];
    messageTemplate = _replaceAll(messageTemplate, `{${key}}`, element);
  }
  return messageTemplate;
};

const getFileS3 = async (bucketName, s3FilePath, attachments, s3) => {
  if (bucketName && s3FilePath) {
    const s3Params = {
      Bucket: bucketName,
      Key: s3FilePath,
    };
    const fileData = await _getFileFromS3(s3, s3Params);
    const partFilePaths = s3FilePath.split('/');
    const fileName = partFilePaths[partFilePaths.length - 1];
    attachments.push({
      filename: fileName,
      content: fileData,
    });
  }

  return attachments;
};
class SendEmailService {
  async healthcheck() {
    await EmailRepo.prototype.healthCheck();
  }

  async firstCondition(bucketName, s3FilePath, attachments, s3) {
    return getFileS3(bucketName, s3FilePath, attachments, s3);
  }

  async secondCondition(bucketName, s3FilePath, attachments, s3) {
    return getFileS3(bucketName, s3FilePath, attachments, s3);
  }

  async conditionTransportersSendMail(
    emailFrom,
    emailTo,
    emailMessage,
    attachments,
    transporter,
  ) {
    await transporter.sendMail({
      from: emailFrom || emailMessage.from,
      to: emailTo || emailMessage.to,
      subject: emailMessage.subject,
      ...(emailMessage.message && { text: emailMessage.message }),
      ...(emailMessage.html_message && { html: emailMessage.html_message }),
      ...(attachments && { attachments }),
    });

    return attachments;
  }

  async conditionPartnerLog(partnerCode, response) {
    if (partnerCode) {
      await logger.log(response);
    }
  }

  async sendEmail(eventSendEmail) {
    const {
      messageId,
      bucketName,
      s3FilePath,
      body,
      errorBucketName,
      s3FileErrorPath,
      emailTo,
      emailFrom,
      language,
      partnerCode,
      userReference,
      channel,
      actionType,
    } = eventSendEmail;

    try {
      // Get Email Message
      const condition = {
        email_id: messageId,
        language,
      };
      let emailMessage = await EmailRepo.getEmailMessage(condition);
      emailMessage = emailMessage[0];
      emailMessage.subject = emailMessage.subject
        ? _replaceMessage(body, emailMessage.subject)
        : emailMessage.subject;
      emailMessage.message = emailMessage.message
        ? _replaceMessage(body, emailMessage.message)
        : emailMessage.message;
      emailMessage.html_message = emailMessage.html_message
        ? _replaceMessage(body, emailMessage.html_message)
        : emailMessage.html_message;

      // Get file from S3
      const attachments = [];
      const s3 = new AWS.S3();
      await this.firstCondition(bucketName, s3FilePath, attachments, s3);
      await this.secondCondition(
        errorBucketName,
        s3FileErrorPath,
        attachments,
        s3,
      );

      // Send SES
      const transporter = nodemailer.createTransport({
        SES: new AWS.SES(),
        secure: true,
      });

      await this.conditionTransportersSendMail(
        emailFrom,
        emailTo,
        emailMessage,
        attachments,
        transporter,
      );

      const descEmail = emailTo || emailMessage.to;
      const response = {
        partnerTransactionReference: body.transactionRef, // Ex. Sign up sessionId
        channel,
        partnerCode,
        entity: partnerCode,
        transactionType: emailMessage.email_type
          ? emailMessage.email_type
          : 'Email',
        action: emailMessage.email_sub_type
          ? emailMessage.email_sub_type
          : actionType,
        initiateBy:
          userReference && userReference !== 'null' ? userReference : null, // Initiated by
        additionalType: 'userReference',
        status: 'Success',
        httpStatusCode: 200,
        responseCode: 'S1002',
        responseData: null, // API response body
        customerId: null,
        requestID: null,
        language,
        location: null,
        jsondata: {
          templateCode: emailMessage.template_code,
          email: descEmail,
          type: 'email',
        },
        mainaccountNo: body.paintAcc ? body.paintAcc : undefined,
      };

      await this.conditionPartnerLog(partnerCode, response);
      return 'Success';
    } catch (error) {
      if (partnerCode) {
        const responseError = {
          partnerTransactionReference: null, // Ex. Sign up sessionId
          channel,
          entity: partnerCode,
          partnerCode,
          transactionType: 'Email',
          action: actionType,
          customerName: userReference && userReference !== 'null', // Initiated by
          status: 'Unsuccess',
          httpStatusCode: 500,
          responseCode: 'E1901',
          responseData: null, // API response body
          customerId: null,
          requestID: null,
          language,
          location: null,
        };
        await logger.log(responseError);
        return responseError;
      }
      throw error;
    }
  }
}

module.exports = SendEmailService;

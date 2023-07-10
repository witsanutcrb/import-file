/* eslint-disable no-param-reassign */
/* eslint-disable no-return-await */
/* eslint-disable consistent-return */
const BuildResponse = require('./utility/helper/BuildResponse');
const Service = require('./SendEmailService');

const buildResponse = new BuildResponse();
const service = new Service();
const validateParams = async (event) => {
  const messAtt = event.messageAttributes;

  if (typeof event.body === 'string') {
    event.body = JSON.parse(event.body);
  }

  if (
    !event ||
    !messAtt ||
    !messAtt.language ||
    !messAtt.language.stringValue ||
    !messAtt.messageId ||
    !messAtt.messageId.stringValue
  ) {
    throw await buildResponse.Build(
      400,
      event.headers,
      'E9003',
      'System is not ready for this service. Sorry for inconvenience',
      "Send Email Service : 'Argument' in is null or empty",
      messAtt,
      false,
    );
  }
  event.messageAttributes.bucketName = messAtt.bucketName
    ? messAtt.bucketName
    : { stringValue: null };
  event.messageAttributes.s3FilePath = messAtt.s3FilePath
    ? messAtt.s3FilePath
    : { stringValue: null };
  event.messageAttributes.errorBucketName = messAtt.errorBucketName
    ? messAtt.errorBucketName
    : { stringValue: null };
  event.messageAttributes.s3FileErrorPath = messAtt.s3FileErrorPath
    ? messAtt.s3FileErrorPath
    : { stringValue: null };
  event.messageAttributes.emailTo = messAtt.emailTo
    ? messAtt.emailTo
    : { stringValue: null };
  event.messageAttributes.emailFrom = messAtt.emailFrom
    ? messAtt.emailFrom
    : { stringValue: null };
  return event;
};

exports.Handler = async (event) => {
  if (event.source)
    if (event.source === 'aws.events') {
      await service.healthcheck();
      return;
    }
  try {
    const validateParam = await validateParams(event.Records[0]); // validate
    const messAtt = validateParam.messageAttributes;
    // support email report
    const partnerCode = event.Records[0].messageAttributes.partnerCode
      ? event.Records[0].messageAttributes.partnerCode.stringValue
      : undefined;
    const userReference = event.Records[0].messageAttributes.userReference
      ? event.Records[0].messageAttributes.userReference.stringValue
      : undefined;
    const channel = event.Records[0].messageAttributes.channel
      ? event.Records[0].messageAttributes.channel.stringValue
      : undefined;
    const actionType = event.Records[0].messageAttributes.actionType
      ? event.Records[0].messageAttributes.actionType.stringValue
      : undefined;
    const eventSendEmail = {
      messageId: messAtt.messageId.stringValue,
      bucketName: messAtt.bucketName.stringValue,
      s3FilePath: messAtt.s3FilePath.stringValue,
      body: validateParam.body,
      errorBucketName: messAtt.errorBucketName.stringValue,
      s3FileErrorPath: messAtt.s3FileErrorPath.stringValue,
      emailTo: messAtt.emailTo.stringValue,
      emailFrom: messAtt.emailFrom.stringValue,
      language: messAtt.language.stringValue.toUpperCase() || 'EN',
      partnerCode: partnerCode || null,
      userReference: userReference || null,
      channel: channel || null,
      actionType: actionType || null,
    };
    const result = await service.sendEmail(eventSendEmail);

    return result;
  } catch (error) {
    console.error('error: ', error);
    if (error.statusCode) return error;
  }
};

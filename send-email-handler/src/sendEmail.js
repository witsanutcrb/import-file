const resultStatusCode = {
  processing: 'processing',
  complete: 'complete',
  error: 'error',
};

const app = require('./SendEmailHandler');

const _event = (
  { language, messageId, emailTo, bucketName, s3FilePath },
  body,
) => {
  const event = {
    Records: [
      {
        messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
        receiptHandle: 'MessageReceiptHandle',
        body: JSON.stringify({
          ...body,
        }),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: '1523232000000',
          SenderId: '123456789012',
          ApproximateFirstReceiveTimestamp: '1523232000001',
        },
        messageAttributes: {
          language: {
            stringValue: language,
            stringListValues: [],
            binaryListValues: [],
            dataType: 'String',
          },
          messageId: {
            stringValue: messageId,
            stringListValues: [],
            binaryListValues: [],
            dataType: 'String',
          },
          emailTo: {
            stringValue: emailTo,
            stringListValues: [],
            binaryListValues: [],
            dataType: 'String',
          },
          bucketName: {
            stringValue: bucketName,
            stringListValues: [],
            binaryListValues: [],
            dataType: 'String',
          },
          s3FilePath: {
            stringValue: s3FilePath,
            stringListValues: [],
            binaryListValues: [],
            dataType: 'String',
          },
        },
        md5OfBody: '7b270e59b47ff90a553787216d55d91d',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:{partition}:sqs:{region}:123456789012:MyQueue',
        awsRegion: 'ap-southeast-1',
      },
    ],
  };

  return event;
};
const sendEmail = async (emailObj, { bucketName, s3FilePath }) => {
  const messageEmailCodeComplate =
    process.env.EMAIL_CODE_COMPLATE || 'EMAIL0106';
  const messageEmailCodefailed = process.env.EMAIL_CODE_FAILED || 'EMAIL0107';
  const messageEmailLanguage = process.env.EMAIL_LANGUAGE || 'EN';
  const messagesId = {
    complate: messageEmailCodeComplate,
    failed: messageEmailCodefailed,
    language: messageEmailLanguage,
  };

  const messageId =
    emailObj.file_summary_status === resultStatusCode.complete
      ? messagesId.complate
      : messagesId.failed;

  const customerName = process.env.EMAIL_CUSTOMER_NAME || '';
  const emailTo = process.env.EMAIL_TO || '';

  process.env.DATE_TIME_FORMAT_EMAIL = 'DD/MM/YYYY HH:mm:ss';

  const event = _event(
    {
      language: messagesId.language,
      customerName,
      messageId,
      emailTo,
      bucketName,
      s3FilePath,
    },
    emailObj,
  );

  try {
    await app.Handler(event);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendEmail };

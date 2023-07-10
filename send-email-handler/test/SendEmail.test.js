process.env.LOCAL_DATABASE = 'In-Memory';
process.env.TIMEZONE = 'Asia/Bangkok';
process.env.DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const app = require('../src/sendEmail');

describe('Send Email Function', () => {
  afterAll(() => {
    jest.resetModules();
  });

  test('Should be return status 400 when event is correct and language is th and body is object', async () => {
    const event = {
      Records: [
        {
          messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
          receiptHandle: 'MessageReceiptHandle',
          body: {
            filename: 'test-file.txt',
            account: '4XXXX32120',
            totalRecord: 1000,
          },
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1523232000000',
            SenderId: '123456789012',
            ApproximateFirstReceiveTimestamp: '1523232000001',
          },
          messageAttributes: {
            language: {
              stringValue: 'EN',
              stringListValues: [],
              binaryListValues: [],
              dataType: 'String',
            },
            bucketName: {
              stringValue: 'tcrb-dev-bucket-mock',
              stringListValues: [],
              binaryListValues: [],
              dataType: 'String',
            },
            s3FilePath: {
              stringValue: 'internal/email',
              stringListValues: [],
              binaryListValues: [],
              dataType: 'String',
            },
            errorBucketName: {
              stringValue: 'tcrb-dev-bucket-mock',
              stringListValues: [],
              binaryListValues: [],
              dataType: 'String',
            },
            s3FileErrorPath: {
              stringValue: 'internal/error.txt',
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
    const result = await app.sendEmail(event, {
      bucketName: '',
      s3FilePath: '',
    });
    expect(result).toBeUndefined();
  });
});

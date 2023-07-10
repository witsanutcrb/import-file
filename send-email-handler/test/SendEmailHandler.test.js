process.env.LOCAL_DATABASE = 'In-Memory';
process.env.TIMEZONE = 'Asia/Bangkok';
process.env.DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const app = require('../src/SendEmailHandler');
const Service = require('../src/SendEmailService');

// const service = new Service();

jest.mock('../src/SendEmailService');

describe('Send Email Handler Function', () => {
  afterAll(() => {
    jest.resetModules();
  });

  test('Should be return status 200 when event is correct and language is th', async () => {
    const event = {
      Records: [
        {
          messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
          receiptHandle: 'MessageReceiptHandle',
          body: JSON.stringify({
            filename: 'test-file.txt',
            account: '4XXXX32120',
            totalRecord: 1000,
          }),
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
            messageId: {
              stringValue: 'EMAIL0001',
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
              stringValue: 'internal/email.txt',
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
            emailTo: {
              stringValue: 'test@test.com',
              stringListValues: [],
              binaryListValues: [],
              dataType: 'String',
            },
            emailFrom: {
              stringValue: 'test@test.com',
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

    const expectResult = {
      statusCode: 200,
      body: JSON.stringify({
        status: 'Success',
        httpStatusCode: 200,
        responseCode: 'S1002',
      }),
    };
    Service.prototype.sendEmail.mockReturnValueOnce(expectResult);

    const result = await app.Handler(event);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).responseCode).toEqual('S1002');
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
    const result = await app.Handler(event);
    expect(result.statusCode).toEqual(400);
    expect(JSON.parse(result.body).responseCode).toEqual('E9003');
  });

  test('Should be return status 200 when bucketName and s3FilePath not assign', async () => {
    const event = {
      Records: [
        {
          messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
          receiptHandle: 'MessageReceiptHandle',
          body: JSON.stringify({
            filename: 'test-file.txt',
            account: '4XXXX32120',
            totalRecord: 1000,
          }),
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
            messageId: {
              stringValue: 'EMAIL0001',
              stringListValues: [],
              binaryListValues: [],
              dataType: 'String',
            },
            // bucketName: {
            //     stringValue: 'tcrb-dev-bucket-mock',
            //     stringListValues: [],
            //     binaryListValues: [],
            //     dataType: 'String',
            // },
            // s3FilePath: {
            //     stringValue: 'internal/email',
            //     stringListValues: [],
            //     binaryListValues: [],
            //     dataType: 'String',
            // },
          },
          md5OfBody: '7b270e59b47ff90a553787216d55d91d',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:{partition}:sqs:{region}:123456789012:MyQueue',
          awsRegion: 'ap-southeast-1',
        },
      ],
    };
    const expectResult = {
      statusCode: 200,
      body: JSON.stringify({
        status: 'Success',
        httpStatusCode: 200,
        responseCode: 'S1002',
      }),
    };
    Service.prototype.sendEmail.mockReturnValueOnce(expectResult);

    const result = await app.Handler(event);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).responseCode).toEqual('S1002');
  });

  test('Should be return status 500 when event is error', async () => {
    const event = {
      Records: [
        {
          messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
          receiptHandle: 'MessageReceiptHandle',
          body: JSON.stringify({
            filename: 'test-file.txt',
            account: '4XXXX32120',
            totalRecord: 1000,
          }),
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
            messageId: {
              stringValue: 'EMAIL0001',
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
    const expectResult = {
      statusCode: 500,
      body: JSON.stringify({
        status: 'Failed',
        httpStatusCode: 500,
        responseCode: 'E1901',
      }),
    };
    Service.prototype.sendEmail.mockImplementationOnce(() => expectResult);
    const result = await app.Handler(event);
    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body).responseCode).toEqual('E1901');
  });
});

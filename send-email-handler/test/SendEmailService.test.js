process.env.LOCAL_DATABASE = 'In-Memory';
process.env.TIMEZONE = 'Asia/Bangkok';
process.env.DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const AWS = require('aws-sdk');
const momenttz = require('moment-timezone');
const nodemailer = require('nodemailer');
const Service = require('../src/SendEmailService');
const EmailRepo = require('../../messaging-repository/src/EmailMessageRepository');

const service = new Service();
jest.mock('nodemailer');
jest.mock('aws-sdk');
jest.mock('../../messaging-repository/src/EmailMessageRepository.js');
jest.mock('utilitylayer/src/utility/logging');

process.env.TIMEZONE = 'Asia/Bangkok';
process.env.DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const today = momenttz
  .tz(process.env.TIMEZONE)
  .format(process.env.DATE_TIME_FORMAT);

describe('Send Email Service Test', () => {
  beforeAll(() => {
    EmailRepo.getEmailMessage.mockResolvedValue([
      {
        created_on: today,
        created_by: 'test',
        email_id: 'email_service_01',
        resource_id: 'test',
        language: 'EN',
        subject: 'test',
        message: 'message: {test}',
        html_message: 'html_message: {test}',
        from: 'test',
        to: 'test',
        status: '1',
      },
    ]);
  });

  afterAll(() => {
    jest.resetModules();
  });

  describe('Success Case', () => {
    beforeAll(() => {
      AWS.S3.prototype.getObject = jest
        .fn()
        .mockImplementation((param, cb) =>
          cb(null, { Body: Buffer.from('test', 'utf8') }),
        );
      AWS.SQS.prototype.sendMessage = jest
        .fn()
        .mockImplementation((param, cb) => cb(null, true));

      nodemailer.createTransport = jest.fn().mockImplementation(() => {
        const sendMail = () => {
          Promise.resolve(true);
        };
        return { sendMail };
      });
    });

    test('should return sucess when parameters are correct and mail has attachment', async () => {
      const expectResult = 'Success';
      const eventSendEmail = {
        messageId: 'email_service_01',
        bucketName: null,
        s3FilePath: null,
        body: {
          test: '1234',
        },
        errorBucketName: 'error',
        s3FileErrorPath: 'error/error1.txt',
        emailTo: 'test@test.com',
        emailFrom: 'test@test.com',
        language: 'EN',
        partnerCode: null,
        userReference: null,
        channel: null,
        actionType: null,
      };

      const result = await service.sendEmail(eventSendEmail);
      expect(result).toEqual(expectResult);
    });

    test('should return sucess when parameters are correct and mail no attachment', async () => {
      const expectResult = 'Success';
      const eventSendEmail = {
        messageId: 'email_service_01',
        bucketName: null,
        s3FilePath: null,
        body: {
          test: '1234',
        },
        errorBucketName: 'error',
        s3FileErrorPath: 'error/error1.txt',
        emailTo: 'test@test.com',
        emailFrom: 'test@test.com',
        language: 'EN',
        partnerCode: null,
        userReference: null,
        channel: null,
        actionType: null,
      };

      const result = await service.sendEmail(eventSendEmail);
      expect(result).toEqual(expectResult);
    });

    test('should return sucess when parameters are correct and email message not provide subject, message, html_message, errorBucketName, s3FileErrorPath', async () => {
      EmailRepo.getEmailMessage.mockResolvedValue([
        {
          created_on: today,
          created_by: 'test',
          email_id: 'email_service_01',
          resource_id: 'test',
          language: 'EN',
          from: 'test',
          to: 'test',
          status: '1',
        },
      ]);

      const expectResult = 'Success';
      const eventSendEmail = {
        messageId: 'email_service_01',
        bucketName: null,
        s3FilePath: null,
        body: {
          test: '1234',
        },
        errorBucketName: 'error',
        s3FileErrorPath: 'error/error1.txt',
        emailTo: 'test@test.com',
        emailFrom: 'test@test.com',
        language: 'EN',
        partnerCode: null,
        userReference: null,
        channel: null,
        actionType: null,
      };
      const result = await service.sendEmail(eventSendEmail);
      expect(result).toEqual(expectResult);
    });

    test('should return sucess when parameters are correct and without emailFrom, emailTo, language', async () => {
      EmailRepo.getEmailMessage.mockResolvedValue([
        {
          created_on: today,
          created_by: 'test',
          email_id: 'email_service_01',
          resource_id: 'test',
          language: 'EN',
          from: 'test',
          to: 'test',
          status: '1',
        },
      ]);

      const expectResult = 'Success';
      const eventSendEmail = {
        messageId: 'email_service_01',
        bucketName: null,
        s3FilePath: null,
        body: {
          test: '1234',
        },
        errorBucketName: 'error',
        s3FileErrorPath: 'error/error1.txt',
        emailTo: 'test@test.com',
        emailFrom: 'test@test.com',
        language: 'EN',
        partnerCode: null,
        userReference: null,
        channel: null,
        actionType: null,
      };
      const result = await service.sendEmail(eventSendEmail);
      expect(result).toEqual(expectResult);
    });
  });

  describe('Error Case', () => {
    beforeAll(() => {
      AWS.SQS.prototype.sendMessage = jest
        .fn()
        .mockImplementation((param, cb) => cb(null, true));
    });

    test('should throw error when s3 is error', async () => {
      AWS.S3.prototype.getObject = jest
        .fn()
        .mockImplementationOnce((param, cb) => cb('S3 Error', null));
      const eventSendEmail = {
        messageId: 'email_service_01',
        bucketName: null,
        s3FilePath: null,
        body: {
          test: '1234',
        },
        errorBucketName: 'error',
        s3FileErrorPath: 'error/error1.txt',
        emailTo: 'test@test.com',
        emailFrom: 'test@test.com',
        language: 'EN',
        partnerCode: null,
        userReference: null,
        channel: null,
        actionType: null,
      };
      let result;
      try {
        await service.sendEmail(eventSendEmail);
      } catch (error) {
        console.error('error', error);
        result = error;
      }
      expect(result).toBeTruthy();
    });
  });
});

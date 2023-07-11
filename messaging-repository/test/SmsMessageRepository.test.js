const moment = require('moment');

process.env.LOCAL_DATABASE = 'In-Memory';
process.env.DEV = 'LOCAL';

const models = require('../src/Model');
const Repository = require('../src/SmsMessageRepository');

const MOMENT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const time = moment(new Date()).format(MOMENT_DATE_FORMAT);

describe('sms_message', () => {
  beforeAll(async () => {
    const model = await models;
    await model.sms_message.sync();
    await model.sms_message.bulkCreate([
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'system',
        updated_on: null,
        updated_by: null,
        terminated_on: null,
        terminated_by: null,
        sms_id: 'EXX1235',
        partner_code: 'TMDS',
        resource_id: 'otp_request',
        language: 'TH',
        message:
          'รหัส OTP ของคุณ คือ {otp} (Pac: Ref:{reference} ใช้ได้ถึง {expire}',
        status: 'T',
        template_code: 'mock_template_code',
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'system',
        updated_on: null,
        updated_by: null,
        terminated_on: null,
        terminated_by: null,
        sms_id: 'EXX1235',
        partner_code: 'TMDS',
        resource_id: 'otp_request',
        language: 'EN',
        message:
          'The SMS-OTP is Ref:{reference}-{otp}. Please enter SMS-OTP. Valid until {expire}',
        status: 'T',
        template_code: 'mock_template_code',
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'BSK',
        updated_on: '2020-03-21T12:31:00.000Z',
        updated_by: 'BSK',
        terminated_on: '2020-03-21T12:31:00.000Z',
        terminated_by: 'BSK',
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        resource_id: '12345',
        language: 'TH',
        message: 'ไทย',
        status: 'T',
        template_code: 'mock_template_code',
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'BSK',
        updated_on: '2020-03-21T12:31:00.000Z',
        updated_by: 'BSK',
        terminated_on: '2020-03-21T12:31:00.000Z',
        terminated_by: 'BSK',
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        resource_id: '12345',
        language: 'EN',
        message: 'English',
        status: 'T',
        template_code: 'mock_template_code',
      },
    ]);
  });

  test('should return result when input correct by language is TH', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(
      'EXX1234',
      'TH',
    );

    expect(result).toEqual([
      {
        created_by: 'BSK',
        created_on: '2020-03-21T12:31:00.000Z',
        language: 'TH',
        message: 'ไทย',
        partner_code: 'ABCDE',
        resource_id: '12345',
        sms_id: 'EXX1234',
        status: 'T',
        terminated_by: 'BSK',
        terminated_on: '2020-03-21T12:31:00.000Z',
        updated_by: 'BSK',
        updated_on: '2020-03-21T12:31:00.000Z',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
    ]);
  });

  test('should return result when input correct by language is EN', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(
      'EXX1234',
      'EN',
    );

    expect(result).toEqual([
      {
        created_by: 'BSK',
        created_on: '2020-03-21T12:31:00.000Z',
        language: 'EN',
        message: 'English',
        partner_code: 'ABCDE',
        resource_id: '12345',
        sms_id: 'EXX1234',
        status: 'T',
        terminated_by: 'BSK',
        terminated_on: '2020-03-21T12:31:00.000Z',
        updated_by: 'BSK',
        updated_on: '2020-03-21T12:31:00.000Z',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
    ]);
  });

  test('should return null when not found by language', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(
      'EXX1234',
      'CN',
    );
    expect(result).toEqual([]);
  });

  test('should return null when not found by sms_id ', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(
      'EXX4321',
      'EN',
    );
    expect(result).toEqual([]);
  });

  test('should return null when no parameter ', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang();
    expect(result).toEqual([]);
  });

  test('should return null when put undifine on parameter ', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(
      undefined,
      undefined,
    );
    expect(result).toEqual([]);
  });

  test('should return null when put null on parameter ', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(null, null);
    expect(result).toEqual([]);
  });

  test('should return null when put boolean on parameter ', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(false, true);
    expect(result).toEqual([]);
  });

  test('should return null when put number on parameter ', async () => {
    const result = await Repository.getSmsMessageBySmsIdAndLang(123, 123);
    expect(result).toEqual([]);
  });

  test('should return result when input correct sms_ids', async () => {
    const result = await Repository.getSmsMessageBySmsIds([
      'EXX1234',
      'EXX1235',
    ]);
    expect(result).toEqual([
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'BSK',
        updated_on: '2020-03-21T12:31:00.000Z',
        updated_by: 'BSK',
        terminated_on: '2020-03-21T12:31:00.000Z',
        terminated_by: 'BSK',
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        resource_id: '12345',
        language: 'EN',
        message: 'English',
        status: 'T',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'BSK',
        updated_on: '2020-03-21T12:31:00.000Z',
        updated_by: 'BSK',
        terminated_on: '2020-03-21T12:31:00.000Z',
        terminated_by: 'BSK',
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        resource_id: '12345',
        language: 'TH',
        message: 'ไทย',
        status: 'T',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'system',
        updated_on: null,
        updated_by: null,
        terminated_on: null,
        terminated_by: null,
        sms_id: 'EXX1235',
        partner_code: 'TMDS',
        resource_id: 'otp_request',
        language: 'EN',
        message:
          'The SMS-OTP is Ref:{reference}-{otp}. Please enter SMS-OTP. Valid until {expire}',
        status: 'T',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'system',
        updated_on: null,
        updated_by: null,
        terminated_on: null,
        terminated_by: null,
        sms_id: 'EXX1235',
        partner_code: 'TMDS',
        resource_id: 'otp_request',
        language: 'TH',
        message:
          'รหัส OTP ของคุณ คือ {otp} (Pac: Ref:{reference} ใช้ได้ถึง {expire}',
        status: 'T',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
    ]);
  });

  test('should return true when update all datas success', async () => {
    const updateData = [
      {
        updated_by: null,
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        language: 'EN',
        message: 'New Message with updated_by = null',
      },
      {
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        language: 'TH',
        message: 'ไทย ข้อความใหม่ แก้ใขแค่ message อย่างเดียว',
      },
    ];
    const updateResult = await Repository.bulkUpdate(updateData);
    expect(updateResult).toEqual(true);
    const getMessageCheck = await Repository.getSmsMessageBySmsIds(['EXX1234']);
    expect(getMessageCheck).toEqual([
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'BSK',
        updated_on: time,
        updated_by: null,
        terminated_on: '2020-03-21T12:31:00.000Z',
        terminated_by: 'BSK',
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        resource_id: '12345',
        language: 'EN',
        message: 'New Message with updated_by = null',
        status: 'T',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'BSK',
        updated_on: time,
        updated_by: 'BSK',
        terminated_on: '2020-03-21T12:31:00.000Z',
        terminated_by: 'BSK',
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        resource_id: '12345',
        language: 'TH',
        message: 'ไทย ข้อความใหม่ แก้ใขแค่ message อย่างเดียว',
        status: 'T',
        template_code: 'mock_template_code',
        sms_type: null,
        sms_sub_type: null,
      },
    ]);
  });

  test('should return false when update failed. sms_id that not exist in table', async () => {
    const updateData = [
      {
        updated_by: null,
        sms_id: 'EXX1234_____',
        partner_code: 'ABCDE',
        language: 'EN',
        message: 'New Message with updated_by = null',
      },
      {
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        language: 'TH',
        message: 'ไทย ข้อความใหม่ แก้ใขแค่ message อย่างเดียว',
      },
    ];
    let result;
    try {
      await Repository.bulkUpdate(updateData);
    } catch (error) {
      result = error;
    }

    expect(result).toBeTruthy();
  });

  test('should return false when update failed. Some value(PK) is null', async () => {
    const updateData = [
      {
        updated_by: null,
        //   sms_id: 'EXX1234_____',
        partner_code: 'ABCDE',
        language: 'EN',
        message: 'New Message with updated_by = null',
      },
      {
        sms_id: 'EXX1234',
        partner_code: 'ABCDE',
        language: 'TH',
        message: 'ไทย ข้อความใหม่ แก้ใขแค่ message อย่างเดียว',
      },
    ];
    let result;
    try {
      await Repository.bulkUpdate(updateData);
    } catch (error) {
      result = error;
    }
    expect(result).toBeTruthy();
  });

  test('should throw error when inquiry and database error', async () => {
    const model = await models;
    model.sms_message.findAll = jest.fn(
      async () => new Promise((resolve, reject) => reject()),
    );
    let result;
    try {
      await Repository.getSmsMessageBySmsIdAndLang('EXX1234', 'TH');
    } catch (error) {
      result = error;
    }

    expect(result).toBeUndefined();
  });

  test('should throw error when getSmsMessages fail', async () => {
    const model = await models;
    model.sms_message.findAll = jest.fn(
      async () => new Promise((resolve, reject) => reject()),
    );
    let result;
    try {
      await Repository.getSmsMessages();
    } catch (error) {
      result = error;
    }
    expect(result).toBeTruthy();
  });

  test('should throw error when getSmsMessageBySmsIds fail', async () => {
    const model = await models;
    model.sms_message.findAll = jest.fn(
      async () => new Promise((resolve, reject) => reject()),
    );
    let result;
    try {
      await Repository.getSmsMessageBySmsIds();
    } catch (error) {
      result = error;
    }
    expect(result).toBeUndefined();
  });
});

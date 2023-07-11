process.env.LOCAL_DATABASE = 'In-Memory';
process.env.DEV = 'LOCAL';
const models = require('../src/Model');

const Repo = require('../src/EmailMessageRepository');

describe('Email Message Repository Test', () => {
  beforeAll(async () => {
    const model = await models;
    await model.email_message.sync();
    await model.email_message.bulkCreate([
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'test',
        email_id: 'email_01',
        resource_id: 'test',
        language: 'EN',
        subject: 'test',
        message: 'test',
        from: 'test',
        to: 'test',
        status: '1',
        html_message: 'test',
        template_code: 'mock_template_code',
      },
      {
        created_on: '2020-03-21T12:31:00.000Z',
        created_by: 'system',
        email_id: 'EMAIL0003',
        resource_id: 'error_correction',
        language: 'EN',
        subject: 'OB: Batch Processing Error_Error Correction_{date}',
        message: 'test',
        from: 'apirat.j@tcrbank.com',
        to: 'apirat.j@tcrbank.com',
        status: '1',
        html_message: 'test',
        template_code: 'mock_template_code',
      },
    ]);
  });

  describe('Success Case', () => {
    test('should return data when inquiry all data', async () => {
      const expectResult = [
        {
          created_by: 'test',
          created_on: '2020-03-21T12:31:00.000Z',
          email_id: 'email_01',
          from: 'test',
          html_message: 'test',
          language: 'EN',
          message: 'test',
          partner_code: null,
          resource_id: 'test',
          status: '1',
          subject: 'test',
          terminated_by: null,
          terminated_on: null,
          to: 'test',
          updated_by: null,
          updated_on: null,
          template_code: 'mock_template_code',
          email_type: null,
          email_sub_type: null,
        },
        {
          created_by: 'system',
          created_on: '2020-03-21T12:31:00.000Z',
          email_id: 'EMAIL0003',
          from: 'apirat.j@tcrbank.com',
          html_message: 'test',
          language: 'EN',
          message: 'test',
          partner_code: null,
          resource_id: 'error_correction',
          status: '1',
          subject: 'OB: Batch Processing Error_Error Correction_{date}',
          terminated_by: null,
          terminated_on: null,
          to: 'apirat.j@tcrbank.com',
          updated_by: null,
          updated_on: null,
          template_code: 'mock_template_code',
          email_type: null,
          email_sub_type: null,
        },
      ];
      const result = await Repo.getEmailMessage();
      expect(result).toEqual(expectResult);
    });

    test('should return data when inquiry using email_id = email_01', async () => {
      const condition = {
        email_id: 'email_01',
      };
      const expectResult = [
        {
          created_by: 'test',
          created_on: '2020-03-21T12:31:00.000Z',
          email_id: 'email_01',
          from: 'test',
          html_message: 'test',
          language: 'EN',
          message: 'test',
          partner_code: null,
          resource_id: 'test',
          status: '1',
          subject: 'test',
          terminated_by: null,
          terminated_on: null,
          to: 'test',
          updated_by: null,
          updated_on: null,
          template_code: 'mock_template_code',
          email_type: null,
          email_sub_type: null,
        },
      ];
      const result = await Repo.getEmailMessage(condition);
      expect(result).toEqual(expectResult);
    });

    test('should return data when inquiry using email_id = email_01 (use JSON as condition)', async () => {
      const condition = {
        email_id: 'email_01',
      };
      const expectResult = [
        {
          created_by: 'test',
          created_on: '2020-03-21T12:31:00.000Z',
          email_id: 'email_01',
          from: 'test',
          html_message: 'test',
          language: 'EN',
          message: 'test',
          partner_code: null,
          resource_id: 'test',
          status: '1',
          subject: 'test',
          terminated_by: null,
          terminated_on: null,
          to: 'test',
          updated_by: null,
          updated_on: null,
          template_code: 'mock_template_code',
          email_type: null,
          email_sub_type: null,
        },
      ];
      const result = await Repo.getEmailMessage(JSON.stringify(condition));
      expect(result).toEqual(expectResult);
    });

    test('should return data when inquiry using email_ids success', async () => {
      const result = await Repo.getEmailMessageByEmailIds([
        'email_01',
        'EMAIL0003',
      ]);
      expect(result).toEqual([
        {
          created_on: '2020-03-21T12:31:00.000Z',
          created_by: 'system',
          updated_on: null,
          updated_by: null,
          terminated_on: null,
          terminated_by: null,
          email_id: 'EMAIL0003',
          partner_code: null,
          resource_id: 'error_correction',
          language: 'EN',
          subject: 'OB: Batch Processing Error_Error Correction_{date}',
          message: 'test',
          from: 'apirat.j@tcrbank.com',
          to: 'apirat.j@tcrbank.com',
          status: '1',
          html_message: 'test',
          template_code: 'mock_template_code',
          email_type: null,
          email_sub_type: null,
        },
        {
          created_on: '2020-03-21T12:31:00.000Z',
          created_by: 'test',
          updated_on: null,
          updated_by: null,
          terminated_on: null,
          terminated_by: null,
          email_id: 'email_01',
          partner_code: null,
          resource_id: 'test',
          language: 'EN',
          subject: 'test',
          message: 'test',
          from: 'test',
          to: 'test',
          status: '1',
          html_message: 'test',
          template_code: 'mock_template_code',
          email_type: null,
          email_sub_type: null,
        },
      ]);
    });

    test('should return true when update datas success.', async () => {
      const updateData = [
        {
          updated_by: null,
          email_id: 'EMAIL0003',
          language: 'EN',
          message: 'New Message with updated_by = null',
        },
        {
          email_id: 'email_01',
          language: 'EN',
          message: 'New Message',
        },
      ];
      const updateResult = await Repo.bulkUpdate(updateData);
      expect(updateResult).toEqual(true);
    });
  });

  describe('Error Case', () => {
    beforeAll(async () => {
      const model = await models;
      model.email_message.findAll = jest.fn(
        async () => new Promise((resolve, reject) => reject()),
      );
    });

    test('should throw error when inquiry and database error', async () => {
      let result;
      try {
        await Repo.getEmailMessage();
      } catch (error) {
        result = error;
      }

      expect(result).toBeUndefined();
    });

    test('should throw error when inquiry and database error', async () => {
      let result;
      try {
        await Repo.getEmailMessageByEmailIds();
      } catch (error) {
        result = error;
      }
      expect(result).toBeUndefined();
    });

    test('should return true when update datas success.', async () => {
      const updateData = [
        {
          updated_by: null,
          //   email_id: 'EMAIL0003',
          language: 'EN',
          message: 'New Message with updated_by = null',
        },
        {
          email_id: 'email_01',
          language: 'EN',
          message: 'New Message',
        },
      ];
      let errResp;
      try {
        await Repo.bulkUpdate(updateData);
      } catch (error) {
        errResp = error;
      }
      expect(errResp).toEqual(Error('Some value is null'));
    });

    test('should return true when update datas success.', async () => {
      const updateData = [
        {
          updated_by: null,
          email_id: 'EMAIL0003_____',
          language: 'EN',
          message: 'New Message with updated_by = null',
        },
        {
          email_id: 'email_01',
          language: 'EN',
          message: 'New Message',
        },
      ];
      let errResp;
      try {
        await Repo.bulkUpdate(updateData);
      } catch (error) {
        errResp = error;
      }
      expect(errResp).toEqual(Error('0'));
    });
  });
});

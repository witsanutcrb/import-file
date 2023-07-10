const { validate } = require('../validate-field');

describe('Field Validation Function ', () => {
  describe('Validate succase case', () => {
    test('Case 1: Validate mandatory is pass', async () => {
      const obj_field = {
        field_id: '1',
        field_name: 'Mandatory',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 5,
        default: '',
        original_value: 'ok',
        value: 'ok',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '1',
        field_name: 'Mandatory',
        result: {},
      });
    });

    test('Case 1.1: Validate mandatory and default is pass', async () => {
      const obj_field = {
        field_id: '1',
        field_name: 'Mandatory',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 5,
        default: 'ok',
        original_value: 'ok',
        value: 'ok',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '1',
        field_name: 'Mandatory',
        result: {},
      });
    });

    test('Case 2: Validate length is pass', async () => {
      const obj_field = {
        field_id: '2',
        field_name: 'Length',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 5,
        default: '',
        original_value: 'apple',
        value: 'apple',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '2',
        field_name: 'Length',
        result: {},
      });
    });

    test('Case 3: Validate Default is pass', async () => {
      const obj_field = {
        field_id: '3',
        field_name: 'Default',
        mandatory: 'Y',
        validation: ['defalut'],
        src_length: 5,
        default: 'tcrb',
        original_value: 'tcrb',
        value: 'tcrb',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '3',
        field_name: 'Default',
        result: {},
      });
    });

    test('Case 4: Validate Email is pass', async () => {
      const obj_field = {
        field_id: '4',
        field_name: 'Email',
        mandatory: 'Y',
        validation: ['email'],
        src_length: 20,
        default: '',
        original_value: 'tcrb@tcrb.com',
        value: 'tcrb@tcrb.com',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '4',
        field_name: 'Email',
        result: {},
      });
    });

    test('Case 5: Validate Date format is pass', async () => {
      const obj_field = {
        field_id: '5',
        field_name: 'Date format',
        mandatory: 'Y',
        validation: ['date'],
        src_length: 20,
        src_format: 'YYYYMMDD',
        default: '',
        original_value: '20221231',
        value: '20221231',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '5',
        field_name: 'Date format',
        result: {},
      });
    });

    test('Case 6: Validate ID Card is pass', async () => {
      const obj_field = {
        field_id: '6',
        field_name: 'ID Card',
        mandatory: 'Y',
        validation: ['id_card'],
        src_length: 20,
        default: '',
        original_value: '5238233727686',
        value: '5238233727686',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '6',
        field_name: 'ID Card',
        result: {},
      });
    });

    test('Case 7: Validate Tel no is pass', async () => {
      const obj_field = {
        field_id: '7',
        field_name: 'Tel no',
        mandatory: 'Y',
        validation: ['tel_no'],
        src_length: 10,
        default: '',
        original_value: '0800752239',
        value: '0800752239',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '7',
        field_name: 'Tel no',
        result: {},
      });
    });

    test('Case 8: Validate Fix length is pass', async () => {
      const obj_field = {
        field_id: '8',
        field_name: 'Fix length',
        mandatory: 'Y',
        validation: ['fix_length'],
        src_length: 5,
        default: '',
        original_value: '00000',
        value: '00000',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '8',
        field_name: 'Fix length',
        result: {},
      });
    });

    test('Case 9: Validate Decimal is pass', async () => {
      const obj_field = {
        field_id: '9',
        field_name: 'Decimal',
        mandatory: 'Y',
        validation: ['decimal'],
        src_length: 10,
        src_format: '#.##',
        default: '',
        original_value: '93.50',
        value: '93.50',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '9',
        field_name: 'Decimal',
        result: {},
      });
    });

    test('Case 10: Validate Numeric is pass', async () => {
      const obj_field = {
        field_id: '10',
        field_name: 'Numeric',
        mandatory: 'Y',
        validation: ['numeric'],
        src_length: 10,
        default: '',
        original_value: '93.5',
        value: '93.5',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '10',
        field_name: 'Numeric',
        result: {},
      });
    });
    test('Case 11: Validate Number is pass', async () => {
      const obj_field = {
        field_id: '11',
        field_name: 'Number',
        mandatory: 'Y',
        validation: ['input_number'],
        src_length: 10,
        default: '',
        original_value: '93.5',
        value: '93.5',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '11',
        field_name: 'Number',
        result: {},
      });
    });

    test('Case 12: Validate Thai charactor is pass', async () => {
      const obj_field = {
        field_id: '12',
        field_name: 'TH',
        mandatory: 'Y',
        validation: ['input_th'],
        src_length: 10,
        default: '',
        original_value: 'ภาษาไทย',
        value: 'ภาษาไทย',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '12',
        field_name: 'TH',
        result: {},
      });
    });

    test('Case 13: Validate Eng charactor is pass', async () => {
      const obj_field = {
        field_id: '13',
        field_name: 'EN',
        mandatory: 'Y',
        validation: ['input_en'],
        src_length: 10,
        default: '',
        original_value: 'English',
        value: 'English',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '13',
        field_name: 'EN',
        result: {},
      });
    });

    test('Case 14: Validate Data boundary is pass', async () => {
      const obj_field = {
        field_id: '14',
        field_name: 'Data boundary',
        mandatory: 'Y',
        validation: [['length', 'input_number']],
        src_length: 2,
        default: '',
        original_value: '01',
        value: '01',
        lookup_flg: 'V',
        lookup_type: [{ type: 'data_boundary', value: 'no_of_loan' }],
      };
      const result = await validate(
        { ...obj_field, lookup_type: JSON.stringify(obj_field.lookup_type) },
        { no_of_loan: { '01': '01', '02': '02' } },
        {},
      );
      expect(result).toStrictEqual({
        field_id: '14',
        field_name: 'Data boundary',
        result: {},
      });
    });

    test('Case 15: Validate Province is pass', async () => {
      const obj_field = {
        field_id: '15',
        field_name: 'Province',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 30,
        default: '',
        original_value: 'กรุงเทพ',
        value: 'กรุงเทพ',
        lookup_flg: 'Y',
        lookup_type: 'province',
      };
      const result = await validate(obj_field, {}, { กรุงเทพ: 1 });
      expect(result).toStrictEqual({
        field_id: '15',
        field_name: 'Province',
        result: {},
      });
    });

    test('Case 16: Validate Charecter is pass', async () => {
      const obj_field = {
        field_id: '15',
        field_name: 'Province',
        mandatory: 'Y',
        validation: ['charecter'],
        src_length: 30,
        default: '',
        original_value: 'กรุงเทพ',
        value: 'กรุงเทพ',
        lookup_flg: 'Y',
        lookup_type: 'province',
      };
      const result = await validate(obj_field, {}, { กรุงเทพ: 1 });
      expect(result).toStrictEqual({
        field_id: '15',
        field_name: 'Province',
        result: {},
      });
    });
  });
  describe('Validate reject case', () => {
    test('Case 1: Validate mandatory is not pass', async () => {
      const obj_field = {
        field_id: '1',
        field_name: 'Mandatory',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 5,
        default: '',
        original_value: '',
        value: '',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '1',
        field_name: 'Mandatory',
        result: { mandatory: 'FAILED' },
      });
    });

    test('Case 1.1: Validate mandatory and default is not pass', async () => {
      const obj_field = {
        field_id: '1',
        field_name: 'Mandatory',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 5,
        default: 'ok',
        original_value: '',
        value: '',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '1',
        field_name: 'Mandatory',
        result: { default: 'FAILED', mandatory: 'FAILED' },
      });
    });
    test('Case 2: Validate length is not pass', async () => {
      const obj_field = {
        field_id: '2',
        field_name: 'Length',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 5,
        default: '',
        original_value: 'tcrbtcrb',
        value: 'tcrbtcrb',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '2',
        field_name: 'Length',
        result: { length: 'FAILED' },
      });
    });

    test('Case 3: Validate Default is not pass', async () => {
      const obj_field = {
        field_id: '3',
        field_name: 'Default',
        mandatory: 'Y',
        validation: ['defalut'],
        src_length: 5,
        default: 'tcrb',
        original_value: 'tcrbtcrb',
        value: 'tcrbtcrb',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '3',
        field_name: 'Default',
        result: { default: 'FAILED' },
      });
    });

    test('Case 4: Validate Email is not pass', async () => {
      const obj_field = {
        field_id: '4',
        field_name: 'Email',
        mandatory: 'Y',
        validation: ['email'],
        src_length: 20,
        default: '',
        original_value: 'tcrbtcrb.com',
        value: 'tcrbtcrb.com',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '4',
        field_name: 'Email',
        result: { email_format: 'FAILED' },
      });
    });

    test('Case 5: Validate Date format is not pass', async () => {
      const obj_field = {
        field_id: '5',
        field_name: 'Date format',
        mandatory: 'Y',
        validation: ['date'],
        src_length: 20,
        src_format: 'YYYYMMDD',
        default: '',
        original_value: '30122022',
        value: '30122022',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '5',
        field_name: 'Date format',
        result: { date_format: 'FAILED' },
      });
    });

    test('Case 6: Validate ID Card is not pass', async () => {
      const obj_field = {
        field_id: '6',
        field_name: 'ID Card',
        mandatory: 'Y',
        validation: ['id_card'],
        src_length: 20,
        default: '',
        original_value: '1191200000000',
        value: '1191200000000',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '6',
        field_name: 'ID Card',
        result: { id_card: 'FAILED' },
      });
    });

    test('Case 7: Validate Tel no is not pass', async () => {
      const obj_field = {
        field_id: '7',
        field_name: 'Tel no',
        mandatory: 'Y',
        validation: ['tel_no'],
        src_length: 10,
        default: '',
        original_value: '0500752239',
        value: '0500752239',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '7',
        field_name: 'Tel no',
        result: { tel_no: 'FAILED' },
      });
    });

    test('Case 8: Validate Fix length is not pass', async () => {
      const obj_field = {
        field_id: '8',
        field_name: 'Fix length',
        mandatory: 'Y',
        validation: ['fix_length'],
        src_length: 5,
        default: '',
        original_value: '0000',
        value: '0000',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '8',
        field_name: 'Fix length',
        result: { fix_length: 'FAILED' },
      });
    });

    test('Case 9: Validate Decimal is not pass', async () => {
      const obj_field = {
        field_id: '9',
        field_name: 'Decimal',
        mandatory: 'Y',
        validation: ['decimal'],
        src_length: 10,
        src_format: '#.##',
        default: '',
        original_value: '93.5',
        value: '93.5',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '9',
        field_name: 'Decimal',
        result: { number_format: 'FAILED' },
      });
    });

    test('Case 10: Validate Numeric is not pass', async () => {
      const obj_field = {
        field_id: '10',
        field_name: 'Numeric',
        mandatory: 'Y',
        validation: ['numeric'],
        src_length: 10,
        default: '',
        original_value: '093.5',
        value: '093.5',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '10',
        field_name: 'Numeric',
        result: { numeric: 'FAILED' },
      });
    });
    test('Case 11: Validate Number is not pass', async () => {
      const obj_field = {
        field_id: '11',
        field_name: 'Number',
        mandatory: 'Y',
        validation: ['input_number'],
        src_length: 10,
        default: '',
        original_value: '09A3.5',
        value: '09A3.5',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '11',
        field_name: 'Number',
        result: { input_number: 'FAILED' },
      });
    });

    test('Case 12: Validate Thai charactor is not pass', async () => {
      const obj_field = {
        field_id: '12',
        field_name: 'TH',
        mandatory: 'Y',
        validation: ['input_th'],
        src_length: 10,
        default: '',
        original_value: '09A3.5',
        value: '09A3.5',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '12',
        field_name: 'TH',
        result: { input_th: 'FAILED' },
      });
    });

    test('Case 13: Validate Eng charactor is not pass', async () => {
      const obj_field = {
        field_id: '13',
        field_name: 'EN',
        mandatory: 'Y',
        validation: ['input_en'],
        src_length: 10,
        default: '',
        original_value: 'ภาษาไทย',
        value: 'ภาษาไทย',
      };
      const result = await validate(obj_field, {}, {});
      expect(result).toStrictEqual({
        field_id: '13',
        field_name: 'EN',
        result: { input_en: 'FAILED' },
      });
    });

    test('Case 14: Validate Data boundary is not pass', async () => {
      const obj_field = {
        field_id: '14',
        field_name: 'Data boundary',
        mandatory: 'Y',
        validation: [['length', 'input_number']],
        src_length: 2,
        default: '',
        original_value: '99',
        value: '99',
        lookup_flg: 'V',
        lookup_type: [{ type: 'data_boundary', value: 'no_of_loan' }],
      };
      const result = await validate(
        { ...obj_field, lookup_type: JSON.stringify(obj_field.lookup_type) },
        { no_of_loan: { '01': '01', '02': '02' } },
        {},
      );
      expect(result).toStrictEqual({
        field_id: '14',
        field_name: 'Data boundary',
        result: { data_boundary: 'FAILED' },
      });
    });

    test('Case 15: Validate Province is not pass', async () => {
      const obj_field = {
        field_id: '15',
        field_name: 'Province',
        mandatory: 'Y',
        validation: ['length'],
        src_length: 30,
        default: '',
        original_value: 'กรุงเทพมหานคร',
        value: 'กรุงเทพมหานคร',
        lookup_flg: 'Y',
        lookup_type: 'province',
      };
      const result = await validate(obj_field, {}, { กรุงเทพ: 1 });
      expect(result).toStrictEqual({
        field_id: '15',
        field_name: 'Province',
        result: { data_boundary: 'FAILED' },
      });
    });

    test('Case 16: Validate Character is not pass', async () => {
      const obj_field = {
        field_id: '15',
        field_name: 'Province',
        mandatory: 'Y',
        validation: ['character'],
        src_length: 30,
        default: '',
        original_value: 'กรุงเทพมหานคร*&',
        value: 'กรุงเทพมหานคร*&',
        lookup_flg: 'Y',
        lookup_type: 'province',
      };
      const result = await validate(obj_field, {}, { กรุงเทพ: 1 });
      expect(result).toStrictEqual({
        field_id: '15',
        field_name: 'Province',
        result: { character: 'FAILED', data_boundary: 'FAILED' },
      });
    });

    test('Case 17: Validate Multi validate is not pass', async () => {
      const obj_field = {
        field_id: '15',
        field_name: 'Province',
        mandatory: 'Y',
        validation: [
          'length',
          'mandatory',
          'input_number',
          'input_en',
          'input_th',
          'character',
          'email',
          'tel_no',
        ],
        src_length: 10,
        default: '1',
        original_value: 'กรุงเทพมหานคร*&',
        value: 'กรุงเทพมหานคร*&',
        lookup_flg: 'Y',
        lookup_type: 'province',
      };
      const result = await validate(obj_field, {}, { กรุงเทพ: 1 });
      expect(result).toStrictEqual({
        field_id: '15',
        field_name: 'Province',
        result: {
          length: 'FAILED',
          default: 'FAILED',
          email_format: 'FAILED',
          tel_no: 'FAILED',
          input_number: 'FAILED',
          input_th: 'FAILED',
          input_en: 'FAILED',
          data_boundary: 'FAILED',
          character: 'FAILED',
        },
      });
    });
  });
});

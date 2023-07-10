const { lookup } = require('../lookup-field');

describe('Lookup Function ', () => {
  describe('Look success case', () => {
    test('Case 1: Lookup "data_boundary" is Correct', () => {
      const result = lookup(
        { type: 'data_boundary', value: 'residential_status' },
        '01',
        { '01': 'ที่อยู่' },
        '',
      );
      expect(result).toStrictEqual({
        data_boundary: 'ที่อยู่',
        lookupType: 'data_boundary',
        value: 'ที่อยู่',
      });
    });
    test('Case 2: Lookup "state" is Correct', () => {
      const result = lookup({ type: 'state' }, 'เลย', { เลย: '02' }, '');
      expect(result).toStrictEqual({ value: '02', lookupType: 'state' });
    });
    test('Case 3: Lookup "province" is Correct', () => {
      const result = lookup('province', 'กรุงเทพ', { กรุงเทพ: '01' }, '');
      expect(result).toStrictEqual({ province: '01' });
    });
    test('Case 4: Lookup "marital_status" is Correct', () => {
      const result = lookup(
        { type: 'marital_status' },
        '01',
        { '01': 'โสด' },
        '',
      );

      expect(result).toStrictEqual({
        lookupType: 'marital_status',
        marital_status: 'โสด',
        value: 'โสด',
      });
    });
    test('Case 5: Lookup "split_date" is Correct', () => {
      const result = lookup({ type: 'split_date' }, '20221231', {}, '');
      expect(result).toStrictEqual({
        lookupType: 'split_date',
        split_date: '31',
        value: '31',
      });
    });
    test('Case 6: Lookup "address_type" is Correct', () => {
      const result = lookup(
        { type: 'address_type' },
        'W',
        { W: 'ที่ทำงาน' },
        '',
      );
      expect(result).toStrictEqual({
        lookupType: 'address_type',
        address_type: 'ที่ทำงาน',
        value: 'ที่ทำงาน',
      });
    });
    test('Case 7: Lookup "product_code" is Correct', () => {
      const result = lookup(
        { type: 'product_code' },
        '01',
        { '01': 'Loan' },
        '',
      );
      expect(result).toStrictEqual({
        lookupType: 'product_code',
        product_code: 'Loan',
        value: 'Loan',
      });
    });
    test('Case 8: Lookup "facility_code" is Correct', () => {
      const result = lookup(
        { type: 'facility_code' },
        '01',
        { '01': 'Loan' },
        '',
      );
      expect(result).toStrictEqual({
        lookupType: 'facility_code',
        facility_code: 'Loan',
        value: 'Loan',
      });
    });
    test('Case 9: Lookup "substring" is Correct', () => {
      const result = lookup(
        { type: 'substring', value: [0, 2] },
        '99-20221231',
      );
      expect(result).toStrictEqual({
        lookupType: 'substring',
        substring: '99',
        value: '99',
      });
    });
    test('Case 10: Lookup "slice" is Correct', () => {
      const result = lookup(
        { type: 'slice', value: -10 },
        '99999999990123456789',
      );
      expect(result).toStrictEqual({
        lookupType: 'slice',
        slice: '0123456789',
        value: '0123456789',
      });
    });
    test('Case 11: Lookup "no_of_loan" is Correct', () => {
      // ไม่ได้ใช้
      const result = lookup(
        { type: 'no_of_loan' },
        '01',
        { '01': 'First' },
        '',
      );
      expect(result).toStrictEqual({
        value: '01',
      });
    });
    test('Case 12: Lookup "Other" is Correct', () => {
      // ไม่ได้ใช้
      const result = lookup('', 'Other', '', '');
      expect(result).toStrictEqual({
        value: 'Other',
      });
    });
  });
});

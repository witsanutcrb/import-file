const {
  thaiValidator,
  engValidator,
  numberValidator,
  numberAndThaiValidator,
  numberAndEngValidator,
  mobileNumberValidator,
  characterValidator,
  nameEnValidator,
} = require('../index');

// const {
//   fixLengthValidator,
// } = require('../../system-validation/validate-field');

describe('Word Validation Function ', () => {
  describe('Validate success case', () => {
    const expected = true;
    test('Case 1: happy', () => {
      // expect(fixLengthValidator('01', '2')).toBe(expected);
      expect(thaiValidator('อำนวย. ณ')).toBe(expected);
      expect(engValidator('support. u')).toBe(expected);
      expect(numberValidator('-01245.63')).toBe(expected);
      expect(numberAndThaiValidator('01283.265 บาท')).toBe(expected);
      expect(numberAndEngValidator('01283.265 usd')).toBe(expected);
      expect(mobileNumberValidator('0851726394')).toBe(expected);
      expect(characterValidator('0851726394')).toBe(expected);
      expect(nameEnValidator('ชื่อ-สกุล')).toBe(expected);
    });
    test('Case 2: input emty ', () => {
      // expect(fixLengthValidator('', '2')).toBe(expected);
      // expect(fixLengthValidator('', undefined)).toBe(expected);
      // expect(fixLengthValidator('', null)).toBe(expected);
      expect(thaiValidator('')).toBe(expected);
      expect(engValidator('')).toBe(expected);
      expect(numberValidator('')).toBe(expected);
      expect(numberAndThaiValidator('')).toBe(expected);
      expect(numberAndEngValidator('')).toBe(expected);
      expect(mobileNumberValidator('')).toBe(expected);
      expect(characterValidator('')).toBe(expected);
    });
  });
  describe('Validate failed case', () => {
    const expected = false;
    test('Case 1: Invalid word Wrong pattern ', () => {
      // expect(fixLengthValidator('0asd1', 'as2')).toBe(expected);
      expect(thaiValidator('อำhhhนวย')).toBe(expected);
      expect(engValidator('supportนะจ๊ะ')).toBe(expected);
      expect(numberValidator('supportนะจ๊ะ01923')).toBe(expected);
      expect(numberAndThaiValidator('supportนะจ๊ะ3246')).toBe(expected);
      expect(numberAndEngValidator('supportนะจ๊ะ234254')).toBe(expected);
      expect(mobileNumberValidator('0123452312323')).toBe(expected);
      expect(characterValidator('0123452312323%$')).toBe(expected);
      expect(nameEnValidator('Full name')).toBe(expected);
    });
    test('Case 2: Special Character ', () => {
      // expect(fixLengthValidator('฿*', '฿*')).toBe(expected);
      expect(thaiValidator('อำนวย฿')).toBe(expected);
      expect(engValidator('฿*&}')).toBe(expected);
      expect(numberValidator('฿*&}')).toBe(expected);
      expect(numberAndThaiValidator('฿*&}')).toBe(expected);
      expect(numberAndEngValidator('฿*&}')).toBe(expected);
      expect(mobileNumberValidator('฿*&}')).toBe(expected);
      expect(characterValidator('฿*&}')).toBe(expected);
    });
    test('Case 3: input undefined ', () => {
      // expect(fixLengthValidator(undefined, '2')).toBe(expected);
      // expect(fixLengthValidator(undefined, undefined)).toBe(expected);
      // expect(fixLengthValidator('01', undefined)).toBe(expected);

      expect(thaiValidator(undefined)).toBe(expected);
      expect(engValidator(undefined)).toBe(expected);
      expect(numberValidator(undefined)).toBe(expected);
      expect(numberAndThaiValidator(undefined)).toBe(expected);
      expect(numberAndEngValidator(undefined)).toBe(expected);
      expect(mobileNumberValidator(undefined)).toBe(expected);
      expect(characterValidator(undefined)).toBe(expected);
    });
    test('Case 4: input null ', () => {
      // expect(fixLengthValidator(null, '2')).toBe(expected);
      // expect(fixLengthValidator(null, null)).toBe(expected);
      // expect(fixLengthValidator('01', null)).toBe(expected);
      expect(thaiValidator(null)).toBe(expected);
      expect(engValidator(null)).toBe(expected);
      expect(numberValidator(null)).toBe(expected);
      expect(numberAndThaiValidator(null)).toBe(expected);
      expect(numberAndEngValidator(null)).toBe(expected);
      expect(mobileNumberValidator(null)).toBe(expected);
      expect(characterValidator(null)).toBe(expected);
    });
  });
});

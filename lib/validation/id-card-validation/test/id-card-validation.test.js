const { checkID } = require('../idcardService');

describe('ID Card Validation Function ', () => {
  describe('Validate success case', () => {
    const expected = true;
    test('Case 1: Valid ID Correct pattern', () => {
      expect(checkID('1119900639020')).toBe(expected);
    });
  });
  describe('Validate error case', () => {
    const expected = false;

    test('Case 2: Invalid ID Wrong pattern', () => {
      expect(checkID('1101700230705')).toBe(expected);
    });

    test('Case 3: Invalid ID Less than 13 character', () => {
      expect(checkID('110170023073')).toBe(expected);
    });

    test('Case 4: Invalid ID Mixed character ', () => {
      expect(checkID('11017002070d3')).toBe(expected);
    });

    test('Case 5: Invalid ID Mixed character', () => {
      expect(checkID('rytege54fsfsf')).toBe(expected);
    });

    test('Case 6: Invalid ID Just 0', () => {
      expect(checkID('0')).toBe(expected);
    });

    test('Case 7: Invalid ID Special character', () => {
      expect(checkID('-')).toBe(expected);
    });

    test('Case 8: Invalid ID Blank character', () => {
      expect(checkID('')).toBe(expected);
    });

    test('Case 9: Invalid ID NULL', () => {
      expect(checkID(null)).toBe(expected);
    });

    test('Case 10: Invalid ID Only text character', () => {
      expect(checkID('blablabla')).toBe(false);
    });

    test('Case 11: Invalid ID Undefined input', () => {
      expect(checkID(undefined)).toBe(false);
    });
  });
});

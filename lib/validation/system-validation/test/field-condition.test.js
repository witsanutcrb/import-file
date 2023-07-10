process.env.TIMEZONE = 'Asia/Bangkok';
const { validateFieldCondition } = require('../field-condition');
const listObjCondition = require('./mock/listObjCondition.json');
const dataObject = require('./mock/dataObject.json');
const listCompare = require('./mock/occupation_list.json');

describe('Field Condition Validation Function ', () => {
  describe('Validate success case', () => {
    test('Case 1: Condition Type : "Relation" multi is Correct', () => {
      const objCon = listObjCondition.filter(
        (word) => word.mappingFieldID === 580,
      );

      const {
        response: [res000, res001],
      } = validateFieldCondition(objCon, dataObject)[0];
      expect(res000.conditionType).toBe('relation');
      expect(res000.status).toBe('PASS');

      expect(res001.conditionType).toBe('relation');
      expect(res001.status).toBe('PASS');
    });
    test('Case 1.1: Condition Type : "Relation" is Correct', () => {
      const objCon = listObjCondition.filter(
        (word) => word.mappingFieldID === 37,
      );
      const emType = '';
      const emName = '';
      const dataObj36 = [
        {
          mappingFieldID: 37,
          index: 1,
          field_id: '1',
          field_name: 'employer_name',
          mandatory: 'Y',
          validate: ['length', 'email', 'date'],
          length: 10,
          format: 'YYYYMMDD',
          data_type: 'string',
          value: emName,
          is_pk: 'Y',
        },
        {
          mappingFieldID: 36,
          index: 2,
          field_id: '2',
          field_name: 'employment_type_se_vs_sa',
          mandatory: 'Y',
          validate: ['length', 'email', 'date'],
          length: 10,
          format: 'YYYYMMDD',
          data_type: 'string',
          value: emType,
          is_dup_key: 'Y',
        },
      ];

      dataObj36[0].value = '';
      dataObj36[1].value = '01';
      const { response: res01Pass } = validateFieldCondition(
        objCon,
        dataObj36,
      )[0];
      expect(res01Pass[0].conditionType).toBe('relation');
      expect(res01Pass[0].status).toBe('PASS');

      dataObj36[0].value = 'DEV';
      dataObj36[1].value = '01';
      const { response: res01Pass_2 } = validateFieldCondition(
        objCon,
        dataObj36,
      )[0];
      expect(res01Pass_2[0].conditionType).toBe('relation');
      expect(res01Pass_2[0].status).toBe('PASS');

      dataObj36[0].value = 'Dev';
      dataObj36[1].value = '02';
      const { response: res02Pass } = validateFieldCondition(
        objCon,
        dataObj36,
      )[0];
      expect(res02Pass[0].conditionType).toBe('relation');
      expect(res02Pass[0].status).toBe('PASS');

      dataObj36[0].value = '';
      dataObj36[1].value = '02';
      const { response: res02Failed } = validateFieldCondition(
        objCon,
        dataObj36,
      )[0];
      expect(res02Failed[0].conditionType).toBe('relation');
      expect(res02Failed[0].status).toBe('FAILED');
    });
    test('Case 1.2: Condition Type : "Date Relation" is Correct', () => {
      const objCon = listObjCondition.filter(
        (word) =>
          word.mappingFieldID === 278 &&
          word.condition[0].conditionType === 'daterelation',
      );

      const {
        response: [res],
      } = validateFieldCondition(objCon, dataObject)[0];

      expect(res.conditionType).toBe('daterelation');
      expect(res.status).toBe('PASS');
    });
    test('Case 1.3: Condition Type : "Date Compare Current" is Correct', () => {
      const objCon = listObjCondition.filter(
        (word) =>
          word.mappingFieldID === 278 &&
          word.condition[0].conditionType === 'date_compare_current',
      );
      console.log(
        '🚀 ~ file: field-condition.test.js:114 ~ test ~ objCon',
        JSON.stringify(objCon),
      );

      const {
        response: [res],
      } = validateFieldCondition(objCon, dataObject)[0];

      expect(res.conditionType).toBe('date_compare_current');
      expect(res.status).toBe('PASS');
    });
    test('Case 2: Condition Type : "Max Value" is Correct', () => {
      const objCon = listObjCondition.filter(
        (word) => word.mappingFieldID === 43,
      );
      const { response } = validateFieldCondition(objCon, dataObject)[0];
      const { conditionType: receivedType, status: receivedStatus } =
        response[0];

      expect(receivedType).toBe('maxvalue');
      expect(receivedStatus).toBe('FAILED');
    });
    test('Case 3: Condition Type : "Compare" is Correct', () => {
      const objCon = listObjCondition.filter(
        (word) => word.mappingFieldID === 51,
      );
      const { response } = validateFieldCondition(objCon, dataObject)[0];
      const { conditionType: receivedType, status: receivedStatus } =
        response[0];

      expect(receivedType).toBe('compare');
      expect(receivedStatus).toBe('PASS');
    });
    test('Case 4: Condition Type : "Mandatory" is Correct', () => {
      const objCon = listObjCondition.filter(
        (word) => word.mappingFieldID === 52,
      );
      const { response } = validateFieldCondition(objCon, dataObject)[0];
      const { conditionType: receivedType, status: receivedStatus } =
        response[0];

      expect(receivedType).toBe('mandatory');
      expect(receivedStatus).toBe('PASS');
    });
    test('Case 5: Condition Type : "Compare and Mandatory" is Correct', () => {
      const listId = [53, 54];
      const objCon = listObjCondition.filter((word) =>
        listId.includes(word.mappingFieldID),
      );
      const received = validateFieldCondition(objCon, dataObject);
      const receivedCompare = received.find(
        (fieldValue) => fieldValue.mappingFieldID === 53,
      );
      const receivedMandatory = received.find(
        (fieldValue) => fieldValue.mappingFieldID === 54,
      );

      const { response: comp } = receivedCompare;
      expect(comp[0].conditionType).toBe('compare');
      expect(comp[0].status).toBe('PASS');

      const { response: comman } = receivedMandatory;
      expect(comman[0].conditionType).toBe('mandatory');
      expect(comman[0].status).toBe('PASS');
    });

    test('Case 6: Condition Type : "Lookup and Relation" is Correct', () => {
      const listId = [336, 338, 339, 34115];
      const objCon = listObjCondition.filter((word) =>
        listId.includes(word.mappingFieldID),
      );
      const received = validateFieldCondition(objCon, dataObject, listCompare);
      expect(received[0].response[0].conditionType).toBe('lookup_relation');
      expect(received[0].response[0].status).toBe('PASS');
      expect(received[1].response[0].conditionType).toBe('lookup_relation');
      expect(received[1].response[0].status).toBe('PASS');
      expect(received[2].response[0].conditionType).toBe('lookup_relation');
      expect(received[2].response[0].status).toBe('PASS');
      expect(received[3].response[0].conditionType).toBe('lookup_relation');
      expect(received[3].response[0].status).toBe('PASS');
    });

    test('Case 7: Condition Type : "Lookup and Relation" is Correct', () => {
      const _listCompare = {
        occupation_list: [],
        tcrb_mapping_account: {
          '22110303500000000002_77221103035000000002_3027538222035':
            '22110303500000000002_77221103035000000002_3027538222035',
        },
        processing_date: '',
        no_of_loan_1st: ['16', '17', '18'],
        no_of_loan_sub: ['2', '3', '4'],
      };

      const _listObjCondition = [
        {
          mappingFieldID: 57,
          condition: [
            {
              conditionType: 'lookup_account',
              mappingFieldID: [59, 58, 4],
              operator: 'EQUAL_TO',
              value: '01',
              expectedValue: 'tcrb_mapping_account',
              expectedOperator: 'NOT_EQUAL_TO',
              responseMsg: '1st ต้องไม่เจอ TRF',
            },
            {
              conditionType: 'lookup_account',
              mappingFieldID: [59, 58, 4],
              operator: 'EQUAL_TO',
              value: '02',
              expectedValue: 'tcrb_mapping_account',
              expectedOperator: 'EQUAL_TO',
              responseMsg: '2nd ต้องเจอ TRF',
            },
            {
              conditionType: 'lookup_date',
              mappingFieldID: [],
              operator: 'EQUAL_TO',
              value: '01',
              expectedValue: 'no_of_loan_1st',
              expectedOperator: 'EQUAL_TO',
              responseMsg: '1st ต้องเป็นวันที่ทำการ',
            },
            {
              conditionType: 'lookup_date',
              mappingFieldID: [],
              operator: 'EQUAL_TO',
              value: '02',
              expectedValue: 'no_of_loan_sub',
              expectedOperator: 'EQUAL_TO',
              responseMsg: '2st ต้องเป็นวันที่ทำการ',
            },
          ],
        },
      ];

      const arrDataObject = [
        [
          // 1st - reject
          {
            mappingFieldID: 4,
            field_id: 4,
            field_name: 'id',
            value: '3027538222035',
          },
          {
            mappingFieldID: 57,
            field_id: 57,
            field_name: 'no_of_loan',
            value: '01',
          },
          {
            mappingFieldID: 58,
            field_id: 58,
            field_name: 'acf_no',
            value: '77221103035000000002',
          },
          {
            mappingFieldID: 59,
            field_id: 59,
            field_name: 'app_id',
            value: '22110303500000000002',
          },
        ],
        [
          // 1st - pass
          {
            mappingFieldID: 4,
            field_id: 4,
            field_name: 'id',
            value: 'x',
          },
          {
            mappingFieldID: 57,
            field_id: 57,
            field_name: 'no_of_loan',
            value: '01',
          },
          {
            mappingFieldID: 58,
            field_id: 58,
            field_name: 'acf_no',
            value: 'x',
          },
          {
            mappingFieldID: 59,
            field_id: 59,
            field_name: 'app_id',
            value: 'x',
          },
        ],
        [
          // 2nd - reject
          {
            mappingFieldID: 4,
            field_id: 4,
            field_name: 'id',
            value: 'x',
          },
          {
            mappingFieldID: 57,
            field_id: 57,
            field_name: 'no_of_loan',
            value: '02',
          },
          {
            mappingFieldID: 58,
            field_id: 58,
            field_name: 'acf_no',
            value: 'x',
          },
          {
            mappingFieldID: 59,
            field_id: 59,
            field_name: 'app_id',
            value: 'x',
          },
        ],
        [
          // 2nd-pass
          {
            mappingFieldID: 4,
            field_id: 4,
            field_name: 'id',
            value: '3027538222035',
          },
          {
            mappingFieldID: 57,
            field_id: 57,
            field_name: 'no_of_loan',
            value: '02',
          },
          {
            mappingFieldID: 58,
            field_id: 58,
            field_name: 'acf_no',
            value: '77221103035000000002',
          },
          {
            mappingFieldID: 59,
            field_id: 59,
            field_name: 'app_id',
            value: '22110303500000000002',
          },
        ],
      ];

      const arrResult = arrDataObject.map((_dataObject, i) => {
        const newListCompare = { ..._listCompare };
        if (i === 1) {
          newListCompare.processing_date = '17';
        }
        if (i === 3) {
          newListCompare.processing_date = '03';
        }
        const result = validateFieldCondition(
          _listObjCondition,
          _dataObject,
          newListCompare,
        );
        return result;
      });
      expect(arrResult).toEqual([
        [
          {
            mappingFieldID: 57,
            response: [
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'FAILED',
                responseMsg: '1st ต้องไม่เจอ TRF',
              },
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'FAILED',
                responseMsg: '1st ต้องเป็นวันที่ทำการ',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'PASS',
              },
            ],
            field_id: 57,
            field_name: 'no_of_loan',
          },
        ],
        [
          {
            mappingFieldID: 57,
            response: [
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'PASS',
              },
            ],
            field_id: 57,
            field_name: 'no_of_loan',
          },
        ],
        [
          {
            mappingFieldID: 57,
            response: [
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'FAILED',
                responseMsg: '2nd ต้องเจอ TRF',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'FAILED',
                responseMsg: '2st ต้องเป็นวันที่ทำการ',
              },
            ],
            field_id: 57,
            field_name: 'no_of_loan',
          },
        ],
        [
          {
            mappingFieldID: 57,
            response: [
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_account',
                conditionMappingId: [59, 58, 4],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'PASS',
              },
              {
                conditionType: 'lookup_date',
                conditionMappingId: [],
                status: 'PASS',
              },
            ],
            field_id: 57,
            field_name: 'no_of_loan',
          },
        ],
      ]);
    });
  });
  //   describe('Validate error case', () => {
  //     const expected = false;

  //     test('Case 2: Invalid ID Wrong pattern', () => {
  //       expect(checkID('1101700230705')).toBe(expected);
  //     });

  //     test('Case 3: Invalid ID Less than 13 character', () => {
  //       expect(checkID('110170023073')).toBe(expected);
  //     });

  //     test('Case 4: Invalid ID Mixed character ', () => {
  //       expect(checkID('11017002070d3')).toBe(expected);
  //     });

  //     test('Case 5: Invalid ID Mixed character', () => {
  //       expect(checkID('rytege54fsfsf')).toBe(expected);
  //     });

  //     test('Case 6: Invalid ID Just 0', () => {
  //       expect(checkID('0')).toBe(expected);
  //     });

  //     test('Case 7: Invalid ID Special character', () => {
  //       expect(checkID('-')).toBe(expected);
  //     });

  //     test('Case 8: Invalid ID Blank character', () => {
  //       expect(checkID('')).toBe(expected);
  //     });

  //     test('Case 9: Invalid ID NULL', () => {
  //       expect(checkID(null)).toBe(expected);
  //     });

  //     test('Case 10: Invalid ID Only text character', () => {
  //       expect(checkID('blablabla')).toBe(false);
  //     });

  //     test('Case 11: Invalid ID Undefined input', () => {
  //       expect(checkID(undefined)).toBe(false);
  //     });
  //   });
});

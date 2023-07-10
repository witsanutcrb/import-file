/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable no-eval */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
const { momenttz } = require('../../moment');
const { operations, passOrNot } = require('../../constructor/enums');

const _eval = (dataValue, expectedOperator, expectedValue) => {
  if (
    dataValue === '' ||
    expectedValue === '' ||
    isNaN(Number(dataValue)) ||
    isNaN(Number(expectedValue))
  ) {
    return eval(
      `"${dataValue ?? ''}" ${operations[expectedOperator]} "${expectedValue}"`,
    );
  }
  return eval(
    `${dataValue ?? ''} ${operations[expectedOperator]} ${expectedValue}`,
  );
};
const checkDateRelation = (strDateA, operator, strDateB) => {
  try {
    const spacialCase = ['999999', '99999999'];
    let dA = 0;
    let dB = 0;
    const A99 = spacialCase.includes(strDateA);
    const B99 = spacialCase.includes(strDateB);

    if (!A99 && !B99) {
      dA = new Date(
        `${strDateA.substring(0, 4)}-${strDateA.substring(
          4,
          6,
        )}-${strDateA.substring(6, 8)}`,
      );
      if (!(dA instanceof Date)) throw new Error('Invalid Date');
      dB = new Date(
        `${strDateB.substring(0, 4)}-${strDateB.substring(
          4,
          6,
        )}-${strDateB.substring(6, 8)}`,
      );
      if (!(dB instanceof Date)) throw new Error('Invalid Date');

      dA = dA.getTime();
      dB = dB.getTime();
    } else {
      dA = parseInt(strDateA, 10);
      dB = parseInt(strDateB, 10);

      if (A99) dA = parseInt('999999999', 10);
      if (B99) dB = parseInt('999999999', 10);
    }

    return eval(dA + operator + dB);
  } catch (error) {
    console.error(error);
    return true;
  }
};
// const checkDateRelation = (strDateA, operator, strDateB) => {
//   try {
//     const spacialCase = ['999999', '99999999'];
//     let dA = 0;
//     let dB = 0;
//     const A99 = spacialCase.includes(strDateA);
//     const B99 = spacialCase.includes(strDateB);

//     if (!A99 && !B99) {
//       dA = new Date(
//         `${strDateA.substring(0, 4)}-${strDateA.substring(
//           4,
//           6,
//         )}-${strDateA.substring(6, 8)}`,
//       ).getTime();
//       if (!(dA instanceof Date)) throw new Error('Invalid Date');
//       dB = new Date(
//         `${strDateB.substring(0, 4)}-${strDateB.substring(
//           4,
//           6,
//         )}-${strDateB.substring(6, 8)}`,
//       ).getTime();
//       if (!(dB instanceof Date)) throw new Error('Invalid Date');
//     } else {
//       dA = parseInt(strDateA);
//       dB = parseInt(strDateB);

//       if (A99) dA = parseInt('999999999');
//       if (B99) dB = parseInt('999999999');
//     }

//     return eval(dA + operator + dB);
//   } catch (error) {
//     console.error(error);
//     return true;
//   }
// };

const checkCondition = (dataValue, condition, dataObject, listCompare) => {
  const { conditionType, value, operator, expectedValue, expectedOperator } =
    condition;

  let newDataValue = dataValue;
  if (!Number.isNaN(dataValue)) {
    newDataValue = Number(dataValue);
  }

  if (conditionType == 'maxvalue') {
    const maxValue = Math.max(
      ...condition.mappingFieldID.map(
        (x) =>
          dataObject.find(
            (conditionValue) => conditionValue.mappingFieldID == x,
          ).value || 0,
      ),
    );
    return _eval(maxValue, operator, dataValue);
    // return eval(`${maxValue} ${operations[operator]} ${newDataValue}`);
  }

  let newValue = value;
  if (!Number.isNaN(value)) {
    newValue = Number(value);
  }

  if (conditionType == 'mandatory') {
    const conditionValue = dataObject.find(
      (conditionValue) =>
        conditionValue.mappingFieldID == condition.mappingFieldID,
    ).value;
    if (conditionValue) {
      return dataValue != '';
    }
    return true;
  }

  if (conditionType == 'mandatory_group') {
    const { mappingFieldID, expectedOperator, expectedValue } = condition;
    const arrOperation = condition.operator.split(',');
    const arrValue = condition.value.split(',');

    const resultRelate = mappingFieldID.map((mapId, x) => {
      const operator = arrOperation[x];
      const value = arrValue[x];

      const { value: checkValue } = dataObject.find(
        (conditionValue) => conditionValue.mappingFieldID == mapId,
      );

      return _eval(value, operator, checkValue);
    });

    const lengthFalse = resultRelate.filter((isFalse) => {
      return isFalse == false;
    }).length;

    if (lengthFalse === 0) {
      return _eval(dataValue, expectedOperator, expectedValue);
    }
    return true;
  }

  if (conditionType == 'relation') {
    const resultRelate = dataObject
      .filter(
        (conditionValue) =>
          conditionType !== 'maxvalue' &&
          condition.mappingFieldID.includes(conditionValue.mappingFieldID),
      )
      .map((objR) => {
        const { value: conditionValue } = objR;

        let newConditionValue = conditionValue;
        if (!Number.isNaN(conditionValue)) {
          newConditionValue = Number(conditionValue);
        }
        return eval(`${newValue} ${operations[operator]} ${newConditionValue}`);
      });

    const lengFalse = resultRelate.filter((isFalse) => {
      return isFalse == false;
    }).length;

    // if (resultRelate.find((isFalse) => isFalse == false)) {
    if (lengFalse == 0) {
      if (
        dataValue === '' ||
        expectedValue === '' ||
        isNaN(Number(dataValue)) ||
        isNaN(Number(expectedValue))
      ) {
        return eval(
          `"${dataValue ?? ''}" ${
            operations[expectedOperator]
          } "${expectedValue}"`,
        );
      }
      return eval(
        `${newDataValue ?? ''} ${
          operations[expectedOperator]
        } ${expectedValue}`,
      );
    }

    return true;
  }

  if (conditionType == 'daterelation') {
    const { value: conditionValue } = dataObject.find(
      (conditionValue) =>
        conditionValue.mappingFieldID == condition.mappingFieldID,
    );
    return checkDateRelation(dataValue, operations[operator], conditionValue);
  }

  if (conditionType == 'compare') {
    const { value: conditionValue } = dataObject.find(
      (conditionValue) =>
        conditionType !== 'maxvalue' &&
        conditionValue.mappingFieldID == condition.mappingFieldID,
    );
    let newConditionValue = conditionValue;
    if (!Number.isNaN(conditionValue)) {
      newConditionValue = Number(conditionValue);
    }
    if (dataValue && conditionValue) {
      const res = eval(
        `${newDataValue} ${operations[operator]} ${newConditionValue}`,
      );
      return res;
    }
    return false;
  }
  if (conditionType == 'lookup_relation') {
    // const listMappingFieldID = condition.mappingFieldID;
    // listMappingFieldID.map((element, index) => {
    //   const conditionValue = dataObject.find(
    //     (conditionValue) => conditionValue.mappingFieldID == element,
    //   ).value;
    //   listMappingFieldID[index] = conditionValue;
    // });
    const listMappingFieldID = condition.mappingFieldID.map((element) => {
      return dataObject.find(
        (conditionValue) => conditionValue.mappingFieldID == element,
      ).value;
    });
    const valueForCheck = listMappingFieldID.join('_').replace('-', '_');

    const occList = listCompare[value];
    const occCheckList = [];
    // console.log(occList);
    occList.forEach((element) => {
      const expectedValueStart = condition.expectedValue.split(',');
      const expectedValue = expectedValueStart.map((expectedData) => {
        return element[expectedData];
      });
      // expectedValue.find((expectedData, expectedIndex) => {
      //   expectedValue[expectedIndex] = element[expectedData];
      //   // return expectedData == element[expectedData];
      // });
      occCheckList.push(expectedValue.join('_'));
    });
    // console.log('---occCheckList----', occCheckList);
    // console.log('valueForCheck', valueForCheck);
    // console.log('Is Exists', occCheckList.includes(valueForCheck));
    return occCheckList.includes(valueForCheck);
  }

  if (conditionType == 'lookup_account') {
    const res1 = _eval(dataValue, operator, value);
    if (res1) {
      const listMappingFieldID = condition.mappingFieldID.map((element) => {
        return dataObject.find(
          (conditionValue) => conditionValue.mappingFieldID == element,
        ).value;
      });
      const valueForCheck = listMappingFieldID.join('_').replace('-', '_');
      const occList = listCompare[expectedValue];
      const occCheckList = occList[valueForCheck];
      return _eval(valueForCheck, expectedOperator, occCheckList);
    }
    return true;
  }

  if (conditionType == 'lookup_date') {
    const res1 = _eval(dataValue, operator, value);
    if (res1) {
      const occList = listCompare.processing_date || momenttz().format('D');

      const arrExpect = listCompare[expectedValue];
      for (let index = 0; index < arrExpect.length; index++) {
        const expect = arrExpect[index];
        const result = _eval(occList, expectedOperator, expect);
        if (result) return true;
      }
      return false;
    }
    return true;
  }

  if (conditionType == 'date_compare_current') {
    const { format } = dataObject.find(
      (conditionValue) =>
        conditionValue.mappingFieldID == condition.mappingFieldID,
    );
    const newConditionValue = momenttz().format(format);
    if (dataValue && newConditionValue) {
      const res = eval(
        `${newDataValue} ${operations[operator]} ${newConditionValue}`,
      );
      return res;
    }
    return false;
  }

  if (conditionType == 'text_relation') {
    const resultRelate = dataObject
      .filter((conditionValue) =>
        condition.mappingFieldID.includes(conditionValue.mappingFieldID),
      )
      .map((objR) => {
        const { value: conditionValue } = objR;
        const newConditionValue = conditionValue;
        return eval(
          `'${value}' ${operations[operator]} '${newConditionValue}'`,
        );
      });

    const lengFalse = resultRelate.filter((isFalse) => {
      return isFalse == false;
    }).length;

    if (lengFalse == 0) {
      if (
        dataValue === '' ||
        expectedValue === '' ||
        isNaN(Number(dataValue)) ||
        isNaN(Number(expectedValue))
      ) {
        return eval(
          `"${dataValue ?? ''}" ${
            operations[expectedOperator]
          } "${expectedValue}"`,
        );
      }
      return eval(
        `${newDataValue ?? ''} ${
          operations[expectedOperator]
        } ${expectedValue}`,
      );
    }

    return true;
  }
};

const validateFieldCondition = (listObjCondition, dataObject, listCompare) => {
  const response = [];
  if (listObjCondition) {
    for (let indexx = 0; indexx < listObjCondition.length; indexx++) {
      const result = {};
      const element = listObjCondition[indexx];
      const {
        field_id,
        field_name,
        value: dataValue,
      } = dataObject.find(
        (fieldValue) => fieldValue.mappingFieldID == element.mappingFieldID,
      );
      const conditions = element.condition;

      for (let index = 0; index < conditions.length; index++) {
        let skipFlag = false;
        if (Object.keys(result).length != 0) {
          const mandaObj = result.response.filter(
            (x) => x.conditionType === 'mandatory',
          );
          if (mandaObj.length > 0) {
            const mandatoryValue = dataObject.find(
              (conditionValue) =>
                conditionValue.mappingFieldID == mandaObj[0].conditionMappingId,
            ).value;
            if (
              (mandaObj[0].status == passOrNot.pass && !mandatoryValue) ||
              mandaObj[0].status == passOrNot.failed
            ) {
              skipFlag = true;
            }
          }
        }

        if (!skipFlag) {
          const condition = conditions[index];
          if (!checkCondition(dataValue, condition, dataObject, listCompare)) {
            result.mappingFieldID = element.mappingFieldID;
            const objResponse = {};
            objResponse.conditionType = condition.conditionType;
            objResponse.conditionMappingId = condition.mappingFieldID;
            objResponse.status = passOrNot.failed;
            objResponse.responseMsg = condition.responseMsg;
            if (result.response) {
              result.response.push(objResponse);
            } else {
              result.response = [objResponse];
            }
          } else {
            result.mappingFieldID = element.mappingFieldID;
            const objResponse = {};
            objResponse.conditionType = condition.conditionType;
            objResponse.conditionMappingId = condition.mappingFieldID;
            objResponse.status = passOrNot.pass;
            if (result.response) {
              result.response.push(objResponse);
            } else {
              result.response = [objResponse];
            }
          }
        }
      }
      result.field_id = field_id;
      result.field_name = field_name;
      if (Object.keys(result).length != 0) {
        response.push(result);
      }
    }
  }
  // console.log('response', JSON.stringify(response));
  return response;
};
module.exports = { validateFieldCondition };

// {
//     mappingFieldID: 37,  //ID จาก Table Mapping Field
//     condition: [ // Array list ของเงื่อนไข
//       {
//         conditionType: 'relation', //Type ของ Condition
//         mappingFieldID: 36,  // Mapping Field ID ที่ต้องการนำมาทำ Condition
//         operator: 'EQUAL_TO', // Operation ใช้ใน relation และ Compare
//         value: '01',  // ใช้กำหนดค่าของเงื่อนไขใน relation
//         expectedValue: '', //ใช้เป็นเงื่อนไขตรวจสอบของ relation
//         responseMsg: 'When Employment Type = 01, This field needs to be blank.',  // response message
//       },
//     ],
//   },

// const listCompare = {
//   occupation_list: [
//     {
//       tcrb_code: '17',
//       mapping_code: '0787400112',
//       employment_type: '02',
//       business_sector: '0787500011',
//       occupation_index: '02',
//     },
//     {
//       tcrb_code: '17',
//       mapping_code: '0787400112',
//       employment_type: '02',
//       business_sector: '0787500011',
//       occupation_index: '03',
//     },
//     {
//       tcrb_code: '25',
//       mapping_code: '0787400112',
//       employment_type: '02',
//       business_sector: '0787500005',
//       occupation_index: '14',
//     },
//     {
//       tcrb_code: '25',
//       mapping_code: '0787400112',
//       employment_type: '01',
//       business_sector: '0787500005',
//       occupation_index: '20',
//     },
//   ],
// };
// const listObjCondition = [
//   {
//     mappingFieldID: 36,
//     condition: [
//       {
//         conditionType: 'lookup_relation',
//         mappingFieldID: [36, 38, 39, 4115],
//         operator: 'EQUAL_TO',
//         value: 'occupation_list',
//         expectedValue:
//           'employment_type,tcrb_code,mapping_code,business_sector,occupation_index',
//         responseMsg: 'Occupation Fields is not Relate or Data out of bound',
//       },
//     ],
//   },
//   {
//     mappingFieldID: 38,
//     condition: [
//       {
//         conditionType: 'lookup_relation',
//         mappingFieldID: [36, 38, 39, 4115],
//         operator: 'EQUAL_TO',
//         value: 'occupation_list',
//         expectedValue:
//           'employment_type,tcrb_code,mapping_code,business_sector,occupation_index',
//         responseMsg: 'Occupation Fields is not Relate or Data out of bound',
//       },
//     ],
//   },
//   {
//     mappingFieldID: 39,
//     condition: [
//       {
//         conditionType: 'lookup_relation',
//         mappingFieldID: [36, 38, 39, 4115],
//         operator: 'EQUAL_TO',
//         value: 'occupation_list',
//         expectedValue:
//           'employment_type,tcrb_code,mapping_code,business_sector,occupation_index',
//         responseMsg: 'Occupation Fields is not Relate or Data out of bound',
//       },
//     ],
//   },
//   {
//     mappingFieldID: 4115,
//     condition: [
//       {
//         conditionType: 'lookup_relation',
//         mappingFieldID: [36, 38, 39, 4115],
//         operator: 'EQUAL_TO',
//         value: 'occupation_list',
//         expectedValue:
//           'employment_type,tcrb_code,mapping_code,business_sector,occupation_index',
//         responseMsg: 'Occupation Fields is not Relate or Data out of bound',
//       },
//     ],
//   },
// ];
// const dataObject = [
//   {
//     mappingFieldID: 36,
//     field_name: 'employment type',
//     value: '01',
//   },
//   {
//     mappingFieldID: 38,
//     field_name: 'occupation',
//     value: '25-0787400112',
//   },
//   {
//     mappingFieldID: 39,
//     field_name: 'busness sector',
//     value: '0787500005',
//   },
//   {
//     mappingFieldID: 4115,
//     field_name: 'occupation index',
//     value: '20',
//   },
// ];
// const result = validateFieldCondition(
//   listObjCondition,
//   dataObject,
//   listCompare,
// );
// result.forEach((element) => {
//   // console.log(element);
// });

const _listObjCondition = [
  {
    mappingFieldID: 1006,
    condition: [
      {
        conditionType: 'mandatory_group',
        mappingFieldID: [1016, 1019],
        operator: 'EQUAL_TO,EQUAL_TO',
        value: 'Y,RVP',
        expectedOperator: 'NOT_EQUAL_TO',
        expectedValue: '',
        responseMsg: 'When reverse repayment This field is mandatory',
      },
    ],
  },
];

// mandatory group
// const mapping = [
//   {
//     mappingFieldID: 1016,
//     field_id: 1016,
//     field_name: 'flg',
//     value: '',
//   },
//   {
//     mappingFieldID: 1019,
//     field_id: 1019,
//     field_name: 'type',
//     value: '',
//   },
//   {
//     mappingFieldID: 1006,
//     field_id: 1006,
//     field_name: 'date',
//     value: '20000',
//   },
// ];

// const result = validateFieldCondition(_listObjCondition, mapping, {});
// console.log('🚀 ~ file: field-condition.test.js:545 ~ test ~ result', result);
// result.forEach((t) => {
//   console.log(t);
// });

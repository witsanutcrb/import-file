/* eslint-disable no-param-reassign */
const {
  validateResponseMessage,
} = require('../../lib/response-message/responseMessage');

const checkSystemValidate = ({
  system_validate_result,
  responseMessage,
  systemReason,
  checkResultcode,
  resultCode,
  fieldMaster,
  mergeResult,
}) => {
  const system = {};
  const { validate_field_result } = system_validate_result;
  for (let i = 0; i < validate_field_result.length; i += 1) {
    const field_detail = validate_field_result[i];
    const newResult = {};
    const { field_id, field_name, result, field_condition_result } =
      field_detail;

    if (result) {
      const result_arr = Object.entries(result);
      for (let index = 0; index < result_arr.length; index += 1) {
        const rule = result_arr[index];
        const rule_key = Object.values(rule)[0];
        const rule_result = validateResponseMessage(rule_key, responseMessage);
        newResult[rule_key] = rule_result;
        system.message = 'Data Validation is not pass.';
        system.reason_code = systemReason.reason_code;
        checkResultcode.result = resultCode.failed;
      }
    }
    // update field condition
    if (field_condition_result) {
      const field_condition_arr = Object.entries(field_condition_result);
      for (let index = 0; index < field_condition_arr.length; index += 1) {
        const rule = field_condition_arr[index];
        const rule_key = Object.values(rule)[0];
        const rule_result = field_condition_result[rule_key];

        newResult[rule_key] = rule_result;
        system.message = 'Data Validation is not pass.';
        system.reason_code = systemReason.reason_code;
        checkResultcode.result = resultCode.failed;
      }
    }

    system[field_name] = {
      field_name,
      description: fieldMaster[field_id] || field_name,
      result: newResult,
    };
  }

  if (Object.keys(system).length > 0) {
    mergeResult.System = system;
  }
};
const checkCompareColumn = ({
  system_validate_result,
  resultCode,
  mergeResult,
  responseMessage,
  checkResultcode,
}) => {
  if (system_validate_result.compare_column === resultCode.failed) {
    mergeResult.compare_column = {
      message: validateResponseMessage(
        'compare_column_reason',
        responseMessage,
      ),
    };
    checkResultcode.result = resultCode.failed;
  }
};
const checkDuplicate = ({
  duplicated_flag,
  mergeResult,
  responseMessage,
  checkResultcode,
  systemReason,
  resultCode,
}) => {
  if (duplicated_flag === 'Y') {
    mergeResult.duplicate = {
      message: validateResponseMessage('duplicated', responseMessage),
      display: 'Duplicated',
    };
    mergeResult.duplicate.reason_code = systemReason.reason_code;
    checkResultcode.result = resultCode.failed;
  }
};
const generateReason = async ({
  system_validate_result,
  duplicated_flag,
  fieldMaster,
  responseMessage,
}) => {
  const mergeResult = {};
  const resultCode = { pass: 'PASS', failed: 'FAILED' };
  const systemReason = { reason_code: '08' };
  const checkResultcode = { result: resultCode.pass };

  if (Object.keys(system_validate_result).length > 0) {
    const { validate_field_result } = system_validate_result;
    if (validate_field_result) {
      checkSystemValidate({
        system_validate_result,
        responseMessage,
        systemReason,
        checkResultcode,
        resultCode,
        fieldMaster,
        mergeResult,
      });
    }
  }

  checkDuplicate({
    duplicated_flag,
    mergeResult,
    responseMessage,
    checkResultcode,
    systemReason,
    resultCode,
  });

  checkCompareColumn({
    system_validate_result,
    resultCode,
    mergeResult,
    responseMessage,
    checkResultcode,
  });

  return { mergeResult, checkResultcode: checkResultcode.result };
};

module.exports = { generateReason };

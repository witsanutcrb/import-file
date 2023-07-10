const configValidateMsg = {
  mandatory: 'E9018',
  default: 'E9019',
  length: 'E9020',
  email_format: 'E9021',
  date_format: 'E9022',
  duplicated: 'E9031',
  compare_column: 'E9017',
  relation: 'E9039',
  data_boundary: 'E9030',
  numeric: 'E9026',
  input_th: 'E9027',
  input_en: 'E9028',
  input_number: 'E9029',
  id_card: 'E9023',
  tel_no: 'E9024',
  fix_length: 'E9025',
  compare_column_reason: 'E9043',
  relation_trf: 'E9039',
  relation_trf_dd: 'E9040',
  relation_trf_file: 'E9044',
  character: 'E9045',
  reject_customer: 'E9046',
  reject_account: 'E9047',
  mapping_account: 'E9049',
};

const validateResponseMessage = (key, responseMessage) => {
  const errorCode = configValidateMsg[key];
  const errorMessage = responseMessage[errorCode]?.business_message_en;
  if (!errorCode || !errorMessage) return key;
  return errorMessage;
};

module.exports = { validateResponseMessage };

const moment = require('moment');
const { passOrNot, lookupType } = require('../../../constructor/enums');
const { lookup } = require('../../lookup/lookup-field');

const {
  thaiValidator,
  engValidator,
  mobileNumberValidator,
  isNumericValidator,
  numberValidator,
  characterValidator,
  nameEnValidator,
} = require('../word-validation');

const { checkID } = require('../id-card-validation/idcardService');

const fixLengthValidator = (value, size) => {
  if (value === '') return true;
  const sizeInt = parseInt(size, 10);
  if (
    !value ||
    !sizeInt ||
    typeof value !== 'string' ||
    typeof sizeInt !== 'number'
  )
    return false;
  if (value.length === sizeInt) return true;
  return false;
};

const emailValidator = (emailToValidate) => {
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegexp.test(emailToValidate);
};

const dateValidator = ({ format, value }) => {
  if (value === '999999' || value === '99999999') {
    return true;
  }
  return moment(value, format, true).isValid();
};

const checkDefaultValue = ({ default_value, value }) => {
  // console.log('checkDefaultValue : ', default_value === value);
  return default_value === value;
};

const decimalValidator = ({ format, value }) => {
  if (Number.isNaN(Number(value))) return false;
  const splitFormat = format.split('.');
  const splitValue = value.split('.');
  if (splitValue.length <= 1 || splitFormat.length <= 1) return false;
  return splitFormat[1].length === splitValue[1].length;
};

const validate = async (obj_field, master, province) => {
  const res = {};
  const result = {};
  const objValidation = {};
  res.field_id = obj_field.field_id;
  res.field_name = obj_field.field_name;

  // get validation type
  if (obj_field.validation.length > 0) {
    const { validation } = obj_field;
    try {
      validation.forEach((validateType) => {
        objValidation[validateType] = validateType;
      });
    } catch (error) {}
  }

  // 1.mandatory
  if (obj_field.mandatory === 'Y' && obj_field.original_value === '') {
    result.mandatory = passOrNot.failed;
    // return { ...res, result: { mandatory: passOrNot.failed } };
  }

  // 2.length
  if (objValidation.length && obj_field.original_value !== '') {
    if (obj_field.original_value.length > obj_field.src_length) {
      result.length = passOrNot.failed;
      // return {
      //   ...res,
      //   result: { length: passOrNot.failed },
      // };
    }
  }

  // 3.default
  if (
    obj_field.mandatory === 'Y' &&
    obj_field.default &&
    !checkDefaultValue({
      default_value: obj_field.default,
      value: obj_field.value,
    })
  ) {
    result.default = passOrNot.failed;
    // return { ...res, result: { default: passOrNot.failed } };
  }

  if (obj_field.original_value !== '') {
    // 4.validate Data Format
    //    1.Email
    if (objValidation.email) {
      if (!emailValidator(obj_field.value)) {
        result.email_format = passOrNot.failed;
        // return { ...res, result: { email_format: passOrNot.failed } };
      }
    }
    //    2.Date
    if (objValidation.date) {
      if (
        !dateValidator({
          format: obj_field.src_format,
          value: obj_field.value,
        })
      ) {
        result.date_format = passOrNot.failed;
        // return { ...res, result: { date_format: passOrNot.failed } };
      }
    }
    //    3.ID Card
    if (objValidation.id_card) {
      if (!checkID(obj_field.value)) {
        result.id_card = passOrNot.failed;
        // return { ...res, result: { id_card: passOrNot.failed } };
      }
    }
    //    4.Phone Number
    if (objValidation.tel_no) {
      if (!mobileNumberValidator(obj_field.value)) {
        result.tel_no = passOrNot.failed;
        // return { ...res, result: { tel_no: passOrNot.failed } };
      }
    }
    //    5.Fix Length
    if (objValidation.fix_length) {
      if (!fixLengthValidator(obj_field.original_value, obj_field.src_length)) {
        result.fix_length = passOrNot.failed;
        // return { ...res, result: { fix_length: passOrNot.failed } };
      }
    }
    //    6.decimal
    if (objValidation.decimal) {
      if (
        !decimalValidator({
          format: obj_field.src_format,
          value: obj_field.value,
        })
      ) {
        result.number_format = passOrNot.failed;
        // return { ...res, result: { number_format: passOrNot.failed } };
      }
    }

    // 5.validate Input Type
    //    1.Numeric
    if (objValidation.numeric) {
      if (!isNumericValidator(obj_field.value)) {
        result.numeric = passOrNot.failed;
        // return { ...res, result: { numeric: passOrNot.failed } };
      }
    }
    //    2.Number
    if (objValidation.input_number) {
      if (!numberValidator(obj_field.value)) {
        result.input_number = passOrNot.failed;
        // return { ...res, result: { input_number: passOrNot.failed } };
      }
    }
    //    3.TH
    if (objValidation.input_th) {
      if (!thaiValidator(obj_field.value)) {
        result.input_th = passOrNot.failed;
        // return { ...res, result: { input_th: passOrNot.failed } };
      }
    }

    //    4.EN
    if (objValidation.input_en) {
      if (nameEnValidator(obj_field.value)) {
        result.input_en = passOrNot.failed;
        // return { ...res, result: { input_en: passOrNot.failed } };
      }
    }

    // 6.Data Boundary

    if (obj_field.lookup_flg === 'V') {
      const { lookup_type } = obj_field;
      for (let i = 0; i < JSON.parse(lookup_type).length; i += 1) {
        const lookup_item = JSON.parse(lookup_type)[i];
        const lookup_data_value = lookup(
          lookup_item,
          obj_field.value,
          master[lookup_item.value],
        );
        const resultValidate = lookup_data_value[lookup_item.type];
        if (!resultValidate) {
          result[lookup_item.type] = passOrNot.failed;
          // return { ...res, result: { [lookup_item.type]: passOrNot.failed } };
        }
      }
    }

    // 7.Province
    if (obj_field.lookup_flg === 'Y') {
      if (obj_field.lookup_type === lookupType.province) {
        const lookup_data_value = lookup(
          lookupType[obj_field.lookup_type],
          obj_field.value,
          province,
        );
        const value_for_check = lookup_data_value[obj_field.lookup_type];
        if (!value_for_check) {
          result.data_boundary = passOrNot.failed;
          // return { ...res, result: { data_boundary: passOrNot.failed } };
        }
      }
    }
    // 8.Charecter
    if (objValidation.character) {
      if (!characterValidator(obj_field.value)) {
        result.character = passOrNot.failed;
        // return { ...res, result: { character: passOrNot.failed } };
      }
    }
  }

  res.result = result;
  return res;
};

module.exports = { validate };

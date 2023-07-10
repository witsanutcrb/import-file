const moment = require('moment');
const { lookupType } = require('../../constructor/enums');

const lookupSplitDate = (value, destConfig) => {
  const format = destConfig.src_format;
  const newData = moment(value, format).format('DD');
  return newData || value;
};
const lookupMerital = (value, compareValue) => {
  try {
    return compareValue[value];
  } catch (error) {
    return value;
  }
};
const lookupProvince = (value, compareValue) => {
  try {
    return compareValue[value];
  } catch (error) {
    return value;
  }
};
const lookupAddress = (value, compareValue) => {
  try {
    return compareValue[value];
  } catch (error) {
    return value;
  }
};

const lookupCompare = (value, compareValue) => {
  try {
    return compareValue[value];
  } catch (error) {
    return value;
  }
};

const lookup = (lookup_type_obj, value, compareValue, destConfig) => {
  const result = {};
  const lookup_type = lookup_type_obj.type || lookup_type_obj;

  switch (lookup_type) {
    case lookupType.data_boundary:
      result[lookupType.data_boundary] = lookupCompare(value, compareValue);
      result.value = lookupCompare(value, compareValue);
      result.lookupType = lookup_type;
      break;
    case lookupType.state:
      result.value = lookupProvince(value, compareValue);
      result.lookupType = lookup_type;
      break;
    case lookupType.province:
      // operation-rule
      result[lookupType.province] = lookupProvince(value, compareValue);
      break;
    case lookupType.marital_status:
      result[lookupType.marital_status] = lookupMerital(value, compareValue);
      result.value = lookupMerital(value, compareValue);
      result.lookupType = lookup_type;
      break;
    case lookupType.split_date:
      result[lookupType.split_date] = lookupSplitDate(value, destConfig);
      result.value = lookupSplitDate(value, destConfig);
      result.lookupType = lookup_type;
      break;
    case lookupType.address_type:
      result[lookupType.address_type] = lookupAddress(value, compareValue);
      result.value = lookupAddress(value, compareValue);
      result.lookupType = lookup_type;
      break;
    case lookupType.product_code:
      result[lookupType.product_code] = lookupCompare(value, compareValue);
      result.value = lookupCompare(value, compareValue);
      result.lookupType = lookup_type;
      break;
    case lookupType.facility_code:
      result[lookupType.facility_code] = lookupCompare(value, compareValue);
      result.value = lookupCompare(value, compareValue);
      result.lookupType = lookup_type;
      break;
    case lookupType.substring:
      result[lookupType.substring] = value.substring(
        lookup_type_obj.value[0],
        lookup_type_obj.value[1],
      );
      result.value = value.substring(
        lookup_type_obj.value[0],
        lookup_type_obj.value[1],
      );
      result.lookupType = lookup_type;
      break;
    case lookupType.slice:
      result[lookupType.slice] = value.slice(lookup_type_obj.value);
      result.value = value.slice(lookup_type_obj.value);
      result.lookupType = lookup_type;
      break;
    case lookupType.no_of_loan:
      result[lookupType.no_of_loan] = lookupCompare(value, compareValue);
      result.value = lookupCompare(value, compareValue);
      result.lookupType = lookup_type;
      break;
    case lookupType.split_field:
      result[lookupType.split_field] = value.split(lookup_type_obj.delimeter)[
        lookup_type_obj.value
      ];
      result.value = value.split(lookup_type_obj.delimeter)[
        lookup_type_obj.value
      ];
      result.lookupType = lookup_type;
      break;
    default:
      result.value = value;
      break;
  }
  return result;
};

module.exports = { lookup };

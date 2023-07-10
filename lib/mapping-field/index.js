/* eslint-disable no-param-reassign */
const moment = require('moment');
const mathjs = require('mathjs');
const R = require('rambda');
const { parse } = require('csv-parse');

const { passOrNot } = require('../../constructor/enums');
const { convertDetailField } = require('./convertDetailField');

const converter = (value, srcType, destType) => {
  let res = value;
  if (destType.includes('decimal')) {
    if (value === '') res = '0';
    const reg = /^\d+$/;
    if (!reg.test(res)) return res;
    const arType = destType.split(',');
    const digit = arType[2];
    const divideBy = mathjs.pow(10, digit);
    if (R.isEmpty(value) || R.isNil(value)) {
      value = '0';
    }
    res = mathjs.divide(mathjs.bignumber(value), divideBy);
    if (Number.isNaN(res)) {
      res = value;
    } else {
      res = mathjs.format(res, { notation: 'fixed', precision: 2 });
    }
  } else if (value && !(value === '') && destType.includes('integer')) {
    if (value === '') res = '0';
    const reg = /^\d+$/;
    if (!reg.test(res)) return res;
    res = Number(value);
    if (Number.isNaN(res)) {
      res = value;
    } else {
      res = res.toString();
    }
  }
  return res;
};

const dateConvertorFormat = (format) => {
  return moment().format(format);
};

const genValueThenNull = (value, defaultValue, validation, format) => {
  const res = { removeDefault: false, valueGen: value };
  if (
    defaultValue &&
    validation &&
    validation.includes('if_null_then_default')
  ) {
    res.removeDefault = true;
    if ((!value || value.trim().length === 0) && defaultValue === 'now') {
      res.valueGen = dateConvertorFormat(format);
    } else if (!value || value.trim().length === 0) {
      res.valueGen = defaultValue;
    }
  }
  return res;
};

const compareColumn = async (arrRowData, detail_field) => {
  return arrRowData.length === detail_field.length;
};

const splitCsv = async ({ rowData, delimeter }) => {
  return new Promise((resolve) => {
    const input = rowData;
    parse(
      input,
      {
        delimiter: delimeter || ',',
      },
      (err, records) => {
        resolve(records[0]);
      },
    );
  });
};
const splitValue = async ({ rowData, delimeter, splitType }) => {
  if (splitType === 'CSV') {
    const result = await splitCsv({ rowData, delimeter });
    return result;
  }
  return rowData.split(delimeter);
};
const mapping_field = async (arrRowData, mf) => {
  const detail_field = convertDetailField(mf);
  const new_mapping_field = [];
  const mapping_field_name = {};
  const res = {};
  if (await compareColumn(arrRowData, detail_field)) {
    detail_field.map((element, index) => {
      const { removeDefault, valueGen } = genValueThenNull(
        arrRowData[index],
        element.default,
        element.validation,
        element.src_format,
      );
      const new_value = converter(
        // arrRowData[index],
        valueGen,
        element.src_type,
        element.dest_field_type || '',
      );
      // element.original_value = arrRowData[index];
      element.original_value = valueGen;
      element.value = new_value;
      if (removeDefault) element.default = null;
      new_mapping_field.push(element);
      mapping_field_name[element.dest_field_name] = new_value;
      return element;
    });
    res.compare_column = passOrNot.pass;
    res.mapping_field = new_mapping_field;
    res.mapping_field_name = mapping_field_name;
  } else {
    res.compare_column = passOrNot.failed;
  }
  return res;
};

module.exports = { mapping_field };

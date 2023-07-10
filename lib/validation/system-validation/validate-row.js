/* eslint-disable no-param-reassign */
const createKey = (ar_field_mapping) => {
  let key_dup = '';
  ar_field_mapping.forEach((obj_field) => {
    if (obj_field.is_pk === 'Y') {
      if (!key_dup) {
        key_dup += obj_field.value;
      } else {
        key_dup += `_${obj_field.value}`;
      }
    }
  });
  return key_dup;
};

const checkDuplicate = (ar_field_mapping, obj_check_dup_key) => {
  const key_dup = createKey(ar_field_mapping);
  let is_duplicated = 'N';
  const res = {};
  if (key_dup !== '') {
    if (obj_check_dup_key[key_dup]) {
      is_duplicated = 'Y';
    } else {
      obj_check_dup_key[key_dup] = obj_check_dup_key[key_dup]
        ? (obj_check_dup_key[key_dup] += 1)
        : 1;
    }
  }
  res.duplicated = is_duplicated;
  res.key_dup = key_dup;
  return res;
};

module.exports = { checkDuplicate };

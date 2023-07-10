const convertDetailField = (data) => {
  return data.map((mf) => {
    let mandatory = '';
    if (mf.mandatory) {
      mandatory = mf.mandatory;
    } else if (mf.is_mandatory === 'Y') {
      mandatory = mf.is_mandatory;
    } else {
      mandatory = 'N';
    }

    return {
      ...mf,
      index: !(mf.index === null || mf.index === undefined)
        ? mf.index
        : mf.src_index,
      field_name: mf.field_name || mf.src_name || null,
      mandatory,
      format: mf.format || mf.src_format || null,
      data_type: mf.data_type || mf.src_type || null,
      default: mf.default || mf.default_value || null,
      mappingFieldID: mf.mappingFieldID || mf.id || null,
      // dest_field_name: mf.dest_field_name,
      // dest_field_type: mf.dest_field_type,
      // is_mandatory,
      // field_id: mf.field_id,
      // validation: mf.validation,
      // is_pk: mf.is_pk,
      // src_length: mf.src_length,
      // src_format: mf.src_format,
      // encrypt_flg: mf.encrypt_flg,
      // lookup_flg: mf.lookup_flg,
      // lookup_type: mf.lookup_type,
      // field_condition: mf.field_condition,
    };
  });
};

module.exports = { convertDetailField };

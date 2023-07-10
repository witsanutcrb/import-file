const statuses = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  rejected: 'REJECTED',
  pending: 'PENDING',
  draft: 'DRAFT',
  pass: 'PASS',
  failed: 'FAILED',
};
const allStatuses = Object.values(statuses);

const defaultValue = {
  actionTime: 'now()',
  actionBy: 'System',
};
const resultStatusCode = {
  complete: 'complete',
  processing: 'processing',
  error: 'error',
};

const passOrNot = {
  pass: 'PASS',
  failed: 'FAILED',
};

const lookupType = {
  province: 'province',
  marital_status: 'marital_status',
  system_date: 'system_date',
  split_date: 'split_date',
  state: 'state',
  zip: 'zip',
  password: 'password',
  address_type: 'address_type',
  substring: 'substring',
  slice: 'slice',
  product_code: 'product_code',
  facility_code: 'facility_code',
  data_boundary: 'data_boundary',
  split_field: 'split_field',
};

module.exports = {
  statuses,
  allStatuses,
  defaultValue,
  resultStatusCode,
  passOrNot,
  lookupType,
};

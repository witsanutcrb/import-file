const responseCode = {
  E9001: 'E9001', //	File Validate	The Name of input data file is incorrect.
  E9002: 'E9002', //	File Validate	The hash content of the input data file with SHA256 is incorrect.
  E9003: 'E9003', //	File Validate	Can not decryption file.
  E9004: 'E9004', //	File Validate	Processing Date is match with header and tailer.
  E9005: 'E9005', //	File Validate	Chanel code is not match.
  E9006: 'E9006', //	File Validate	Round number is match with header and tailer.
  E9007: 'E9007', //	File Validate	ข้อนี้ น่าจะตกที่ defalut ของ header record
  E9008: 'E9008', //	File Validate	Processing Date is not now
  E9009: 'E9009', //	File Validate	Today is not in processing due diligence date.
  E9010: 'E9010', //	File Validate	ยังไม่มี
  E9011: 'E9011', //	File Validate	ยังไม่มี
  E9012: 'E9012', //	File Validate	Round number format is incorrect.
  E9013: 'E9013', //	File Validate	The number of total data record of the input data file is incorrect.
  E9014: 'E9014', //	File Validate	Header record or footer record is validation system is reject.
  E9015: 'E9015', //	File Validate
  E9016: 'E9016', //	File Validate
  E9041: 'E9041', //	File Validate	File Name  is already exists.
  E9042: 'E9042', //	File Validate
};

module.exports = { responseCode };

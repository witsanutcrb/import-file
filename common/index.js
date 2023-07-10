const { runEcsTask } = require('./src/callEcs');
const { responseCode } = require('./src/responseCode');
const { checkRawData } = require('./src/checkRawData');
const { generateReason } = require('./src/generateReason');

const logFunction = (context) => {
  if (context) {
    console.log(`Lamda Function Name : ${context.functionName}`);
  }
};
const convertFileNameToObject = (fileName) => {
  const arrFileName = fileName.split('_');
  const arrFileNameData = fileName.split('_');
  const arrFileType = arrFileName[6].split('.');
  arrFileType.shift();
  const fileType = arrFileType.join('.');
  arrFileNameData.shift();
  const fileNameData = arrFileNameData.join('_');
  return {
    ctrl: arrFileName[0],
    partnerCode: arrFileName[1],
    bankCode: arrFileName[2],
    topic: `${arrFileName[3]}_${arrFileName[4]}`,
    processDate: arrFileName[5],
    processTime: arrFileName[6].split('.')[0],
    fileType,
    fileNameCtrl: fileName,
    fileNameData : fileNameData.replace('txt' , 'csv'),
  };
};

module.exports = {
  logFunction,
  convertFileNameToObject,
  runEcsTask,
  responseCode,
  checkRawData,
  generateReason,
};

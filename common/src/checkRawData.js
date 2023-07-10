const pad = (arr, x) => Array.from({ length: x }, (_, i) => arr[i] ?? '');

const checkRawData = (arrData, len) => {
  const arr = arrData;
  if (arr.length < len) {
    const newArr = pad(arr, len);
    return newArr;
  }
  if (arr.length > len) {
    const newArr = arr.slice(0, len);
    return newArr;
  }
  return arrData;
};

module.exports = { checkRawData };

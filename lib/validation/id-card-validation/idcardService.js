const checkID = (id) => {
  if (id == null || id.length !== 13 || !/^[0-9]\d+$/.test(id)) return !1;
  let i;
  let sum = 0;
  for (i = 0, sum = 0; i < 12; i += 1) {
    sum += parseInt(id.charAt(i), 10) * (13 - i);
  }
  const check = (11 - (sum % 11)) % 10;
  if (check === parseInt(id.charAt(12), 10)) {
    return !0;
  }
  return !1;
};

module.exports = { checkID };

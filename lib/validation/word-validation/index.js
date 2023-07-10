const paramIsTrue = (param) => {
  if (param === false || param === undefined || param === null) return false;

  return true;
};
const thaiValidator = (thaiToValidate) => {
  if (thaiToValidate === '') return true;
  if (!paramIsTrue(thaiToValidate)) return false;
  const Regexp =
    // eslint-disable-next-line no-misleading-character-class
    /^[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์.\s]+$/;
  return Regexp.test(thaiToValidate);
};

// const thaiValidator = (thaiToValidate) => {
//   const Regexp = /^[\u0E00-\u0E7F.\s]*$/;
//   return Regexp.test(thaiToValidate);
// };

const engValidator = (engToValidate) => {
  if (engToValidate === '') return true;
  if (!paramIsTrue(engToValidate)) return false;
  const Regexp = /^[a-zA-Z.\s]*$/;
  return Regexp.test(engToValidate);
};

// const numberValidator = (numberToValidate) => {
//   const Regexp = /^[0-9.]*$/;
//   return Regexp.test(numberToValidate);
// };
const numberValidator = (input_number) => {
  if (input_number === '') return true;
  if (!paramIsTrue(input_number)) return false;
  const number = Number(input_number);
  if (Number.isNaN(number)) {
    return false;
  }
  return true;
};

const numberAndThaiValidator = (engToValidate) => {
  if (engToValidate === '') return true;
  if (!paramIsTrue(engToValidate)) return false;
  const Regexp =
    // eslint-disable-next-line no-misleading-character-class
    /^[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์.\s0-9]+$/;
  // return Regexp.test(thaiToValidate);
  // const Regexp = /^[\u0E00-\u0E7F.\s0-9]*$/;
  return Regexp.test(engToValidate);
};

const numberAndEngValidator = (engToValidate) => {
  if (engToValidate === '') return true;
  if (!paramIsTrue(engToValidate)) return false;
  const Regexp = /^[a-zA-Z.\s0-9]*$/;
  return Regexp.test(engToValidate);
};

const isNumericValidator = (input) => {
  if (input === '') return true;
  if (!paramIsTrue(input)) return false;
  const RE =
    /^-?(0|INF|(0[1-7][0-7]*)|(0x[0-9a-fA-F]+)|((0|[1-9][0-9]*|(?=[\.,]))([\.,][0-9]+)?([eE]-?\d+)?))$/;
  return RE.test(input);
};

const mobileNumberValidator = (input) => {
  if (input === '') return true;
  if (!paramIsTrue(input)) return false;
  const RE = /^(0[689]{1})+([0-9]{8})+$/;
  return RE.test(input);
};

const characterValidator = (input) => {
  if (input === '') return true;
  if (!paramIsTrue(input)) return false;
  // eslint-disable-next-line no-useless-escape
  const character = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return !character.test(input);
};

const nameEnValidator = (engToValidate) => {
  if (engToValidate === '') return true;
  if (!paramIsTrue(engToValidate)) return false;
  const Regexp = /[ก-๙]/;
  return Regexp.test(engToValidate);
};

module.exports = {
  thaiValidator,
  engValidator,
  numberValidator,
  numberAndThaiValidator,
  numberAndEngValidator,
  isNumericValidator,
  mobileNumberValidator,
  characterValidator,
  nameEnValidator,
};

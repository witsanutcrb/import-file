class OBGenerator {
  obGenerator(accountRef) {
    try {
      if (accountRef) {
        return 'OB'
          .concat(Math.round(Date.now()).toString())
          .concat(accountRef.substring(0, 5));
      }
      return '';
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OBGenerator;

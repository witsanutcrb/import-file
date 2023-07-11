const { QueryTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const models = require('./Model');

const MOMENT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const time = moment(new Date()).format(MOMENT_DATE_FORMAT);
const { Op } = Sequelize;

class SmsMessageRepository {
  static async healthCheck() {
    const model = await models;
    const sql = `select 1
        from sms_message limit 1 `;
    try {
      const result = await model.sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });
      return result;
    } catch (error) {
      console.error('error in repository :: ', error);
      throw error;
    }
  }

  static async getSmsMessageBySmsIdAndLang(sms_id = null, language = null) {
    let newLanguage;

    if (typeof language === 'string') {
      newLanguage = language.toUpperCase();
    }
    const where = { sms_id };
    if (newLanguage) where.language = newLanguage;

    const model = await models;
    const listResult = await model.sms_message
      .findAll({
        where,
        raw: true,
      })
      .then((pmps) => {
        return pmps;
      })
      .catch((error) => {
        throw error;
      });
    return listResult;
  }

  static async getSmsMessageBySmsIds(sms_ids = null) {
    // for BOF
    const model = await models;
    const listResult = await model.sms_message
      .findAll({
        where: {
          sms_id: {
            [Op.in]: sms_ids,
          },
        },
        raw: true,
      })
      .then((pmps) => {
        return pmps;
      })
      .catch((error) => {
        throw error;
      });
    return listResult;
  }

  static async bulkUpdate(array) {
    const model = await models;
    return model.sequelize
      .transaction(async (t) => {
        for await (const data of array) {
          if (!data.sms_id || !data.partner_code || !data.language) {
            throw new Error('Some value is null');
          }
          const condition = {
            where: {
              sms_id: data.sms_id,
              partner_code: data.partner_code,
              language: data.language,
            },
          };
          delete data.sms_id;
          delete data.partner_code;
          delete data.language;
          data.updated_on = time;
          console.error('bulkUpdate data to update::', data, condition);

          const result = await model.sms_message.update(data, condition, {
            transaction: t,
          });
          if (result[0] === 0) {
            throw new Error(result);
          }
        }
        return true;
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error('bulkUpdate Error :: ', err);
        throw err;
      });
  }
}
module.exports = SmsMessageRepository;

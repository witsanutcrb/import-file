const { QueryTypes, Sequelize } = require('sequelize');

const { Op } = Sequelize;
const moment = require('moment');

const models = require('./Model');

const MOMENT_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const time = moment(new Date()).format(MOMENT_DATE_FORMAT);

class EmailMessageRepository {
  static async healthCheck() {
    const model = await models;
    const sql = `select 1
        from email_message limit 1 `;
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

  static async getEmailMessage(query = {}) {
    const newQuery = typeof query === 'string' ? JSON.parse(query) : query;
    const model = await models;
    const result = await model.email_message.findAll({
      where: newQuery,
      raw: true,
    });
    return result;
  }

  static async getEmailMessageByEmailIds(email_ids = null) {
    // for BOF
    const model = await models;
    const listResult = await model.email_message
      .findAll({
        where: {
          email_id: {
            [Op.in]: email_ids,
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
    const t = await model.sequelize.transaction();
    try {
      for await (const data of array) {
        if (!data.email_id || !data.language) {
          throw new Error('Some value is null');
        }
        const condition = {
          where: {
            email_id: data.email_id,
            language: data.language,
          },
        };
        delete data.email_id;
        delete data.language;
        data.updated_on = time;
        const result = await model.email_message.update(data, condition, {
          transaction: t,
        });
        if (result[0] === 0) {
          throw new Error(result);
        }
      }
      await t.commit();
      return true;
    } catch (err) {
      console.error('bulkUpdate Error :: ', err);
      await t.rollback();
      throw err;
    }
  }
}
module.exports = EmailMessageRepository;

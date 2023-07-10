const { Op } = require('sequelize');
const models = require('../models');

class OlaCustomerAppointmentResultRepository {
  static async findCount({ where }) {
    try {
      const model = await models;
      const { olaCustomerAppointmentResult } = model;
      return await olaCustomerAppointmentResult.count({
        where,
      });
    } catch (error) {
      console.log(
        'Error finding all ola_customer_appointment_result ::',
        error,
      );
      throw error;
    }
  }

  static async findAllbyKey({ attributes, where, limit, offset }) {
    try {
      const model = await models;
      const { olaCustomerAppointmentResult } = model;
      return await olaCustomerAppointmentResult.findAll({
        attributes,
        where: {
          ...where,
          line_number: {
            [Op.gt]: 0,
          },
        },
        order: [['line_number']],
        limit,
        offset,
        raw: true,
      });
    } catch (error) {
      console.log(
        'Error finding all ola_customer_appointment_result ::',
        error,
      );
      throw error;
    }
  }

  static async addBulkOnConflict(item, dupplicated) {
    const model = await models;
    const { olaCustomerAppointmentResult, sequelize } = model;
    const t = await sequelize.transaction();
    try {
      const keys = Object.keys(item[0]);
      const keysDuplicate = keys.filter(
        (key_item) => !(key_item === 'created_by' || key_item === 'created_on'),
      );
      await olaCustomerAppointmentResult.bulkCreate(item, {
        fields: [...keys],
        conflictFields: [...dupplicated],
        updateOnDuplicate: [...keysDuplicate],
        returning: true,
        raw: true,
        transaction: t,
      });
      return t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = OlaCustomerAppointmentResultRepository;

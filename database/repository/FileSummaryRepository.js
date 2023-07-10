const { Op } = require('sequelize');
const models = require('../models');

class FileSummaryRepository {
  static async findAllbyKey({ attributes, where, order, limit, offset }) {
    try {
      const model = await models;
      const { FileSummary } = model;
      const result = await FileSummary.findAll({
        attributes,
        where: {
          ...where,
        },
        order,
        limit,
        offset,
        raw: true,
      });

      return result;
    } catch (error) {
      console.error('Error findAllbyKey file_summary ::', error);
      throw error;
    }
  }

  static async findByPrefixFileName(preFixName) {
    try {
      const model = await models;
      const { FileSummary, sequelize } = model;
      const file_summary = await FileSummary.findAll({
        attributes: [
          'file_name',
          [
            sequelize.fn(
              'substring',
              sequelize.col('file_name'),
              preFixName.length + 1,
              3,
            ),
            'round_number',
          ],
        ],
        where: { file_name: { [Op.like]: `%${preFixName}%` } },
        order: [['file_name', 'asc']],
        group: ['file_name'],
        raw: true,
      });
      return file_summary;
    } catch (error) {
      console.log('Error finding all file_summary ::', error);

      throw error;
    }
  }

  static async upsert(values, condition) {
    const model = await models;
    const { FileSummary } = model;
    return await FileSummary.findOne({ where: condition })
      .then(async (obj) => {
        // update
        const updateValues = { ...values };

        delete updateValues.created_by;
        delete updateValues.created_on;

        if (obj) return FileSummary.update(updateValues, { where: condition });

        // insert
        return FileSummary.create(values);
      })
      .catch((error) => {
        console.error(
          `Error insert or update a file_summary with  ${condition}::`,
          error,
        );
        throw error;
      });
  }
}

module.exports = FileSummaryRepository;

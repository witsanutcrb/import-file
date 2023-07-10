const { Sequelize, Op } = require('sequelize');
const models = require('../models');

class FileControlRepository {
  static async findAllByKey(where) {
    try {
      const model = await models;
      const { FileControl } = model;
      const file_control = await FileControl.findAll({ where });
      return file_control;
    } catch (error) {
      console.error(
        `Error finding all by key file_control :: ${where} ::`,
        error,
      );

      throw error;
    }
  }

  static async findByPrefixName(
    prefix_file_name,
    file_type,
    is_ctrl = undefined,
  ) {
    try {
      const model = await models;
      const { FileControl } = model;
      const attributes = Object.keys(FileControl.getAttributes());
      let where = {};
      where = {
        [Op.and]: [
          Sequelize.literal(`'${prefix_file_name}' like prefix_file_name||'%'`),
          { file_type },
        ],
      };
      if (is_ctrl) {
        where = {
          [Op.and]: [
            Sequelize.literal(
              `'${prefix_file_name}' like prefix_file_name||'%'`,
            ),
            { file_type },
            { is_ctrl },
          ],
        };
      }
      return await FileControl.findOne({
        attributes,
        where,
        raw: true,
      });
    } catch (error) {
      console.error(
        `Error finding a file_control with prefix_file_name : ${prefix_file_name} ::`,
        error,
      );
      throw error;
    }
  }

  static async upsert(values, condition) {
    const model = await models;
    const { FileControl } = model;
    return await FileControl.findOne({ where: condition })
      .then(async (obj) => {
        // update
        const updateValues = { ...values };

        delete updateValues.created_by;
        delete updateValues.created_on;

        if (obj) return FileControl.update(updateValues, { where: condition });

        // insert
        return FileControl.create(values);
      })
      .catch((error) => {
        console.log(
          `Error insert or update a file_summary with  ${condition}::`,
          error,
        );
        throw error;
      });
  }
}

module.exports = FileControlRepository;

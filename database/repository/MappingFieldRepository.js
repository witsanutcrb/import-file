const models = require('../models');

class MappingFieldRepository {
  static async findByFileControlID(file_control_id) {
    try {
      const model = await models;
      const { MappingField } = model;
      return MappingField.findAll({
        where: { file_control_id },
        order: [['src_index']],
        raw: true,
      });
    } catch (error) {
      console.error(
        `Error finding a mapping_field with file_control_id: ${file_control_id} ::`,
        error,
      );
      throw error;
    }
  }
}

module.exports = MappingFieldRepository;

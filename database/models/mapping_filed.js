const { allStatuses } = require('../../constructor/enums');

const model = (Sequelize, DataTypes) => {
  const mf = Sequelize.define(
    'MappingField',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      file_control_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      field_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      validation: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      src_index: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      src_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      src_format: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      src_length: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      src_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      dest_field_name: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      dest_field_format: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      dest_field_length: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dest_field_type: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(allStatuses),
        allowNull: true,
      },
      record_type: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      is_mandatory: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      is_pk: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      default_value: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      encrypt_flg: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      lookup_flg: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      lookup_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING,
        defaultValue: 'SYSTEM',
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dest_index: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dest_prefix_value: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      dest_postfix_value: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      dest_default_value: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      field_condition: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      dest_config_value: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      dest_config_key: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
    },
    {
      tableName: 'mapping_field',
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
  );

  return mf;
};

module.exports = model;

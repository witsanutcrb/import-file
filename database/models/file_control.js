const { allStatuses } = require('../../constructor/enums');

const model = (Sequelize, DataTypes) => {
  const fileC = Sequelize.define(
    'FileControl',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      channel_code: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      file_type: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      prefix_file_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      file_path: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      target_table: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      target_table_process: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      transfer_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      imp_seq: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      delimeter: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      header_str: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      body_str: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      trailer_str: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      send_mail_flg: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(allStatuses),
        allowNull: true,
      },
      encrypt_flg: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      encrypt_type: { type: DataTypes.STRING(20), allowNull: true },
      created_by: {
        type: DataTypes.STRING,
        defaultValue: 'SYSTEM',
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_ctrl: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      encrypt_key: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      not_wait_ctrl: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
    },
    {
      tableName: 'file_control',
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
  );

  return fileC;
};

module.exports = model;

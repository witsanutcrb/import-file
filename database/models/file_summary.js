const { allStatuses } = require('../../constructor/enums');

const model = (Sequelize, DataTypes) => {
  return Sequelize.define(
    'FileSummary',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      file_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      file_part: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      processing_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      processing_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      channel_code: {
        type: DataTypes.STRING(5),
        allowNull: true,
      },
      round_number: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      file_type: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      total_record: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      pass_record: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      failed_record: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      start_time: {
        type: 'TIMESTAMP',
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(allStatuses),
        allowNull: true,
      },
      end_time: {
        type: 'TIMESTAMP',
        allowNull: true,
      },
      file_summary_status: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      rule_status: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      as400_status: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      datamart_status: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      specialist_status: {
        type: DataTypes.STRING(10),
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
      created_on: {
        type: 'TIMESTAMP',
        // allowNull: false,
      },
      updated_on: {
        type: 'TIMESTAMP',
      },
      read_record: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      error_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      group_ref_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      tableName: 'file_summary',
      createdAt: false,
      updatedAt: false,
    },
  );
};

module.exports = model;

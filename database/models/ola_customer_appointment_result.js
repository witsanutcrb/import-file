const model = (Sequelize, DataTypes) => {
  return Sequelize.define(
    'olaCustomerAppointmentResult',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      messenger_id: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      customer_firstname: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      customer_lastname: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      customer_mobile_no: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      appointment_date: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      job_date: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      job_no: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      sales_team: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      sales_group: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      recorder_sales_code: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      recorder_sales_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      recorder_sales_tel: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      sales_code: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      sales_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      sales_tel: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      file_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      line_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      file_name_line_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      validate_field_result: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      duplicated_flag: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      result: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      reason: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      group_ref_code: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      ref_code: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      entity: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      channel: {
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
      },
      updated_on: {
        type: 'TIMESTAMP',
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['file_name_line_number'],
        },
      ],
      tableName: 'ola_customer_appointment_result',
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
  );
};
module.exports = model;

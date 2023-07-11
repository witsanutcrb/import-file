const model = (Sequelize, DataTypes) => {
  const sms_message = Sequelize.define(
    'sms_message',
    {
      created_on: {
        type: 'TIMESTAMP',
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      updated_on: {
        type: 'TIMESTAMP',
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      terminated_on: {
        type: 'TIMESTAMP',
        allowNull: true,
      },
      terminated_by: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      sms_id: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        allowNull: false,
      },
      partner_code: {
        //
        type: DataTypes.STRING(5),
        primaryKey: true,
        allowNull: false,
      },
      resource_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      language: {
        type: DataTypes.CHAR(2),
        primaryKey: true,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      template_code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sms_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sms_sub_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'sms_message',
      freezeTableName: true,
      timestamps: true,
      createdAt: false,
      updatedAt: false,
    },
  );
  return sms_message;
};

module.exports = model;

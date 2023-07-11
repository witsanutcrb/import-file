const model = (Sequelize, DataTypes) => {
  const email_message = Sequelize.define(
    'email_message',
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
      email_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false,
      },
      partner_code: {
        type: DataTypes.STRING(5),
        allowNull: true,
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
      subject: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      from: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      to: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      html_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      template_code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email_sub_type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'email_message',
      freezeTableName: true,
      timestamps: true,
      createdAt: false,
      updatedAt: false,
    },
  );
  return email_message;
};

module.exports = model;

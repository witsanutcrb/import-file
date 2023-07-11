/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const pg = require('pg');

delete pg.native;
const db = {};

const connect = async () => {
  /* istanbul ignore next */
  let sequelize;
  if (process.env.DEV === 'PROD') {
    const username = process.env.POSTGRES_USER_MESSAGING;
    const password = process.env.POSTGRES_PASS_MESSAGING;
    const host = process.env.POSTGRES_URL_MESSAGING;
    const engine = process.env.POSTGRES_ENGINE_MESSAGING;
    const port = process.env.POSTGRES_PORT_MESSAGING;

    console.time('New Sequelize Instance');
    sequelize = new Sequelize('messaging', username, password, {
      dialect: engine,
      host,
      port,
      logging: false,
      dialectOptions: {
        useUTC: true, // for reading from database
        dateStrings: true,
        typeCast: true,
      },
      pool: {
        max: 150,
        min: 0,
        acquire: 60000,
        idle: 900000,
      },
    });
    console.timeEnd('New Sequelize Instance');
  } else {
    // local unit test
    /* istanbul ignore next */
    sequelize = new Sequelize('sqlite::memory:', {
      // disable logging; default: console.log
      logging: false,
      dialectOptions: {
        useUTC: true, // for reading from database
        dateStrings: true,
        typeCast: true,
      },
    });
  }

  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      );
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes,
      );
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    /* istanbul ignore next */
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  return db;
};

module.exports = connect();

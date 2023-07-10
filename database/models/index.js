/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const db = {};
const { Op } = Sequelize;

const connect = async () => {
  let sequelize = null;
  if (process.env.DEV === 'PROD') {
    const host = process.env.POSTGRES_URL;
    const port = process.env.POSTGRES_PORT;
    const engine = process.env.POSTGRES_ENGINE;
    const username = process.env.POSTGRES_USER;
    const password = process.env.POSTGRES_PASS;
    sequelize = new Sequelize('debt_acquisition', username, password, {
      dialect: engine,
      host,
      port,
      logging: false,
      dialectOptions: {
        useUTC: true,
        dateStrings: true,
        typeCast: true,
      },
      operatorsAliases: {
        $eq: Op.eq,
        $ne: Op.ne,
        $gte: Op.gte,
        $gt: Op.gt,
        $lte: Op.lte,
        $lt: Op.lt,
        $not: Op.not,
        $in: Op.in,
        $notIn: Op.notIn,
        $is: Op.is,
        $like: Op.like,
        $notLike: Op.notLike,
        $iLike: Op.iLike,
        $notILike: Op.notILike,
        $regexp: Op.regexp,
        $notRegexp: Op.notRegexp,
        $iRegexp: Op.iRegexp,
        $notIRegexp: Op.notIRegexp,
        $between: Op.between,
        $notBetween: Op.notBetween,
        $overlap: Op.overlap,
        $contains: Op.contains,
        $contained: Op.contained,
        $adjacent: Op.adjacent,
        $strictLeft: Op.strictLeft,
        $strictRight: Op.strictRight,
        $noExtendRight: Op.noExtendRight,
        $noExtendLeft: Op.noExtendLeft,
        $and: Op.and,
        $or: Op.or,
        $any: Op.any,
        $all: Op.all,
        $values: Op.values,
        $col: Op.col,
      },
      pool: {
        max: 150,
        min: 0,
        acquire: 60000,
        idle: 10000,
        evict: 1000,
      },
    });
  } else {
    sequelize = new Sequelize('sqlite::memory:', {
      logging: false,
      dialectOptions: {
        useUTC: true,
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
      // eslint-disable-next-line global-require
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes,
      );
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};

module.exports = connect();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('db_name', 'root', 'mysql_password', { //define within your needs
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
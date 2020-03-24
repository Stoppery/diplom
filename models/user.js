var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

//var company = require('../server.js');
var company = global.comp;
//console.log("data111 = ", company);
var sequelize = new Sequelize( company, 'postgres', 'Xtcyjr007', {
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
  })

var User = sequelize.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    group: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        }
        }
        })
        User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
        };
;

sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));


module.exports = sequelize;
// export User model for use in other files.
module.exports = User;

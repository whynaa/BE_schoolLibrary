'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.borrow, {
        foreignKey: "adminID",
        as        : "borrowed"
      })
    }
  };
  admin.init({
    name: DataTypes.STRING(100),
    contact: DataTypes.STRING(100),
    address: DataTypes.STRING,
    username: DataTypes.STRING(100),
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'admin',
  });
  return admin;
};
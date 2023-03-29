'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.details_of_borrow, {
        foreignKey: "bookID",
        as        : "details_of_borrow"
      })
    }
  };
  book.init({
    isbn: DataTypes.STRING(50),
    title: DataTypes.STRING(100),
    author: DataTypes.STRING(100),
    publisher: DataTypes.STRING(100),
    category: DataTypes.ENUM("Novel","Komik","Study"),
    stock: DataTypes.INTEGER(10),
    cover: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};
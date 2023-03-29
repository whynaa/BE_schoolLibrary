'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isbn: {
        type: Sequelize.STRING(50)
      },
      title: {
        type: Sequelize.STRING(100)
      },
      author: {
        type: Sequelize.STRING(100)
      },
      publisher: {
        type: Sequelize.STRING(100)
      },
      category: {
        type: Sequelize.ENUM("Novel","Komik","Study")
      },
      stock: {
        type: Sequelize.INTEGER(10)
      },
      cover: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('books');
  }
};
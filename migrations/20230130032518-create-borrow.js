'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('borrows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      memberID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "members",
          key: "id"
        }
      },
      adminID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "admins",
          key: "id"
        }
      },
      date_of_borrow: {
        type: Sequelize.DATE
      },
      date_of_return: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('borrows');
  }
};
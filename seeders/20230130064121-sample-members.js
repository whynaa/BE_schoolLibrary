'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("members", [
      {
        name: `Soekarno`, gender: `Male`,
        contact: `021-223311`, address: `Tokyo, Japan`,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        name: `Soeharto`, gender: `Male`,
        contact: `0331-474747`, address: `Beijing, China`,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        name: `Megawati`, gender: `Female`,
        contact: `091-23981`, address: `Bangkok, Thailand`,
        createdAt: new Date(), updatedAt: new Date()
      },
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('members', null, {});
  }
};

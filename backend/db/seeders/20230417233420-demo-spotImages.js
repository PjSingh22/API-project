'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'SpotImages';
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https://i.imgur.com/M6WbGRu.jpeg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://i.imgur.com/M6WbGRu.jpeg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://i.imgur.com/1KgfYNV.jpeg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://i.imgur.com/wzMdw6e.jpeg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://i.imgur.com/0AKKIdd.jpeg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://i.imgur.com/lYTYgZ9.jpeg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://i.imgur.com/asLguVw.jpeg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://i.imgur.com/C6pn1k1.jpeg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://i.imgur.com/eeaIUrz.jpeg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://i.imgur.com/tbiL2SJ.jpeg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://i.imgur.com/3zTTYLa.jpeg',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://i.imgur.com/C3lLLlT.jpeg',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://i.imgur.com/IzJK3Ku.jpeg',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://i.imgur.com/MCWsA8l.jpeg',
      preview: false
    },
    {
      spotId: 3,
      url: 'https://i.imgur.com/j1kdc1u.jpeg',
      preview: false
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};

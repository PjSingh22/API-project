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
   options.tableName = 'Spots'
   await queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '123 somewhere st',
      city: 'someTown',
      state: 'California',
      country: 'United States',
      lat: 39.420,
      lng: 69.123,
      name: 'cozy home',
      description: 'come on over and give me your money',
      price: 100
    },
    {
      ownerId: 1,
      address: '246 somewhere st',
      city: 'anotherTown',
      state: 'Texas',
      country: 'United States',
      lat: 42.420,
      lng: 80.123,
      name: 'not so cozy home',
      description: 'more money please!',
      price: 65
    },
    {
      ownerId: 2,
      address: '2245 oldtown rd',
      city: 'oldTown',
      state: 'Florida',
      country: 'United States',
      lat: 124.420,
      lng: 645.123,
      name: 'old home',
      description: 'don\'t tell my wife',
      price: 20
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
  }
};

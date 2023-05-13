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
    { // spot 1
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
    { // spot 2
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
    { // spot 3
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
    },
    { // spot 4
      ownerId: 3,
      address: '298 James road',
      city: 'New York',
      state: 'New York',
      country: 'United States',
      lat: 12.432,
      lng: 88.444,
      name: 'Views',
      description: 'Watch out for Rob',
      price: 160
    },
    { // spot 5
      ownerId: 3,
      address: 'West 34th Street',
      city: 'New York',
      state: 'New York',
      country: 'United States',
      lat: 12.432,
      lng: 88.444,
      name: 'Empire State Building',
      description: 'costs extra to go to the top',
      price: 300
    },
    { // spot 6
      ownerId: 4,
      address: '420 oldtown road',
      city: 'oldTown',
      state: 'Kentucky',
      country: 'United States',
      lat: 65.432,
      lng: 22.444,
      name: 'Cottage le cot',
      description: 'no free toilet paper',
      price: 200
    },
    { // spot 7
      ownerId: 5,
      address: '9 figure ln',
      city: 'Agoura Hills',
      state: 'California',
      country: 'United States',
      lat: 99.432,
      lng: 88.444,
      name: 'Castle Of Glass',
      description: 'One step closer to find a place where you belong',
      price: 160
    },
    { // spot 8
      ownerId: 5,
      address: '3764 Elvis Presley Boulevard',
      city: 'Memphis',
      state: 'Tennessee',
      country: 'United States',
      lat: 124.420,
      lng: 645.123,
      name: 'Graceland',
      description: "It's all in the pelvis",
      price: 2000
    },
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
    await queryInterface.bulkDelete(options);
  }
};

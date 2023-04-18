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
   options.tableName = 'Reviews';
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 2,
      review: 'This is a nice spot to escape the family and have some alone time. Just a man and his fiddle',
      stars: 5
    },
    {
      spotId: 1,
      userId: 3,
      review: 'Pretty alright place. Pretty alright location. Pretty alright in general',
      stars: 3
    },
    {
      spotId: 3,
      userId: 1,
      review: 'old place in a old town with an old vibe. There is also an old man who walks about the neighborhood passing around candy and has a hook for a hand',
      stars: 4
    },
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options);
  }
};

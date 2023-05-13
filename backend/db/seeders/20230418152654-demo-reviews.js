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
      spotId: 1,
      userId: 4,
      review: 'The place has a beautiful guarden but nothing much else.',
      stars: 4
    },
    {
      spotId: 3,
      userId: 1,
      review: 'old place in a old town with an old vibe. There is also an old man who walks about the neighborhood passing around candy and has a hook for a hand',
      stars: 4
    },
    {
      spotId: 3,
      userId: 3,
      review: "There's this guy who walks around with a hook for a hand asking if we want candy. Kinda creepy and did not like my stay.",
      stars: 1
    },
    {
      spotId: 3,
      userId: 4,
      review: 'Let me tell you, when they said this place is old they meant it. I did not see this old man passing candy around though, kinda bummed about that :(',
      stars: 3
    },
    {
      spotId: 3,
      userId: 5,
      review: "meh",
      stars: 5
    },
    {
      spotId: 4,
      userId: 1,
      review: "Nice place in New York, close to some nice sandwich shops",
      stars: 5
    },
    {
      spotId: 4,
      userId: 2,
      review: "How Do I know if this submitted?",
      stars: 5
    },
    {
      spotId: 4,
      userId: 5,
      review: "I love New York bby",
      stars: 5
    },
    {
      spotId: 5,
      userId: 2,
      review: "costs extra to get to the top. why!",
      stars: 2
    },
    {
      spotId: 5,
      userId: 1,
      review: "It is really crazy cool at the top. I can see everything!",
      stars: 5
    },
    {
      spotId: 5,
      userId: 4,
      review: "big building, me like",
      stars: 5
    },
    {
      spotId: 5,
      userId: 5,
      review: "A lot of pollution can be seen from the top",
      stars: 3
    },
    {
      spotId: 6,
      userId: 5,
      review: "Haha I like the house address",
      stars: 5
    },
    {
      spotId: 7,
      userId: 1,
      review: "I CAN'T FAINT",
      stars: 5
    },
    {
      spotId: 7,
      userId: 2,
      review: "I think I got a papercut",
      stars: 4
    },
    {
      spotId: 7,
      userId: 3,
      review: "This place has me breaking the habit",
      stars: 4
    },
    {
      spotId: 7,
      userId: 4,
      review: "In the end, it doesn't even matter",
      stars: 5
    },
    {
      spotId: 8,
      userId: 1,
      review: "I visited the toilet. very nice",
      stars: 5
    },
    {
      spotId: 8,
      userId: 2,
      review: "Crazy cool record room, Lots of awards",
      stars: 5
    },
    {
      spotId: 8,
      userId: 3,
      review: "The decor is weird",
      stars: 2
    },
    {
      spotId: 8,
      userId: 4,
      review: "Got me shaking like Elvis",
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

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
      url: 'https://i.imgur.com/WOKYVES.jpeg',
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
      preview: true
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
    },
    {
      spotId: 4,
      url: 'https://www.linwoodhomes.com/cdn-cgi/image/quality=30/https://dm47sa8vny7s2.cloudfront.net/designs/antler-trail/thumbnail/thumb-antlertrail-600x587.jpg',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://thumbs.dreamstime.com/b/outdoor-backyard-patio-76208073.jpg',
      preview: false
    },
    {
      spotId: 4,
      url: 'https://thumbs.dreamstime.com/b/outdoor-backyard-patio-76208073.jpg',
      preview: false
    },
    {
      spotId: 4,
      url: 'https://thumbs.dreamstime.com/b/living-space-inside-house-49487046.jpg',
      preview: false
    },
    {
      spotId: 4,
      url: 'https://thumbs.dreamstime.com/b/swimming-pool-inside-house-12883132.jpg',
      preview: false
    },
    {
      spotId: 5,
      url: 'https://s39023.pcdn.co/wp-content/uploads/2022/10/Where-Are-Those-Morgans-Empire-State-Building.jpg.optimal.jpg',
      preview: false
    },
    {
      spotId: 5,
      url: 'https://untappedcities.com/wp-content/uploads/2021/05/Empire-State-Building-Aerial-Photo-from-Above-Secrets-NYC-2.jpg',
      preview: false
    },
    {
      spotId: 5,
      url: 'https://yourbrooklynguide.com/wp-content/uploads/2021/08/view-of-the-world-trade-center-from-the-empire-state-building-observatory.jpg',
      preview: false
    },
    {
      spotId: 5,
      url: 'https://www.findingtheuniverse.com/wp-content/uploads/2020/07/Empire-State-Building-view-from-uptown_by_Laurence-Norah-2.jpg',
      preview: false
    },
    {
      spotId: 5,
      url: 'https://www.esbnyc.com/sites/default/files/2020-01/ESB%20Day.jpg',
      preview: false
    },
    {
      spotId: 6,
      url: 'https://www.albuquerqueoldtown.com/cdn-cgi/image/width=768,height=513,fit=crop,quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/2022/07/Oldtown-11.jpg',
      preview: false
    },
    {
      spotId: 6,
      url: 'https://michellesrawfoodz.com/wp-content/uploads/2023/02/od1.jpg',
      preview: false
    },
    {
      spotId: 6,
      url: 'https://media.cntraveler.com/photos/5a8f4049d41cc84048ce6a1e/16:9/w_2560,c_limit/Temecula-Old-Town_2018_GettyImages-545623615.jpg',
      preview: false
    },
    {
      spotId: 6,
      url: 'https://images.squarespace-cdn.com/content/v1/603e540f1edc485432420a9d/1625931979847-OMT6ZFRUVMWT9BJ7O1BB/image-asset.jpeg',
      preview: false
    },
    {
      spotId: 6,
      url: 'https://cdn.vox-cdn.com/thumbor/JaKYF7fqO5wHBPjBT0EFJ9SLgeo=/0x0:4032x3024/1200x900/filters:focal(1803x1409:2447x2053)/cdn.vox-cdn.com/uploads/chorus_image/image/56222239/IMG_5817.0.jpeg',
      preview: false
    },
    {
      spotId: 7,
      url: 'https://www.realtordavid.com/wp-content/uploads/2021/04/29424-MALIBU-VIEW-COURT-Agoura-hills3-1024x683.jpg',
      preview: true
    },
    {
      spotId: 7,
      url: 'https://cdn.apartmenttherapy.info/image/upload/v1651082918/at/real-estate/backyard-stock.jpg',
      preview: false
    },
    {
      spotId: 7,
      url: 'https://hips.hearstapps.com/hmg-prod/images/interior-design-trends-2022-home-libraries-1653410954.jpg',
      preview: false
    },
    {
      spotId: 7,
      url: 'https://hips.hearstapps.com/hmg-prod/images/priors-crescent-living-room-haus-interiors-show-home-1602462623.jpg',
      preview: false
    },
    {
      spotId: 7,
      url: 'https://static.asianpaints.com/content/dam/asianpaintsbeautifulhomes/home-decor-advice/design-and-style/nine-small-house-interior-design-hacks/two-seater-couches-and-wall-mounts-design-hack.jpg',
      preview: false
    },
    {
      spotId: 8,
      url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Graceland_Memphis_Tennessee.jpg',
      preview: true
    },
    {
      spotId: 8,
      url: 'https://www.bloggeratlarge.com/wp-content/uploads/2020/06/Elvis-Presley-white-lounge.jpg',
      preview: false
    },
    {
      spotId: 8,
      url: 'https://media.architecturaldigest.com/photos/62a201b9c03eceeaa1e6dfe5/3:2/w_3600,h_2400,c_limit/BT988J.jpg',
      preview: false
    },
    {
      spotId: 8,
      url: 'https://danielscottkitchens.co.uk/wp-content/uploads/2018/02/Elvis-Graceland-Kitchen-1024x576.jpg',
      preview: false
    },
    {
      spotId: 8,
      url: 'https://c8.alamy.com/comp/DCB4D6/gold-records-on-display-in-the-trophy-room-at-graceland-the-home-of-DCB4D6.jpg',
      preview: false
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
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);
  }
};

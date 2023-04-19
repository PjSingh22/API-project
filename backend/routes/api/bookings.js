const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, ReviewImage, User, Spot, SpotImage, Booking } = require('../../db/models');

router.get('/current', async (req, res) => {
  const { user } = req;

  if (user) {
    const allBookings = await Booking.findAll({
      where: {
        userId: user.id
      },
      raw: true,
      attributes: {
        include: ['id']
      }
    });

    for (let booking of allBookings) {
      const spot = await Spot.findOne({
        where: {
          id: booking.spotId
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        raw: true
      });

      const previewImage = await SpotImage.findOne({ where:{ spotId:spot.id }})
      if(previewImage) spot.previewImage = previewImage.url
      else spot.previewImage = 'invalid';

      booking.Spot = spot;
    }

    return res.json(allBookings);
  }
});

module.exports = router;

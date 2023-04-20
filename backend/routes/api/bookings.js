const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, ReviewImage, User, Spot, SpotImage, Booking } = require('../../db/models');

// edit a booking
router.put('/:id', async (req, res) => {
  const { user } = req;
  const { startDate, endDate } = req.body;
  const bookingId = req.params.id;
  const booking = await Booking.findByPk(bookingId);
  const editBooking = await Booking.findByPk(bookingId);
  const otherBookings = await Booking.findAll({ where: {spotId: booking.spotId, id: { [Op.not]: booking.id} }});

  if (!editBooking || editBooking.userId !== user.id) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    });
  }

  if (editBooking.userId == user.id) {
    const spotEndDate = new Date(editBooking.endDate.toDateString()).getTime();

    const newStartDate = startDate ? new Date(startDate + ' ') : new Date(editBooking.startDate);
    const newEndDate = endDate ? new Date(endDate + ' ') : new Date(editBooking.endDate);

    const convertedBSD = new Date(newStartDate.toDateString()).getTime(); // conv to time
    const convertedBED = new Date(newEndDate.toDateString()).getTime();

    if (convertedBSD > spotEndDate) {
      return res.status(403).json({
        message: "Past bookings can't be modified"
      })
    }

    if (convertedBED < convertedBSD) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot come before startDate"
        }
      });
    }

    for (let booking of otherBookings) {
      let conflict = false;
      const errors = {}
      const spotStartDate = new Date(booking.startDate.toDateString()).getTime();
      const spotEndDate = new Date(booking.endDate.toDateString()).getTime();

      if (convertedBSD === spotStartDate || (convertedBSD > spotStartDate && convertedBSD <= spotEndDate)) {
        errors.startDate = "Start date conflicts with an existing booking";
        conflict = true;
      }

      if (convertedBED === spotEndDate || (convertedBED >= spotStartDate && convertedBED < spotEndDate)) {
        errors.endDate = "End date conflicts with an existing booking"
        conflict = true
      }

      if (convertedBSD < spotStartDate && convertedBED > spotEndDate) {
        errors.startDate = "Start date conflicts with an existing booking";
        errors.endDate = "End date conflicts with an existing booking"
        conflict = true
      }

      if (conflict) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors
        })
      }
    }

    editBooking.startDate = newStartDate;
    editBooking.endDate = newEndDate;

    await editBooking.save();
    return res.json(editBooking);
  }
});

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
          exclude: ['createdAt', 'updatedAt', 'description']
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

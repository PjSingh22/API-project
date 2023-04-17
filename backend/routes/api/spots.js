const express = require('express');
const router = express.Router();

const { Spot } = require('../../db/models');

router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll();

  return res.json(allSpots);
})

router.post('/', async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price} = req.body;
  if (!address || !city || !state || !country || !lat || !lng || !description || !price) {
    return res.status(400).json('Please fill in each field');
  }

  if (user) {
    const newSpot = Spot.build({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    await newSpot.save();

    return res.json(newSpot);
  }

  res.status(400).json('Error in creating new spot');
});

module.exports = router;

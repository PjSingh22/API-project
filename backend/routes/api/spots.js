const express = require('express');
const router = express.Router();

const { Spot, SpotImage } = require('../../db/models');
const spot = require('../../db/models/spot');

// TODO: add reviews and avgRating to returned data
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const spot = await Spot.findByPk(id);

  if (spot) {
    return res.json(spot);
  }

  return res.status(404).json(`spot with id ${id} does not exist.`);
})

// TODO: add reviews to this.
router.put('/:id', async (req, res) => {
  const { user } = req;
  const spotToEdit = await Spot.findByPk(id, {
    where: {
      ownerId: user.id
    }
  });

  if (spotToEdit) {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;

    if (address) spotToEdit.address = address;
    if (city) spotToEdit.city = city;
    if (state) spotToEdit.state = state;
    if (country) spotToEdit.country = country;
    if (lat) spotToEdit.lat = lat;
    if (lng) spotToEdit.lng = lng;
    if (name) spotToEdit.name = name;
    if (description) spotToEdit.name = name;
    if (price) spotToEdit.price = price;

    await spotToEdit.save();
    return res.json(spotToEdit);
  }

  return res.status(404).json('Spot does not exist');
})

router.post('/:id/images', async (req, res, next) => {
  const { user } = req;
  const id = parseInt(req.params.id);
  const theSpot = await Spot.findByPk(id, {
    where: {
      ownerId: user.id
    }
  });

  if (theSpot) {
    const { url, preview } = req.body;

    let newImage = SpotImage.build({
      spotId: id,
      url,
      preview
    });

    await newImage.save();
    return res.json(newImage);
  }

  next({
    error: `Spot does not exist with given id: ${id}`,
    status: 400
  })
})

router.get('/', async (req, res, next) => {
  const allSpots = await Spot.findAll();

  if (allSpots) return res.json(allSpots);
  return next({
    error: 'Spots cannot be retrieved',
    status: 400
  });
});

router.post('/', async (req, res, next) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  try {
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

  } catch (error) {
    const errArr = [];
    error.errors.forEach(err => errArr.push(err.message));

    next({
      error: errArr,
      status: 400
    });
    // return res.status(400).json(errArr);
  }

});

router.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500);
  return res.json({ errors: err.error })
});

module.exports = router;

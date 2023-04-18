const express = require('express');
const router = express.Router();

const { Spot, SpotImage, Review, User } = require('../../db/models');

// TODO: add reviews and avgRating to returned data
router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const spot = await Spot.findByPk(id, { raw: true });

  if (!spot) {
    return next({
      error: 'Spot cannot be retrieved',
      status: 400
    });
  }

  // gets the total stars and average
  const stars = await Review.sum('stars',{where:{spotId:spot.id}}); // get all stars tied to this spot
  const owner = await User.findByPk(spot.ownerId, { attributes: ['id', 'firstName', 'lastName']});
  const totalReviews = await Review.count({where:{spotId:spot.id}});
  const spotImages = await SpotImage.findAll({where:{spotId:spot.id}, attributes: ['id', 'url', 'preview']})
  let avg = stars/totalReviews
  spot.avgStarRating = avg ? avg : 0; // set it!
  spot.numReviews = totalReviews;
  spot.owner = owner
  // check to see if previewimage is true if true put the url there
  if(spotImages) spot.spotImages = spotImages
  else spot.spotImages = 'invalid';

  return res.json(spot);

})

// TODO: add reviews to this.
router.put('/:id', async (req, res, next) => {
  const { user } = req;
  const id = req.params.id;
  const spotToEdit = await Spot.findByPk(id, {
    where: {
      ownerId: user.id
    }
  });

  if (spotToEdit.ownerId === user.id) {
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

  return next({
    error: 'Either spot does not exist or you do not have permission to edit this spot',
    status: 404
  });
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

// Get all spots
router.get('/', async (req, res, next) => {


  const spots = await Spot.findAll({raw: true})

  if (!spots) {
    return next({
      error: 'Spots cannot be retrieved',
      status: 400
    });
  }
  for(let spot of spots){ // iterate through all spots
       // gets the total stars and average
      const stars = await Review.sum('stars',{where:{spotId:spot.id}}); // get all stars tied to this spot
      const totalReviews = await Review.count({where:{spotId:spot.id}});
      let avg = stars/totalReviews
      spot.avgRating = avg ? avg : 0; // set it!
      // check to see if previewimage is true if true put the url there
      const previewImage = await SpotImage.findOne({where:{spotId:spot.id}})
      if(previewImage) spot.previewImage = previewImage.url
      else spot.previewImage = 'invalid';
  }
  return res.json(spots);

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

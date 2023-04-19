const express = require('express');
const router = express.Router();
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
const { Spot, SpotImage, Review, User } = require('../../db/models');

router.get('/current', async (req, res, next) => {
  const { user } = req;

  if (user) {
    const id = user.id;
    const currentUser = await User.findByPk(id);
    const spots = await currentUser.getSpots({ raw: true });

    for (let spot of spots) {
      const stars = await Review.sum('stars', { where: { spotId: spot.id }});
      const totalReviews = await Review.count({where:{spotId:spot.id}});
      const previewImage = await SpotImage.findOne({where:{spotId:spot.id}});
      const avg = stars/totalReviews;

      if (previewImage) spot.previewImage = previewImage.url
      else spot.previewImage = 'invalid';

      spot.avgRating = avg;

    }
    res.json(spots);
  }

  return next({
    error: 'You are not authorized to view this page',
    status: 400
  })
})

router.post('/:id/reviews', async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.id;
  const userId = user.id;
  const spot = await Spot.findByPk(spotId);
  const review = await Review.findOne({ where: { spotId: spotId, userId: userId }});

  if (!spot) {
    return next({
      error: `spot with id ${spotId} does not exist`,
      status: 404
    });
  }

  if (review) {
    return next({
      error: `A review from this use already exists. Cannot submit a new one.`,
      status: 403
    });
  }

  if (user) {
    try {
      const { review, stars } = req.body;

      const newReview = Review.build({
        spotId,
        userId,
        review,
        stars
      });

      await newReview.save();

      return res.json(newReview);

    } catch(err) {
      return next({
        error: err.errors.map(err => err.message),
        status: 400
      });
    }
  }
});

router.post('/:id/images', async (req, res, next) => {
  const { user } = req;
  const id = parseInt(req.params.id);
  const theSpot = await Spot.findByPk(id, {
    where: {
      ownerId: user.id
    }
  });

  try {
    if (theSpot) {
      const { url, preview } = req.body;

      let newImage = SpotImage.build({
        spotId: theSpot.id,
        url,
        preview
      });

      await newImage.save();
      return res.json(newImage);
    }
  } catch (error) {
    return res.json(error);
  }

  next({
    error: `Spot does not exist with given id: ${id}`,
    status: 400
  })
});

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

  if (!spotToEdit) {
    return next({
      error: `spot with id ${id} does not exist.`,
      status: 404
    });
  }

  if (spotToEdit.ownerId === user.id) {
    const { address, city, state, country, lat, lng, name, description, price} = req.body;
    try {
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

    } catch(err) {
      return res.status(400).json(err);
    }
  }
});

router.delete('/:id', async (req, res, next) => {
  const { user } = req;
  const id = req.params.id;
  const spot = await Spot.findByPk(id);

  if (spot.ownerId === user.id){
    await spot.destroy();
    res.json('Successfully removed spot!');
  }

  return next({
    error: `Spot with id ${id} either does not exist or you do not have permission to delete it.`,
    status: 404
  });
});


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
  }
});

router.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500);
  return res.json({ errors: err.error })
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),

  check("city")
  .exists({ checkFalsy: true })
  .withMessage("City is required"),

  check("state")
  .exists({ checkFalsy: true })
  .withMessage("State is required"),

  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),

  check("lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),

  check("lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),

  check("name")
  .exists({ checkFalsy: true })
  .withMessage("Name is required"),

  check("name")
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),

  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),

  check("description")
  .isLength({ min: 10})
  .withMessage("Description must be at least 10 characters long"),

  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),

  handleValidationErrors
];

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
    return res.json({ Spots: spots });
  }

  return next({
    error: 'You are not authorized to view this page',
    status: 400
  })
})

router.get('/:id/reviews', (req, res, next) => {

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

    if (theSpot) {
      const { url, preview } = req.body;

      let newImage = SpotImage.build({
        spotId: theSpot.id,
        url,
        preview
      });

      await newImage.save();
      return res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
      });
    }

  return res.status(404).json({ message: "Spot couldn't be found" });
});

// get spot by id
router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const spot = await Spot.findByPk(id, { raw: true });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
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

// edit review
router.put('/:id',validateSpot, async (req, res, next) => {
  const { user } = req;
  const id = req.params.id;
  const spotToEdit = await Spot.findByPk(id, {
    where: {
      ownerId: user.id
    }
  });

  if (!spotToEdit) {
    return res.status(404).json({ message: "spot couldn't be found" });
  }

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
});

// delete a spot
router.delete('/:id', async (req, res, next) => {
  const { user } = req;
  const id = req.params.id;
  const spot = await Spot.findByPk(id);

  if(!spot) {
    return res.status(404).json({ message: "spot couldn't be found" });
  }

  if (spot.ownerId === user.id){
    await spot.destroy();
    return res.json({message: 'Successfully deleted'});
  }
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
      const stars = await Review.sum('stars',{ where:{ spotId:spot.id }}); // get all stars tied to this spot
      const totalReviews = await Review.count({ where:{ spotId:spot.id }});
      let avg = stars/totalReviews
      spot.avgRating = avg ? avg : 0; // set it!
      // check to see if previewimage is true if true put the url there
      const previewImage = await SpotImage.findOne({ where:{ spotId:spot.id }})
      if(previewImage) spot.previewImage = previewImage.url
      else spot.previewImage = 'invalid';
  }


  return res.json({ Spots: spots });

});

// create a spot
router.post('/',validateSpot, async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  if (user) {
    const newSpot = await Spot.create({
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

    return res.json({
      address: newSpot.address,
      city: newSpot.city,
      state: newSpot.state,
      country: newSpot.country,
      lat: newSpot.lat,
      lng: newSpot.lng,
      name: newSpot.name,
      description: newSpot.description,
      price: newSpot.price
    });
  }
});

module.exports = router;

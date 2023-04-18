const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, SpotImage, Review, User } = require('../../db/models');

// const validateSpot = [
//   check("address")
//     .exists({ checkFalsy: true })
//     .withMessage("Street address is required"),
//   check("city").exists({ checkFalsy: true }).withMessage("City is required"),
//   check("state").exists({ checkFalsy: true }).withMessage("State is required"),
//   check("country")
//     .exists({ checkFalsy: true })
//     .withMessage("Country is required"),
//   check("lat")
//     .isFloat({ min: -90, max: 90 })
//     .withMessage("Latitude is not valid"),
//   check("lng")
//     .isFloat({ min: -180, max: 180 })
//     .withMessage("Longitude is not valid"),
//   check("name").exists({ checkFalsy: true }).withMessage("Name is required"),
//   check("name")
//     .isLength({ max: 49 })
//     .withMessage("Name must be less than 50 characters"),
//   check("description")
//     .exists({ checkFalsy: true })
//     .withMessage("Description is required"),
//   check("price")
//     .exists({ checkFalsy: true })
//     .withMessage("Price per day is required"),
//   handleValidationErrors,
// ];

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

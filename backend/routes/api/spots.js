const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');

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

const validateReview = [
  check("review")
  .isLength({ min: 10 })
  .withMessage("Review must have a minimum of 10 characters"),

  check("review")
  .exists({ checkFalsy: true })
  .withMessage("Review text is required"),

  check("stars")
  .isInt({ min: 1, max: 5 })
  .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
]

// create a review for a spot
router.post('/:id/reviews', validateReview, async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.id;
  const userId = user.id;
  const spot = await Spot.findByPk(spotId);
  const review = await Review.findOne({ where: { spotId: spotId, userId: userId }});
  const reviewTotal = await Review.count('id');
  if (!spot) {
    return res.status(404).json({ error: `spot couldn't be found` });
  }

  if (review) {
    return res.status(500).json({ message: `User already has a review for this spot` });
  }

  if (user) {
    const { review, stars } = req.body;

    const newReview = await Review.create({
      spotId,
      userId,
      review,
      stars
    });

    return res.json({
      id: reviewTotal + 1,
      spotId: newReview.spotId,
      userId: newReview.userId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt
    });

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

// edit spot
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
  //TODO: use update method to replace build and save;
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
});
// get bookings by spot id
router.get('/:spotId/bookings', async (req, res) => {
  const { user } = req;
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  const bookings = await Booking.findAll({
    where: {
      spotId: spotId,
    },
    attributes: {
      include: ['id']
    },
    raw: true
  });

  if (!spot) return res.status(404).json({ message: "spot couldn't be found" });

  for (let booking of bookings) {
    if (booking.userId === user.id) {
      const owner = await User.findByPk(user.id, {
        attributes: {
          exclude: ['username']
        }
      });
      booking.User = owner;
    } else {
      return res.json({
        Bookings: {
          spotId: booking.spotId,
          startDate: booking.startDate,
          endDate: booking.endDate
        }
      });
    }
  }


  return res.json({ Bookings: bookings });
});

// get review by spot id
router.get('/:id/reviews', async (req, res) => {
  const spotId = req.params.id;
  const spot = await Spot.findByPk(spotId);
  const allReviews = await Review.findAll({
    where: {
      spotId: spotId
    },
    raw: true
  });

  if (!spot) {
    return res.status(404).json({ message: "spot doesn't exist" });
  }

  for(let review of allReviews) {
    const reviewId = review.id;
    const user = await User.findOne({
      where: {
        id: review.userId
      },
      attributes: ['id', 'firstName', 'lastName']
    });
    const reviewImages = await ReviewImage.findAll({
      where: {
        reviewId: reviewId
      },
      attributes: ['id', 'url']
    });

    review.User = user;
    review.ReviewImages = reviewImages
  }


  return res.json({Reviews: allReviews });
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

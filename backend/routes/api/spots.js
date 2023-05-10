const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const { Op } = require('sequelize');

const checkPagination = (body, res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = body;
  const errObj = {};

  if (page && page < 1) errObj.page = "Page must be greater than or equal to 1";

  if (size && size < 1) errObj.size = "Size must be greater than or equal to 1";

  if (minLat && (minLat < -90 || minLat > 90)) errObj.minLat = "Minimum latitude is invalid";

  if (maxLat && (maxLat < -90 || maxLat > 90)) errObj.maxLat = "Maximum latitude is invalid";

  if (minLng && (minLng < -180 || minLng > 180)) errObj.maxLat = "Minimum longitude is invalid";

  if (maxLng && (maxLng < -180 || maxLng > 180)) errObj.maxLat = "Maximum longitude is invalid";

  if ((minPrice && minPrice < 0)) errObj.minPrice = "Minimum price must be greater than or equal to 0";

  if ((maxPrice && maxPrice < 0)) errObj.maxPrice = "Maximum price must be greater than or equal to 0";

  if(Object.keys(errObj).length) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errObj
    })
  }
};

const validateSpotEdit = (body, res) => {
  const { address, city, state, country } = body;
  const errorsObj = {};

  if (address) {
    if (address.length < 5 || address.length > 30) {
      errorsObj.address = "Address needs to be between 5 and 30 characters";
    }
  }

  if (city) {
    if (city.length < 2 || city.length > 18) {
      errorsObj.city = "City needs to be between 2 and 18 characters";
    }
  }

  if (state) {
    if (state.length < 1 || state.length > 12) {
      errorsObj.state = "State needs to be between 1 and 12 characters";
    }
  }

  if (country) {
    if (country.length < 3 || country.length > 57) {
      errorsObj.country = "Country needs to be 3 and 57 characters";
    }
  }

  if(Object.keys(errorsObj).length) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errorsObj
    })
  }
}

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
    .exists({ checkNull: false }),

  // check("lat")
  //   .isFloat({ min: -90, max: 90 })
  //   .withMessage("Latitude is not valid"),

  check("lng")
    .exists({ checkNull: false }),

  // check("lng")
  //   .isFloat({ min: -180, max: 180 })
  //   .withMessage("Longitude is not valid"),

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
];

// create a booking from a spot
router.post('/:id/bookings', async (req, res) => {
  const { user } = req;
  const spotId = parseInt(req.params.id);

  if (user) {
    const { startDate, endDate } = req.body;
    const spot = await Spot.findOne({ where: { id: spotId }, include: {model: Booking }});

    if (!spot) return res.status(404).json({ message: "spot couldn't be found" });

    const spotBookings = spot.Bookings;
    const bodyStartDate = new Date(startDate + ' ').toDateString()
    const bodyEndDate = new Date(endDate + ' ').toDateString()
    const convertedBSD = new Date(bodyStartDate).getTime() // conv to time
    const convertedBED = new Date(bodyEndDate).getTime()
    const today = new Date();

    if (convertedBSD < today.getTime() && bodyStartDate != today.toDateString()) {
      return res.status(400).json({
        message: "Cannot book dates in the past"
      })
    }

    if (convertedBED <= convertedBSD) return res.status(400).json({
      message: "Bad request",
      errors: {
        endDate: "endDate cannot be on or before startDate"
      }
    })

    if (spot.ownerId !== user.id) {
      // for each booking, convert the time for the start and end date then compare to the bodys start and end date and throw errors if confliction is found.
      for(let booking of spotBookings) {
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
      // create booking if no conflicton is found
      const newBooking = await Booking.create({
        spotId: spotId,
        userId: user.id,
        ...req.body
       });

       return res.json(newBooking);
    }
  }
  // if spot owned by owner
  return res.status(403).json({ message: "Forbidden" });
});

// create a review for a spot
router.post('/:id/reviews', validateReview, async (req, res, next) => {
  const { user } = req;
  const spotId = parseInt(req.params.id);
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

    return res.json(newReview);

  }
});
// create image for spot
router.post('/:id/images', async (req, res, next) => {
  const { user } = req;
  const id = parseInt(req.params.id);
  const theSpot = await Spot.findByPk(id)

  if (!theSpot) return res.status(404).json({ message: "Spot couldn't be found" });

  if (!user) return res.status(401).json({ message: "Authentication required" });

  if (theSpot.ownerId != user.id) return res.status(403).json({ message: "Forbidden" });

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
});

// edit spot
router.put('/:id', async (req, res, next) => {
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

    validateSpotEdit(req.body, res);

    if (address) spotToEdit.address = address;
    if (city) spotToEdit.city = city;
    if (state) spotToEdit.state = state;
    if (country) spotToEdit.country = country;
    if (lat) spotToEdit.lat = lat;
    if (lng) spotToEdit.lng = lng;
    if (name) spotToEdit.name = name;
    if (description) spotToEdit.description = description;
    if (price) spotToEdit.price = price;

    await spotToEdit.save();
    return res.json(spotToEdit);
  }
});

// delete a spot
router.delete('/:id', async (req, res) => {
  const { user } = req;
  const id = req.params.id;
  const spot = await Spot.findOne({ where: { id: id }});

  if (!user) return res.status(401).json({
    error: "Authentication required"
  });

  if(!spot) {
    return res.status(404).json({ message: "spot couldn't be found" });
  }

  if (spot.ownerId == user.id){
    await spot.destroy();
    return res.json({message: 'Successfully deleted'});
  }

  return res.status(403).json({ message: "Forbidden" });
});
// get current users spots
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

      spot.avgRating = avg ? avg : 0;

    }
    return res.json({ Spots: spots });
  }

  return res.status(401).json({
    error: "Authentication required"
  });
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

  if (!user) return res.status(401).json({ error: "Authentication required" });

  if (!spot) return res.status(404).json({ message: "spot couldn't be found" });

  for (let booking of bookings) {
    if (spot.ownerId === user.id) {
      const owner = await User.findByPk(booking.userId, {
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
    return res.status(404).json({ message: "spot couldn't be found" });
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
  // const spot = await Spot.findByPk(id, {
  //   include: [{ model: SpotImage, attributes: ['id', 'url', 'preview']}, { model: User, attributes: ['id', 'firstname', 'lastname']}],
  //   // raw: true
  // } );

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
  else spot.spotImages = [];

  return res.json(spot);

})

// Get all spots
router.get('/', async (req, res, next) => {
  let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  const pagination = {
    where: {}
  }

  checkPagination(req.query, res)

  const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
  const size = req.query.size === undefined ? 20 : parseInt(req.query.size);

  if (!page) page = 1;
  if (!size) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;
  if (page >= 1 && size >=1) {
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }

  if (minLat !== undefined && maxLat !== undefined) pagination.where.lat = {[Op.between]: [minLat, maxLat]};

  if (minLat != undefined && maxLat == undefined) pagination.where.lat = {[Op.gte]: minLat};

  if (minLat == undefined && maxLat != undefined) pagination.where.lat = {[Op.lte]: maxLat};

  if (minLng != undefined && maxLng != undefined) pagination.where.lng = {[Op.between]: [minLng, maxLng]};

  if (minLng != undefined && maxLng == undefined) pagination.where.lng = {[Op.gte]: minLng};

  if (minLng == undefined && maxLng != undefined) pagination.where.lng = {[Op.lte]: maxLng};

  if (minPrice != undefined && maxPrice != undefined) pagination.where.price = {[Op.between]: [minPrice, maxPrice]};

  if (minPrice != undefined && maxPrice == undefined) pagination.where.price = {[Op.gte]: minPrice};

  if (minPrice == undefined && maxPrice != undefined) pagination.where.price = {[Op.lte]: maxPrice};

  const spots = await Spot.findAll({
    raw: true,
    where: pagination.where,
    limit: pagination.limit,
    offset: pagination.offset
  })

  if (!spots) {
    return res.status(400).json({
      message: 'Spots cannot be retrieved'
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

  return res.json({ Spots: spots, page, size });

});

// create a spot
router.post('/', validateSpot, async (req, res) => {
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

    return res.json(newSpot);
  }
});

module.exports = router;

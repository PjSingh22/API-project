const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');
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

router.put('/:reviewId', validateReview, async (req, res) => {
  const { user } = req;

  if (user) {
    const reviewId = req.params.reviewId;
    const editRev = await Review.findByPk(reviewId);

    if (!editRev || editRev.userId != user.id) {
      return res.status(404).json({ message: "Review couldn't be found" });
    }

    await editRev.update({ ...req.body });

    return res.json(editRev);
  }
})

router.post('/:id/images', async (req, res, next) => {
  const { user } = req;
  const reviewId = req.params.id;
  const userId = user.id;
  const review = await Review.findOne({
    where: {
      id: reviewId,
      userId: userId
    }
  });
  // get count of all reviewImages on current review to use in following if statement
  const reviewImages = await ReviewImage.count({
    where: {
      reviewId: reviewId
    }
  });
  // check if the max amount of images is reached and throw error if reached
  if (reviewImages > 10) {
    return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
  }

  if (review) {
    const { url } = req.body;
    const newImage = ReviewImage.build({
      reviewId,
      url
    });

    await newImage.save();

    res.json({
      id: newImage.id,
      url: newImage.url
    });
  } else {
    return res.status(404).json({ message: `Review couldn't be found` });
  }
});

router.get('/current', async (req, res) => {
  const { user } = req;

  if (user) {
    const foundUser = await User.findByPk(user.id, {
      attributes: ['id', 'firstName', 'lastName']
    });
    const reviews = await Review.findAll({
      where: {
        userId: user.id
      },
      attributes: {
        exclude: []
      },
      raw: true
    });

    for (let review of reviews) {
      const spot = await Spot.findOne({
        where: {
          id: review.spotId
        },
        attributes: {
          exclude: ['description', 'createdAt', 'updatedAt']
        },
        raw: true
      });

      const reviewImages = await ReviewImage.findAll({
        where: {
          reviewId: review.id
        },
        attributes: ['id', 'url']
      })
      const previewImage = await SpotImage.findOne({where:{spotId:spot.id}})
      if (previewImage) spot.previewImage = previewImage.url
      else spot.previewImage = 'invalid';

      review.reviewImages = reviewImages;
      review.User = foundUser;
      review.Spot = spot
    }

    return res.json({ Reviews: reviews });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const { Review, ReviewImage, User, Spot, SpotImage } = require('../../db/models');

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
  const reviewImages = await ReviewImage.findAll({
    where: {
      reviewId: reviewId
    }
  });

  if (reviewImages.length > 3) {
    return next({
      error: 'Cannot add any more images to review',
      status: 403
    });
  }

  if (review) {
    const { url } = req.body;
    const newImage = ReviewImage.build({
      reviewId,
      url
    });

    await newImage.save();

    res.json(newImage);
  } else {
    return next({
      error: `review with id ${reviewId} does not exist`,
      status: 404
    });
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

router.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500);
  return res.json({ errors: err.error })
});

module.exports = router;

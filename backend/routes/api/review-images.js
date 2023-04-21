const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Review, ReviewImage, User, Spot, SpotImage, Booking } = require('../../db/models');

router.delete('/:id', async (req, res) => {
  const { user } = req;
  const imageId = req.params.id;
  const reviewImage = await ReviewImage.findByPk(imageId, {
    include: [{model: Review }]
  });

  if (!user) return res.status(401).json({ message: "Authentication required" });

  if (!reviewImage) return res.status(404).json({
    message: "Review Image couldn't be found"
  })

  if (reviewImage.Review.userId === user.id) {
    await reviewImage.destroy();

    return res.json({
      message: "Successfully deleted"
    })
  }
  // if not owned by current user
  return res.status(403).json({ message: "Forbidden" });
})

module.exports = router;

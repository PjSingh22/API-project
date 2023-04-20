const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Review, ReviewImage, User, Spot, SpotImage, Booking } = require('../../db/models');

router.delete('/:id', async (req, res) => {
  const { user } = req;
  const imageid = req.params.id
  const image = await SpotImage.findByPk(imageid, {
    include: [{model: Spot}]
  });

  if (user && image.Spot.ownerId == user.id) {
    await image.destroy();

    return res.json({
      message: "Successfully deleted"
    })
  }

  return res.status(404).json({
    message: "Spot Image couldn't be found"
  })
})

module.exports = router;

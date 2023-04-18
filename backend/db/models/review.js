'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(
        models.ReviewImage,
        {
          foreignKey: 'reviewId'
        }
      );
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'spotId is required' },
        isInt: true,
        notEmpty: { msg: 'spotId is required' }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'ownerId is required' },
        isInt: true,
        notEmpty: { msg: 'ownerId is required' }
      }
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'review cannot be empty' },
        notEmpty: { msg: 'review cannot be empty' },
        minLength(value) {
          if (value.length < 10) {
            throw new Error('review must be a minimum length of 10 characters');
          }
        }
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notNull: { msg: 'rating is required' },
        notEmpty: { msg: 'rating is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};

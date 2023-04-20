'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(
        models.Review,
        {
          foreignKey: 'reviewId'
        }
      )
    }
  }
  ReviewImage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'reviewId is required' },
        isInt: true,
        notEmpty: { msg: 'reviewId is required' }
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
        notNull: { msg: 'url is required'},
        notEmpty: { msg: 'url is required'}
      }
    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};

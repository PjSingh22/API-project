'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );
    }
  }
  Booking.init({
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
        notNull: { msg: 'userId is required' },
        isInt: true,
        notEmpty: { msg: 'userId is required' }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'Start date needs to be a date'},
        notNull: { msg: 'Start date is required' },
        notEmpty: { msg: 'Start date is required' }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'End date needs to be a date'},
        notNull: { msg: 'End date is required' },
        notEmpty: { msg: 'End date is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
    defaultScope: {
      attributes: {
        include: ['id']
      }
    }
  });
  return Booking;
};

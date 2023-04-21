'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,
        {
          foreignKey: 'ownerId'
        }
      );

      Spot.hasMany(
        models.SpotImage,
        {
          foreignKey: 'spotId', onDelete: 'CASCADE',  hooks: true,
          as: 'previewImage'
        }
      );

      Spot.belongsToMany(
        models.User,
        {
          through: models.Review,
          foreignKey: 'spotId',
          otherKey: 'userId'
        }
      );

      Spot.belongsToMany(
        models.User,
        {
          through: models.Booking,
          foreignKey: 'spotId',
          otherKey: 'userId'
        }
      );

      Spot.hasMany(
        models.Review,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        }
      );

      Spot.hasMany(
        models.Booking,
        {
          foreignKey: 'SpotId'
          // onDelete: 'CASCADE',
          // hooks: true
        },

      )
    }

  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Address is required' },
        len: [5, 30],
        notEmpty: { msg: 'Address is required'}
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'City is required' },
        len: [2, 18],
        notEmpty: { msg: 'City is required'}
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'State is required' },
        len: [1, 12],
        notEmpty: { msg: 'State is required'}
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Country is required' },
        len: [3, 57],
        notEmpty: { msg: 'Country is required'}
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: { msg: 'Lat is required' },
        isFloat: true,
        notEmpty: { msg: 'Lat is required'}
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: { msg: 'Lng is required' },
        isFloat: true,
        notEmpty: { msg: 'Lng is required'}
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Name is required' },
        notEmpty: { msg: 'Name is required'}
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Description is required' },
        notEmpty: { msg: 'Description is required'}
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: { msg: 'Price is required' },
        notEmpty: { msg: 'Price is required'}
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    // defaultScope: {
    //   attributes: {
    //     include: ['id']
    //   }
    // }
  });
  return Spot;
};

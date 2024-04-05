'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Withdrawals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Withdrawals.init({
    isAllowed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Withdrawals',
  });
  return Withdrawals;
};
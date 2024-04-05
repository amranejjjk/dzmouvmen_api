'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BaridmobValue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BaridmobValue.init({
    value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BaridmobValue',
  });
  return BaridmobValue;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    price: DataTypes.STRING,
    product_desc: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_images: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};
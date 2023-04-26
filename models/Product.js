// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

class Product extends Model {}

Product.init(
  {
    // Created all required columns for Product model
    id: {
      // Id is and integer, the primary key, and will auto increment.
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      // Product name is a string
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      // Price is a decimal and used the validate property to make sure it is correct
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    stock: {
      // Set a default value of 10 for stock and also validates it to be only a number
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        isNumeric: true,
      },
    },
    category_id: {
      // Category_id is referenced from the category model id to create a relationship
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;

const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');
const Product = require('./Product');

class ProductTag extends Model {}

ProductTag.init(
  { //Id will be primary key and auto increment
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: { 
      // References the product model's id colum
      type: DataTypes.INTEGER,
      references: {
        model: 'poduct',
        key: 'id'
      }
    },
    tag_id: {
      //references the tag model's id column
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;

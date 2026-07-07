import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.id;
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Dark Chocolate', 'Milk Chocolate', 'Nut Chocolate', 'White Chocolate', 'Gift Box'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    get() {
      const value = this.getDataValue('price');
      return value === null ? null : parseFloat(value);
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  numReviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

export default Product;
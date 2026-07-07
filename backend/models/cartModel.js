import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Cart = sequelize.define('Cart', {
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // A user has only one cart
    references: {
      model: User,
      key: 'id'
    }
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
});

// Associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Cart;

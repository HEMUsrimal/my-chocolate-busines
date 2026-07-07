import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Order = sequelize.define('Order', {
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
    references: {
      model: User,
      key: 'id'
    }
  },
  orderItems: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentResult: {
    type: DataTypes.JSON,
    allowNull: true
  },
  itemsPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Order;
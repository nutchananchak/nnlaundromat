const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_number: {
    type: DataTypes.STRING(20),
    unique: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rider_id: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  },
  service_id: {
    type: DataTypes.INTEGER,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 'driver_accepted', 'picked_up',
      'washing', 'washing_done', 'delivering',
      'delivered', 'cancelled'
    ),
    defaultValue: 'pending',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  note: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'Order_Table',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Order;
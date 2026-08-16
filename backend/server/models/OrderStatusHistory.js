const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
  history_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'Order_Status_History',
  timestamps: true,
  createdAt: 'updated_at',
  updatedAt: false,
});

module.exports = OrderStatusHistory;
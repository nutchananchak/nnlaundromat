const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Rider = sequelize.define('Rider', {
  rider_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
  },
  status: {
    type: DataTypes.ENUM('online', 'offline'),
    defaultValue: 'offline',
  },
}, {
  tableName: 'Rider',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Rider;
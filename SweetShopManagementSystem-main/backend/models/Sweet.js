const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


sweetSchema.pre('save', function(next) {
  this.inStock = this.quantity > 0;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Sweet', sweetSchema);
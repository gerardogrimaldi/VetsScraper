'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Vet Schema
 */
var VetSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Vet name',
    trim: true
  },
  url: {
    type: String, required: true, trim: true
  },
  details: {
    type: String
  },
  site: {
    type: String
  },
  location: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  date_created: {
    type: Date, required: true, default: Date.now
  }
});


module.exports = mongoose.model('Vet', VetSchema);
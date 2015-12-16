'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
	'name': { type: String, uppercase: true }
});

module.exports = mongoose.model('Stock', Stock);
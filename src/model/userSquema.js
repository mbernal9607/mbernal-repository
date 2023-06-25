const mongoose = require('mongoose');

const schema = mongoose.Schema({
    id: {type: Number, required: true},
    email: {type: String, required: true},
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('user', schema);
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, min: 6, unique: true },
    password: { type: String, required: true }
});

const User = model('User', userSchema);

module.exports = User;

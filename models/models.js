const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    locationName: String,
    address: String,
    reviewerProfilePicSrc: String,
    reviewerName: String,
    rating: Number,
    reviewText: String,
    reviewDate: String
})

const userSchema = new mongoose.Schema({
    username: String,
    userLocation: Object
})

const Review = mongoose.model('Reviews', reviewSchema, 'reviews');
const User = mongoose.model('Users', userSchema, 'users');


module.exports = {Review, User}
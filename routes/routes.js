const express = require('express');
const router = express.Router();
const {getAllReviews, userLocation, getCategories, getReviewsOfPlace} = require('../controllers/controllers');


router.route('/').get(getAllReviews)
router.route('/userLocation').post(userLocation)
router.route('/categories').get(getCategories)
router.route('/search').get(getReviewsOfPlace)




module.exports = router;
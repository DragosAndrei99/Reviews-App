const express = require('express');
const router = express.Router();
const {getAllReviews,
    userLocation, 
    getCategories, 
    getReviewsOfPlace,
    addReview, 
    getLocation} = require('../controllers/controllers');


router.route('/').get(getAllReviews);
router.route('/userLocation').post(userLocation);
router.route('/categories').get(getCategories);
router.route('/search').get(getReviewsOfPlace);
router.route('/addReview').get(addReview);
router.route('/addReview/location').get(getLocation);




module.exports = router;
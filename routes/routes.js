const express = require('express');
const router = express.Router();
const {getAllReviews, userLocation} = require('../controllers/controllers');


router.route('/').get(getAllReviews)
router.route('/userLocation').post(userLocation)



module.exports = router;
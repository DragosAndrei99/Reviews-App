const {Review, User, Category} = require('../models/models');
const {
    asyncWrapper
} = require('../middleware/async');

const {getNearbyPlaces, getDetailedPlaceInfo, getSearchedPlace, setReviews} = require('../scripts/scripts');

const userLocation = asyncWrapper(async (req, res, next)=>{
    const longitude = req.body.position.longitude
    const latitude = req.body.position.latitude

    //send it to the database 
    //check if user already exist in our database and update if needed
    const loggedUser = req.oidc.user;
    const username = loggedUser.nickname;
    let query = {username: username},
        update = {$set:{userLocation:{longitude, latitude}}} ,
        options = { upsert: true, setDefaultsOnInsert: true };
    User.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        res.status(200).json(result);
    })
})

const getAllReviews = asyncWrapper(async (req, res, next) => {
    let category = req.query.category;
    if(category === undefined){
        category = '';
    }
    const completeData = [];
    let userLocation = '';
    const radius = 50000;
    //get user location
    const user = await User.findOne({username:req.oidc.user.nickname}).exec();
    //check for user location
    if(user && user.userLocation){
        userLocation = user.userLocation;
    }
    //make api call for all nearby places
    const data = await getNearbyPlaces(userLocation, category, radius);
    const nearbyPlaces = data.results;
    //make api call for detailed information for each nearby place
    for(location of nearbyPlaces){
        let detailedPlaceInfo = await getDetailedPlaceInfo(location)
        if(detailedPlaceInfo.result.reviews){
            completeData.push({
                locationName: detailedPlaceInfo.result.name,
                address: detailedPlaceInfo.result.adr_address.includes('span') ? detailedPlaceInfo.result.adr_address.replace(/<[^>]*>/g, '') : detailedPlaceInfo.result.adr_address,
                reviewerProfilePicSrc: detailedPlaceInfo.result.reviews[0].profile_photo_url,
                reviewerName: detailedPlaceInfo.result.reviews[0].author_name,
                rating: detailedPlaceInfo.result.reviews[0].rating,
                reviewText: detailedPlaceInfo.result.reviews[0].text,
                reviewDate: detailedPlaceInfo.result.reviews[0].time
            })
        }
    }
    res.status(200).render('homepage', {reviews:completeData});
});

const getCategories= asyncWrapper(async (req, res, next)=>{
    const categories = await Category.find();
    res.status(200).json(categories)
})

const getReviewsOfPlace = asyncWrapper(async(req, res, next)=>{
    const data = await getSearchedPlace(req.query.locationName)
    res.status(200).render('homepage', {reviews: setReviews(data)})
})

const addReview = asyncWrapper(async(req, res, next)=>{
    const locationName = req.query.locationName;
    if (locationName) {
        const data = await getSearchedPlace(req.query.locationName)
        const locationCoords = data.result.geometry.location
        return  res.status(200).render('add_review', {locationCoords});

    }
    return res.status(200).render('add_review');
})

const getLocation = asyncWrapper(async(req, res, next)=>{
    const user = await User.findOne({username:req.oidc.user.nickname}).exec();
    let userLocation = '';
    if(user && user.userLocation){
        userLocation = user.userLocation;
    }
    res.status(200).json(userLocation)
})


module.exports = {
    getAllReviews,
    userLocation,
    getCategories,
    getReviewsOfPlace,
    addReview,
    getLocation
};
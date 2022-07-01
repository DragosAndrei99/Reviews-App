const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.API_KEY;

const config = {
    method: '',
    url: '',
    headers: {}
}

function apiCall(config){
    return axios(config)
    .then(response => {
        return response.data
    })
    .catch(error =>{
        console.log(error);
    });
}


//get nearby locations of the current location
function getNearbyPlaces(userLocation, category, radius){
    config.method = 'get';
    config.url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&fields=place_id&location=${userLocation.latitude},${userLocation.longitude}&radius=${radius}&type=${category}&business_status=OPERATIONAL`
    return apiCall(config).then(response =>{
        return response
    });
}

// some locations might not have review field
function getDetailedPlaceInfo(data){
    placeId= data.place_id;
    config.method = 'get';
    //add fields query param in the api call url for making the call take less time
    config.url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
    return apiCall(config).then(response =>{
        return response
    });
}
function getSearchedPlace(textInput){
    config.method = 'get';
    config.url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${textInput}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    return apiCall(config).then(response =>{
        return getDetailedPlaceInfo(response.candidates[0])
    });
}
function setReviews(data){
    const completeReviews = [];
    if(data.result.reviews){
        for(review of data.result.reviews){
            completeReviews.push({
                locationName: data.result.name,
                address: data.result.adr_address.includes('span') ? data.result.adr_address.replace(/<[^>]*>/g, '') : data.result.adr_address,
                reviewerProfilePicSrc: review.profile_photo_url,
                reviewerName: review.author_name,
                rating: review.rating,
                reviewText: review.text,
                reviewDate: review.time,
                reviewAproxDate: review.relative_time_description
                })
            }
        }
    return completeReviews;
}

module.exports = {getNearbyPlaces, getDetailedPlaceInfo, getSearchedPlace, setReviews}
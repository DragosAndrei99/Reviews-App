const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.API_KEY;

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
    const config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${userLocation.latitude},${userLocation.longitude}&radius=${radius}&type=${category}&business_status=OPERATIONAL`,
    headers: { }
    };

    return apiCall(config).then(response =>{
        return response
    });
}

// some locations might not have review field
function getDetailedPlaceInfo(data){
    let placeId= '';
    let config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/place/details/json?key=${apiKey}&place_id=${placeId}`,
        headers: { }
    };
    placeId= data.place_id;
    config.url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    return apiCall(config).then(response =>{
        return response
    });
}

module.exports = {getNearbyPlaces, getDetailedPlaceInfo}
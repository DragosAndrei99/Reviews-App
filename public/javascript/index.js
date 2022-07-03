const mediaPhone = window.matchMedia("(max-width: 425px)");
const mediaLaptop = window.matchMedia("(max-width: 1440px)");
const mediaTablet = window.matchMedia("(max-width: 768px)");
const divsList=  document.querySelectorAll('#faq');
const divsArray = [...divsList];
const navbar = document.getElementById('myTopNav');
const dataList = document.getElementById('categories');
const categoriesInput  = document.getElementById('categoriesInput');
const categoriesBtn  = document.getElementById('categoriesBtn');
const cards = document.querySelectorAll('.card-container');


showFAQtext();
if(cards){
    displayCards();
}
window.addEventListener('resize', displayCards);
//event listener for location button
if(document.getElementById('get-location')){
    document.getElementById('get-location').addEventListener('click', getLocation);
}
if(dataList){
    renderDataList();
    categoriesBtn.addEventListener('click', function(){
        categoriesInput.value = categoriesInput.value.toLowerCase().replace(/ /g, '_');
    })
}


// FAQ text
function showFAQtext(){
    divsArray.forEach(div =>{
        div.addEventListener('click', function(){
            let text = document.getElementById(div.children[2].id)
            div.classList.toggle('faq-show')
            text.classList.toggle('faq-hidden')
            text.classList.toggle('text-show')
            text.classList.add("animate");
        })
    });
}

// NAVBAR
function responsiveNavbar() {
    if (navbar.className === "topnav") {
        navbar.className += " responsive";
    } else {
        navbar.className = "topnav";
    }
}

// displaying cards on homepages
function displayCards(){
    let numOfCardsPerRow;
    if(mediaTablet.matches){
        numOfCardsPerRow = 1;
    } else if(mediaLaptop.matches){
        numOfCardsPerRow = 2;
    }else {
        numOfCardsPerRow = 3;
    }
    let row = 1;
    let column = 1;
    cards.forEach(card =>{
        card.style['grid-row-start'] = row;
        card.style['grid-column-start'] = column;
        column++;
        if(column === numOfCardsPerRow+1){
            row++;
            column = 1;
        }
    })
};


//get user location
function getLocation() {
    if (!navigator.geolocation) {
        console.log('Geolocation API not supported by this browser.');
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const data = {position: {latitude: latitude, longitude:longitude}};
    //send userlocation to backend
    fetch('/reviewApp/userLocation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
        console.log('Success:', data);
    })
        .catch((error) => {
        console.error('Error:', error);
    });
    window.location.replace('/reviewApp');

}
function error() {
    console.log('Geolocation error!');
    alert('Cannot get nearby places if location is not allowed\n Please visit this page to learn how to get your location: \n https://support.google.com/chrome/answer/142065?hl=en');
    window.location.replace('/reviewApp');
}

//--------SHOW DATA LIST FOR CATEGORIES ------
function renderDataList(){
    //make api call
    fetch('/reviewApp/categories', {
        method: 'GET'
    })
    .then(response =>response.json())
    .then(data =>{
        console.log('Success:', data)
        data[0].categories.forEach(category =>{
            dataList.innerHTML += `<option value="${category.replace(/_/g, ' ').replace(/\b\w/g, c => c. toUpperCase())}"></option>`
        })
    })
    .catch(error =>{
        console.log('Error:', error)
    })
}

//newsletter
const subscribeNewsletter = document.getElementById('subscribeNewsletter');
const emailInput = document.getElementById('emailInput');
function subscribeToNewsLetter(){
    console.log(emailInput.value)
    fetch("/audience/add/member", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({email: emailInput.value})
      }).then(res => {
        console.log("Request complete! response:", res);
      }).catch(error =>{
        console.log("Error: ", error)
      })
}

//get user location 
async function getLocation(){
    let coords = '';
    await fetch("/reviewApp/addReview/location", {
        method: 'GET'
    }).then(res => res.json()
    ).then(data =>{
        coords =  {lat: data.latitude, lng:data.longitude}
    }).catch(error =>{
        console.log(error)
    })
    return coords
}

const mapDiv = document.getElementById("map");
async function initMap(zoom = 10) {
    const coords = await getLocation();
    const map = new google.maps.Map(mapDiv, {
      zoom: zoom,
      center: coords,
    });
    const marker = new google.maps.Marker({
      position: coords,
      map: map,
    });
}
if(mapDiv){
    window.initMap = initMap;
    const outputZoom = document.getElementById('outputZoom');
    const inputZoom = document.getElementById('inputZoom');

    inputZoom.addEventListener('change', function(){
        let zoom = parseInt(outputZoom.innerText);
        initMap(zoom);
    })
}

console.log(locationCoords)


let divsList=  document.querySelectorAll('#faq')
let divsArray = [...divsList]
divsArray.forEach(div =>{
    div.addEventListener('click', function(){
        let text = document.getElementById(div.children[2].id)
        div.classList.toggle('faq-show')
        text.classList.toggle('faq-hidden')
        text.classList.toggle('text-show')
        text.classList.add("animate");
  
        
    })
});

function myFunction() {
    var x = document.getElementById("myTopNav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
}

const mediaPhone = window.matchMedia("(max-width: 425px)");
const mediaLaptop = window.matchMedia("(max-width: 1440px)");
const mediaTablet = window.matchMedia("(max-width: 768px)");

// displaying cards on homepage
function displayCards(){
    const cards = document.querySelectorAll('.card-container')
    let numOfCardsPerRow;
    if(mediaPhone.matches){
        numOfCardsPerRow = 1;
    }else if(mediaTablet.matches){
        numOfCardsPerRow = 2;
    } else if(mediaLaptop.matches){
        numOfCardsPerRow = 3;
    }else {
        numOfCardsPerRow = 4;
    }
    let row = 1;
    let column = 1;
    cards.forEach(card =>{
        card.style['grid-row-start'] = row;
        card.style['grid-column-start'] = column;
        column++;
        if(column === numOfCardsPerRow){
            row++;
            column = 1;
        }
    })
};

displayCards();
//the below line of code is not working properly
window.addEventListener('resize', displayCards);

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

//event listener for location button
if(document.getElementById('get-location')){
    document.getElementById('get-location').addEventListener('click', getLocation);
}


/*
    using ajax request to fetch the data from json file.
 */

// Global products array
let products = [];

//map obj

const productObj = new Map();

//First, create a new XMLhttp-request object.

let http = new XMLHttpRequest();
// the variable http holds now all methods and properties of object.




// the first argument sets the http method
// in the second argument we pass the file where our data lives
// and the last keyword true , sets the request to be async.



// after send the request I need to catch the response
//check the onload eventlistner 

/*

    0: The request is not initialized.
    1: Server connection established.
    2: Request received by the server.
    3: Processing the request on the server.
    4: The request is finished, and the response is ready.



*/

http.onload = function(){
    // inside this function need to check the reeady state and status properties.
    if(this.readyState == 4 && this.status == 200){

        //if we have a successful response, i have to parse the json data
        //and convert them to js array

        let products = JSON.parse(this.responseText);
        for(let data of products){
            productObj.set(data.pid , data);
        }
        console.log(products);
        
        displayProducts(productObj); 

    }

}

//Second, prepare the request with the open() method
http.open('GET', 'products.json', true);
//Next, send the request 

http.send();


//display products function

function displayProducts(productsToDisplay , searchQuery ="") {

    document.querySelector('.products-container').innerHTML = "";
    console.log("This is display:" , searchQuery);

    let productsArray = Array.from(productsToDisplay.values()); // mapobj to array

    let output = "";

    for(let item of productsArray) {

        const matchSearchQuery = item.product_name.toLowerCase().includes(searchQuery);

        console.log(matchSearchQuery);

        if(matchSearchQuery){ //true

            output += `
            <div class="product">
                <img src="${item.img}" alt="${item.product_name}">
                <p class="title">${item.product_name}</p>
                <p class="price">
                    <span>$${item.price}</span>
                    <span>${item.currency}</span>
                </p>
                <p class="cart">Add to cart <i class="ri-shopping-cart-line"></i></p>
            </div>
        `;

        }



    }
    document.querySelector('.products-container').innerHTML = output;
}

// search Bar
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', handleSearch);


// Function to handle the search and display suggestions
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();

    // Debugging: log the search term to console
    console.log('Searching for:', searchTerm);

    // Call this function to display the filtered products
    displayProducts(productObj ,searchTerm);
}






// Humburger Menu


document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('nav-toggle');
    const menu = document.querySelector('.nav-list');
    const breakpoint = 768; // Set this to your mobile breakpoint

    function adjustMenuVisibility() {
        if (window.innerWidth > breakpoint) {
            menu.style.display = ''; // Reset display style
        } else {
            if (menuToggle.checked) {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        }
    }

    menuToggle.addEventListener('change', adjustMenuVisibility);

    // Add resize event listener to adjust menu visibility on window resize
    window.addEventListener('resize', adjustMenuVisibility);

    // Initial adjustment in case the window is resized before any interaction.
    adjustMenuVisibility();
});





// Using jQuery for toggling the search bar

$(document).ready(function(){
    $('#toggle-search').click(function(event){
        // Prevent the default action of the anchor tag
        event.preventDefault();
        
        // Toggle the display of the search bar
        $('#searchBar').toggle('normal', function(){
            // Focus on the search input if it's visible after toggling
            if ($(this).is(':visible')) {
                $(this).focus();
            }
        });


    });
});


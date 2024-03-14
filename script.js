/*
    using ajax request to fetch the data from json file.
 */

//import class
import { Product, CartItem } from "./JS/productClass.js";

// Global products array
let products = [];

//map obj

const productObj = new Map();

//cart object
const cartObj = new Map();

//First, create a new XMLhttp-request object.

let http = new XMLHttpRequest();
// the variable http holds now all methods and properties of object.

// changing language select function
let jsonFileName = "products_en.json"; //default
let language = "en"; //default
$("#selectLang").on("change", function () {
    jsonFileName = "products_" + $("#selectLang").val() + ".json";
    language = $("#selectLang").val();
    load();
    open();
    
});

const notification = document.getElementsByClassName('notification-container')[0];
// Show notification
const showNotification = () => {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000)
}

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
function load() {

    http.onload = function () {
        // inside this function need to check the reeady state and status properties.
        if (this.readyState == 4 && this.status == 200) {

            //if we have a successful response, i have to parse the json data
            //and convert them to js array

            let products = JSON.parse(this.responseText);
            for (let data of products) {
                productObj.set(data.pid, data);
            }
            console.log(products);

            prepareSuggestions();

            displayProducts(productObj,'','',language);

        }

    }

};

load();

let suggestions = [];
// Now that productObj has been populated, generate the suggestions array
function prepareSuggestions() {
    suggestions = Array.from(productObj.values()).map(product => product.product_name);
    console.log("Suggestion Details:", suggestions);// now store in array 
    // Proceed to use suggestions for autofill
}

function open() {
    //Second, prepare the request with the open() method
    http.open('GET', jsonFileName, true);
    //Next, send the request 

    http.send();
}
open();

// search Bar
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', handleSearch);

//filter
function handleFilter() {
    let filterCategory = "";
    $(".filter").click(function () {
        filterCategory = $(this).attr("id");
        displayProducts(productObj, "", filterCategory, language);
    });
    return filterCategory;
}

let filterCategory = handleFilter();
handleFilter();
// Function to handle the search and display suggestions

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();

    // Debugging: log the search term to console
    console.log('Searching for:', searchTerm);

    if (searchTerm == "") {
        displaySuggestions([]);
        return;
    }


    let filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchTerm)
    );


    displaySuggestions(filteredSuggestions);


    // Call this function to display the filtered products
    displayProducts(productObj, searchTerm, filterCategory);




}

// function to display suggestion

function displaySuggestions(filteredSuggestions) {
    const suggestionsContainer = document.querySelector('.resultBox');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (filteredSuggestions.length > 0) {
        const suggestionsHtml = filteredSuggestions.map(suggestion =>
            `<li onclick="selectSuggestion('${suggestion}')">${suggestion}</li>`
        ).join('');

        suggestionsContainer.innerHTML = `<ul>${suggestionsHtml}</ul>`;
        suggestionsContainer.style.display = 'block';

    } else {
        
        suggestionsContainer.innerHTML = `<div class='not-found'>Sorry, we can't find the product.</div>`;
        suggestionsContainer.style.display = 'block';
        
    }
}


function selectSuggestion(suggestion) {
    const searchBar = document.getElementById('searchBar');
    searchBar.value = suggestion;
    console.log("suggestion" + suggestion);



    const suggestionsContainer = document.querySelector('.resultBox ');
    suggestionsContainer.style.display = 'none';

    handleSearch({ target: { value: suggestion } });
}

document.addEventListener('click', function (event) {
    // Get the search bar and the suggestion bar elements
    const searchBar = document.getElementById('searchBar');
    const suggestionBar = document.querySelector('.resultBox');

    // Check if the clicked element is not the search bar and not inside the suggestion bar
    if (!searchBar.contains(event.target) && !suggestionBar.contains(event.target)) {
        // Hide the suggestion bar
        suggestionBar.style.display = 'none';
    }
});

document.querySelector('.resultBox').addEventListener('click', function (event) {
    if (event.target.tagName.toLowerCase() === 'li') {
        const suggestion = event.target.textContent;
        selectSuggestion(suggestion);
    }
});


// Humburger Menu


document.addEventListener('DOMContentLoaded', function () {
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

$(document).ready(function () {
    $('#toggle-search').click(function (event) {
        // Prevent the default action of the anchor tag
        event.preventDefault();

        // Toggle the display of the search bar
        $('#searchBar').toggle('normal', function () {
            // Focus on the search input if it's visible after toggling
            if ($(this).is(':visible')) {
                $(this).focus();
            }
        });


    });
});


/* Shopping Cart*/

// Add Cart functionlity 
// check the item is already exist or not, if yes updated the quantity 
// if not add a new item to the cart

function addToCart(pid, quantity = 1) {
    // Check if the product exists in the product catalog
    if (!productObj.has(pid)) {
        console.error("Product not found with PID:", pid);
        return; // Stop execution if the product does not exist
    }

    const product = productObj.get(pid);
    let cartItem = cartObj.get(pid);

    // If the product is already in the cart, update the quantity
    if (cartItem) {
        cartItem.quantity++;
        $("#alert").text("Item already in cart, updating count");
        showNotification();
        // alert("Item already in cart, updating count");
        console.log("Item already in cart, updating count:", cartItem);
    } else {
        // If the product is not in the cart, add it with the given quantity
        cartItem = new CartItem(product, quantity);
        console.log("New item, adding to cart:", cartItem);

        $("#alert").text("New item, adding to cart");
        showNotification();
        // alert("New item, adding to cart");
    }



    // Update the cart with the new or updated item
    cartObj.set(pid, cartItem);
    displayCartItems(); // Assuming this function properly displays cart items


}




document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to a parent container
    document.querySelector('.products-container').addEventListener('click', function (event) {
        // Use event delegation to check if the clicked element is an add-to-cart button
        if (event.target.closest('.add-to-cart')) {
            const pid = event.target.closest('.add-to-cart').getAttribute('data-pid');
            console.log(`Adding product with PID: ${pid} to cart`); // Debug log
            addToCart(pid);
        }
    });
});




function displayCartItems() {
    const cartTable = document.querySelector('.show-cart');
    let totalCartAmount = 0;
    let output = "";

    // Start table structure
    output += `
    <thead>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Delete</th>
        </tr>
    </thead>
    <tbody>
    `;

    // Iterate over cart items and create table rows
    cartObj.forEach((cartItem, pid) => {
        // Access product details through the `product` property of `CartItem`
        const product = cartItem.product;
        const subtotal = product.price * cartItem.quantity; // Use `product.price` and `cartItem.quantity`
        totalCartAmount += subtotal;
        output += `
        <tr>
            <td>${product.product_name}</td> 
            <td>${product.price.toFixed(2)}</td> 
            <td>${cartItem.quantity}</td> 
            <td>${subtotal.toFixed(2)}</td>
            <td>
            <button class="btn btn-danger btn-sm removeItem" data-pid="${pid}">Remove</button>
            </td>
        </tr>
        `;
    });



    // Close tbody
    output += `</tbody>`;

    // Set the innerHTML of the cart table to the newly created rows
    cartTable.innerHTML = output;

    // Update the total cart amount display
    document.querySelector('.total-cart').textContent = totalCartAmount.toFixed(2);

    document.querySelectorAll('.removeItem').forEach(button => {
        button.addEventListener('click', removeHandler);
    });
}
function removeHandler(e) {
    const pid = e.target.getAttribute('data-pid'); // Get the product ID
    if (cartObj.has(pid)) {
        cartObj.delete(pid); // Remove the item from the cart
        displayCartItems(); // Refresh the cart display to show updated cart
    }
}



document.querySelector('.btn-primary').addEventListener('click', () => {
    cartObj.clear(); // Clear the cart
    displayCartItems(); // Update the UI
});



//display products function

function displayProducts(productsToDisplay, searchQuery = "", filter = "", language="en") {

    document.querySelector('.products-container').innerHTML = "";
    console.log("This is display:", searchQuery);

    let productsArray = Array.from(productsToDisplay.values()); // mapobj to array

    if (filter != '') {
        let productsArrayFiltered = [];
        for (let i = 0; i < productsArray.length; i++) {
            if (productsArray[i].category == filter) {
                productsArrayFiltered = [...productsArrayFiltered, productsArray[i]];
            }
        }
        productsArray = productsArrayFiltered;
    }

    let output = "";
    let languageText = "";
    if( language == "ch"){
        languageText = "加入購物車";
    }else if(language == "kr"){
        languageText = "장바구니 담기";
    }else{
        languageText = "Add to Cart";
    }

    for (let item of productsArray) {

        const matchSearchQuery = item.product_name.toLowerCase().includes(searchQuery);

        console.log(matchSearchQuery);

        if (matchSearchQuery) { //true

            output += `
            <div class="product">
                <img src="${item.img}" alt="${item.product_name}">
                <p class="title">${item.product_name}</p>
                <p class="price">
                    <span>$${item.price}</span>
                    <span>${item.currency}</span>
                </p>
               
                <p onClick="addToCart('${item.pid}')" data-pid="${item.pid}" class="cart add-to-cart">`+languageText+`<i class="ri-shopping-cart-line"></i></p>
            </div>
        `;

        }



    }
    document.querySelector('.products-container').innerHTML = output;
}



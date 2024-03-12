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

        prepareSuggestions();
        
        displayProducts(productObj); 

    }

}

let suggestions = [];
// Now that productObj has been populated, generate the suggestions array
function prepareSuggestions() {
    suggestions = Array.from(productObj.values()).map(product => product.product_name);
    console.log("Suggestion Details:", suggestions);// now store in array 
    // Proceed to use suggestions for autofill
}

//Second, prepare the request with the open() method
http.open('GET', 'products.json', true);
//Next, send the request 

http.send();

// search Bar
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', handleSearch);


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
               
                <p onclick="addToCart('${item.pid}')" class="cart">Add to Cart <i class="ri-shopping-cart-line"></i></p>
            </div>
        `;

        }



    }
    document.querySelector('.products-container').innerHTML = output;
}



// Function to handle the search and display suggestions
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();

    // Debugging: log the search term to console
    console.log('Searching for:', searchTerm);

    if(searchTerm == ""){
        displaySuggestions([]);
        return;
    }


    let filteredSuggestions = suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(searchTerm)
        );

    
    displaySuggestions(filteredSuggestions);


    // Call this function to display the filtered products
    displayProducts(productObj ,searchTerm);

    
  
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
        suggestionsContainer.style.display = 'none';
    }
}


function selectSuggestion(suggestion) {
    const searchBar = document.getElementById('searchBar');
    searchBar.value = suggestion;
    
   document.getElementById('searchBar').value = "";


    const suggestionsContainer = document.querySelector('.resultBox ');
    suggestionsContainer.style.display = 'none';

    handleSearch({ target: { value: suggestion } }); 
}

document.addEventListener('click', function(event) {
    // Get the search bar and the suggestion bar elements
    const searchBar = document.getElementById('searchBar');
    const suggestionBar = document.querySelector('.resultBox');

    // Check if the clicked element is not the search bar and not inside the suggestion bar
    if (!searchBar.contains(event.target) && !suggestionBar.contains(event.target)) {
        // Hide the suggestion bar
        suggestionBar.style.display = 'none';
    }
});



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


/* Shopping Cart*/



//  function ready(){
//     var removeCartItemButton = document.getElementsByClassName('btn-danger');
//     for (var i = 0 ; i < removeCartItemButton.length; i++){
//         var button = removeCartItemButton[i];
//         button.addEventListener('click', removeCartItem)
//     }

//     var quantityInputs = document.getElementsByClassName('cart-quantity-input');
//     for(var i = 0 ;i < quantityInputs.length ; i++){
//         var input = quantityInputs[i];
//         input.addEventListener('change', quantityChanged);
//     }
    
//     var addToCartButtons = document.getElementsByClassName('shop-item-button');
//     for(var i = 0; i< addToCartButtons.length; i++){
//         var button = addToCartButtons[i];
//         button.addEventListener('click',addToCartClicked)
//     }

//     document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
//  }


//  function purchaseClicked(){
//      alert('Thank you for your purchase!!!');
//      var cartItems = document.getElementsByClassName('cart-items')[0];
//      while(cartItems.hasChildNodes()){
//          cartItems.removeChild(cartItems.firstChild)
//      }
//      updateCartTotal();
//  }

// function removeCartItem(event){
//     var buttonClicked = event.target;
//     buttonClicked.parentElement.parentElement.remove();
//     updateCartTotal();
    
// }

// function  quantityChanged(event){
//     var input = event.target;
//     if(isNaN(input.value) || input.value <= 0 ){
//         input.value = 1;
//     }
//     updateCartTotal();
// }


// function addToCartClicked(event){
//     var button = event.target;
//     var shopItem = button.parentElement.parentElement;
//     var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
//     var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
//     var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
//     addItemToCart(title,price,imageSrc);
//     updateCartTotal();
// }

// function addItemToCart(title, price, imageSrc){
//     var cartRow = document.createElement('tr');
//     cartRow.classList.add('cart-row');
//     var cartItems = document.getElementsByClassName('cart-items')[0];
//     var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

//     for (i = 0; i< cartItemNames.length ; i++){
//         if(cartItemNames[i].innerText == title){
//             alert('This item already has added to the cart!');
//             return
//         }
//     }
//     var cartRowContents = `

//         <td class="cart-item cart-column">
//             <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
//             <span class="cart-item-title">${title}</span>                  
//         </td>
//         <td class="cart-item cart-column">
//             <span class="cart-price cart-column">${price}</span>
//         </td>
//         <td class="cart-item cart-column">
//             <input class="cart-quantity-input" type="number" value="1" style="width: 50px">
//             <button class="btn btn-danger" type="button">Remove</button>
//         </td>        
//     `;
     
            
//     cartRow.innerHTML = cartRowContents;
//     cartItems.append(cartRow);
//     cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
//     cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
// }


// function updateCartTotal(){
//     var cartItemContainer = document.getElementsByClassName('cart-items')[0];
//     var cartRows = cartItemContainer.getElementsByClassName('cart-row');
//     var total = 0;
//     for (var i = 0 ; i< cartRows.length ; i++){
//         var cartRow =cartRows[i];
//         var priceElement = cartRow.getElementsByClassName('cart-price')[0];
//         var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
//         var price = parseFloat(priceElement.innerText.replace('Rs ' , ''))
//         var quantity = quantityElement.value;
//         total = total + (price * quantity);
         
//     }
//     total = Math.round(total * 100 )/100;
//     document.getElementsByClassName('cart-total-price')[0].innerText = 'Rs '+ total + '.00';
 
// }

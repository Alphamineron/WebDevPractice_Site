if (document.readyState == "loading")
	document.addEventListener("DOMContentLoaded", ready);
else ready();
// =================================================================
// 			Above Code Ensures that the JS isn't executed
// 			In case the HTML hasn't been loaded as we are
// 			Using async
// =================================================================

function ready() {
	// Lets stick them with them sticky Event Listeners (Aka NSA Boi)... Stick em all!!
	var removeCartItemButtons = document.getElementsByClassName("btn-danger");
	for (let i = 0; i < removeCartItemButtons.length; i++) {
		let button = removeCartItemButtons[i];
		button.addEventListener("click", removeItem);  // Stick the remove button
	}

	let quantityInputs = document.getElementsByClassName("cart-quantity-input");  // One way of getting <input>
	for (let i = 0; i < quantityInputs.length; i++) {
		let inputElement = quantityInputs[i];
		inputElement.addEventListener("change", quantityChanged);  // Stick the Quantity Input
	}

	let addToCartButtons = document.getElementsByClassName("card-details-btn");
	for (let i = 0; i < addToCartButtons.length; i++) {
		let button = addToCartButtons[i];
		button.addEventListener("click", addToCart);  // Stick the Add To Cart Button
	}

	let purchaseButtons = document.getElementsByClassName("btn-purchase")[0].addEventListener("click", initPurchase);  // Stick Everything
}

// ===================================Event Listeners====================================

function removeItem(event) {
	let btnClicked = event.target;
	btnClicked.parentElement.parentElement.remove();  // Removes the cart-row
	updateCartTotal();   // Ah! So important...
}

function quantityChanged(event) {
	let input = event.target;
	if (isNaN(input.value) || input.value <= 0) {
		input.value = 1;
	}
	updateCartTotal();	// Seriously though, don't forget this!
}

function addToCart(event) {
	button = event.target;		// Lets get some intel...
	let card = button.parentElement.parentElement;
	let title = card.getElementsByClassName("card-title")[0].innerText;
	let price = card.getElementsByClassName("card-details-price")[0].innerText;
	let imgSrc = card.getElementsByClassName("card-image")[0].src;

	// Item is only rendered into the Cart if there isn't any 
	// Duplication, otherwise quantity is increased instead!
	if (!duplicateItemCheck(title)) renderCart(title, price, imgSrc);

	updateCartTotal(); // Never gonna give you up, Never gonna let you down, Never gonna run around and desert you!
}

function initPurchase(event) {
	alert("Thank You For Your Purchase");	// Display a browser alert, no buddy does this nowadays but whatever
	let cart = document.getElementsByClassName("cart")[0];
	while (cart.childElementCount > 1) {  // Because our firstChild is the Header of the Cart which we don't wanna remove!
		cart.removeChild(cart.lastChild);	// Gotta start with last, Gotta save that Header!
	}

	updateCartTotal();	// How can I ever forget you, sweetheart?
}


// ===================================Utility Functions====================================

function updateCartTotal() {
	let total = 0;
	let cartContainer = document.getElementsByClassName("cart")[0];  // Even though we have only one "cart" class element,
	let cartRows = cartContainer.getElementsByClassName("cart-row"); // JS still returns a an array of size 1, hence we use [0]
	for (let i = 1; i < cartRows.length; i++) {
		// Starts from 1 because first row is Header Row
		let cartRow = cartRows[i];
		let priceElement = cartRow.getElementsByClassName("cart-price")[0];
		let quantityElement = cartRow.getElementsByClassName("cart-quantity")[0].getElementsByTagName("input")[0];	// Another way of getting <input>

		// Now, We have to extract the information from these Elements...
		// PARSING THE ELEMENTS:
		let price = priceElement.innerText.replace("$", "");
		price = parseFloat(price);
		let quantity = quantityElement.value;
		quantity = parseInt(quantity);

		// Count Total
		total = total + price * quantity;
	}
	// Updating Total Value in HTML Document
	let cartTotalElement = document
		.getElementsByClassName("cart-total")[0] // This line "cart-total" isn't really needed
		.getElementsByClassName("cart-total-price")[0];
	cartTotalElement.innerText = "$" + Math.round(total * 100) / 100; // Rounding up to 2 decimal places Math.round(<-->*100)/100
}

function duplicateItemCheck(title) {
	var cart = document.getElementsByClassName("cart")[0];
	var cartRows = cart.getElementsByClassName("cart-row");     // IMP: We do this because we need access to Quantity-Input
																	//  NOT just compare the two titles and return....

	for (let i = 1; i < cartRows.length; i++) {
		let cartRow = cartRows[i];

		var cartItemsTitles = cartRow.querySelectorAll(".cart-item span"); // Using CSS Selectors in JS to make our lives better
		for (let i = 0; i < cartItemsTitles.length; i++) {
			if (cartItemsTitles[i].innerText == title) {
				cartRow.getElementsByClassName("cart-quantity-input")[0].value = parseInt(cartRow.getElementsByClassName("cart-quantity-input")[0].value) + 1;
				return true;
			}
		}
	}
	return false;	// false indicates that the Item is not already present in the cart
}

function renderCart(title, price, imgSrc) {
	var cartRow = document.createElement("div");
	// We can insert our variables directly into the string below! So SIMPLE!
	cartRow.innerHTML = `
					<div class="cart-item cart-column">
						<img src="${imgSrc}" width="50">
						<span>${title}</span>
					</div>

					<span class="cart-price cart-column">${price}</span>

					<div class="cart-quantity cart-column">
						<input class="cart-quantity-input" type="number" value="1">
						<button class="btn btn-danger" role="button">REMOVE</button>
					</div>`;

	// Lets not forget to add the "cart-row" styling class
	cartRow.classList.add("cart-row");

	// We now have our <div>, now lets find injection point
	var cart = document.getElementsByClassName("cart")[0];
	cart.append(cartRow);

	// Finally, we also need to add listeners to this new addition...
	cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", removeItem);
	cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChanged);
}
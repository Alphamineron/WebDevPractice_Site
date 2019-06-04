function printClick() {
	console.log("clicked");
}

var removeCartItemButtons = document.getElementsByClassName("btn-danger");
console.log(removeCartItemButtons);

for (let i = 0; i < removeCartItemButtons.length; i++) {
	let button = removeCartItemButtons[i];
	button.addEventListener("click", printClick);
}

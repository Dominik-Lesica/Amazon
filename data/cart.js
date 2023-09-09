export let cart = JSON.parse(localStorage.getItem('cart'));

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export function addToCart(productId, quantity) {
  let matchingItem;

    cart.forEach((Cartitem) => {
      if(productId===Cartitem.productId) {
        matchingItem=Cartitem;
      }
    });

    if(matchingItem) {
      matchingItem.quantity+=quantity;
    } else {
      cart.push({productId, quantity});
    }

    saveToStorage();
};

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => {
    return cartItem.productId !== productId; 
  });

  saveToStorage();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity+=cartItem.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
};

import { getDeliveryOption } from "./delivery-options.js";

export let cart;

loadFromStorage()

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

export function saveToStorage() {
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
    cart.push({
      productId, 
      quantity,
      deliveryOptionId: '1'});
  }

  saveToStorage();
};

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => {
    return cartItem.productId !== productId; 
  });

  saveToStorage();
}

export function renderCartQuantity() {
  let cartQuantity = 0;
  console.log(cart);
  cart.forEach((cartItem) => {
    cartQuantity+=cartItem.quantity;
  });
  return cartQuantity;
}

export function updateCartQuantity() {
  const cartQuantity = renderCartQuantity();
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
};

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find((cartItem) => {
    return cartItem.productId === productId 
  })

  if(!matchingItem) return;
  if(!getDeliveryOption(deliveryOptionId)) return;

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

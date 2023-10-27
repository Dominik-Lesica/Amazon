import { cart, removeFromCart,updateCartQuantity, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import  formatCurrency  from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import deliveryOptions from "../data/delivery-options.js";

function generateCartSummaryHTML() {
  let cartSummeryHtml = '';
  cart.forEach((cartItem) => {
    const {productId} = cartItem;
    let matchingProduct;
    products.forEach((product) => {
      if(product.id===productId) {
        matchingProduct=product;
      };
    });

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption;
    deliveryOptions.forEach((option) => {
      if (deliveryOptionId === option.id) {
        deliveryOption = option;
      }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
  
    cartSummeryHtml+=`<div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>
  
      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">
  
        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary" data-product-id="${productId}">Update</span>
            <input type="number" min="1" max="9" value="${cartItem.quantity}" class="quantity-input js-quantity-input js-quantity-input-${productId}" data-product-id="${productId}">
            <a class="save-link link-primary js-save-link" data-product-id="${productId}">Save</a>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
              Delete
            </span>
          </div>
        </div>
  
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHtml(productId, cartItem)}
        </div>
      </div>
    </div>`;
  });
  updateCartQuantity();
  return cartSummeryHtml;
}

function saveNewQuantity(productId) {
  const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      cartItem.quantity = newQuantity;
    }
  });
  document.querySelector('.js-order-summary').innerHTML = generateCartSummaryHTML();
  document.querySelector(`.js-cart-item-container-${productId}`).classList.remove("is-editing-quantity");
}

function setUpEventListeners () {
  document.querySelectorAll('.update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      document.querySelector(`.js-cart-item-container-${productId}`).classList.add("is-editing-quantity");
    })
  });
  
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      saveNewQuantity(productId);
      setUpEventListeners();
    })
  });

  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keypress', (event) => {
      const productId = input.dataset.productId;
      if(event.key==='Enter') {
        saveNewQuantity(productId);
        setUpEventListeners();
      }
    })
  });
}

function deliveryOptionsHtml(productId, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0
     ? 'FREE'
     : `${formatCurrency(deliveryOption.priceCents)}`;

     const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${productId}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${productId}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>`
  })
  return html;
}

document.querySelector('.js-order-summary').innerHTML = generateCartSummaryHTML();
document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
    updateCartQuantity();
  });
});

document.querySelectorAll('.js-delivery-option').forEach((option) => {
  option.addEventListener('click', () => {
    const {productId, deliveryOptionId} = option.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
    generateCartSummaryHTML();
  })
})
setUpEventListeners();





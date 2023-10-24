import { cart, removeFromCart,updateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import {hello} from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js"
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"

hello();
const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

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
  
    cartSummeryHtml+=`<div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
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
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${productId}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${productId}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${productId}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
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

document.querySelector('.js-order-summary').innerHTML = generateCartSummaryHTML();
document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
    updateCartQuantity();
  });
})
setUpEventListeners();





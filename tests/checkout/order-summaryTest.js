import renderOrderSummary from "../../scripts/checkout/order-summary.js";
import { loadFromStorage, cart } from "../../data/cart.js";

describe('Test suite: renderOrderSummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6'
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d"

  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML=
      '<div class="js-cart-quantity"></div><div class="js-order-summary"></div><div class="js-payment-summary"></div>'

    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();

    renderOrderSummary();
  })

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  })

  function TestProduct2Display() {
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual('Intermediate Size Basketball')
    expect(document.querySelector(`.js-product-price-${productId2}`).innerText).toEqual('$20.95')
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
  }

  it('Displays cart', () => {
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 1');
    
    TestProduct2Display()
  })

  it('Removes a product', () => {
    document.querySelector(`.js-delete-link-${productId1}`).click()

    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);
    expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null)
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
    
    TestProduct2Display()
  })

  it('Updates the delivery option', () => {
    document.querySelector(`.js-delivery-option-input-${productId1}-2`).click();

    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(document.querySelector('.js-shipping-cost').innerText).toEqual('$9.99');
    expect(document.querySelector('.js-total-cost').innerText).toEqual('$46.02')
  })
})
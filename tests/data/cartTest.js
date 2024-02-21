import { addToCart, cart, loadFromStorage, removeFromCart, updateDeliveryOption } from "../../data/cart.js";

const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";
const productId3 = "83d4ca15-0f35-48f5-b7a3-1ea210004f2e";

describe('Test suite: AddToCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  })

  it('Adds an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();
    addToCart(productId1, 1);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId1,
      quantity: 2,
      deliveryOptionId: '1'
    }]));
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].quantity).toEqual(2);
  })

  it('Adds a new product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();

    addToCart(productId1, 1);
    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId1,
      quantity: 1,
      deliveryOptionId: '1'
    }]));
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].quantity).toEqual(1);
  })
})


describe('Test suite: RemoveFromCart', () => {
  beforeEach(() => {
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
  })

  it('Removes a product in the cart', () => {
    removeFromCart(productId2);

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId1)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId1,
      quantity: 1,
      deliveryOptionId: '1'
    }]));
  })

  it('Removes a product that is not in the cart', () => {
    removeFromCart(productId3);

    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual(productId1)
    expect(cart[1].productId).toEqual(productId2)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId1,
      quantity: 1,
      deliveryOptionId: '1'
    },{
      productId: productId2,
      quantity: 1,
      deliveryOptionId: '1'
    }]));
  })
})

describe('Test suite: updateDeliveryOption', () => {
  it('Updates the delivery option of a product in the cart', () => {
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
    })
    loadFromStorage();

    updateDeliveryOption(productId1, '3')
    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId1,
      quantity: 1,
      deliveryOptionId: '3'
    }, {
      productId: productId2,
      quantity: 1,
      deliveryOptionId: '1'
    }]))
  })

  it('Updates the delivery option of a product that is not in the cart', () => {
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
    })
    loadFromStorage();

    updateDeliveryOption(productId3, '3');

    expect(cart.length).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  })

  it('Works with a delivery option that does not exist', () => {
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
    })
    loadFromStorage();
    updateDeliveryOption(productId1, '4');

    expect(cart.length).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  })
})
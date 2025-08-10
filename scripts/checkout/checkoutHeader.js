import {
  Cart
} from "../data/cart.js";

export function showCheckoutHeader() {
  const cart = new Cart('cart');
  
  let itemsQuantity = 0;
  cart.getCartItems().forEach((item) => {
    itemsQuantity += item.quantity;
  });

  document.querySelector('.js-return-to-home-link').innerHTML = `${itemsQuantity} items`;
}
import {
  Cart
} from "../data/cart.js";

const cart = new Cart('cart');

export function showCheckoutHeader() {
  let itemsQuantity = 0;
  cart.getCartItems().forEach((item) => {
    itemsQuantity += item.quantity;
  });
  document.querySelector('.js-return-to-home-link').innerHTML = `${itemsQuantity} items`;
}
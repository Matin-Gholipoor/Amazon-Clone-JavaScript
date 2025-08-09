import {
  cart
} from "../data/cart.js";

export function showCheckoutHeader() {
  let itemsQuantity = 0;
  cart.forEach((item) => {
    itemsQuantity += item.quantity;
  });
  document.querySelector('.js-return-to-home-link').innerHTML = `${itemsQuantity} items`;
}
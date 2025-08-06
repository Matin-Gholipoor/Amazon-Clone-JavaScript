import {
  products
} from "./products.js";

export const cart = [{
    productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
    quantity: 2
  },
  {
    productId: '54e0eccd-8f36-462b-b68a-8182611d9add',
    quantity: 3
  }
];

export function addToCart(productId) {
  let productExists = false;
  let indexInCart;
  let quantity = 1;

  document.querySelectorAll('.js-quantity-selector').forEach((quantitySelector) => {
    if (quantitySelector.dataset.productId === productId)
      quantity = Number(quantitySelector.value);
  })

  cart.forEach((item, index) => {
    if (item.productId === productId) {
      productExists = true;
      indexInCart = index;
    }
  });

  productExists ? cart[indexInCart].quantity += quantity : cart.push({
    productId: productId,
    quantity
  });
}

export function removeFromCart(productId) {
  cart.forEach((itemInCart, index) => {
    if (itemInCart.productId === productId)
      cart.splice(index, 1);
  })
}
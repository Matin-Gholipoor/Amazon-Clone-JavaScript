export const cart = [];

export function addToCart(button) {
  let productExists = false;
  let indexInCart;
  let quantity = 1;

  document.querySelectorAll('.js-quantity-selector').forEach((quantitySelector) => {
    if (quantitySelector.dataset.productId === button.dataset.productId)
      quantity = Number(quantitySelector.value);
  })

  cart.forEach((item, index) => {
    if (item.productId === button.dataset.productId) {
      productExists = true;
      indexInCart = index;
    }
  });

  productExists ? cart[indexInCart].quantity += quantity : cart.push({
    productId: button.dataset.productId,
    quantity
  });
}
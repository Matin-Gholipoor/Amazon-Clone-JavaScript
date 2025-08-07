export const cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log(cart);

export function addToCart(productId) {
  let productExists = false;
  let indexInCart;
  let quantity = 1;

  document.querySelectorAll('.js-quantity-selector').forEach((quantitySelector) => {
    if (quantitySelector.dataset.productId === productId)
      quantity = Number(quantitySelector.value);
  })

  cart.forEach((itemInCart, index) => {
    if (itemInCart.productId === productId) {
      productExists = true;
      indexInCart = index;
    }
  });

  productExists ? cart[indexInCart].quantity += quantity : cart.push({
    productId: productId,
    quantity
  });

  saveCart();
}

export function removeFromCart(productId) {
  cart.forEach((itemInCart, index) => {
    if (itemInCart.productId === productId)
      cart.splice(index, 1);
  });

  saveCart();
}

export function updateQuantiy(productId, newQuantity) {
  cart.forEach((itemInCart) => {
    if (itemInCart.productId === productId) {
      if (newQuantity === 0)
        removeFromCart(productId);
      else
        itemInCart.quantity = newQuantity;
    }
  });

  saveCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
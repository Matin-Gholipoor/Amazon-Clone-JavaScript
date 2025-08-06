import {
  products
} from '../data/products.js';

import {
  cart,
  addToCart
} from '../data/cart.js';

products.forEach(generateProduct);

function generateProduct(product) {
  const productElement = `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="images/products/${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector" data-product-id="${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart" data-product-id="${product.id}" data-timeout-id="">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;

  document.querySelector('.js-products-grid').innerHTML += productElement;
}

document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
  button.addEventListener('click', () => {
    addToCart(button);
    updateCartQuantity();
  })
});

function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

  document.querySelectorAll('.js-added-to-cart').forEach((addedElement) => {
    if (addedElement.dataset.productId === button.dataset.productId) {
      addedElement.classList.add('added-to-cart-activated');

      clearTimeout(addedElement.dataset.timeoutID);
      addedElement.dataset.timeoutID = setTimeout(() => {
        addedElement.classList.remove('added-to-cart-activated');
      }, 2000);
    }
  });
}
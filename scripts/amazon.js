import {
  products,
  loadProducts
} from './data/products.js';

import {
  Cart
} from './data/cart.js';

import {
  centsToDollars
} from './utils/money.js';

new Promise((resolve)=>{
  loadProducts(resolve);
}).then(()=>{
  generateProductHTML();
});

// loadProducts(generateProductHTML);

const cart = new Cart('cart');
showCartQuantity();

function generateProductHTML() {
  products.forEach((product) => {

    const productElement = `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.getImageLink()}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars" src="${product.getRatingImageLink()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${centsToDollars(product.priceCents)}
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

      ${product.extraInfoHTML()}

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
  });

  document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
      let quantity;
      document.querySelectorAll('.js-quantity-selector').forEach((quantitySelector) => {
        if (quantitySelector.dataset.productId === button.dataset.productId)
          quantity = Number(quantitySelector.value);
      });

      cart.addToCart(button.dataset.productId, quantity);

      activateAddedMessage(button.dataset.productId);
      showCartQuantity();
    })
  });
}



function showCartQuantity() {
  let cartQuantity = 0;
  cart.getCartItems().forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function activateAddedMessage(productId) {
  document.querySelectorAll('.js-added-to-cart').forEach((addedElement) => {
    if (addedElement.dataset.productId === productId) {
      addedElement.classList.add('added-to-cart-activated');

      clearTimeout(addedElement.dataset.timeoutID);
      addedElement.dataset.timeoutID = setTimeout(() => {
        addedElement.classList.remove('added-to-cart-activated');
      }, 2000);
    }
  });
}
import {
  cart,
  removeFromCart,
  updateQuantiy
} from '../data/cart.js';

import {
  products
} from '../data/products.js';

let orderSummaryHTML;
showOrderSummary();

function showOrderSummary() {
  orderSummaryHTML = '';

  cart.forEach((item) => {
    let product;

    products.forEach((itemFromProducts) => {
      if (itemFromProducts.id === item.productId)
        product = itemFromProducts;
    })

    orderSummaryHTML += `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>
  
        <div class="cart-item-details-grid">
          <img class="product-image" src="images/products/${product.image}">
  
          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              $${(product.priceCents / 100).toFixed(2)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label">${item.quantity}</span>
              </span>
              <span class="update-quantity-link js-update-quantity-link link-primary" data-product-id = ${item.productId}>
                Update
              </span>
              <div class="save-quantity-row js-save-quantity-row" data-product-id = ${item.productId}>
                <input type="number" class="update-quantity-input js-update-quantity-input" value="${item.quantity}" min="0"></input>
                <span class="save-quantity-link js-save-quantity-link link-primary" data-product-id = ${item.productId}>
                  Save
                </span>
              </div>
              <span class="delete-quantity-link js-delete-quantity-link link-primary" data-product-id = ${item.productId}>
                Delete
              </span>
            </div>
          </div>
  
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            <div class="delivery-option">
              <input type="radio" checked class="delivery-option-input" name="delivery-option-${item.productId}">
              <div>
                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${item.productId}">
              <div>
                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>
                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>
              </div>
            </div>
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${item.productId}">
              <div>
                <div class="delivery-option-date">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

  document.querySelectorAll('.js-delete-quantity-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      removeFromCart(deleteLink.dataset.productId);
      showOrderSummary();
    });
  });

  document.querySelectorAll('.js-update-quantity-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      document.querySelector('.js-update-quantity-link').classList.add('update-quantity-link-editing');
      document.querySelector('.js-save-quantity-row').classList.add('save-quantity-row-editing');
      document.querySelector('.js-quantity-label').innerHTML = '';
    });
  });

  document.querySelectorAll('.js-save-quantity-link').forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      document.querySelector('.js-update-quantity-link').classList.remove('update-quantity-link-editing');
      document.querySelector('.js-save-quantity-row').classList.remove('save-quantity-row-editing');
      document.querySelector('.js-quantity-label').innerHTML = `${document.querySelector('.js-update-quantity-input').value}`;

      updateQuantiy(saveLink.dataset.productId, Number(document.querySelector('.js-update-quantity-input').value));
      showOrderSummary();
    });
  });

  let itemsQuantity = 0;
  cart.forEach((item) => {
    itemsQuantity += item.quantity;
  });
  document.querySelector('.js-return-to-home-link').innerHTML = `${itemsQuantity} items`;
}
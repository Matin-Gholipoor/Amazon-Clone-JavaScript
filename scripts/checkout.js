import {
  cart,
  removeFromCart,
  updateQuantiy,
  updateDeliveryOption
} from '../data/cart.js';

import {
  products
} from '../data/products.js';

import {
  deliveryOptions
} from '../data/deliveryOptions.js';

import dayjs from "https://esm.run/dayjs";

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
        <div class="delivery-date js-delivery-date">
          Delivery date: ${retrieveDeliveryDate(item.deliveryOptionId)}
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
                Quantity: <span class="quantity-label js-quantity-label js-quantity-label-${item.productId}">${item.quantity}</span>
              </span>
              <span class="update-quantity-link js-update-quantity-link js-update-quantity-link-${item.productId} link-primary" data-product-id = ${item.productId}>
                Update
              </span>
              <div class="save-quantity-row js-save-quantity-row js-save-quantity-row-${item.productId}" data-product-id = ${item.productId}>
                <input type="number" class="update-quantity-input js-update-quantity-input-${item.productId}" value="${item.quantity}" min="0"></input>
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

            ${GenerateDeliveryOptionsHTML(item)}
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

  // bug here
  document.querySelectorAll('.js-update-quantity-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      document.querySelector(`.js-update-quantity-link-${updateLink.dataset.productId}`).classList.add('update-quantity-link-editing');
      document.querySelector(`.js-save-quantity-row-${updateLink.dataset.productId}`).classList.add('save-quantity-row-editing');
      document.querySelector(`.js-quantity-label-${updateLink.dataset.productId}`).innerHTML = '';
    });
  });

  document.querySelectorAll('.js-save-quantity-link').forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      document.querySelector(`.js-update-quantity-link-${saveLink.dataset.productId}`).classList.remove('update-quantity-link-editing');
      document.querySelector(`.js-save-quantity-row-${saveLink.dataset.productId}`).classList.remove('save-quantity-row-editing');
      document.querySelector(`.js-quantity-label-${saveLink.dataset.productId}`).innerHTML = `${document.querySelector(`.js-update-quantity-input-${saveLink.dataset.productId}`).value}`;

      updateQuantiy(saveLink.dataset.productId, Number(document.querySelector(`.js-update-quantity-input-${saveLink.dataset.productId}`).value));
      showOrderSummary();
    });
  });

  let itemsQuantity = 0;
  cart.forEach((item) => {
    itemsQuantity += item.quantity;
  });
  document.querySelector('.js-return-to-home-link').innerHTML = `${itemsQuantity} items`;

  document.querySelectorAll('.js-delivery-option').forEach((option, index) => {
    option.addEventListener('click', () => {
      updateDeliveryOption(option.dataset.productId, String(index % deliveryOptions.length));
      showOrderSummary();
    });
  });
}

function GenerateDeliveryOptionsHTML(item) {
  let deliveryOptionsHTML = '';

  deliveryOptions.forEach((deliveryOption) => {
    const isChecked = item.deliveryOptionId === deliveryOption.id;

    deliveryOptionsHTML += `
      <div class="delivery-option js-delivery-option" data-product-id="${item.productId}">
        <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${item.productId}">
        <div>
          <div class="delivery-option-date">
            ${dayjs().add(deliveryOption.deliveryDays, 'day').format('dddd, MMMM D')}
          </div>
          <div class="delivery-option-price">
            ${deliveryOption.priceCents ? `$${(deliveryOption.priceCents / 100).toFixed(2)} -` : 'FREE'} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return deliveryOptionsHTML;
}

function retrieveDeliveryDate(deliveryOptionId) {
  let deliveryDate = '';

  deliveryOptions.forEach((deliveryOption) => {
    if (deliveryOptionId === deliveryOption.id)
      deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'day').format('dddd, MMMM D');
  });

  return deliveryDate;
}
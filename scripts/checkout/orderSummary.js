import {
  Cart
} from '../data/cart.js';

import {
  products,
  loadProducts
} from '../data/products.js';

import {
  deliveryOptions
} from '../data/deliveryOptions.js';

import dayjs from "https://esm.run/dayjs";

import {
  showPaymentSummary
} from './paymentSummary.js';

import {
  showCheckoutHeader
} from './checkoutHeader.js';

import {
  centsToDollars
} from '../utils/money.js';

let orderSummaryHTML;

// loadProducts(() => {
//   showOrderSummary();
//   showPaymentSummary();
//   showCheckoutHeader();
// });

new Promise((resolve) => {
  loadProducts(resolve);
}).then(() => {
  showOrderSummary();
  showPaymentSummary();
  showCheckoutHeader();
});

function showOrderSummary() {
  const cart = new Cart('cart');
  orderSummaryHTML = '';

  cart.getCartItems().forEach((item) => {
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
          <img class="product-image" src="${product.image}">
  
          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              $${centsToDollars(product.priceCents)}              
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
      cart.removeFromCart(deleteLink.dataset.productId);
      showOrderSummary();
      showPaymentSummary();
      showCheckoutHeader();
    });
  });

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

      cart.updateQuantiy(saveLink.dataset.productId, Number(document.querySelector(`.js-update-quantity-input-${saveLink.dataset.productId}`).value));
      showOrderSummary();
      showPaymentSummary();
      showCheckoutHeader();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((option, index) => {
    option.addEventListener('click', () => {
      cart.updateDeliveryOption(option.dataset.productId, String(index % deliveryOptions.length));
      showOrderSummary();
      showPaymentSummary();
      showCheckoutHeader();
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
            ${retrieveDeliveryDate(deliveryOption.id)}
          </div>
          <div class="delivery-option-price">
            ${deliveryOption.priceCents ? `$${centsToDollars(deliveryOption.priceCents)} -` : 'FREE'} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return deliveryOptionsHTML;
}

function retrieveDeliveryDate(deliveryOptionId) {
  let deliveryDateFormatted = '';

  deliveryOptions.forEach((deliveryOption) => {
    let deliveryDate = dayjs();

    if (deliveryOptionId === deliveryOption.id) {
      for (let i = 0; i < deliveryOption.deliveryDays;) {
        deliveryDate = deliveryDate.add(1, 'day');

        if (deliveryDate.format('dddd') !== 'Saturday' && deliveryDate.format('dddd') !== 'Sunday')
          i++;
      }

      deliveryDateFormatted = deliveryDate.format('dddd, MMMM D');
    }
  });

  return deliveryDateFormatted;
}
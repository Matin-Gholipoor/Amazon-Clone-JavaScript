import {
  orders
} from './data/orders.js';

import {
  centsToDollars
} from './utils/money.js'

import {
  products,
  loadProductsFetch
} from './data/products.js';

import dayjs from "https://esm.run/dayjs";

import {
  Cart
} from './data/cart.js';

async function loadOrders() {
  await loadProductsFetch();

  showOrdersSummary();
}
loadOrders();

const cart = new Cart('cart');
showCartQuantity();

function showCartQuantity() {
  let cartQuantity = 0;
  cart.getCartItems().forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function showOrdersSummary() {

  let orderHTML = '';

  if(orders.length === 0){
    orderHTML = `
    <p class="no-orders-message">
      You have no orders.
    </p>
    `;
  }

  orders.forEach((order) => {
    orderHTML += `
      <div class="order-container">

        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dayjs(order.orderTime).format('MMMM D')}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${centsToDollars(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        ${itemsHTMLGenerator(order)}
        
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = orderHTML;
}

function itemsHTMLGenerator(order) {
  let itemsHTML = '    <div class="order-details-grid">';

  order.products.forEach((productFromOrder) => {
    products.forEach((product) => {
      if (product.id === productFromOrder.productId) {
        itemsHTML += `
          <div class="product-image-container">
            <img src="${product.getImageLink()}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${dayjs(productFromOrder.estimatedDeliveryTime).format('MMMM D')}
            </div>
            <div class="product-quantity">
              Quantity: ${productFromOrder.quantity}
            </div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
              <button class="track-package-button js-track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
      }
    })
  });

  itemsHTML += '    </div>';

  return itemsHTML;
}
import {
  orders
} from "./data/orders.js";

import {
  products,
  loadProductsFetch
} from "./data/products.js";

import dayjs from "https://esm.run/dayjs";

import {
  Cart
} from "./data/cart.js";

const cart = new Cart('cart');

async function loadTracking() {
  await loadProductsFetch();

  generateTrackingHTML();
}
loadTracking();

const urlSearchParameters = new URLSearchParams(window.location.search);
const orderId = urlSearchParameters.get('orderId');
const productId = urlSearchParameters.get('productId');

let trackingHTML = '';

function generateTrackingHTML() {
  trackingHTML = `
    <div class="delivery-date">
      Arriving on ${retrieveArrivingDate()}
    </div>

    <div class="product-info">
      ${retrieveName()}
    </div>

    <div class="product-info">
      Quantity: ${retrieveQuantity()}
    </div>

    <img class="product-image" src="${retrieveImage()}">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="js-progress-bar"></div>
    </div>      
  `;

  document.querySelector('.js-order-tracking').innerHTML += trackingHTML;

  if (retrieveShippingStatus() === 'shipped')
    document.querySelector('.js-progress-bar').classList.add('progress-bar-shipped');
  else
    document.querySelector('.js-progress-bar').classList.add('progress-bar-delivered');

  showCartQuantity();
}

function showCartQuantity() {
  let cartQuantity = 0;
  cart.getCartItems().forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function retrieveArrivingDate() {
  let arrivingDate;
  orders.forEach((order) => {

    if (order.id === orderId) {
      order.products.forEach((product) => {
        if (product.productId === productId)
          arrivingDate = dayjs(product.estimatedDeliveryTime).format('dddd MMMM D');
      });
    }
  });

  return arrivingDate;
}

function retrieveName() {
  let name;

  products.forEach((product) => {
    if (product.id === productId)
      name = product.name;
  });

  return name;
}

function retrieveQuantity() {
  let quantity;
  orders.forEach((order) => {

    if (order.id === orderId) {
      order.products.forEach((product) => {
        if (product.productId === productId)
          quantity = product.quantity;
      });
    }
  });

  return quantity;
}

function retrieveImage() {
  let image;

  products.forEach((product) => {
    if (product.id === productId)
      image = product.image;
  });

  return image;
}

function retrieveShippingStatus() {
  let shippingStatus;
  orders.forEach((order) => {

    if (order.id === orderId) {
      order.products.forEach((product) => {
        if (product.productId === productId)
          if (dayjs(product.estimatedDeliveryTime).isAfter(dayjs()))
            shippingStatus = 'shipped';
          else
            shippingStatus = 'delivered';
      });
    }
  });

  return shippingStatus;
}
import {
  Cart
} from '../data/cart.js';

import {
  deliveryOptions
} from '../data/deliveryOptions.js';

import {
  products
} from '../data/products.js';

import {
  centsToDollars
} from '../utils/money.js';

import {
  Order,
  orders
} from '../data/orders.js';

import dayjs from "https://esm.run/dayjs";

export function showPaymentSummary() {
  const cart = new Cart('cart');
  let itemsQuantity = 0;
  let itemsPriceCents = 0;
  let shippingAndHandlingPriceCents = 0;

  cart.getCartItems().forEach((item) => {
    itemsQuantity += item.quantity;

    products.forEach((product) => {
      if (product.id === item.productId)
        itemsPriceCents += product.priceCents * item.quantity;
    });

    deliveryOptions.forEach((deliveryOption) => {
      if (deliveryOption.id === item.deliveryOptionId)
        shippingAndHandlingPriceCents += deliveryOption.priceCents;
    });
  });

  const itemsPrice = centsToDollars(itemsPriceCents);
  const shippingAndHandlingPrice = centsToDollars(shippingAndHandlingPriceCents);
  const totalBeforeTax = centsToDollars(itemsPriceCents + shippingAndHandlingPriceCents);
  const estimatedTax = centsToDollars((itemsPriceCents + shippingAndHandlingPriceCents) / 10);
  const orderTotal = centsToDollars((itemsPriceCents + shippingAndHandlingPriceCents) * 1.1);

  const paymentSummary = `
		<div class="payment-summary-title">
			Order Summary
		</div>

		<div class="payment-summary-row">
			<div>Items (${itemsQuantity}):</div>
			<div class="payment-summary-money">$${itemsPrice}</div>
		</div>

		<div class="payment-summary-row">
			<div>Shipping &amp; handling:</div>
			<div class="payment-summary-money">$${shippingAndHandlingPrice}</div>
		</div>

		<div class="payment-summary-row subtotal-row">
			<div>Total before tax:</div>
			<div class="payment-summary-money">$${totalBeforeTax}</div>
		</div>

		<div class="payment-summary-row">
			<div>Estimated tax (10%):</div>
			<div class="payment-summary-money">$${estimatedTax}</div>
		</div>

		<div class="payment-summary-row total-row">
			<div>Order total:</div>
			<div class="payment-summary-money">$${orderTotal}</div>
		</div>

		<button class="place-order-button js-place-order-button button-primary">
			Place your order
		</button>

    <p class="empty-cart-message js-empty-cart-message" data-timeout-id="a">
      Cart is empty!
    </p>
	`;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummary;

  // document.querySelector('.js-place-order-button').addEventListener('click', async () => {
  //   try {
  //     const response = await fetch('https://supersimplebackend.dev/orders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         cart: cart.getCartItems()
  //       })
  //     });

  //     window.location.href = 'orders.html';

  //     if (!response.ok)
  //       throw new Error('Server error.');

  //     const newOrder = new Order(await response.json());
  //     addOrder(newOrder);
  //   } catch (error) {
  //     console.log(`Error: ${error.message}`);
  //   }
  // });

  document.querySelector('.js-place-order-button').addEventListener('click', () => {
    console.log(cart.isEmpty());

    if (!cart.isEmpty()) {
      const newOrder = {
        id: crypto.randomUUID(),
        orderTime: dayjs().toISOString(),
        totalCostCents: Number(orderTotal) * 100,
        products: []
      };
      cart.getCartItems().forEach((item) => {
        products.forEach((product) => {
          if (product.id === item.productId) {
            newOrder.products.push({
              productId: product.id,
              quantity: item.quantity,
              estimatedDeliveryTime: retrieveEstimatedDeliveryTime(item.deliveryOptionId)
            });
          }
        });
      });

      new Order(newOrder).addOrder();

      cart.empty();
      console.log(orders);

      window.location.href = 'orders.html';
    } else {
      document.querySelector('.js-empty-cart-message').classList.add('empty-cart-message-activated');

      clearTimeout(document.querySelector('.js-empty-cart-message').dataset.timeoutId);
      document.querySelector('.js-empty-cart-message').dataset.timeoutId = setTimeout(() => {
        document.querySelector('.js-empty-cart-message').classList.remove('empty-cart-message-activated');
      }, 2000);
    }
  });
}


function retrieveEstimatedDeliveryTime(deliveryOptionId) {
  let estimatedDeliveryTime;

  deliveryOptions.forEach((deliveryOption) => {
    let deliveryDate = dayjs();

    if (deliveryOptionId === deliveryOption.id) {
      for (let i = 0; i < deliveryOption.deliveryDays;) {
        deliveryDate = deliveryDate.add(1, 'day');

        if (deliveryDate.format('dddd') !== 'Saturday' && deliveryDate.format('dddd') !== 'Sunday')
          i++;
      }

      estimatedDeliveryTime = deliveryDate.toISOString();
    }
  });

  return estimatedDeliveryTime;
}
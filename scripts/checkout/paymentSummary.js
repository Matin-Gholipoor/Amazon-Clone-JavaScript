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
	Order
} from '../data/orders.js';

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
	`;

	document.querySelector('.js-payment-summary').innerHTML = paymentSummary;

	document.querySelector('.js-place-order-button').addEventListener('click', async () => {
		try {
			const response = await fetch('https://supersimplebackend.dev/orders', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					cart: cart.getCartItems()
				})
			});

			window.location.href = 'orders.html';

			if (!response.ok)
				throw new Error('Server error.');

			const newOrder = new Order(await response.json());
			addOrder(newOrder);
		} catch (error) {
			console.log(`Error: ${error.message}`);
		}
	});
}
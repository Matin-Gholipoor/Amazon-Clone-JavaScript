import {
	cart
} from '../../data/cart.js';

import {
	deliveryOptions
} from '../../data/deliveryOptions.js';

import {
	products
} from '../../data/products.js';

export function showPaymentSummary() {
	let itemsQuantity = 0;
	let itemsPriceCents = 0;
	let shippingAndHandlingPriceCents = 0;

	cart.forEach((item) => {
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

	const itemsPrice = (itemsPriceCents / 100).toFixed(2);
	const shippingAndHandlingPrice = (shippingAndHandlingPriceCents / 100).toFixed(2);
	const totalBeforeTax = ((itemsPriceCents + shippingAndHandlingPriceCents) / 100).toFixed(2);
	const estimatedTax = ((itemsPriceCents + shippingAndHandlingPriceCents) / 1000).toFixed(2);
	const orderTotal = ((itemsPriceCents + shippingAndHandlingPriceCents) / 100 * 1.1).toFixed(2);

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

		<button class="place-order-button button-primary">
			Place your order
		</button>
	`;

	document.querySelector('.js-payment-summary').innerHTML = paymentSummary;
}
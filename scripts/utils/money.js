export function centsToDollars(priceInCents) {
	return (Math.round(priceInCents) / 100).toFixed(2);
}
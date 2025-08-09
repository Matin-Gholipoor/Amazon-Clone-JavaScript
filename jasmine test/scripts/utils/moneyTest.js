import {
	centsToDollars
} from '../../../scripts/utils/money.js'

describe('centsToDollars Test', () => {
	it('normal case', () => {
		expect(centsToDollars(1090)).toEqual('10.90');
	});

	it('round up', () => {
		expect(centsToDollars(1090.8)).toEqual('10.91');
	});

	it('round up .5', () => {
		expect(centsToDollars(1090.5)).toEqual('10.91');
	});

	it('round down', () => {
		expect(centsToDollars(1090.1)).toEqual('10.90');
	});

	it('zero', () => {
		expect(centsToDollars(0)).toEqual('0.00');
	});
});
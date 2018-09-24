/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const shortcuts = require(".");

const id = "23438d929d9290f";
const fromID = [
	"icloud.com/" + id,
	"https://icloud.com/" + id,
	"http://icloud.com/" + id,
	id,
];

describe("idFromURL", () => {
	fromID.forEach(input => {
		const output = shortcuts.idFromURL(input);
	
		it("returns a string", () => {
			assert.isString(output);
		});
		it("is same as the actual id", () => {
			assert.strictEqual(output, id);
		});
	});
});

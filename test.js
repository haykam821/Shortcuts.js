/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const { idFromURL } = require(".");

const id = "23438d929d9290f";

describe("idFromURL", () => {
	it("returns string when valid", () => {
		assert.isString(idFromURL(id));
	});
	
	it("gets id if input is just id", () => {
		assert.strictEqual(idFromURL(id), id);
	});
	it("gets id if input has http protocol", () => {
		assert.strictEqual(idFromURL("http://icloud.com/shortcuts/" + id), id);
	});
	it("gets id if input has https protocol", () => {
		assert.strictEqual(idFromURL("https://icloud.com/shortcuts/" + id), id);
	});
	it("gets id if input doesn't specify protocol", () => {
		assert.strictEqual(idFromURL("http://icloud.com/shortcuts/" + id), id);
	});
});

/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const { idFromURL } = require(".");

const id = "e04c0db9ef974178b60f94518daeb8f2";

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

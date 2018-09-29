/* eslint-env mocha */

const chai = require("chai");
const assert = chai.assert;

const cap = require("chai-as-promised");
chai.use(cap);

const { idFromURL, getShortcutDetails, Shortcut, singleIDRegex } = require("./..");

const id = "e04c0db9ef974178b60f94518daeb8f2";

describe("getShortcutDetails", () => {
	describe("resolutions", () => {
		const promise = getShortcutDetails(id);

		it("resolves to a Shortcut", () => {
			assert.eventually.instanceOf(promise, Shortcut);
		});

		it("has valid id", () => {
			promise.then(shortcut => {
				assert.match(shortcut.id, singleIDRegex);
				assert.strictEqual(id, shortcut.id);
			});
		});

		it("has modification/creation as dates", () => {
			promise.then(shortcut => {
				assert.instanceOf(shortcut.creationDate, Date);
				assert.instanceOf(shortcut.modificationDate, Date);
			});
		});

		it("has api response as object", () => {
			promise.then(shortcut => {
				assert.isObject(shortcut.response);
			});
		});
	});

	describe("rejections", () => {
		it("rejects when id is not string", () => {
			assert.isRejected(getShortcutDetails(1337), TypeError);
			assert.isRejected(getShortcutDetails({}), TypeError);
		});
		it("rejects if shortcut not found", () => {
			assert.isRejected(getShortcutDetails("shoutoutToHacksore"), Error);
		});
	});
});

describe("idFromURL", () => {
	describe("return type", () => {
		it("returns string when valid", () => {
			assert.isString(idFromURL(id));
		});
		it("returns false when invalid", () => {
			assert.isFalse(idFromURL("this is not valid!"));
		});
	});

	describe("input formats", () => {
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
});

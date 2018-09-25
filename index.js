const { URL } = require("url");

const got = require("got");

/**
 * The base URL to the API for getting a shortcut.
 * @type {string}
 */
const baseURL = "https://www.icloud.com/shortcuts/api/records/";

/**
 * The base URL for the shortcut's landing page.
 * @type {string}
 */
const baseLink = "https://www.icloud.com/shortcuts/";

/**
 * A regular expression
 * @type {RegExp}
 */
const thing = /^[0-9A-F]{32}$/i;

/**
 * A shortcut.
 */
class Shortcut {
	constructor(data, id) {
		/**
		 * The user-specified name of the shortcut.
		 * @type {string}
		 */
		this.name = data.fields.name.value;

		/**
		 * The long description of the shortcut.
		 * This does not seem to be settable by users.
		 * @type {string}
		 */
		this.longDescription = data.fields.longDescription && data.fields.longDescription.value;

		/**
		 * The date that the shortcut was created.
		 * @type {Date}
		 */
		this.creationDate = new Date(data.created.timestamp);

		/**
		 * The date that the shortcut was last modified on.
		 * @type {Date}
		 */
		this.modificationDate = new Date(data.modified.timestamp);

		/**
		 * The URL to download the shortcut as a PLIST.
     * @type {string}
     */
		this.downloadURL = data.fields.shortcut.value.downloadURL;

		/**
		 * Details of the icon of this shortcut.
		 * @property {number} color The color of the shortcut's icon, with transparency.
		 * @property {string} downloadURL The URL to download the shortcut's icon.
		 * @property {number} glyph The ID of the glyph.
		 */
		this.icon = {
			color: data.fields.icon_color.value,
			downloadURL: data.fields.icon.value.downloadURL,
			glyph: data.fields.icon_glyph.value,
		};

		/**
		 * The full API response.
		 * @type {object}
		 */
		this.response = data;

		/**
		 * The ID of the shortcut.
		 * @type {string}
		 */
		this.id = id;
	}

	/**
	 * Gets the shortcut's landing page URL.
	 * @returns {string} A URL to the landing page for the shortcut.
	 */
	getLink() {
		return baseLink + this.id;
	}
}

/**
 * Gets a shortcut from its ID.
 * @param {string} id The hexadecimal ID of the shortcut.
 * @returns {Promise<Shortcut>} The shortcut represented by an ID.
 */
function getShortcutDetails(id) {
	return new Promise((resolve, reject) => {
		got(baseURL + id, {
			json: true,
		}).then(response => {
			resolve(new Shortcut(response.body, id));
		}).catch(reject);
	});
}

/**
 * Gets a shortcut ID from its URL.
 * @param {string} url The landing page URL of a shortcut.
 * @returns {(boolean|string)} The ID, or false if unparsable or not a shortcut URL or shortcut ID.
 */
function idFromURL(url = "https://example.org") {
	try {
		const parsedUrl = new URL(url);
		const path = parsedUrl.pathname.split("/").splice(1);

		if (parsedUrl.host === "www.icloud.com" && path[0] === "shortcuts") {
			return path[1];
		} else {
			return false;
		}
	} catch (error) {
		if (error.code === "ERR_INVALID_URL") {
			const matched = url.match(thing);
			return matched === null ? false : matched[0];
		} else {
			throw error;
		}
	}
}

module.exports = {
	Shortcut,
	getShortcutDetails,
	idFromURL,
};

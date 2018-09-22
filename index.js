const { URL } = require("url");

const got = require("got");

/**
 * The base URL to the API for getting a shortcut.
 */
const baseURL = "https://www.icloud.com/shortcuts/api/records/";

/**
 * The base URL for the shortcut's landing page.
 */
const baseLink = "https://www.icloud.com/shortcuts/";

/**
 * A shortcut.
 */
class Shortcut {
	constructor(data, id) {
		/**
		 * The user-specified name of the shortcut.
		 */
		this.name = data.fields.name.value;

		/**
		 * The long description of the shortcut.
		 * This does not seem to be settable by users.
		 */
		this.longDescription = data.fields.longDescription && data.fields.longDescription.value;

		/**
		 * The date that the shortcut was created.
		 */
		this.creationDate = new Date(data.created.timestamp);

		/**
		 * The date that the shortcut was last modified on.
		 */
		this.modificationDate = new Date(data.modified.timestamp);

		/**
		 * The URL to download the shortcut's icon.
		 */
		this.imageURL = data.fields.icon.value.downloadURL;

		/**
		 * The URL to download the shortcut as a PLIST.
		 */
		this.downloadURL = data.fields.shortcut.value.downloadURL;

		/**
		 * The full API response.
		 */
		this.response = data;

		/**
		 * The ID of the shortcut.
		 */
		this.id = id;
	}
	
	/**
	 * Returns a link to the landing page for the shortcut.
	 */
	getLink() {
		return baseLink + this.id;
	}
}

/**
 * Gets a shortcut ID from its URL.
 * @param {string} url The landing page URL of a shortcut.
 * @returns {(boolean|string)} The ID, or false if unparsable or not a shortcut URL.
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
			return false;
		} else {
			throw error;
		}
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

module.exports = {
	Shortcut,
	idFromURL,
	getShortcutDetails,
};

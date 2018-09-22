const { URL } = require("url");

const got = require("got");
const baseURL = "https://www.icloud.com/shortcuts/api/records/";
const baseLink = "https://www.icloud.com/shortcuts/";

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
		this.longDescription = data.fields.longDescription.value;

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

function shortcutFromURL(url = "https://example.org") {
	const parsedUrl = new URL(url);
	const path = parsedUrl.pathname.split("/").splice(1);
	
	if (parsedUrl.host === "www.icloud.com" && path[0] === "shortcuts") {
		return path[1];
	} else {
		return false;
	}
}

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
	shortcutFromURL,
	getShortcutDetails,
};

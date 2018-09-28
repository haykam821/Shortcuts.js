const { URL } = require("url");

const got = require("got");
const bplist = require("bplist-parser");

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
 * A single action in a shortcut.
 */
class Action {
	constructor(action) {
		/**
		 * @type {string} A namespace of the action.
		 */
		this.identifier = action.WFWorkflowActionIdentifier;

		/**
		 * @type {Object[]}
		 */
		this.parameters = action.WFWorkflowActionParameters;
	}
}

/**
 * A single question to be asked when importing a shortcut into the Shortcuts app.
 */
class ImportQuestion {
	constructor(question) {
		this.parameterKey = question.ParameterKey;
    	this.category = question.Category;
    	this.actionIndex = question.ActionIndex;
		this.text = question.Text;
		this.defaultValue = question.DefaultValue;
	}
}

/**
 * The shortcut file.
 */
class ShortcutMetadata {
	constructor(metadata) {
		/**
		 * Details of the icon of this shortcut.
		 * @property {number} minimumVersion The Shortcut app version.
		 * @property {number} version The Shortcut minumum version.
		 * @property {string} release The Shortcut app version.
		 */
		this.client = {
			minimumVersion: parseInt(metadata.WFWorkflowMinimumClientVersion),
			version: parseInt(metadata.WFWorkflowClientVersion),
			release: metadata.WFWorkflowClientRelease,
		};

		const imgData = metadata.WFWorkflowIcon.WFWorkflowIconImageData; 

		/**
		 * Details of the icon of this shortcut.
		 * @property {number} color The color of the shortcut's icon, with transparency.
		 * @property {?Buffer} imageData The base64 data that makes up the custom image.
		 * @property {number} glyph The ID of the glyph.
		 */
		this.icon = {
			color: metadata.WFWorkflowIcon.WFWorkflowIconStartColor,
			imageData: imgData.length >= 0 ? new Buffer(imgData, "base64") : null,
			glyph: metadata.WFWorkflowIcon.WFWorkflowIconGlyphNumber,
		};

		/**
		 * The user-specified name of the shortcut.
		 * @type {ImportQuestion[]}
		 */
		this.importQuestions = metadata.WFWorkflowImportQuestions.map(question => new ImportQuestion(question));

		this.types = metadata.WFWorkflowTypes;

		this.actions = metadata.WFWorkflowActions.map(action => new Action(action));

		this.inputContentItemClasses = metadata.WFWorkflowInputContentItemClasses;
	}
}

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
	 * Gets the shortcuts metadata from the downloadURL.
	 * @returns {ShortcutMetadata} An object with all the metadata about the shortcut.
	 */
	getMetadata() {
		return new Promise((resolve, reject) => {
			got(this.downloadURL, {
				encoding: null,
			}).then(response => {
				const buffer = Buffer.from(response.body);
				const json = bplist.parseBuffer(buffer);

				const metadata = new ShortcutMetadata(json[0]);

				resolve(metadata);
			}).catch(reject);
		});
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

module.exports = {
	Shortcut,
	getShortcutDetails,
	idFromURL,
};

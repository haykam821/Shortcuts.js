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
		 * A namespace of the action.
		 * @type {string}
		 */
		this.identifier = action.WFWorkflowActionIdentifier;

		/**
		 * An object denoting a shortcut action.
		 * The properties in this object are not renamed and follow the Apple naming convention.
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
		/**
		 * An unknown property.
		 * @type {string}
		 */
		this.parameterKey = question.ParameterKey;

		/**
		 * The category of the question.
		 * @type {string}
		 */
		this.category = question.Category;

		/**
		 * The action index of the question.
		 * @type {number}
		 */
		this.actionIndex = question.ActionIndex;

		/**
		 * The question to be asked.
		 * @type {string}
		 */
		this.text = question.Text;

		/**
		 * The default value for the question to be asked.
		 * @type {string}
		 */
		this.defaultValue = question.DefaultValue;
	}
}

/**
 * The shortcut file.
 */
class ShortcutMetadata {
	constructor(metadata) {
		const minVer = metadata.WFWorkflowMinimumClientVersion;

		/**
		 * Details of the client used to create this shortcut.
		 * @property {?number} minimumVersion The minimum build number of Shortcuts usable to manage this shortcut.
		 * @property {string} release The release of Shortcuts that was used to manage this shortcut.
		 * @property {number} version The build number of Shortcuts that was used to managed this shortcut.
		 */
		this.client = {
			minimumVersion: minVer ? parseInt(minVer) : null,
			release: metadata.WFWorkflowClientRelease,
			version: parseInt(metadata.WFWorkflowClientVersion),
		};

		const imgData = metadata.WFWorkflowIcon.WFWorkflowIconImageData;

		/**
		 * Details of the icon of this shortcut.
		 * @property {number} color The color of the shortcut's icon, with transparency.
		 * @property {number} glyph The ID of the glyph.
		 * @property {?Buffer} imageData The base64 data that makes up the custom image.
		 */
		this.icon = {
			color: metadata.WFWorkflowIcon.WFWorkflowIconStartColor,
			glyph: metadata.WFWorkflowIcon.WFWorkflowIconGlyphNumber,
			imageData: imgData.length >= 0 ? Buffer.from(imgData, "base64") : null,
		};

		/**
		 * The user-specified name of the shortcut.
		 * @type {ImportQuestion[]}
		 */
		this.importQuestions = metadata.WFWorkflowImportQuestions.map(question => new ImportQuestion(question));

		/**
		 * An unknown property.
		 * @type {string[]}
		 */
		this.types = metadata.WFWorkflowTypes;

		/**
		 * A list of actions that the shortcut performs.
		 * @type {Action[]}
		 */
		this.actions = metadata.WFWorkflowActions.map(action => new Action(action));

		/**
		 * A list of services that the shortcut uses.
		 * @type {string[]}
		 */
		this.inputContentItemClasses = metadata.WFWorkflowInputContentItemClasses;
	}
}

/**
 * A regular expression to match a single shortcut ID.
 * @type {RegExp}
 */
const singleIDRegex = /^[0-9A-F]{32}$/i;

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
		 * @property {string} hexColor The hexadecimal color of the shortcut's icon.
		 */
		this.icon = {
			color: data.fields.icon_color.value,
			downloadURL: data.fields.icon.value.downloadURL,
			glyph: data.fields.icon_glyph.value,
			hexColor: data.fields.icon_color.value.toString(16).substring(0, 6),
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
	 * Downloads and parses the shortcut's metadata.
	 * @returns {Promise<ShortcutMetadata>} An object with all the metadata about the shortcut.
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
		// Reject if the ID wasn't a string.
		if (typeof id !== "string") {
			const error = new TypeError("The ID must be a string.");
			error.code = "SHORTCUT_ID_NOT_STRING";

			return reject(error);
		}

		got(baseURL + id, {
			json: true,
		}).then(response => {
			const body = response.body;

			// Reject if the shortcut was not found.
			if (body.error) {
				const error = new Error("API error: " + error.reason);
				error.code = "ICLOUD_API_ERROR";

				return reject(error);
			}

			return resolve(new Shortcut(response.body, id));
		}).catch(reject);
	});
}

/**
 * A list of hosts usable in a shortcut URL.
 */
const hosts = [
	"www.icloud.com",
	"icloud.com",
];

/**
 * Gets a shortcut ID from its URL.
 * @param {string} url The landing page URL of a shortcut.
 * @param {boolean} allowSingle If true, allows the ID by itself.
 * @returns {(boolean|string)} The ID, or false if unparsable or not a shortcut URL or shortcut ID.
 */
function idFromURL(url = "https://example.org", allowSingle = true) {
	try {
		const parsedUrl = new URL(url);
		const path = parsedUrl.pathname.split("/").splice(1);

		if (hosts.includes(parsedUrl.host) && path[0] === "shortcuts") {
			return path[1];
		} else {
			return false;
		}
	} catch (error) {
		if (error.code === "ERR_INVALID_URL") {
			if (allowSingle) {
				const matched = url.match(singleIDRegex);
				return matched === null ? false : matched[0];
			} else {
				return false;
			}
		} else {
			throw error;
		}
	}
}

module.exports = {
	Action,
	ImportQuestion,
	Shortcut,
	ShortcutMetadata,
	getShortcutDetails,
	idFromURL,
	singleIDRegex,
};

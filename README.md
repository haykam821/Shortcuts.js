# Shortcuts.js

[![GitHub release](https://img.shields.io/github/release/haykam821/Shortcuts.js.svg?style=popout&label=github)](https://github.com/haykam821/Shortcuts.js/releases/latest)
[![npm](https://img.shields.io/npm/v/shortcuts.js.svg?style=popout&colorB=red)](https://www.npmjs.com/package/shortcuts.js)
[![Travis (.com)](https://img.shields.io/travis/com/haykam821/Shortcuts.js.svg?style=popout)](https://travis-ci.com/haykam821/Shortcuts.js)

A simple library for Apple's Shortcuts.

* [Shortcuts.js](#shortcutsjs)
	* [Installation](#installation)
	* [Usage](#usage)
	* [Documentation](#documentation)
		* [`getShortcutDetails(id)`](#getshortcutdetailsid)
		* [`idFromURL(url, allowSingle)`](#idfromurlurl-allowsingle)
		* [`Shortcut` properties and methods](#shortcut-properties-and-methods)
		* [`ShortcutIcon` properties](#shortcuticon-properties)
		* [`ShortcutMetadata` properties](#shortcutmetadata-properties)
		* [`Action` properties](#action-properties)
		* [`ImportQuestion` properties](#importquestion-properties)
	* [See also](#see-also)

## Installation

You can install this module with NPM:

```shell
npm install shortcuts.js
```

If you prefer [Yarn](https://yarnpkg.com/), you can use that as well:

```shell
yarn add shortcuts.js
```

## Usage

First, you must require this library:

```js
const shortcuts = require("shortcuts.js");
```

Afterwards, you can use its methods. One of the simplest things you can do with this library is grab the ID from an iCloud URL. This is useful for later methods such as getting a shortcut's details from a user-submitted value, which might not always be just the ID.

```js
// Get an ID from a iCloud URL
const id = shortcuts.idFromURL("https://www.icloud.com/shortcuts/903110dea9a944f48fef9e94317fb686");
```

This example uses promise chaining to get shortcut metadata from an iCloud URL:

```js
// Chain promises to get a shortcut's metadata
shortcuts.getShortcutDetails(id).then(shortcut => {
    console.log(`Hi, I'm ${id}! What's your name?`);
    return shortcut.getMetadata();
}).then(metadata => {
    console.log(`I have ${metadata.actions.length} actions! How cool is that?`);
}).catch(error => {
    console.log(`${error.code}? How could this happen!`);
});
```

You can also use [async/await](https://javascript.info/async-await) to simplify things:

```js
async function getBasicInfo() {
    const shortcut = await shortcuts.getShortcutDetails(id);
    const metadata = await shortcut.getMetadata();
    
    return `Hi! I'm ${shortcut.name}. I have ${metadata.importQuestions.length} import questions, and I'm happy to be here. What's your name?`;
}

getBasicInfo().then(console.log).catch(error => {
    console.log(`There was an error: ${error.code}. At least I can say that I tried...`);
});
```

## Documentation

This is the documentation for Shortcuts.js.

### `getShortcutDetails(id)`

This method gets the details of a shortcut.

The `id` argument is required and specifies the public ID of the shortcut to fetch. It can be found in the shareable URLs, in the form of `https://icloud.com/shortcuts/<id>`.

This method immediately returns a promise, which will resolve to a `Shortcut`.

### `idFromURL(url, allowSingle)`

Gets a shortcut ID from its URL.

This method returns either `false` or a string. If it returns a string, that string will be the parsed ID from the URL, or `false` if the URL was unable to be parsed.

The `url` is a string that can take on multiple forms:

  * Just the ID (`903110dea9a944f48fef9e94317fb686`)
  * An iCloud link (`http://icloud.com/shortcuts/903110dea9a944f48fef9e94317fb686`)
  * An iCloud link with the `https` protocol (`https://icloud.com/shortcuts/903110dea9a944f48fef9e94317fb686`)
  * An iCloud link with the `www` subdomain (`http://www.icloud.com/shortcuts/903110dea9a944f48fef9e94317fb686`)

### `Shortcut` properties and methods

This is what the `getShortcutDetails()` promise will resolve with.

`name` ⟶ String

The user-specified name of the shortcut.

`longDescription` ⟶ String

The long description of the shortcut.
This does not seem to be settable by users.

`creationDate` ⟶ Date

The date that the shortcut was created.

`modificationDate` ⟶ Date

The date that the shortcut was last modified on.

`downloadURL` ⟶ String

The URL to download the shortcut as a PLIST

`icon` ⟶ ShortcutIcon

Details of the icon of this shortcut.

`response` ⟶ Object

The full API response.

`id` ⟶ String

The ID of the shortcut.

`getLink()` ⟶ String

Gets the shortcut's landing page URL.

`getMetadata()` ⟶ Promise\<ShortcutMetadata>

Downloads and parses the shortcut's metadata.

### `ShortcutIcon` properties

A shortcut's icon.

`color` ⟶ Number

The color of the shortcut's icon, with transparency.

`downloadURL` ⟶ String

The URL to download the shortcut's icon.

`glyph` ⟶ Number

The ID of the glyph.

`hexColor` ⟶ String

The hexadecimal color of the shortcut's icon.

### `ShortcutMetadata` properties

The shortcut file with all the properties parsed into a custom class. The object will be found after calling `getMetadata()` on a shortcut.

`client` ⟶ Object

Details of the client used to create this shortcut.

`icon` ⟶ Object

Details of the icon of this shortcut.

`importQuestions` ⟶ ImportQuestion[]

The user-specified name of the shortcut.

`types` ⟶ String[]

An unknown property.

`actions` ⟶ Action[]

A list of actions that the shortcut performs.

`inputContentItemClasses` ⟶ String[]

A list of services that the shortcut uses.

### `Action` properties

A single action in a shortcut. The object will be found in the `ShortcutMetadata.actions` property.

`identifier` ⟶ String

A namespace of the action.

`parameters` ⟶ Object

An object denoting a shortcut action. The properties in this object are not renamed and follow the Apple naming convention.


### `ImportQuestion` properties

A single question to be asked when importing a shortcut into the Shortcuts app. The object will be found in the `ShortcutMetadata.importQuestions` property.

`parameterKey` ⟶ String

An unknown property.

`category` ⟶ String

The category of the question.

`actionIndex` ⟶ Number

The action index of the question.

`text` ⟶ String

The question to be asked.

`defaultValue` ⟶ String

The default value for the question to be asked.

## See also

* [Shortcutify](https://github.com/haykam821/Shortcutify), the framework for building shortcuts with JavaScript.

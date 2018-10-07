# Shortcuts.js

[![GitHub release](https://img.shields.io/github/release/haykam821/Shortcuts.js.svg?style=popout&label=github)](https://github.com/haykam821/Shortcuts.js/releases/latest)
[![npm](https://img.shields.io/npm/v/shortcuts.js.svg?style=popout&colorB=red)](https://www.npmjs.com/package/shortcuts.js)
[![Travis (.com)](https://img.shields.io/travis/com/haykam821/Shortcuts.js.svg?style=popout)](https://travis-ci.com/haykam821/Shortcuts.js)

A simple library for Apple's Shortcuts. 

## Installation

You can install this module with NPM:

    npm install shortcuts.js

If you prefer [Yarn](https://yarnpkg.com/), you can use that as well:

    yarn add shortcuts.js

## Quick Reference
* [Shortcut Methods](#shortcut-api)
* [Shortcut Properties](#shortcut-properties-and-methods)
* [ShortcutMetadata Properties](#shortcutmetadata-properties)
* [Action Properties](#action-properties)
* [ImportQuestion Properties](#importquestion-properties)

## Examples

### Promise chain
```javascript
const shortcuts = require("shortcuts.js");

// Get id from the iCloud link
const id = shortcuts.idFromURL("https://www.icloud.com/shortcuts/903110dea9a944f48fef9e94317fb686");

let resolvedShortcut;
// Lookup the shortcut via its ID
shortcuts.getShortcutDetails(id)
.then(shortcut => {
    resolvedShortcut = shortcut;
    // Pass the metadata promise down the chain
    return shortcut.getMetadata();
})
.then(metadata => {
    console.log(resolvedShortcut);
    console.log(metadata);
})
.catch(err => {
    console.log(err);
})
```

### async/await
```javascript
const shortcuts = require("shortcuts.js");

// Get the id from the iCloud link
const id = shortcuts.idFromURL("https://www.icloud.com/shortcuts/903110dea9a944f48fef9e94317fb686");

async function myAsyncMethod(){
    // Lookup the shortcut via its ID
    const shortcut = await shortcuts.getShortcutDetails(id);

    // Lookup the shortcut metadata
    const metadata = await shortcut.getMetadata();

    console.log(shortcut);
    console.log(metadata);
}

try {
    myAsyncMethod();
}
catch(err){
    console.log(err);
}
```

## Shortcut API
These are methods exposed on the libary. Once you include the libary you can call `shortcuts.<Method>(Param)` and expect the appropriate return value.

`getShortcutDetails(String)` ⟶ Promise\<Shortcut>

Downloads and parses the shortcut's metadata.

`idFromURL(String)` ⟶ [Boolean|String]

Gets a shortcut ID from its URL.

#
## `Shortcut` properties and methods
This is what `getShortcutDetails()` promise will resolve with.

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

`icon` ⟶ Object

Details of the icon of this shortcut.

`response` ⟶ Object

The full API response.

`id` ⟶ String

The ID of the shortcut.

`getLink()` ⟶ String

Gets the shortcut's landing page URL.

`getMetadata()` ⟶ Promise\<ShortcutMetadata>

Downloads and parses the shortcut's metadata.

#
## `ShortcutMetadata` properties

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

#
## `Action` properties

A single action in a shortcut. The object will be found in the `ShortcutMetadata.actions` property.

`identifier` ⟶ String

A namespace of the action.

`parameters` ⟶ Object

An object denoting a shortcut action. The properties in this object are not renamed and follow the Apple naming convention.


#
## `ImportQuestion` properties

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

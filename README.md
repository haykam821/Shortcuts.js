# Shortcuts.js

[![GitHub release](https://img.shields.io/github/release/haykam821/Shortcuts.js.svg?style=popout&label=github)](https://github.com/haykam821/Shortcuts.js/releases/latest)
[![npm](https://img.shields.io/npm/v/shortcuts.js.svg?style=popout&colorB=red)](https://www.npmjs.com/package/shortcuts.js)
[![Travis (.com)](https://img.shields.io/travis/com/haykam821/Shortcuts.js.svg?style=popout)](https://travis-ci.com/haykam821/Shortcuts.js)

A simple library for Apple's Shortcuts. 

## Installation
`npm install shortcuts.js`

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

`getShortcutDetails(String)` -> Promise

Downloads and parses the shortcut's metadata.

`idFromURL(String)` -> [Boolean|String]

Gets a shortcut ID from its URL.

#
### `Shortcut` properties and methods

`getMetadata()` -> Promise

Downloads and parses the shortcut's metadata.

`name` -> String

The user-specified name of the shortcut.

`longDescription` -> String

The long description of the shortcut.
This does not seem to be settable by users.

`creationDate` -> Date

The date that the shortcut was created.


`modificationDate` -> Date

The date that the shortcut was last modified on.

`downloadURL` -> String

The URL to download the shortcut as a PLIST


`icon` -> Object

Details of the icon of this shortcut.


`response` -> Object

The full API response.

`id` -> String

The ID of the shortcut.

`getLink()` -> String

Gets the shortcut's landing page URL.

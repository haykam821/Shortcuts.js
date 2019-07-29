# Shortcuts.js

[![GitHub release](https://img.shields.io/github/release/haykam821/Shortcuts.js.svg?style=popout&label=github)](https://github.com/haykam821/Shortcuts.js/releases/latest)
[![npm](https://img.shields.io/npm/v/shortcuts.js.svg?style=popout&colorB=red)](https://www.npmjs.com/package/shortcuts.js)
[![Travis (.com)](https://img.shields.io/travis/com/haykam821/Shortcuts.js.svg?style=popout)](https://travis-ci.com/haykam821/Shortcuts.js)

A simple library for Apple's Shortcuts.

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

Documentation is available on [GitHub Pages](https://haykam821.github.io/Shortcuts.js/).

## See also

* [Shortcutify](https://github.com/haykam821/Shortcutify), the framework for building shortcuts with JavaScript.

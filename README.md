# rollup-plugin-codefilter
This is a plugin for rollup/vite that filter code by dotenv variables.

# install
```bash
npm install rollup-plugin-codefilter --save-dev
```

# quick start
create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:
```js
import codeFilter from 'rollup-plugin-codefilter'

module.exports = {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    name: 'test'
  },
  plugins: [
    codeFilter()
  ]
}
```
create a `.env` [configuration file](https://github.com/motdotla/dotenv#usage) and define some true or false variables.
```bash
keep = true
discard = false
```
create `index.js`:
```js
function log () {
  // ifdef keep
  console.log('hello world!')
  // endif

  // ifdef discard
  console.log('it will be discarded.')
  // endif
}

export default log
```
Finally, run `rollup -c rollup.config.js`.  
The file will be generated in folder `dist`:
```js
var test = (function () {
  'use strict';

  function log () {
    console.log('hello world!');
  }

  return log;

}());
```

# options
### `ext`

Type: `Array<string>`
Default: `[js, json]`

Only handle the module which match the provided extension. Currently only support `js` and `json`.

### `dotenv`

Refer to dotenv's [options](https://www.npmjs.com/package/dotenv#options)

### `exclude`

Type: `String` | `Array<String>`<br>
Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should _ignore_. By default no files are ignored.

### `include`

Type: `String` | `Array<String>`<br>
Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should operate on. By default all files are targeted.

---
The options below are the same as [@rollup/plugin-json](https://github.com/rollup/plugins/tree/master/packages/json)'s.

> To be careful, you can't use `@rollup/plugin-json` when this plugin injected.

### `indent`

Type: `String`<br>
Default: `'\t'`

Specifies the indentation for the generated default export.

### `namedExports`

Type: `Boolean`<br>
Default: `true`

If `true`, instructs the plugin to generate a named export for every property of the JSON object.

### `preferConst`

Type: `Boolean`<br>
Default: `false`

If `true`, instructs the plugin to declare properties as variables, using either `var` or `const`. This pertains to tree-shaking.

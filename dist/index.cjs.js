'use strict';

var chalk = require('chalk');
var path = require('path');
var dotenv = require('dotenv');
var pluginutils = require('@rollup/pluginutils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);

var name = "rollup-plugin-codefilter";

function CodeFilterPlugin (options = {}) {
  const filter = pluginutils.createFilter(options.include, options.exclude);

  options = applyOptions(options);
  transformOptions(options);

  return {
    name,
    transform (code, id) {
      if (!filter(id)) return null

      const fileUrl = this.getModuleInfo(id).id;
      const ext = path__default['default'].extname(fileUrl);

      // skip empty
      if (!ext) return null

      // skip if no matched
      if (!options.ext[ext.substr(1)]) return null

      code = codeFilter(code, options);

      let map = undefined;

      if (ext === '.json') {
        code = pluginutils.dataToEsm(parseJSON(code), {
          preferConst: options.preferConst,
          compact: options.compact,
          namedExports: options.namedExports,
          indent: options.indent
        });
        map = {
          mappings: ''
        };
      }

      return { code, map }
    }
  }
}

function codeFilter (code, options) {
  const re = /[ \t]*\/\/\s*ifdef\s+([^\s\n]+)\n([\s\S]+?)\s*\/\/\s*endif\s*?(\n\n)?/g;

  return code.replace(/\r\n/g, '\n').replace(re, function () {
    // arguments is matched array
    let [variable, code] = [].slice.call(arguments, 1);

    variable = variable.trim();

    if (!/\w+/.test(variable)) {
      error(`SyntaxError: Unexpected name ${variable}.`);
    }

    return isPreserved(variable) ? code : ''
  })

  function isPreserved (variable) {
    let env = dotenv__default['default'].config(options.dotenv);

    if (env.error) {
      error(env.error.message);
    }

    env = env.parsed;

    return env[variable] === 'true'
  }
}

function parseJSON (code) {
  const semiEndRe = /,\s*}/;
  code = code.replace(semiEndRe, m => m.substr(1));
  return JSON.parse(code)
}

function transformOptions (options) {
  const extMap = {};
  options.ext.forEach(e => {
    extMap[e] = true;
  });
  options.ext = extMap;
}

function applyOptions (options) {
  const defaultOptions = {
    ext: ['js', 'json'],
    indent: '\t',
    dotenv: {}
  };
  for (const k of Object.keys(options)) {
    if (defaultOptions[k] === void(0)) ; else {
      defaultOptions[k] = options[k];
    }
  }
  return defaultOptions
}

function normalizeLog (text) {
  return `[rollup-plugin-codefilter]: ${text}`
}

function error (text) {
  throw new Error(chalk__default['default'].redBright(normalizeLog(text)))
}

// function warn (text) {
//   console.log(chalk.yellow(normalizeLog(text)));
// }

// function log (text) {
//   console.log(chalk.white(normalizeLog(text)));
// }

module.exports = CodeFilterPlugin;

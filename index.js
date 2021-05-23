import {name} from './package.json'
import chalk from 'chalk'
import path from 'path'
import dotenv from 'dotenv'
import {createFilter, dataToEsm} from '@rollup/pluginutils'

export default function CodeFilterPlugin (options = {}) {
  const filter = createFilter(options.include, options.exclude)

  options = applyOptions(options)
  transformOptions(options)

  return {
    name,
    transform (code, id) {
      if (!filter(id)) return null

      const fileUrl = this.getModuleInfo(id).id
      const ext = path.extname(fileUrl)

      // skip empty
      if (!ext) return null

      // skip if no matched
      if (!options.ext[ext.substr(1)]) return null

      code = codeFilter(code, options)

      let map = undefined

      if (ext === '.json') {
        code = dataToEsm(JSON.parse(code), {
          preferConst: options.preferConst,
          compact: options.compact,
          namedExports: options.namedExports,
          indent: options.indent
        })
        map = {
          mappings: ''
        }
      }

      return { code, map }
    }
  }
}

function codeFilter (code, options) {
  const re = /[ \t]*\/\/\s*ifdef\s+([^\s\n]+)\n([\s\S]+?)\s*\/\/\s*endif\s*?(\n\n)?/g

  return code.replace(/\r\n/g, '\n').replace(re, function () {
    // arguments is matched array
    let [variable, code] = [].slice.call(arguments, 1)

    variable = variable.trim()

    if (!/\w+/.test(variable)) {
      error(`SyntaxError: Unexpected name ${variable}.`)
    }

    return isPreserved(variable) ? code : ''
  })

  function isPreserved (variable) {
    let env

    if (options.useVite) {
      env = import.meta.env
    } else {
      env = dotenv.config()

      if (env.error) {
        error(env.error.message)
      }

      env = env.parsed
    }

    return env[variable] === 'true'
  }
}

function transformOptions (options) {
  const extMap = {}
  options.ext.forEach(e => {
    extMap[e] = true
  })
  options.ext = extMap
}

function applyOptions (options) {
  const defaultOptions = {
    ext: ['js', 'json'],
    useVite: false,
    indent: '\t'
  }
  for (const k of Object.keys(options)) {
    if (defaultOptions[k] === void(0)) {
      // warn(`(!) You have passed an unrecognized option`)
      // log(`Unkown options: ${k}. Allowed options: ${Object.keys(defaultOptions).join(', ')}`)
    } else {
      defaultOptions[k] = options[k]
    }
  }
  return defaultOptions
}

function normalizeLog (text) {
  return `[rollup-plugin-codefilter]: ${text}`
}

function error (text) {
  throw new Error(chalk.redBright(normalizeLog(text)))
}

// function warn (text) {
//   console.log(chalk.yellow(normalizeLog(text)));
// }

// function log (text) {
//   console.log(chalk.white(normalizeLog(text)));
// }
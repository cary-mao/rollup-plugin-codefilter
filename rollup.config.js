import json from '@rollup/plugin-json'

const dir = 'dist'
const filename = 'codefilter'
const formats = ['cjs', 'es']

export default {
  input: 'index.js',
  output: formats.map(format => ({
    file: `${dir}/${filename}.${format}.js`,
    format,
  })),
  plugins: [
    json()
  ]
}
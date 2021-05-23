import json from '@rollup/plugin-json'

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs'
  },
  plugins: [json()]
}
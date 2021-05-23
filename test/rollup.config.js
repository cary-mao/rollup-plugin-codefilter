import codeFilter from '../dist/codefilter.es';

process.chdir(__dirname);

export default {
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
import test from 'ava'
import {rollup} from 'rollup'
import codeFilter from '../index'
import {build} from 'vite'

process.chdir(__dirname)

test('basic', async t => {
  const bundle = await rollup({
    input: 'fixtures/basic/index.js',
    plugins: [codeFilter({
      dotenv: {
        path: 'fixtures/basic/.env'
      }
    })]
  })

  const {output: [{code}]} = await bundle.generate({ format: 'cjs', exports: 'auto' })
  t.true(/hello world!/.test(code))
  t.false(/it will be discarded./.test(code))
})

test('json', async t => {
  console.log(process.cwd())
  const bundle = await rollup({
    input: 'fixtures/json/index.js',
    plugins: [codeFilter({
      dotenv: {
        path: 'fixtures/json/.env'
      },
      indent: '  '
    })]
  })

  const {output: [{code}]} = await bundle.generate({ format: 'cjs', exports: 'auto' })
  t.true(/hello world!/.test(code))
  t.false(/it will be discarded./.test(code))
})

test('vite:lib', async t => {
  const bundle = await build({
    plugins: [codeFilter({
      dotenv: {
        path: 'fixtures/vite_lib/.env'
      }
    })],
    build: {
      lib: {
        entry: 'fixtures/vite_lib/index.js',
        name: 'MyLib'
      }
    }
  })
  const [{output}] = bundle
  const [{code}] = output
  t.true(/hello world!/.test(code))
  t.false(/development!/.test(code))
})
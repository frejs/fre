export default {
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from '../../src/index'`,
    target: 'es2020',
    format: 'esm'
  }
}
export default {
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { h, Fragment } from 'fre'`,
    target: 'es2020',
    format: 'esm'
  }
}
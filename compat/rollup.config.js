import { plugins } from '../rollup.config'

export default {
  input: 'compat/index.js',
  output: {
    file: 'dist/fre-compat.js',
    format: 'umd',
    name: 'fre',
    sourcemap: true
  },
  plugins
}

import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'

const plugins = [
  terser(),
  size()
]

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/fre.umd.js', format: 'umd', name: 'fre', sourcemap: true },
    { file: 'dist/fre.js', format: 'esm', sourcemap: true },
    { file: 'dist/fre.esm.js', format: 'esm', sourcemap: true },
  ],
  plugins,
}

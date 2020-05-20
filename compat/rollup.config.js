import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: '../dist/fre.compat.js',
      format: 'umd',
      esModule: false,
      name: 'fre',
      sourcemap: true
    },
    { file: '../dist/fre.compat.esm.js', format: 'esm', esModule: false, sourcemap: true }
  ],
  plugins: [
    typescript({
      tsconfig: '../tsconfig.json',
      removeComments: true,
      rootDir:"./src"
    }),
    terser({
      include: ['fre.compat.js']
    })
  ]
}

import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/fre.js',
      format: 'umd',
      name: 'fre',
      sourcemap: true
    },
    { file: 'dist/fre.esm.js', format: 'esm', sourcemap: true }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      removeComments: true
    }),
    terser({
      include: ['fre.js']
    })
  ]
}

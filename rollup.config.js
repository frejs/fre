import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const plugins = [
  typescript({
    tsconfig: 'tsconfig.json',
    removeComments: true,
    useTsconfigDeclarationDir: true,
  }),
  terser({
    include: ['fre.js'],
  }),
]

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/fre.umd.js', format: 'umd', name: 'fre', sourcemap: true },
    { file: 'dist/fre.js', format: 'esm', sourcemap: true },
  ],
  plugins,
}

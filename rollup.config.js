import { terser } from "rollup-plugin-terser"
import typescript from 'rollup-plugin-typescript2'

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/fre.js", format: "umd", esModule: false, name: "fre", sourcemap: true },
    { file: "dist/fre.esm.js", format: "esm", esModule: false, sourcemap: true },
  ],
  plugins: [
    typescript(),
    terser({
      include: ["fre.js"]
    })
  ]
}

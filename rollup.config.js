import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.js",
  output: [
    { file: "dist/fre.js", format: "cjs", esModule: false, sourcemap: true },
    { file: "dist/fre-cjs.js", format: "cjs", esModule: false, sourcemap: true },
    { file: "dist/fre-umd.js", format: "umd", esModule: false, name: "fre", sourcemap: true },
    { file: "dist/fre-esm.js", format: "esm", esModule: false, sourcemap: true },
  ],
  plugins: [
    terser({
      include: ["fre.js"]
    })
  ]
}

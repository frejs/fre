import { terser } from "rollup-plugin-terser"

export default {
  input: "src/index.js",
  output: [
    { file: "dist/fre.js", format: "umd", esModule: false, name: "fre", sourcemap: true },
    { file: "dist/fre.esm.js", format: "esm", esModule: false, sourcemap: true },
  ],
  plugins: [
    terser({
      include: ["fre.js"]
    })
  ]
}

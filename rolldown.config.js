export default {
  input: './src/index.ts',
  minify: true,
  output: [
    {
      file: './dist/fre.umd.js',
      format: 'umd',
      name: 'fre',
      sourcemap: true,
    },
    {
      file: './dist/fre.js',
      format: 'es',
      minify: true,
      sourcemap: true,
    },
  ],
  external: [],
}

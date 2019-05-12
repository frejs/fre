import cleanup from 'rollup-plugin-cleanup'
import license from 'rollup-plugin-license'

export default {
  input: './src/index.js',
  output: {
    file: './dist/fre.js',
    format: 'umd',
    name: 'fre'
  },
  plugins: [
    license({
      banner: `by 132yse Copyright ${JSON.stringify(new Date()).replace(
        /T.*|"/g,
        ''
      )}`
    }),
    cleanup()
  ]
}
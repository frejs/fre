import cleanup from 'rollup-plugin-cleanup'
import license from 'rollup-plugin-license'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    file: './dist/fre.js',
    format: 'umd',
    name: 'fre'
  },
  plugins: [
    babel({
      babelrc: false,
      presets: [['@babel/preset-react']]
    }),
    license({
      banner: `by 132yse Copyright ${JSON.stringify(new Date()).replace(
        /T.*|"/g,
        ''
      )}`
    }),
    cleanup()
  ]
}

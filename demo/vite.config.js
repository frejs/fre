export default {
  port: '8000',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    target: 'es2020',
    format: 'esm'
  },
  server: {
    port: 8080,
    proxy: {
      '/ssr': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
}

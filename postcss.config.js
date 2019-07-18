module.exports = {
  // parser: 'sugarss',
  plugins: [
    // require('precss'),
    require('autoprefixer'),
    require('postcss-opacity')({
      legacy: true
    })
  ]
}

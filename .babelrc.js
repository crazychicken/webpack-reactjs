module.exports = {
  plugins: [
    [
      require.resolve('@babel/plugin-proposal-decorators'),
      {
        legacy: true
      }
    ],
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      {
        loose: true
      }
    ],
    require.resolve('@babel/plugin-syntax-dynamic-import')
  ],
  presets: [
    require.resolve(`@babel/preset-env`),
    require.resolve(`@babel/preset-react`)
  ]
};

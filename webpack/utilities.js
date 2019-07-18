var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// resolve.alias
var moduleAlias = {
  containers: path.resolve(__dirname, "../src/containers"),
  components: path.resolve(__dirname, "../src/components")
};
// resolve.extensions
var moduleExtensions = [
  ".js",
  ".jsx",
  ".scss",
  ".css",
  ".html",
  ".json",
  ".woff",
  ".woff2",
  ".eot",
  ".ttf",
  ".web.js",
  ".mjs",
  ".web.mjs",
  ".mjs",
  ".web.js",
  ".web.ts",
  ".ts",
  ".web.tsx",
  ".tsx",
  ".json",
  ".web.jsx"
];
// common function to get style loaders
const getStyleLoaders = (cssOptions, preProcessor, Env) => {
  // Check SourceMap sass
  Env = process.env.envSourceMap || Env;
  const loaders = [
    !Env && require.resolve("style-loader"),
    Env && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: "/",
        modules: true,
        sourceMap: true,
        importLoader: 2
      }
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          })
        ],
        sourceMap: true
      }
    }
  ].filter(Boolean);
  if (preProcessor) {
    // loaders.push({
    //   loader: require.resolve('resolve-url-loader')
    // });
    // Global sourceMap: true, sass, css
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: true
      }
    });
  }
  return loaders;
};

module.exports = {
  moduleExtensions,
  moduleAlias,
  getStyleLoaders
};

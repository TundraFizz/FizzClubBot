/* eslint-disable */
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const path = require("path");
const glob = require("glob");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const PurgeCSSPlugin = require("purgecss-webpack-plugin");

process.env.VUE_APP_PLACEHOLDER = "testing";

if (process.env.local) {
  process.env.VUE_APP_PLACEHOLDER_2 = "testing_2";
} else if (process.env.NODE_ENV === "dev") {
  process.env.VUE_APP_PLACEHOLDER_2 = "testing_2";
} else if (process.env.NODE_ENV === "prod") {
  process.env.VUE_APP_PLACEHOLDER_2 = "testing_2";
}

// function addStyleResource (rule) {
//   rule.use('style-resource')
//     .loader('style-resources-loader')
//     .options({
//       patterns: [
//         path.resolve(__dirname, './src/styles/imports.styl'),
//       ],
//     })
// }

module.exports = {
  devServer: {
    host: "localhost",
    public: "tundra.ngrok.io",
    disableHostCheck: true // Allow using ngrok with the frontend
  },
  pwa: {
    manifestOptions: {
      name: "Bitspades",
      short_name: "Bitspades",
      start_url: "./",
      display: "standalone",
      theme_color: "#821191"
      // ,icons: [
      //   {
      //     src: "./favicon.svg",
      //     sizes: "512x512",
      //     type: "image/svg+xml",
      //     purpose: "any maskable",
      //   },
      // ],
    },
    name: "Bitspades",
    themeColor: "#821191",
    msTileColor: "#821191",
    appleMobileWebAppCapable: "no",
    appleMobileWebAppStatusBarStyle: "default",
    manifestPath: "manifest.json",
    // workboxPluginMode: "InjectManifest",
    workboxPluginMode: "GenerateSW",
    skipWaiting: true,
    workboxOptions: {
      // swSrc: "./src/public/service-worker.js", // Required in InjectManifest mode
      // navigateFallback: "index.html",
      exclude: [/_redirects/]
    }
  },
  chainWebpack: (config) => {
    // Specify the location of the public directory
    config.plugin("html").tap((args) => {
      args[0].template = "./src/public/index.html";
      return args;
    });

    config.plugins.delete("prefetch");
    // config.plugin("CompressionPlugin").use(CompressionPlugin);
    config.performance.maxEntrypointSize(400000).maxAssetSize(400000);
  },
  configureWebpack: {
    mode: "production",
    devtool: false,
    performance: {
      hints: false
    },
    optimization: {
      nodeEnv: "production",
      minimize: true,
      splitChunks: {
        chunks: "async",
        minSize: 10000,
        maxSize: 100000,
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        }
      ]
    },
    plugins: [
      // new CopyWebpackPlugin([{
      //   from: "./src/public", // from: "./frontend/public",
      //   to: ".",
      //   toType: "dir"
      // }]),

      // new CompressionPlugin()
    ]
  },
  pluginOptions: {
    compression:{
      zopfli: {
        compressionOptions: {
          numiterations: 15,
        },
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
      }
    }
  }
}

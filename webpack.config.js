const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000,
    hints: 'warning'
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 500000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '-',
      cacheGroups: {
        defaultVendors: {
          test: /[\\]node_modules[\\]/,
          priority: -10,
          reuseExistingChunk: true,
          enforce: true,
          name(module) {
            const packageName = module.context.match(/[\\]node_modules[\\](.+?)([\\]|$)/)[1];
            return `vendor.${packageName.replace('@', '')}`;
          }
        },
        common: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          name: 'common'
        }
      }
    },
    runtimeChunk: 'single'
  },
  entry: {
    popup: './popup.js',
    options: './options.js',
    content: './content.js',
    background: './background.js',

  },
  experiments: {
    topLevelAwait: true
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    parser: {
      javascript: {
        dynamicImports: true
      }
    },
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
      fs: require.resolve('browserify-fs'),
      os: require.resolve('os-browserify'),
      net: require.resolve('net-browserify'),
      tls: require.resolve('tls-browserify'),
      crypto: require.resolve('crypto-browserify'),
      querystring: require.resolve('querystring-es3'),
      constants: require.resolve('constants-browserify'),
      vm: false,
      'async_hooks': false,
      'http2': false,
      'dns': false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
};
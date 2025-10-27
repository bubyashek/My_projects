const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Получить список файлов Pug из каталога представлений
const PAGES = fs.readdirSync('./src/views/').filter(name => name.endsWith('.pug') && name !== 'layout.pug');

module.exports = {
  mode: 'production',
  
  // Несколько точек входа для разных страниц
  entry: {
    users: './src/ts/users.ts',
    friends: './src/ts/friends.ts',
    news: './src/ts/news.ts'
  },
  
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist-webpack'),
    publicPath: '/webpack/',
    clean: true
  },
  
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    extensionAlias: {
      '.js': ['.ts', '.js']
    }
  },
  
  module: {
    rules: [
      // TypeScript загрузчик с Babel
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ["> 1%", "last 2 versions", "not dead"]
                  }
                }],
                '@babel/preset-typescript'
              ]
            }
          },
          'ts-loader'
        ]
      },
      
      // SCSS/CSS загрузчик
      {
        test: /\.(scss|sass|css)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      
      // Pug загрузчик
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'pug3-loader',
            options: {
              pretty: false
            }
          }
        ]
      }
    ]
  },
  
  plugins: [
    // Извлечь CSS в отдельные файлы
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    
    // Генерация HTML-файлов из шаблонов Pug
    ...PAGES.map(page => {
      const pageName = page.replace(/\.pug$/, '');
      return new HtmlWebpackPlugin({
        template: `./src/views/${page}`,
        filename: `./${page.replace(/\.pug$/, '.html')}`,
        chunks: [pageName],
        inject: 'body',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      });
    })
  ],
  
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  },
  
  devtool: 'source-map'
};

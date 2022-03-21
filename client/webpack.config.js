/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshBabelPlugin = require("react-refresh/babel");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const svgToMiniDataURI = require("mini-svg-data-uri");
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

/**
 * babel-loader配置
 * 启用缓存
 * 按需加载polyfill（corejs），避免重复
 * 自动引入React运行时
 * typescript
 * reactFastRefresh热加载插件
 */
const babelLoader = {
  loader: "babel-loader",
  options: {
    cacheDirectory: true,
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: "3.21",
        },
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
      "@babel/preset-typescript",
    ],
    plugins: [
      !isProduction && ReactRefreshBabelPlugin,
      "@babel/plugin-transform-runtime",
    ].filter(Boolean),
  },
};

const productOptimization = {
  usedExports: true, // tree-shake
  minimize: true,
  minimizer: [
    "...",
    new CssMinimizerPlugin(),
    // 图片压缩，这里使用的是默认配置（有损压缩）
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.squooshMinify,
        options: {},
      },
    }),
  ],
  runtimeChunk: "single", // 生成单一运行时chunk文件
  moduleIds: "deterministic", // 确定性的moduleId
  // 分离第三方包
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/](react|react-dom|scheduler|object-assign)[\\/]/,
        name: "vendors",
        chunks: "all",
      },
    },
  },
};

const config = {
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    open: true,
    host: "localhost",
    compress: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "template.html"),
      favicon: path.resolve(__dirname, "favicon.ico"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.([tj]s|[tj]sx)$/,
        // 额外排除corejs与buildin，它们会被打包到源代码中
        exclude: [
          /node_modules/,
          // eslint-disable-next-line no-useless-escape
          /node_modules[\\\/]core-js/,
          // eslint-disable-next-line no-useless-escape
          /node_modules[\\\/]webpack[\\\/]buildin/,
        ],
        use: [babelLoader],
      },
      {
        test: /\.css$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // 只转换稳定的css新语法
                    // 包含autoprefixer
                    "postcss-preset-env",
                    {
                      stage: 4,
                      autoprefixer: { grid: false },
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      // 都使用asset类型来处理图片资源
      {
        test: /\.svg$/i,
        type: "asset",
        generator: {
          dataUrl: (content) => {
            content = content.toString();
            return svgToMiniDataURI(content);
          },
          filename: "images/[name]-[hash][ext]",
        },
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 4kb
          },
        },
        generator: {
          filename: "images/[name]-[hash][ext]",
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name]-[hash][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.devtool = "hidden-source-map";
    config.plugins.push(
      ...[
        new MiniCssExtractPlugin(),
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        }),
      ]
    );
    config.optimization = productOptimization;

    // return new SpeedMeasurePlugin().wrap(config);

    return config;
  } else {
    config.mode = "development";
    config.devtool = "eval-cheap-source-map";
    config.plugins.push(...[new ReactRefreshWebpackPlugin()]);
    return config;
  }
};

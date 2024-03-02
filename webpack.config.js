const { getConfig, dev } = require('./webpack.config.base');
const { spawn, execSync } = require('child_process');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const terser = require('terser');

let electronProcess;

const mainConfig = getConfig({
  target: 'electron-main',
  devtool: dev ? 'inline-source-map' : false,
  watch: dev,
  entry: {
    main: './src/main',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@cliqz/adblocker-electron-preload/dist/preload.cjs.js',
          to: 'preload.js',
          async transform(fileContent) {
            const { code } = await terser.minify(fileContent.toString());
            return code;
          },
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      maxSize: 244000,
    },
  },
});

const preloadConfig = getConfig({
  target: 'web',
  devtool: false,
  watch: dev,
  entry: {
    'view-preload': './src/preloads/view-preload',
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      maxSize: 244000,
    },
  },
});

if (process.env.ENABLE_EXTENSIONS) {
  preloadConfig.entry['popup-preload'] = './src/preloads/popup-preload';
  preloadConfig.entry['extensions-preload'] = './src/preloads/extensions-preload';
}

if (process.env.START === '1') {
  mainConfig.plugins.push({
    apply(compiler) {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
        if (electronProcess) {
          try {
            if (process.platform === 'win32') {
              execSync(`taskkill /pid ${electronProcess.pid} /f /t`);
            } else {
              electronProcess.kill();
            }
            electronProcess = null;
          } catch (e) {}
        }
        electronProcess = spawn('npm', ['start'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        });
      });
    },
  });
}

module.exports = [mainConfig, preloadConfig];
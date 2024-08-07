import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// eslint-disable-next-line import/default
import CopyWebpackPlugin from 'copy-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      { from: 'src/preferences.app.json', to: 'preferences.app.json' },
      { from: 'assets/icon.ico', to: 'main_window/icon.ico' },
    ],
  }),
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
];

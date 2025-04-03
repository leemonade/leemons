import '@babel/register';

// Register Babel for JSX/TSX files
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  extensions: ['.jsx', '.tsx', '.ts'],
  ignore: [
    (filename: string) => {
      if (filename.includes('/node_modules/')) {
        return true; // Ignore
      }
      return !filename.match(/\.(jsx|tsx)$/);
    },
  ],
});

import { getEmailTypes } from './getEmailTypes';
import { LeemonsEmailsMixin } from './mixin/mixin';

export interface EmailTypes {
  active: 'active';
}

export { getEmailTypes, LeemonsEmailsMixin };

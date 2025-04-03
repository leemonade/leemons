// Register Babel for JSX files
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  ignore: [
    (filename: string) => {
      // Ignore files inside node_modules
      if (filename.includes('/node_modules/')) {
        return true; // Ignore
      }
      return !filename.endsWith('.jsx');
    },
  ],
});

import { getEmailTypes } from './getEmailTypes';
import { LeemonsEmailsMixin } from './mixin/mixin';

export interface EmailTypes {
  active: 'active';
}

export { getEmailTypes, LeemonsEmailsMixin };

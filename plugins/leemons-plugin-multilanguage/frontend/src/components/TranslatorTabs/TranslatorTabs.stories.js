import React from 'react';
import { TranslatorTabs, TRANSLATOR_TABS_DEFAULT_PROPS } from './TranslatorTabs';
import { TRANSLATOR_TABS_DATA } from './mocks/data';

export default {
  title: 'Leemons/Multilanguage/TranslatorTabs',
  parameters: {
    component: TranslatorTabs,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onLocaleChange: { action: 'Locale has changed' },
    defaultLocale: {
      options: TRANSLATOR_TABS_DATA.locales.map((locale) => locale.code),
      control: { type: 'select' },
    },
  },
};

const Template = ({ ...props }) => {
  return <TranslatorTabs {...props} />;
};

export const Playground = Template.bind({});
Playground.args = {
  ...TRANSLATOR_TABS_DEFAULT_PROPS,
  ...TRANSLATOR_TABS_DATA,
};

import React, { useState } from 'react';
import { Button } from '@bubbles-ui/components';
import { DATASET_ITEM_DRAWER_DEFAULT_PROPS, DatasetItemDrawer } from './DatasetItemDrawer';
import mdx from './DatasetItemDrawer.mdx';
import { TRANSLATOR_TABS_DATA } from '../../multilanguage/TranslatorTabs/mocks/data';

export default {
  title: 'Leemons/Dataset/DatasetItemDrawer',
  parameters: {
    component: DatasetItemDrawer,
    docs: {
      page: mdx,
    },
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    // myBooleanProp: { control: { type: 'boolean' } },
    // mySelectProp: { options: ['Hello', 'World'], control: { type: 'select' } },
  },
};

const Template = ({ children, ...props }) => {
  const [opened, setOpened] = useState(true);

  const selectOptions = DATASET_ITEM_DRAWER_DEFAULT_PROPS.selectOptions;
  selectOptions.userProfiles = [
    {
      label: 'All',
      value: '*',
    },
    {
      label: 'Profile 1',
      value: 1,
    },
    {
      label: 'Profile 2',
      value: 2,
    },
  ];

  selectOptions.userCenters = [
    {
      label: 'All',
      value: '*',
    },
    {
      label: 'Center 1',
      value: 1,
    },
    {
      label: 'Center 2',
      value: 2,
    },
  ];

  selectOptions.centers = selectOptions.userCenters;

  return (
    <>
      <Button color="secondary" onClick={() => setOpened(true)}>
        OPEN
      </Button>
      <DatasetItemDrawer
        {...props}
        selectOptions={selectOptions}
        defaultValues={{ config: { centers: ['*'] } }}
        opened={opened}
        locales={TRANSLATOR_TABS_DATA.locales}
        defaultLocale={TRANSLATOR_TABS_DATA.defaultLocale}
        onClose={() => setOpened(false)}
      />
    </>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  // myBooleanProp: false,
  // mySelectProp: 'Hello'
  ...DATASET_ITEM_DRAWER_DEFAULT_PROPS,
};

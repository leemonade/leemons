import React from 'react';
import { Box, Alert, Text } from '@bubbles-ui/components';
import { TranslatorModal, TRANSLATOR_MODAL_DEFAULT_PROPS } from './TranslatorModal';
import { TranslatorTabs } from '../TranslatorTabs';
import { TRANSLATOR_TABS_DATA } from '../TranslatorTabs/mocks/data';

export default {
  title: 'Leemons/Multilanguage/TranslatorModal',
  parameters: {
    component: TranslatorModal,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onClose: { action: 'Close button pressed' },
    onSave: { action: 'Save button pressed' },
    onCancel: { action: 'Cancel button pressed' },
  },
};

const Template = ({ test_translatorModalData, test_showAlert, ...props }) => {
  return (
    <TranslatorModal
      {...props}
      alert={
        test_showAlert ? (
          <Alert severity="warning" closeable={false}>
            Must save profile to save translations
          </Alert>
        ) : null
      }
    >
      <TranslatorTabs {...test_translatorModalData}>
        <Box style={{ padding: 20 }}>
          <Text>I'm locale</Text>
        </Box>
      </TranslatorTabs>
    </TranslatorModal>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...TRANSLATOR_MODAL_DEFAULT_PROPS,
  labels: {
    title: 'Configuration & languages',
    trigger: 'Translations',
    help: 'Untranslated content will appear in the default language',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
  },
  test_translatorModalData: { ...TRANSLATOR_TABS_DATA },
  test_showAlert: false,
};

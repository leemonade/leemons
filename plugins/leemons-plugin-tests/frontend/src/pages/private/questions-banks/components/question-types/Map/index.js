import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  ContextContainer,
  ListInput,
  ListItem,
  Switch,
  Stack,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';

import { Controller, useFormContext } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';
import { useStore } from '@common';
import { forEach, map } from 'lodash';
import ImagePicker from '@leebrary/components/ImagePicker';
import { QuestionImageMarkersModal } from '../../../../../../components/QuestionImageMarkersModal';
import { ListItemValueRender } from './components/ListItemValueRender';
import { NumberedListIcon } from './components/NumberedListIcon';

// eslint-disable-next-line import/prefer-default-export
export function QuestionMap({ form: _form, t }) {
  const [store, render] = useStore();
  const form = useFormContext() ?? _form;
  const properties = form.watch('properties');

  function showMarkersModal() {
    store.showMarkersModal = true;
    render();
  }

  function closeMarkersModal() {
    store.showMarkersModal = false;
    render();
  }

  React.useEffect(() => {
    if (!properties?.image) {
      form.setValue('properties.markers', {
        ...(properties?.markers || {}),
        list: [],
      });
    }
  }, [properties?.image]);

  React.useEffect(() => {
    render();
  }, [JSON.stringify(properties)]);

  const getListValues = (value) => map(value ?? [], (item) => ({ value: item }));

  return (
    <ContextContainer>
      <Box>
        <ContextContainer title={`${t('mapLabel')} *`}>
          <Controller
            control={form.control}
            name="properties.image"
            render={({ field }) => <ImagePicker {...field} label={t('mapLabel')} />}
          />
        </ContextContainer>
      </Box>

      {properties?.image ? (
        <ContextContainer>
          <Box>
            <Button variant="outline" leftIcon={<NumberedListIcon />} onClick={showMarkersModal}>
              {t(properties?.markers?.list?.length ? 'editNumbering' : 'createNumbering')}
            </Button>
          </Box>

          <QuestionImageMarkersModal
            value={properties?.markers}
            onChange={(value) => form.setValue('properties.markers', value)}
            src={properties?.image}
            opened={store.showMarkersModal}
            onClose={closeMarkersModal}
          />

          <Controller
            control={form.control}
            name="properties.caption"
            render={({ field }) => <Textarea label={t('captionAltLabel')} {...field} />}
          />
        </ContextContainer>
      ) : null}

      <ContextContainer title={`${t('explanationLabel')} *`}>
        <Controller
          control={form.control}
          name="properties.explanation"
          render={({ field }) => (
            <TextEditorInput {...field} editorStyles={{ minHeight: '96px' }} />
          )}
        />
      </ContextContainer>

      <ContextContainer
        title={`${t('itemsLabel')} *`}
        description={properties?.markers?.list?.length ? '' : t('itemsDescriptionBeforeMap')}
      >
        <Controller
          control={form.control}
          name="properties.hasClues"
          render={({ field }) => (
            <Switch {...field} checked={field.value} label={t('hasCluesLabel')} />
          )}
        />
        {properties?.markers?.list?.length ? (
          <Controller
            control={form.control}
            name="properties.markers"
            rules={{
              required: t('markersRequired'),
              validate: (value) => {
                if (!value?.list?.length) {
                  return t('markersRequired');
                }
                let allHasResponse = true;
                forEach(value?.list, (e) => {
                  if (!e.response) {
                    allHasResponse = false;
                  }
                });
                return allHasResponse ? undefined : t('markersNeedResponseInAllItems');
              },
            }}
            render={({ field }) => (
              <ListInput
                {...field}
                withItemBorder
                withInputBorder
                value={getListValues(field.value?.list)}
                onChange={(value) => {
                  field.onChange({
                    ...properties.markers,
                    list: map(value, (item) => item.value),
                  });
                }}
                error={form.formState.errors.properties?.markers}
                inputRender={(itemProps) => (
                  <TextInput
                    {...itemProps}
                    value={itemProps?.value.response}
                    onChange={(e) => itemProps?.onChange({ ...itemProps.value, response: e })}
                  />
                )}
                listRender={
                  <ListItem
                    itemContainerRender={({ children }) => (
                      <Stack alignItems="center" fullWidth>
                        {children}
                      </Stack>
                    )}
                    itemValueRender={
                      <ListItemValueRender
                        markers={properties?.markers}
                        t={t}
                        canSetHelp
                        showEye={field?.value?.list?.length > 2}
                      />
                    }
                  />
                }
              />
            )}
          />
        ) : null}
      </ContextContainer>
    </ContextContainer>
  );
}

QuestionMap.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

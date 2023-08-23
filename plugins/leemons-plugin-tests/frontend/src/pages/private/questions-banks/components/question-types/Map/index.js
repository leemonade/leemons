import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  ListInput,
  ListItem,
  Paper,
  Stack,
  Textarea,
  TextInput,
} from '@bubbles-ui/components';
import { ViewOffIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';

import { Controller } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';
import { useStore } from '@common';
import { findIndex, forEach, map } from 'lodash';
import ImagePicker from '@leebrary/components/ImagePicker';
import { QuestionImage } from '../../../../../../components/QuestionImage';
import { QuestionImageMarkersModal } from '../../../../../../components/QuestionImageMarkersModal';
import { ListItemValueRender } from './components/ListItemValueRender';

// eslint-disable-next-line import/prefer-default-export
export function QuestionMap({ form, t }) {
  const [store, render] = useStore();
  const image = form.watch('properties.image');
  const markers = form.watch('properties.markers');

  function showMarkersModal() {
    store.showMarkersModal = true;
    render();
  }

  function closeMarkersModal() {
    store.showMarkersModal = false;
    render();
  }

  function toggleHideOnHelp(item) {
    const data = form.getValues('properties.markers');
    const index = findIndex(data.list, item);
    if (index >= 0) {
      data.list[index].hideOnHelp = !data.list[index].hideOnHelp;
      form.setValue('properties.markers', data);
    }
  }

  const splits = t('itemsDescription').split('{{icon}}');
  const itemsDescription = [
    splits[0],
    <Box
      key={2}
      sx={(theme) => ({
        display: 'inline',
        fontSize: theme.fontSizes[3],
        verticalAlign: 'middle',
      })}
    >
      <ViewOffIcon />
    </Box>,
    splits[1],
  ];

  function removeImage() {
    form.setValue('properties.image', null);
    form.setValue('properties.markers', {
      ...markers,
      list: [],
    });
  }

  return (
    <ContextContainer>
      <InputWrapper required label={t('mapLabel')}>
        {image ? (
          <ContextContainer>
            <ContextContainer direction="row">
              <Box>
                <QuestionImage src={image} markers={markers} />
              </Box>
              <Box>
                <ActionButton icon={<DeleteBinIcon />} onClick={() => removeImage()} />
              </Box>
            </ContextContainer>

            <Box>
              <Button onClick={showMarkersModal}>{t('createNumbering')}</Button>
            </Box>
            <Controller
              control={form.control}
              name="properties.markers"
              render={({ field }) => (
                <QuestionImageMarkersModal
                  {...field}
                  src={image}
                  opened={store.showMarkersModal}
                  onClose={closeMarkersModal}
                />
              )}
            />
            <Controller
              control={form.control}
              name="properties.caption"
              render={({ field }) => <Textarea label={t('captionAltLabel')} {...field} />}
            />
          </ContextContainer>
        ) : (
          <Box>
            <Controller
              control={form.control}
              name="properties.image"
              render={({ field }) => <ImagePicker {...field} />}
            />
          </Box>
        )}
      </InputWrapper>
      <InputWrapper
        required
        label={t('itemsLabel')}
        description={
          markers && markers.list && markers.list.length
            ? itemsDescription
            : t('itemsDescriptionBeforeMap')
        }
      >
        <Controller
          control={form.control}
          name="properties.markers"
          rules={{
            required: t('markersRequired'),
            validate: (m) => {
              if (!m.list || m.list.length === 0) {
                return t('markersRequired');
              }
              let allHasResponse = true;
              forEach(m.list, (e) => {
                if (!e.response) {
                  allHasResponse = false;
                }
              });
              return allHasResponse ? undefined : t('markersNeedResponseInAllItems');
            },
          }}
          render={({ field }) => {
            let canSetHelp = true;
            forEach(field.value?.list, ({ hideOnHelp }) => {
              if (hideOnHelp) canSetHelp = false;
            });
            return (
              <ListInput
                {...field}
                value={map(field.value?.list || [], (item) => ({ value: item }))}
                onChange={(value) => {
                  field.onChange({
                    ...field.value,
                    list: map(field.value.list, (item, i) => ({
                      ...item,
                      response: value[i].value.response,
                      hideOnHelp: value[i].value.hideOnHelp,
                    })),
                  });
                }}
                error={form.formState.errors.properties?.markers}
                inputRender={(props) => (
                  <TextInput
                    {...props}
                    value={props.value.response}
                    onChange={(e) => props.onChange({ ...props.value, response: e })}
                  />
                )}
                listRender={
                  <ListItem
                    itemContainerRender={({ children }) => (
                      <Paper
                        fullWidth
                        sx={(theme) => ({
                          marginTop: theme.spacing[2],
                          marginBottom: theme.spacing[2],
                          width: '100%',
                        })}
                      >
                        <Stack alignItems="center" fullWidth>
                          {children}
                        </Stack>
                      </Paper>
                    )}
                    itemValueRender={
                      <ListItemValueRender
                        markers={markers}
                        t={t}
                        canSetHelp={canSetHelp}
                        toggleHideOnHelp={toggleHideOnHelp}
                        showEye={field?.value?.list?.length > 2}
                      />
                    }
                  />
                }
              />
            );
          }}
        />
      </InputWrapper>
      <InputWrapper label={t('explanationLabel')}>
        <Controller
          control={form.control}
          name="properties.explanation"
          render={({ field }) => <TextEditorInput {...field} />}
        />
      </InputWrapper>
    </ContextContainer>
  );
}

QuestionMap.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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
  InputWrapper,
} from '@bubbles-ui/components';
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import ImagePicker from '@leebrary/components/ImagePicker';
import { forEach, map } from 'lodash';
import PropTypes from 'prop-types';

import { QuestionImageMarkersModal } from '../../../../../../components/QuestionImageMarkersModal';

import { ListItemValueRender } from './components/ListItemValueRender';
import { NumberedListIcon } from './components/NumberedListIcon';

// eslint-disable-next-line import/prefer-default-export
export function MapQuestion({ form: _form, t }) {
  const [showMarkersModal, setShowMarkersModal] = useState(false);

  const form = useFormContext() || _form;
  const mapProperties = form.watch('mapProperties');
  const hasHelp = form.watch('hasHelp');

  useEffect(() => {
    if (!mapProperties?.image) {
      form.setValue('mapProperties.markers.list', []);
    }
  }, [mapProperties?.image]);

  const getListValues = (list) => map(list ?? [], (item) => ({ value: item }));

  return (
    <ContextContainer>
      <Box>
        <ContextContainer title={`${t('mapLabel')} *`}>
          <Controller
            control={form.control}
            name="mapProperties.image"
            render={({ field }) => <ImagePicker {...field} label={t('mapLabel')} />}
          />
        </ContextContainer>
      </Box>

      {mapProperties?.image ? (
        <ContextContainer>
          <Box>
            <Button
              variant="outline"
              leftIcon={<NumberedListIcon />}
              onClick={() => setShowMarkersModal(true)}
            >
              {t(mapProperties?.markers?.list?.length ? 'editNumbering' : 'createNumbering')}
            </Button>
          </Box>

          <QuestionImageMarkersModal
            value={mapProperties?.markers}
            onChange={(value) => form.setValue('mapProperties.markers', value)}
            src={mapProperties?.image}
            opened={showMarkersModal}
            onClose={() => setShowMarkersModal(false)}
          />

          <Controller
            control={form.control}
            name="mapProperties.caption"
            render={({ field }) => (
              <Textarea
                label={t('captionAltLabel')}
                placeholder={t('captionAltPlaceholder')}
                {...field}
              />
            )}
          />
        </ContextContainer>
      ) : null}

      <ContextContainer title={`${t('explanationLabel')} *`}>
        <Controller
          control={form.control}
          name="globalFeedback"
          rules={{ required: t('explanationRequired') }}
          render={({ field }) => (
            <TextEditorInput
              {...field}
              toolbars={TEXT_EDITOR_TEXTAREA_TOOLBARS}
              value={field.value?.text}
              onChange={(value) => {
                field.onChange({ text: value, format: 'html' });
              }}
              error={form?.formState?.errors?.globalFeedback?.text}
              editorStyles={{ minHeight: '96px' }}
              placeholder={t('explanationPlaceHolder')}
            />
          )}
        />
      </ContextContainer>

      <ContextContainer
        title={`${t('itemsLabel')} *`}
        description={mapProperties?.markers?.list?.length ? '' : t('itemsDescriptionBeforeMap')}
      >
        <Controller
          control={form.control}
          name="mapProperties.markers"
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
            <>
              <InputWrapper error={form.formState.errors.mapProperties?.markers}>
                {mapProperties?.markers?.list?.length ? (
                  <ListInput
                    {...field}
                    withItemBorder
                    withInputBorder
                    value={getListValues(field.value?.list)}
                    onChange={(value) => {
                      field.onChange({
                        ...mapProperties.markers,
                        list: map(value, (item) => item.value),
                      });
                    }}
                    error={form.formState.errors.properties?.markers}
                    inputRender={(itemProps) => (
                      <TextInput
                        {...itemProps}
                        value={itemProps?.value.response}
                        placeholder={t('responsePlaceholder')}
                        onChange={(e) => itemProps?.onChange({ ...itemProps.value, response: e })}
                      />
                    )}
                    listRender={
                      <ListItem
                        labels={{ cancel: t('cancel'), saveChanges: t('saveChanges') }}
                        itemContainerRender={({ children }) => (
                          <Stack alignItems="center" fullWidth>
                            {children}
                          </Stack>
                        )}
                        itemValueRender={
                          <ListItemValueRender
                            markers={mapProperties?.markers}
                            t={t}
                            canSetHelp
                            showEye={field?.value?.list?.length > 2 && hasHelp}
                          />
                        }
                      />
                    }
                  />
                ) : null}
              </InputWrapper>
            </>
          )}
        />
      </ContextContainer>
      <ContextContainer>
        <Controller
          control={form.control}
          name="hasHelp"
          render={({ field }) => (
            <Switch
              {...field}
              checked={field.value}
              label={t('hasCluesLabelWithMinResponses')}
              description={t('cluesSwitchDescription')}
            />
          )}
        />
      </ContextContainer>
    </ContextContainer>
  );
}

MapQuestion.propTypes = {
  form: PropTypes.object,
  t: PropTypes.func,
};

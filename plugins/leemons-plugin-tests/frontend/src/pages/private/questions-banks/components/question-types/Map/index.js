import React, { useEffect } from 'react';
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

function NumberedListIcon({ width = 21, height = 20 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.500102 1.66667C0.500102 1.43655 0.68665 1.25 0.916768 1.25H1.33344C1.55445 1.25 1.76641 1.3378 1.92269 1.49408C2.07897 1.65036 2.16677 1.86232 2.16677 2.08333V4.58171H2.58344C2.81355 4.58171 3.0001 4.76825 3.0001 4.99837C3.0001 5.22849 2.81355 5.41504 2.58344 5.41504H1.78718C1.77497 5.41612 1.7626 5.41667 1.7501 5.41667C1.7376 5.41667 1.72524 5.41612 1.71302 5.41504H0.916768C0.68665 5.41504 0.500102 5.22849 0.500102 4.99837C0.500102 4.76825 0.68665 4.58171 0.916768 4.58171H1.33344V2.08333H0.916768C0.68665 2.08333 0.500102 1.89679 0.500102 1.66667ZM6.125 2.70671C5.77982 2.70671 5.5 2.98653 5.5 3.33171C5.5 3.67688 5.77982 3.95671 6.125 3.95671H19.875C20.2202 3.95671 20.5 3.67688 20.5 3.33171C20.5 2.98653 20.2202 2.70671 19.875 2.70671H6.125ZM6.125 9.37337C5.77982 9.37337 5.5 9.65319 5.5 9.99837C5.5 10.3435 5.77982 10.6234 6.125 10.6234H19.875C20.2202 10.6234 20.5 10.3435 20.5 9.99837C20.5 9.65319 20.2202 9.37337 19.875 9.37337H6.125ZM5.5 16.665C5.5 16.3199 5.77982 16.04 6.125 16.04H19.875C20.2202 16.04 20.5 16.3199 20.5 16.665C20.5 17.0102 20.2202 17.29 19.875 17.29H6.125C5.77982 17.29 5.5 17.0102 5.5 16.665ZM1.65055 15.4248C1.73082 15.4092 1.81387 15.4161 1.89007 15.4444C1.96622 15.4726 2.03179 15.5209 2.08 15.5827C2.12815 15.6445 2.15721 15.7175 2.16478 15.7934C2.17235 15.8692 2.15825 15.946 2.12357 16.015C2.08886 16.0842 2.03462 16.1435 1.96608 16.1854C1.89747 16.2273 1.81765 16.2499 1.7357 16.25C1.50582 16.2501 1.31949 16.4364 1.3193 16.6663C1.31912 16.8962 1.50515 17.0828 1.73503 17.0833C1.81683 17.0835 1.89648 17.1062 1.96493 17.1481C2.03332 17.19 2.08744 17.2491 2.12211 17.3182C2.15675 17.3871 2.1709 17.4637 2.16344 17.5394C2.15599 17.6152 2.12711 17.6881 2.0792 17.7498C2.03123 17.8117 1.96592 17.86 1.89001 17.8885C1.81405 17.9169 1.73118 17.9241 1.65099 17.9089C1.57082 17.8937 1.4974 17.8569 1.43872 17.8037C1.38009 17.7505 1.33856 17.6831 1.3178 17.6094C1.25536 17.3879 1.02519 17.259 0.803703 17.3215C0.58222 17.3839 0.453295 17.6141 0.515742 17.8356C0.579297 18.061 0.70537 18.2635 0.878762 18.4209C1.05209 18.5781 1.26588 18.684 1.49579 18.7276C1.72566 18.7712 1.96341 18.7509 2.1825 18.6688C2.40164 18.5866 2.5941 18.4456 2.73759 18.2607C2.88114 18.0757 2.96982 17.8542 2.99277 17.6211C3.01572 17.3879 2.97191 17.1534 2.86677 16.9441C2.81612 16.8433 2.75228 16.7503 2.67738 16.6674C2.75297 16.584 2.81736 16.4905 2.86835 16.3889C2.97361 16.1792 3.0173 15.9442 2.994 15.7106C2.9707 15.4771 2.88145 15.2554 2.73722 15.0704C2.59304 14.8854 2.39983 14.7447 2.18004 14.6631C1.96029 14.5816 1.72203 14.5621 1.49192 14.6067C1.26179 14.6513 1.0481 14.7585 0.875288 14.9169C0.70241 15.0754 0.577278 15.2791 0.515035 15.5053C0.453989 15.7272 0.584365 15.9565 0.806239 16.0176C1.02811 16.0786 1.25746 15.9482 1.31851 15.7264C1.33884 15.6525 1.38004 15.5847 1.43846 15.5311C1.49695 15.4775 1.57032 15.4404 1.65055 15.4248ZM1.45548 8.87204C1.37734 8.95018 1.33344 9.05616 1.33344 9.16667C1.33344 9.39678 1.14689 9.58333 0.916772 9.58333C0.686654 9.58333 0.500106 9.39678 0.500106 9.16667C0.500106 8.83515 0.631802 8.5172 0.866222 8.28278C1.10064 8.04836 1.41858 7.91667 1.75011 7.91667C2.08163 7.91667 2.39957 8.04836 2.63399 8.28278C2.8584 8.50719 2.98918 8.87653 2.9999 9.19265C2.99415 9.54774 2.8706 9.89162 2.64874 10.1695L1.78396 11.25H2.58344C2.81356 11.25 3.00011 11.4365 3.00011 11.6667C3.00011 11.8968 2.81356 12.0833 2.58344 12.0833H0.916772C0.756586 12.0833 0.610583 11.9915 0.541208 11.8471C0.471834 11.7027 0.491374 11.5314 0.591471 11.4063L2.00966 9.63398C2.10627 9.50657 2.16079 9.30345 2.16614 9.14375C2.1609 9.04846 2.09544 8.93002 2.03136 8.85925C1.95868 8.79275 1.83246 8.75413 1.73397 8.75031C1.62933 8.75436 1.52981 8.79771 1.45548 8.87204Z"
        fill="currentColor"
      />
    </svg>
  );
}

NumberedListIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
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

  useEffect(() => {
    if (!properties?.image) {
      form.setValue('properties.markers', {
        ...(properties?.markers || {}),
        list: [],
      });
    }
  }, [properties?.image]);

  useEffect(() => {
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
          name="properties.explanation"
          render={({ field }) => (
            <TextEditorInput
              {...field}
              editorStyles={{ minHeight: '96px' }}
              placeholder={t('explanationPlaceHolder')}
            />
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
                    placeholder={t('responsePlaceholder')}
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
  form: PropTypes.object,
  t: PropTypes.func,
};

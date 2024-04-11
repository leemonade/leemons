import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  InputWrapper,
  Paragraph,
  TextInput,
} from '@bubbles-ui/components';
import prefixPN from '@calendar/helpers/prefixPN';
import { MeetingCameraIcon, PluginRedactorIcon, SmileyPinIcon } from '@bubbles-ui/icons/outline';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { linkify } from '@common';

export default function Event({ isEditing, event, form, data, allFormData, classes, disabled }) {
  const [t] = useTranslateLoader(prefixPN('event_mode_event_type'));
  const { t: tCommon } = useCommonTranslate('forms');

  const {
    Controller,
    control,
    formState: { errors },
  } = form;

  return (
    <ContextContainer spacing={2}>
      {!disabled || (disabled && form.getValues('videoLink')) ? (
        <Controller
          name="videoLink"
          control={control}
          render={({ field }) => {
            if (disabled) {
              return (
                <InputWrapper label={t('video_link')}>
                  <Paragraph clean dangerouslySetInnerHTML={{ __html: linkify(field.value) }} />
                </InputWrapper>
              );
            }
            return (
              <TextInput
                size="xs"
                disabled={disabled}
                label={t('video_link')}
                error={get(errors, 'videoLink')}
                {...field}
              />
            );
          }}
        />
      ) : null}
      {!disabled || (disabled && form.getValues('place')) ? (
        <Controller
          name="place"
          control={control}
          render={({ field }) => {
            if (disabled) {
              return (
                <InputWrapper label={t('add_place')}>
                  <Paragraph clean dangerouslySetInnerHTML={{ __html: linkify(field.value) }} />
                </InputWrapper>
              );
            }
            return (
              <TextInput
                size="xs"
                readOnly={disabled}
                disabled={disabled}
                label={t('add_place')}
                error={get(errors, 'place')}
                {...field}
              />
            );
          }}
        />
      ) : null}
      {!disabled || (disabled && form.getValues('description')) ? (
        <Controller
          name="description"
          control={control}
          render={({ field }) => {
            if (disabled) {
              return (
                <InputWrapper label={t('add_description')}>
                  <Paragraph clean dangerouslySetInnerHTML={{ __html: linkify(field.value) }} />
                </InputWrapper>
              );
            }
            return (
              <TextInput
                size="xs"
                disabled={disabled}
                label={t('add_description')}
                error={get(errors, 'description')}
                {...field}
              />
            );
          }}
        />
      ) : null}
    </ContextContainer>
  );
}

Event.propTypes = {
  isEditing: PropTypes.bool,
  event: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  allFormData: PropTypes.object,
  tCommon: PropTypes.func,
};

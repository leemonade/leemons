import React, { useMemo } from 'react';

import {
  ActionButton,
  ContextContainer,
  Text,
  InputWrapper,
  Paragraph,
  TextInput,
  TextClamp,
} from '@bubbles-ui/components';
import { OpenIcon } from '@bubbles-ui/icons/outline';
import { linkify } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '@calendar/helpers/prefixPN';

dayjs.extend(isBetween);

const PREVENT_MINUTES_BEFORE_START = 15;

export default function Event({ isEditing, event, form, data, allFormData, classes, disabled }) {
  const [t] = useTranslateLoader(prefixPN('event_mode_event_type'));

  const {
    Controller,
    control,
    formState: { errors },
  } = form;

  const onClickCallLink = () => window.open(form.getValues('videoLink'), '_blank');

  const showVideoLink = useMemo(() => {
    const currentTime = dayjs();
    const startTime = dayjs(event?.startDate).subtract(PREVENT_MINUTES_BEFORE_START, 'minutes');
    const endTime = dayjs(event?.endDate);
    return (
      disabled &&
      form.getValues('videoLink') &&
      currentTime.isBetween(startTime, endTime, null, '[]')
    );
  }, [form, event, disabled]);

  return (
    <>
      {!disabled && (
        <ContextContainer spacing={2}>
          <Controller
            name="videoLink"
            control={control}
            render={({ field }) => {
              if (disabled) {
                return (
                  <TextInput
                    size="xs"
                    disabled={disabled}
                    label={t('video_link')}
                    error={get(errors, 'videoLink')}
                    {...field}
                  />
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
        </ContextContainer>
      )}
      {disabled && (
        <ContextContainer>
          {showVideoLink && (
            <ContextContainer spacing={2}>
              <Text size="lg" strong>
                {t('video_link_view')}
              </Text>
              <ContextContainer direction="row" justifyContent="space-between" alignItems="center">
                <TextClamp lines={1} withTooltip>
                  <Text>{form.getValues('videoLink')}</Text>
                </TextClamp>
                <ActionButton
                  onClick={onClickCallLink}
                  variant="linkInline"
                  style={{ paddingBottom: '6px' }}
                >
                  <OpenIcon width={18} height={18} />
                </ActionButton>
              </ContextContainer>
            </ContextContainer>
          )}

          {form.getValues('place') ? (
            <ContextContainer spacing={2}>
              <Text size="lg" strong>
                {t('add_place')}
              </Text>
              <Text>{form.getValues('place')}</Text>
            </ContextContainer>
          ) : null}

          {form.getValues('description') ? (
            <ContextContainer spacing={2}>
              <Text size="lg" strong>
                {t('add_description')}
              </Text>
              <Text>{form.getValues('description')}</Text>
            </ContextContainer>
          ) : null}
        </ContextContainer>
      )}
    </>
  );
}

Event.propTypes = {
  isEditing: PropTypes.bool,
  event: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  allFormData: PropTypes.object,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
};

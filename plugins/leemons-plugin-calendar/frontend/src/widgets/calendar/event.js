import React from 'react';

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
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '@calendar/helpers/prefixPN';

export default function Event({ isEditing, event, form, data, allFormData, classes, disabled }) {
  const [t] = useTranslateLoader(prefixPN('event_mode_event_type'));
  const { t: tCommon } = useCommonTranslate('forms');

  const {
    Controller,
    control,
    formState: { errors },
  } = form;

  const onClickCallLink = () => window.open(form.getValues('videoLink'), '_blank');

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
          {disabled && form.getValues('videoLink') ? (
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
          ) : null}

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
  tCommon: PropTypes.func,
};

import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';
import { Box, Col, ContextContainer, Grid, TextInput } from '@bubbles-ui/components';
import prefixPN from '@calendar/helpers/prefixPN';
import { MeetingCameraIcon, PluginKimIcon, PluginRedactorIcon } from '@bubbles-ui/icons/outline';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

export default function Event({ isEditing, event, form, data, allFormData, classes, disabled }) {
  const [t] = useTranslateLoader(prefixPN('event_mode_event_type'));
  const { t: tCommon } = useCommonTranslate('forms');

  const {
    Controller,
    control,
    formState: { errors },
  } = form;

  return (
    <ContextContainer>
      {!disabled || (disabled && form.getValues('videoLink')) ? (
        <Box>
          <Grid columns={100} gutter={0}>
            <Col span={10} className={classes.icon}>
              <MeetingCameraIcon />
            </Col>
            <Col span={90}>
              <Controller
                name="videoLink"
                control={control}
                render={({ field }) => (
                  <TextInput
                    size="xs"
                    disabled={disabled}
                    label={t('video_link')}
                    error={get(errors, 'videoLink')}
                    {...field}
                  />
                )}
              />
            </Col>
          </Grid>
        </Box>
      ) : null}
      {!disabled || (disabled && form.getValues('place')) ? (
        <Box>
          <Grid columns={100} gutter={0}>
            <Col span={10} className={classes.icon}>
              <PluginKimIcon />
            </Col>
            <Col span={90}>
              <Controller
                name="place"
                control={control}
                render={({ field }) => (
                  <TextInput
                    size="xs"
                    disabled={disabled}
                    label={t('add_place')}
                    error={get(errors, 'place')}
                    {...field}
                  />
                )}
              />
            </Col>
          </Grid>
        </Box>
      ) : null}
      {!disabled || (disabled && form.getValues('description')) ? (
        <Box>
          <Grid columns={100} gutter={0}>
            <Col span={10} className={classes.icon}>
              <PluginRedactorIcon />
            </Col>
            <Col span={90}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextInput
                    size="xs"
                    disabled={disabled}
                    label={t('add_description')}
                    error={get(errors, 'description')}
                    {...field}
                  />
                )}
              />
            </Col>
          </Grid>
        </Box>
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

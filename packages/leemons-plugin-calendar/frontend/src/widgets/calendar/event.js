import PropTypes from 'prop-types';
import * as _ from 'lodash';
import React, { useEffect } from 'react';
import { FormControl, Input } from 'leemons-ui';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

export default function Event({ isEditing, event, form, data, allFormData }) {
  const [t] = useTranslateLoader(prefixPN('event_mode_event_type'));
  const { t: tCommon } = useCommonTranslate('forms');

  useEffect(() => {
    if (event) {
      if (_.isObject(event.data)) {
        _.forIn(event.data, (value, key) => {
          form.setValue(key, value);
        });
      }
    }
  }, []);

  return (
    <div>
      <FormControl
        label={t('video_link')}
        className="w-full"
        formError={_.get(form.formState.errors, `videoLink`)}
      >
        <Input className="w-full" outlined={true} {...form.register(`videoLink`)} />
      </FormControl>

      <FormControl
        label={t('add_place')}
        className="w-full"
        formError={_.get(form.formState.errors, `place`)}
      >
        <Input className="w-full" outlined={true} {...form.register(`place`)} />
      </FormControl>

      <FormControl
        label={t('add_description')}
        className="w-full"
        formError={_.get(form.formState.errors, `description`)}
      >
        <Input className="w-full" outlined={true} {...form.register(`description`)} />
      </FormControl>
    </div>
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

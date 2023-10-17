import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  ContextContainer,
  Paragraph,
  RadioGroup,
  Select,
} from '@bubbles-ui/components';
import { LoginProfileSelectorStyles } from './LoginProfileSelector.styles';
import _ from 'lodash';

export const LOGIN_PROFILE_SELECTOR_DEFAULT_PROPS = {
  labels: { title: '', description: '', help: '', remember: '', login: '' },
  errorMessages: {},
  loading: false,
  profiles: [],
};
export const LOGIN_PROFILE_SELECTOR_PROP_TYPES = {
  labels: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    help: PropTypes.string,
    remember: PropTypes.string,
    login: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({ profile: PropTypes.any }),
  centers: PropTypes.any,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

const LoginProfileSelector = ({
  labels,
  centers,
  className,
  onSubmit,
  loading,
  errorMessages,
  defaultValues: _defaultValues,
  ...props
}) => {
  const [profileCenters, setProfileCenters] = React.useState([]);
  const { classes, cx } = LoginProfileSelectorStyles({}, { name: 'LoginProfileSelector' });

  const profiles = getProfiles();

  function getProfiles() {
    const profiles = [];
    _.forEach(centers, (center) => {
      profiles.push(...center.profiles);
    });
    return _.uniqBy(profiles, 'id');
  }

  function getProfileCenters(profileId) {
    const _centers = _.filter(centers, (center) => {
      return !!_.find(center.profiles, { id: profileId });
    });
    return _centers.map((center) => ({
      value: center.id,
      label: center.name,
    }));
  }

  let defaultValues = {};
  if (_defaultValues) {
    defaultValues = _defaultValues;
    if (!profileCenters || !profileCenters.length) {
      setProfileCenters(getProfileCenters(defaultValues.profile));
    }
  } else if (profiles.length === 1) {
    defaultValues.profile = profiles[0].id;
    if (!profileCenters || !profileCenters.length) {
      setProfileCenters(getProfileCenters(defaultValues.profile));
    }
  }

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const profilesData = React.useMemo(() => {
    return profiles.map((profile) => {
      return {
        value: profile.id,
        label: profile.name,
      };
    });
  }, [profiles]);

  const selectedProfile = _.find(profiles, { id: watch('profile') });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContextContainer title={labels.title} description={labels.description} {...props}>
        {profiles?.length && profiles.length > 1 ? (
          <Controller
            name="profile"
            control={control}
            rules={{
              required: errorMessages.profile?.required,
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <RadioGroup
                className={classes.radioGroup}
                variant="icon"
                data={profilesData}
                fullWidth
                required
                error={errors.profile}
                onChange={(e) => {
                  const _centers = getProfileCenters(e);
                  if (_centers.length < 2) {
                    setValue('center', _centers[0].value);
                  }
                  setProfileCenters(_centers);
                  onChange(e);
                }}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
        ) : null}

        {profileCenters.length > 1 && selectedProfile && selectedProfile.sysName !== 'admin' ? (
          <Controller
            name="center"
            control={control}
            rules={{
              required: errorMessages.center?.required,
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <Select
                data={profileCenters}
                required
                placeholder={labels.centerPlaceholder}
                error={errors.center}
                onChange={(e) => {
                  onChange(e);
                }}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
        ) : null}

        <Controller
          name="remember"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Checkbox
              className={classes.checkBox}
              label={labels.remember}
              onChange={onChange} // send value to hook form
              checked={value}
              {...field}
            />
          )}
        />
        <Paragraph color="secondary" className={classes.lowerHelp}>
          {labels.help}
        </Paragraph>
        <Box>
          <Button type="submit" fullWidth loading={loading} loaderPosition="right">
            {labels.login}
          </Button>
        </Box>
      </ContextContainer>
    </form>
  );
};

LoginProfileSelector.defaultProps = LOGIN_PROFILE_SELECTOR_DEFAULT_PROPS;
LoginProfileSelector.propTypes = LOGIN_PROFILE_SELECTOR_PROP_TYPES;

export { LoginProfileSelector };

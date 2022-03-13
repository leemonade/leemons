import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Box,
  Button,
  Col,
  ContextContainer,
  DatePicker,
  Grid,
  InputWrapper,
  Select,
  Stack,
  TextInput,
} from '@bubbles-ui/components';
import { EMAIL_REGEX } from '@bubbles-ui/leemons';
import { Controller } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';

function PersonalInformation({ t, user, form, config, isEditMode }) {
  const [tp] = useTranslateLoader(prefixPN('create_users'));

  return (
    <Grid columns={100}>
      <Col span={35}>
        <InputWrapper label={t('personalInformationLabel')} />
      </Col>
      <Col span={65}>
        <ContextContainer>
          <Controller
            name="user.email"
            control={form.control}
            rules={{
              required: tp('emailHeaderRequired'),
              pattern: { value: EMAIL_REGEX, message: tp('emailHeaderNotEmail') },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                error={get(form.formState.errors, 'user.email')}
                label={tp('emailHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          <Box>
            <TextInput label={tp('passwordHeader')} disabled={true} />
            <Stack fullWidth direction="row" justifyContent="flex-end">
              <Button variant="link">{t('recoveryLink')}</Button>
            </Stack>
          </Box>
          <Controller
            name="user.name"
            control={form.control}
            rules={{
              required: tp('nameHeaderRequired'),
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                error={get(form.formState.errors, 'user.name')}
                label={tp('nameHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          <Controller
            name="user.surnames"
            control={form.control}
            rules={{
              required: tp('surnameHeaderRequired'),
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                error={get(form.formState.errors, 'user.surnames')}
                label={tp('surnameHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          {config.secondSurname && !config.secondSurname.disabled ? (
            <Controller
              name="user.secondSurname"
              control={form.control}
              rules={
                config.secondSurname.required ? { required: tp('secondSurnameHeaderRequired') } : {}
              }
              render={({ field }) => (
                <TextInput
                  {...field}
                  error={get(form.formState.errors, 'user.secondSurname')}
                  label={tp('secondSurnameHeader')}
                  disabled={!isEditMode}
                  required={config.secondSurname.required}
                />
              )}
            />
          ) : null}
          <Controller
            name="user.birthdate"
            control={form.control}
            rules={{
              required: tp('birthdayHeaderRequired'),
            }}
            render={({ field }) => (
              <DatePicker
                {...field}
                error={get(form.formState.errors, 'user.birthdate')}
                label={tp('birthdayHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
          <Controller
            name="user.gender"
            control={form.control}
            rules={{
              required: tp('genderHeaderRequired'),
            }}
            render={({ field }) => (
              <Select
                {...field}
                error={get(form.formState.errors, 'user.gender')}
                data={[
                  { label: tp('male'), value: 'male' },
                  { label: tp('female'), value: 'female' },
                ]}
                label={tp('genderHeader')}
                disabled={!isEditMode}
                required
              />
            )}
          />
        </ContextContainer>
      </Col>
    </Grid>
  );
}

PersonalInformation.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
  form: PropTypes.object,
  config: PropTypes.object,
  isEditMode: PropTypes.bool,
};

export default PersonalInformation;

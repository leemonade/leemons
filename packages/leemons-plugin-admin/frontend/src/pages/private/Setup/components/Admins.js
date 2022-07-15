/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  createStyles,
  DatePicker,
  Select,
  Stack,
  TableInput,
  TextInput,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import { TagsMultiSelect, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLayout } from '@layout/context';
import { map } from 'lodash';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '@admin/constants';

const Styles = createStyles((theme) => ({}));

const Admins = ({ onNextLabel, onNext = () => {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('setup.admins'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const { openDeleteConfirmationModal } = useLayout();
  const form = useForm();

  const [store, render] = useStore({
    loading: true,
    selectedCenter: null,
  });

  const { classes: styles, cx } = Styles();

  const data = React.useMemo(() => {
    const result = {
      pageHeader: {
        title: t('pageTitle'),
      },
      tableColumns: [],
      tableLabels: {
        add: t('tableAdd'),
        remove: t('tableRemove'),
      },
    };
    result.tableColumns.push({
      Header: t('emailHeader'),
      accessor: 'email',
      className: 'text-left',
      input: {
        node: <TextInput disabled={!store.center || !store.profile} required />,
        rules: {
          required: t('emailHeaderRequired'),
          pattern: { value: EMAIL_REGEX, message: t('emailHeaderNotEmail') },
        },
      },
      valueRender: (value) => <>{value}</>,
    });
    result.tableColumns.push({
      Header: t('nameHeader'),
      accessor: 'name',
      className: 'text-left',
      input: {
        node: <TextInput disabled={!store.center || !store.profile || !!store.user} required />,
        rules: { required: t('nameHeaderRequired') },
      },
      valueRender: (value) => <>{value}</>,
    });
    result.tableColumns.push({
      Header: t('surnameHeader'),
      accessor: 'surnames',
      className: 'text-left',
      input: {
        node: <TextInput disabled={!store.center || !store.profile || !!store.user} required />,
        rules: { required: t('surnameHeaderRequired') },
      },
      valueRender: (value) => <>{value}</>,
    });
    if (store.secondSurname && !store.secondSurname.disabled) {
      result.tableColumns.push({
        Header: t('secondSurnameHeader'),
        accessor: 'secondSurname',
        className: 'text-left',
        input: {
          node: <TextInput disabled={!store.center || !store.profile || !!store.user} required />,
          rules: store.secondSurname.required ? { required: t('secondSurnameHeaderRequired') } : {},
        },
        valueRender: (value) => <>{value}</>,
      });
    }
    result.tableColumns.push({
      Header: t('birthdayHeader'),
      accessor: 'birthdate',
      className: 'text-left',
      input: {
        node: <DatePicker disabled={!store.center || !store.profile || !!store.user} required />,
        rules: { required: t('birthdayHeaderRequired') },
      },
      valueRender: (value) => <>{new Date(value).toLocaleString()}</>,
    });
    result.tableColumns.push({
      Header: t('genderHeader'),
      accessor: 'gender',
      className: 'text-left',
      input: {
        node: (
          <Select
            data={[
              { label: t('male'), value: 'male' },
              { label: t('female'), value: 'female' },
            ]}
            disabled={!store.center || !store.profile || !!store.user}
            required
          />
        ),
        rules: { required: t('genderHeaderRequired') },
      },
      valueRender: (value) => <>{t(value)}</>,
    });
    result.tableColumns.push({
      Header: t('tagsHeader'),
      accessor: 'tags',
      className: 'text-left',
      input: {
        node: (
          <TagsMultiSelect
            pluginName="users"
            disabled={
              !store.center ||
              !store.profile ||
              store.userAlreadyHaveThisConfig ||
              store.userEmailAlreadyAdded
            }
          />
        ),
      },
      valueRender: (values) => map(values, (value, index) => `${index ? ', ' : ''}${value}`),
    });
    return result;
  }, [
    t,
    store.center,
    store.profile,
    JSON.stringify(store.avatar),
    JSON.stringify(store.secondSurname),
  ]);

  return (
    <Box>
      <ContextContainer title={t('title')} description={t('description')} divided>
        <Box>
          {store.userEmailAlreadyAdded ? (
            <Alert severity="error" closeable={false}>
              {t('userEmailAlreadyAdded')}
            </Alert>
          ) : null}

          <TableInput
            data={store.usersToCreate}
            // onChange={onChange}
            form={form}
            columns={data.tableColumns}
            disabledAddButton={
              !store.center ||
              !store.profile ||
              store.userAlreadyHaveThisConfig ||
              store.userEmailAlreadyAdded
            }
            sortable={false}
            removable={true}
            labels={data.tableLabels}
          />
        </Box>
        <Stack justifyContent="end">
          <Button onClick={onNext} loading={store.saving}>
            {onNextLabel}
          </Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
};

Admins.defaultProps = {
  onNextLabel: 'Save and continue',
};
Admins.propTypes = {
  onNext: PropTypes.func,
  onNextLabel: PropTypes.string,
};

export { Admins };
export default Admins;

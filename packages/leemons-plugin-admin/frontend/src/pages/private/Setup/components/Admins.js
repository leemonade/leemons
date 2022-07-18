/* eslint-disable no-nested-ternary */
import React from 'react';
import { find, map } from 'lodash';
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
import usersPrefixPN from '@users/helpers/prefixPN';
import { TagsMultiSelect, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLayout } from '@layout/context';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '@admin/constants';
import { listProfilesRequest } from '@users/request';
import { addErrorAlert } from '@layout/alert';
import listUsers from '@users/request/listUsers';

const Styles = createStyles((theme) => ({}));

const Admins = ({ onNextLabel, onNext = () => {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('setup.admins'));
  const [tU] = useTranslateLoader(usersPrefixPN('create_users'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const { openDeleteConfirmationModal } = useLayout();
  const form = useForm();

  const [store, render] = useStore({
    loading: true,
    selectedCenter: null,
  });

  async function load() {
    try {
      store.loading = true;
      render();
      const {
        data: { items: profiles },
      } = await listProfilesRequest({
        page: 0,
        size: 99999,
      });

      store.profile = find(profiles, { sysName: 'admin' });

      const {
        data: { items: users },
      } = await listUsers({
        page: 0,
        size: 99999,
        query: {
          profiles: store.profile.id,
        },
      });

      store.users = users;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  const { classes: styles, cx } = Styles();

  const data = React.useMemo(() => {
    const result = {
      pageHeader: {
        title: tU('pageTitle'),
      },
      tableColumns: [],
      tableLabels: {
        add: tU('tableAdd'),
        remove: tU('tableRemove'),
      },
    };
    result.tableColumns.push({
      Header: tU('emailHeader'),
      accessor: 'email',
      className: 'text-left',
      input: {
        node: <TextInput disabled={!store.center || !store.profile} required />,
        rules: {
          required: tU('emailHeaderRequired'),
          pattern: { value: EMAIL_REGEX, message: tU('emailHeaderNotEmail') },
        },
      },
      valueRender: (value) => <>{value}</>,
    });
    result.tableColumns.push({
      Header: tU('nameHeader'),
      accessor: 'name',
      className: 'text-left',
      input: {
        node: <TextInput disabled={!store.center || !store.profile || !!store.user} required />,
        rules: { required: tU('nameHeaderRequired') },
      },
      valueRender: (value) => <>{value}</>,
    });
    result.tableColumns.push({
      Header: tU('surnameHeader'),
      accessor: 'surnames',
      className: 'text-left',
      input: {
        node: <TextInput disabled={!store.center || !store.profile || !!store.user} required />,
        rules: { required: tU('surnameHeaderRequired') },
      },
      valueRender: (value) => <>{value}</>,
    });
    if (store.secondSurname && !store.secondSurname.disabled) {
      result.tableColumns.push({
        Header: tU('secondSurnameHeader'),
        accessor: 'secondSurname',
        className: 'text-left',
        input: {
          node: <TextInput disabled={!store.center || !store.profile || !!store.user} required />,
          rules: store.secondSurname.required
            ? { required: tU('secondSurnameHeaderRequired') }
            : {},
        },
        valueRender: (value) => <>{value}</>,
      });
    }
    result.tableColumns.push({
      Header: tU('birthdayHeader'),
      accessor: 'birthdate',
      className: 'text-left',
      input: {
        node: <DatePicker disabled={!store.center || !store.profile || !!store.user} required />,
        rules: { required: tU('birthdayHeaderRequired') },
      },
      valueRender: (value) => <>{new Date(value).toLocaleString()}</>,
    });
    result.tableColumns.push({
      Header: tU('genderHeader'),
      accessor: 'gender',
      className: 'text-left',
      input: {
        node: (
          <Select
            data={[
              { label: tU('male'), value: 'male' },
              { label: tU('female'), value: 'female' },
            ]}
            disabled={!store.center || !store.profile || !!store.user}
            required
          />
        ),
        rules: { required: tU('genderHeaderRequired') },
      },
      valueRender: (value) => <>{tU(value)}</>,
    });
    result.tableColumns.push({
      Header: tU('tagsHeader'),
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
              {tU('userEmailAlreadyAdded')}
            </Alert>
          ) : null}

          <TableInput
            data={store.users}
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

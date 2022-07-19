/* eslint-disable no-nested-ternary */
import React from 'react';
import { find, forEach, forIn, map } from 'lodash';
import PropTypes from 'prop-types';
import {
  Alert,
  Badge,
  Box,
  Button,
  ContextContainer,
  createStyles,
  DatePicker,
  MultiSelect,
  Select,
  Stack,
  TableInput,
  TextInput,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@admin/helpers/prefixPN';
import usersPrefixPN from '@users/helpers/prefixPN';
import { TagsMultiSelect, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLayout } from '@layout/context';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '@admin/constants';
import {
  addUsersBulkRequest,
  listCentersRequest,
  listProfilesRequest,
  searchUserAgentsRequest,
} from '@users/request';
import { addErrorAlert } from '@layout/alert';
import deleteUserAgentById from '@users/request/deleteUserAgentById';
import listUsers from '@users/request/listUsers';

const Styles = createStyles((theme) => ({}));

const Admins = ({ onNextLabel, onNext = () => {} }) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('setup.admins'));
  const [tU] = useTranslateLoader(usersPrefixPN('create_users'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const debouncedFunction = useDebouncedCallback(500);

  const { openDeleteConfirmationModal } = useLayout();
  const form = useForm();

  const [store, render] = useStore({
    loading: true,
    centers: [],
    selectedCenter: null,
  });

  async function load() {
    try {
      store.loading = true;
      render();
      const [
        {
          data: { items: profiles },
        },
        {
          data: { items: centers },
        },
      ] = await Promise.all([
        listProfilesRequest({
          page: 0,
          size: 99999,
        }),
        listCentersRequest({
          page: 0,
          size: 999999,
        }),
      ]);

      store.centers = [];
      store.centersById = {};
      forEach(centers, ({ id, name }) => {
        store.centers.push({
          value: id,
          label: name,
        });
        store.centersById[id] = name;
      });
      store.profile = find(profiles, { sysName: 'admin' });

      const { userAgents } = await searchUserAgentsRequest(
        {
          profile: store.profile.id,
        },
        { withCenter: true, queryWithContains: false }
      );

      store.userAgents = userAgents;
      const users = {};
      forEach(userAgents, ({ center, user }) => {
        if (!users[user.id]) {
          users[user.id] = {
            ...user,
            centers: [],
          };
        }
        users[user.id].centers.push(center.id);
      });
      store.users = [];
      forIn(users, (user) => {
        store.users.push(user);
      });
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  async function onSave() {
    try {
      store.saving = true;
      render();

      const usersByCenter = {};
      forEach(store.users, ({ centers, ...user }) => {
        forEach(centers, (center) => {
          if (!usersByCenter[center]) {
            usersByCenter[center] = [];
          }
          usersByCenter[center].push(user);
        });
      });

      const userAgentIdsToRemove = [];
      forEach(store.userAgents, ({ center, user, id }) => {
        if (!usersByCenter[center.id] || !find(usersByCenter[center.id], { id: user.id })) {
          userAgentIdsToRemove.push(id);
        }
      });

      await Promise.all(map(userAgentIdsToRemove, (id) => deleteUserAgentById(id)));

      const centerIds = Object.keys(usersByCenter);
      for (let i = 0, l = centerIds.length; i < l; i++) {
        // eslint-disable-next-line no-await-in-loop
        await addUsersBulkRequest({
          users: usersByCenter[centerIds[i]],
          center: centerIds[i],
          profile: store.profile.id,
        });
      }

      onNext();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function getEmailData(email) {
    const {
      data: { items },
    } = await listUsers({
      page: 0,
      size: 1,
      query: {
        email,
      },
    });

    return items[0];
  }

  async function checkEmail(email) {
    store.userEmailAlreadyAdded = false;
    const user = await getEmailData(email);
    store.user = null;
    if (user) {
      store.user = user;
      form.setValue('name', store.user.name);
      form.setValue('gender', store.user.gender);
      form.setValue('surnames', store.user.surnames);
      form.setValue('secondSurname', store.user.secondSurname);
      form.setValue(
        'birthdate',
        store.user.birthdate ? new Date(store.user.birthdate) : store.user.birthdate
      );
    }
    forEach(store.users, (u) => {
      if (u.email === email) {
        store.userEmailAlreadyAdded = true;
      }
    });
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    const subscription = form.watch((value, event) => {
      if (event.name === 'email') {
        debouncedFunction(async () => {
          checkEmail(value.email);
        });
      }
    });
    return () => subscription.unsubscribe();
  });

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
      input: {
        node: <TextInput disabled={!store.profile} required />,
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
      input: {
        node: <TextInput disabled={!store.profile || !!store.user} required />,
        rules: { required: tU('nameHeaderRequired') },
      },
      valueRender: (value) => <>{value}</>,
    });
    result.tableColumns.push({
      Header: tU('surnameHeader'),
      accessor: 'surnames',
      input: {
        node: <TextInput disabled={!store.profile || !!store.user} required />,
        rules: { required: tU('surnameHeaderRequired') },
      },
      valueRender: (value) => <>{value}</>,
    });
    if (store.secondSurname && !store.secondSurname.disabled) {
      result.tableColumns.push({
        Header: tU('secondSurnameHeader'),
        accessor: 'secondSurname',
        input: {
          node: <TextInput disabled={!store.profile || !!store.user} required />,
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
      input: {
        node: <DatePicker disabled={!store.profile || !!store.user} required />,
        rules: { required: tU('birthdayHeaderRequired') },
      },
      valueRender: (value) => <>{new Date(value).toLocaleString()}</>,
    });
    result.tableColumns.push({
      Header: tU('genderHeader'),
      accessor: 'gender',
      input: {
        node: (
          <Select
            data={[
              { label: tU('male'), value: 'male' },
              { label: tU('female'), value: 'female' },
            ]}
            disabled={!store.profile || !!store.user}
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
      input: {
        node: (
          <TagsMultiSelect
            pluginName="users"
            disabled={!store.profile || store.userEmailAlreadyAdded}
          />
        ),
      },
      valueRender: (values) => map(values, (value, index) => `${index ? ', ' : ''}${value}`),
    });
    result.tableColumns.push({
      Header: tU('centersLabel'),
      accessor: 'centers',
      input: {
        node: (
          <MultiSelect
            data={store.centers}
            disabled={!store.profile || store.userEmailAlreadyAdded}
          />
        ),
        rules: {
          required: tU('centersRequired'),
        },
      },
      valueRender: (values) =>
        map(values, (id) => <Badge label={store.centersById[id]} closable={false} />),
    });
    return result;
  }, [
    t,
    store.center,
    store.profile,
    JSON.stringify(store.avatar),
    JSON.stringify(store.secondSurname),
  ]);

  function onChange(e) {
    store.users = e;
    form.reset();
    render();
  }

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
            onChange={onChange}
            form={form}
            columns={data.tableColumns}
            disabledAddButton={!store.profile || store.userEmailAlreadyAdded}
            editable
            sortable={false}
            removable={true}
            labels={data.tableLabels}
          />
        </Box>
        <Stack justifyContent="end">
          <Button onClick={onSave} loading={store.saving}>
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

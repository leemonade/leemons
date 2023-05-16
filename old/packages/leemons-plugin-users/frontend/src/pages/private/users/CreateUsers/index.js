import React, { useMemo } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  ContextContainer,
  DatePicker,
  PageContainer,
  Select,
  Stack,
  TableInput,
  TextInput,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { AdminPageHeader, EMAIL_REGEX } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@users/helpers/prefixPN';
import { TagsMultiSelect, useStore } from '@common';
import { useForm } from 'react-hook-form';
import { forEach, map, uniq } from 'lodash';
import {
  addUsersBulkRequest,
  getSystemDataFieldsConfigRequest,
  searchUserAgentsRequest,
} from '../../../../request';
import { SelectCenter } from '../../../../components/SelectCenter';
import { SelectProfile } from '../../../../components/SelectProfile';
import getUserFullName from '../../../../helpers/getUserFullName';

function CreateUsers() {
  const [t] = useTranslateLoader(prefixPN('create_users'));
  const [store, render] = useStore({ tags: [] });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const debouncedFunction = useDebouncedCallback(500);

  const form = useForm();

  async function getEmailData(email) {
    const { userAgents } = await searchUserAgentsRequest(
      {
        user: { email },
      },
      { withProfile: true, withCenter: true, queryWithContains: false }
    );

    return userAgents;
  }

  async function init() {
    const { config } = await getSystemDataFieldsConfigRequest();
    store.avatar = config.avatar;
    store.secondSurname = config.secondSurname;
    render();
  }

  async function checkEmail(email) {
    store.userEmailAlreadyAdded = false;
    const userAgents = await getEmailData(email);
    store.userAlreadyHaveThisConfig = false;
    store.user = null;
    if (userAgents.length) {
      store.user = userAgents[0].user;
      form.setValue('name', store.user.name);
      form.setValue('gender', store.user.gender);
      form.setValue('surnames', store.user.surnames);
      form.setValue('secondSurname', store.user.secondSurname);
      form.setValue(
        'birthdate',
        store.user.birthdate ? new Date(store.user.birthdate) : store.user.birthdate
      );

      form.setValue('avatar', store.user.avatar);
      forEach(userAgents, (userAgent) => {
        if (userAgent.center.id === store.center && userAgent.profile.id === store.profile) {
          store.userAlreadyHaveThisConfig = true;
        }
      });
    }
    forEach(store.usersToCreate, (user) => {
      if (user.email === email) {
        store.userEmailAlreadyAdded = true;
      }
    });
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    const email = form.getValues('email');
    if (store.center && store.profile && email) {
      checkEmail(email);
    }
  }, [store.center, store.profile]);

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

  const data = useMemo(() => {
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
    if (store.avatar && !store.avatar.disabled) {
      result.tableColumns.push({
        Header: t('avatarHeader'),
        accessor: 'avatar',
        className: 'text-left',
        input: {
          node: (
            <TextInput
              disabled={!store.center || !store.profile || !!store.user || !store.avatar.required}
              required
            />
          ),
          rules: store.avatar.required ? { required: t('avatarHeaderRequired') } : {},
        },
        valueRender: (v, row) => (
          <>
            <Avatar
              image={row?.avatar}
              fullName={getUserFullName(row)}
              mx="auto"
              mb={10}
              radius="xl"
            />
          </>
        ),
      });
    }
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

  function onChange(e) {
    store.usersToCreate = e;
    form.reset();
    render();
  }

  function centerChange(e) {
    store.center = e;
    render();
  }

  function profileChange(e) {
    store.profile = e;
    render();
  }

  async function save() {
    try {
      store.loading = true;
      render();
      const usersToAdd = map(store.usersToCreate, (user) => ({
        ...user,
        tags: uniq(store.tags.concat(user.tags || [])),
      }));
      await addUsersBulkRequest({
        users: usersToAdd,
        center: store.center,
        profile: store.profile,
      });
      store.usersToCreate = [];
      store.tags = [];
      // store.profile = null;
      // store.center = null;
      addSuccessAlert(t(`usersAddedSuccessfully`));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  return (
    <Stack direction="column" fullWidth fullHeight>
      <AdminPageHeader values={data.pageHeader} />

      <PageContainer noFlex>
        <ContextContainer sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <ContextContainer direction="row">
            <SelectCenter
              label={t('centerLabel')}
              value={store.center}
              disabled={!!store.usersToCreate?.length}
              onChange={centerChange}
            />
            <SelectProfile
              label={t('profileLabel')}
              value={store.profile}
              disabled={!!store.usersToCreate?.length}
              onChange={profileChange}
            />
          </ContextContainer>

          {store.userAlreadyHaveThisConfig ? (
            <Alert severity="error" closeable={false}>
              {t('userAlreadyHaveThisConfig')}
            </Alert>
          ) : null}

          {store.userEmailAlreadyAdded ? (
            <Alert severity="error" closeable={false}>
              {t('userEmailAlreadyAdded')}
            </Alert>
          ) : null}

          <TableInput
            data={store.usersToCreate}
            onChange={onChange}
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

          <TagsMultiSelect
            label={t('tagsForAllUsers')}
            pluginName="users"
            value={store.tags}
            onChange={(e) => {
              store.tags = e;
              render();
            }}
            disabled={!store.center || !store.profile}
          />

          <Box>
            <Button onClick={save} loading={store.loading} disabled={!store.usersToCreate?.length}>
              {t('save')}
            </Button>
          </Box>
        </ContextContainer>
      </PageContainer>
    </Stack>
  );
}

export default CreateUsers;

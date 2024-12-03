import React from 'react';
import { FormProvider, useForm, Controller } from 'react-hook-form';

import { Box, Button, Drawer, ContextContainer, InputWrapper } from '@bubbles-ui/components';
import { TagsAutocomplete, getRequestErrorMessage, randomString } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { UploadingFileModal } from '@leebrary/components';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';
import { compact, groupBy, noop, pick, uniq } from 'lodash';
import PropTypes from 'prop-types';

import { UserDatasets } from '../UserDataset/UserDatasets';
import { UserForm, USER_FIELDS } from '../UserForm';

import { ProfileTableInput } from './components/ProfileTableInput';

import prefixPN from '@users/helpers/prefixPN';
import {
  searchUserAgentsRequest,
  addUsersBulkRequest,
  updateUserRequest,
  updateUserAgentRequest,
  getUserAgentDetailForPageRequest,
} from '@users/request';
import activeUserAgentRequest from '@users/request/activeUserAgent';
import disableUserAgentRequest from '@users/request/disableUserAgent';
import useImpersonateUser from '@users/request/hooks/mutations/useImpersonateUser';

function UserAdminDrawer({ user: value, center, opened, onClose = noop, onSave = noop }) {
  const [user, setUser] = React.useState(value);
  const [uploadingFileInfo, setUploadingFileInfo] = React.useState(null);
  const [isAdminFirstTime, setIsAdminFirstTime] = React.useState(false);
  const [userAgents, setUserAgents] = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const { openConfirmationModal } = useLayout();

  const [t] = useTranslateLoader(prefixPN('create_users'));
  const [tList] = useTranslateLoader(prefixPN('list_users'));
  const { t: tCommon } = useCommonTranslate('formWithTheme');
  const [tEnableUser] = useTranslateLoader(prefixPN('enableUserModal'));
  const [tDisableUser] = useTranslateLoader(prefixPN('disableUserModal'));
  const queryClient = useQueryClient();
  const userDatasetsRef = React.useRef();

  const { mutateAsync: impersonateUser } = useImpersonateUser();

  const form = useForm();
  const { handleSubmit } = form;

  React.useEffect(() => {
    if (opened) {
      setUser({ ...value });
    }
  }, [JSON.stringify(value), opened]);

  // ····················································
  // DATA HANDLING

  async function getUserAgentsByEmail(email) {
    const { userAgents: userAgentsInfo } = await searchUserAgentsRequest(
      {
        user: { email },
      },
      { withProfile: true, withCenter: true, queryWithContains: false }
    );

    return userAgentsInfo;
  }

  async function saveUser(data) {
    const body = pick(data, [...USER_FIELDS, 'id', 'active', 'tags']);

    // Create only the userAgents that has not `id`
    let profilesToCreate = compact(
      userAgents.filter((userAgent) => !userAgent.id).map((userAgent) => userAgent.profile?.id)
    );

    // Update only the userAgents that has `id`
    const userAgentsToUpdate = compact(
      userAgents.filter((userAgent) => userAgent.id).map((userAgent) => userAgent.id)
    );

    // If the user is not being updated, we create the user with the first profile
    if (!data?.id) {
      const firstProfile = profilesToCreate[0];

      // Create User with the first profile
      const results = await addUsersBulkRequest({
        users: [body],
        center: center?.id,
        profile: firstProfile,
      });
      const userData = results?.users?.[0];
      body.id = userData?.id;

      profilesToCreate = profilesToCreate.slice(1);
    } else {
      await updateUserRequest(data.id, body);
    }

    // Save UserAgent for each additional profile
    await profilesToCreate.reduce(async (acc, profile) => {
      const accumulated = await acc;
      const result = await addUsersBulkRequest({
        users: [body],
        center: center?.id,
        profile,
      });
      accumulated.push(result?.users?.[0]);
      return accumulated;
    }, Promise.resolve([]));

    // Update UserAgent for each profile
    await userAgentsToUpdate.reduce(async (acc, userAgent) => {
      const accumulated = await acc;
      const result = await updateUserAgentRequest(userAgent, {
        tags: body.tags,
      });
      accumulated.push(result);
      return accumulated;
    }, Promise.resolve([]));
  }

  // ····················································
  // METHODS

  async function checkEmail(email) {
    if (!email) return;
    const userAgentsInfo = await getUserAgentsByEmail(email);
    const userData = { ...(userAgentsInfo[0]?.user ?? {}) };

    if (userData?.id) {
      userData.userAgents = userAgentsInfo?.filter((item) =>
        ['teacher', 'student'].includes(item.profile?.sysName)
      );
    }

    setUser(userData);

    // If there is only one profile and it's the admin profile, we set the isAdminFirstTime to true
    const profilesGrouped = pick(groupBy(userAgentsInfo, 'profile.sysName'), [
      'admin',
      'teacher',
      'student',
    ]);
    if (profilesGrouped?.admin && Object.keys(profilesGrouped).length === 1) {
      setIsAdminFirstTime(true);
    }
  }

  async function refreshUserAgents(force = false) {
    if (user?.userAgents && !force) {
      setUserAgents(user.userAgents);
    } else if (user?.email) {
      const userAgentsInfo = await getUserAgentsByEmail(user.email);
      setUserAgents(userAgentsInfo);
    }
  }

  async function refreshTags() {
    const result = await Promise.all(
      userAgents
        .filter((userAgent) => userAgent.id)
        .map((userAgent) => getUserAgentDetailForPageRequest(userAgent.id))
    );
    const tags = uniq(result?.map((item) => item.data.tags).flat() ?? []);
    const previousTags = form.getValues('tags') ?? [];
    form.setValue('tags', uniq([...previousTags, ...tags]));
  }

  async function disableUserAgent(userAgent) {
    try {
      await disableUserAgentRequest(userAgent.id);
      refreshUserAgents(true);
      addSuccessAlert(t('disableProfileSuccess', { profile: userAgent?.profile?.name }));
    } catch (e) {
      addErrorAlert(getRequestErrorMessage(e));
    }
  }

  async function enableUserAgent(userAgent) {
    try {
      await activeUserAgentRequest(userAgent.id);
      refreshUserAgents(true);
      addSuccessAlert(t('enableProfileSuccess', { profile: userAgent?.profile?.name }));
    } catch (e) {
      addErrorAlert(getRequestErrorMessage(e));
    }
  }

  function handleActivateUser(active) {
    setUser({ ...user, active });
  }

  React.useEffect(() => {
    if (opened) {
      refreshUserAgents();
    }
  }, [user, opened]);

  React.useEffect(() => {
    if (userAgents?.length) {
      refreshTags();
      form.setValue(
        'profiles',
        userAgents.map((item) => item?.profile?.id)
      );
    }
  }, [userAgents]);

  // ····················································
  // HANDLERS

  function handleOnClose(reload) {
    form.reset({});
    queryClient.invalidateQueries(['userDetails', { userId: value?.id }]);
    setUserAgents(null);
    setUser(null);
    setIsAdminFirstTime(false);
    onClose(reload);
  }

  async function handleSaveUser(data) {
    setSaving(true);
    try {
      await saveUser(data);
      addSuccessAlert(t('usersAddedSuccessfully'));
      handleOnClose(true);
    } catch (e) {
      addErrorAlert(getRequestErrorMessage(e));
    }
    setSaving(false);
    onSave(data);
  }

  async function handleOnSave() {
    if (userDatasetsRef.current) {
      const datasetsSaved = await userDatasetsRef.current.checkFormsAndSave();
      if (!datasetsSaved) {
        return;
      }
    }

    handleSubmit(async (data) => {
      const payload = pick(data, [...USER_FIELDS, 'tags']);

      if (user?.id) {
        payload.id = user.id;
        payload.active = user.active;
      }

      if (payload.avatar instanceof File || payload.avatar instanceof Blob) {
        payload.avatar = await uploadFileAsMultipart(payload.avatar, {
          name: randomString(10),
          onProgress: (info) => {
            setUploadingFileInfo(info);
          },
        });
        setUploadingFileInfo(null);
      }

      handleSaveUser(payload);
    })();
  }

  async function handleDisableUserAgent(userAgent) {
    openConfirmationModal({
      title: tDisableUser('titleProfile'),
      description: tDisableUser('descriptionProfile', {
        profileName: `<strong>${userAgent?.profile?.name}</strong>`,
        centerName: `<strong>${center?.name}</strong>`,
      }),
      labels: {
        confirm: tDisableUser('confirm'),
      },
      onConfirm: async () => {
        disableUserAgent(userAgent);
      },
    })();
  }

  async function handleEnableUserAgent(userAgent) {
    openConfirmationModal({
      title: tEnableUser('titleProfile'),
      description: tEnableUser('descriptionProfile', {
        profileName: `<strong>${userAgent?.profile?.name}</strong>`,
        centerName: `<strong>${center?.name}</strong>`,
      }),
      labels: {
        confirm: tEnableUser('confirm'),
      },
      onConfirm: async () => {
        enableUserAgent(userAgent);
      },
    })();
  }

  // ····················································
  // RENDER

  return (
    <Drawer opened={opened} onClose={handleOnClose}>
      <Drawer.Header title={tList(user?.id ? 'edit' : 'new')} />
      <Drawer.Content>
        <FormProvider {...form}>
          <Box>
            <Button variant="outline" onClick={() => impersonateUser(user)}>
              {t('impersonate')}
            </Button>
          </Box>
          <ContextContainer title={t('profileLabel')}>
            <Controller
              name="profiles"
              rules={{ required: t('profileRequired') }}
              render={() => (
                <InputWrapper error={form.formState.errors.profiles?.message}>
                  <ProfileTableInput
                    userAgents={userAgents}
                    onChange={(val) => {
                      setUserAgents(val);
                      form.setValue(
                        'profiles',
                        val.map((item) => item?.profile?.id),
                        { shouldValidate: form.formState.isSubmitted }
                      );
                    }}
                    onDisable={handleDisableUserAgent}
                    onEnable={handleEnableUserAgent}
                  />
                </InputWrapper>
              )}
            />
          </ContextContainer>

          <UserForm
            user={user}
            onCheckEmail={checkEmail}
            isAdminFirstTime={isAdminFirstTime}
            onActivateUser={handleActivateUser}
          />

          <ContextContainer title={t('tagsHeader')}>
            <Controller
              name="tags"
              render={({ field }) => (
                <TagsAutocomplete {...field} label={t('tagsHeader')} pluginName="users" />
              )}
            />
          </ContextContainer>
          <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
          <UserDatasets
            ref={userDatasetsRef}
            userAgentIds={userAgents?.map((item) => item.id)}
            userId={user?.id}
            validateOnlyForMe
            preferEditMode
            skipOptional
          />
        </FormProvider>
      </Drawer.Content>
      <Drawer.Footer>
        <Drawer.Footer.LeftActions>
          <Button variant="link" onClick={handleOnClose} disabled={saving}>
            {tCommon('cancel')}
          </Button>
        </Drawer.Footer.LeftActions>
        <Drawer.Footer.RightActions>
          <Button onClick={handleOnSave} disabled={saving} loading={saving}>
            {t(user?.id ? 'save' : 'create')}
          </Button>
        </Drawer.Footer.RightActions>
      </Drawer.Footer>
    </Drawer>
  );
}

UserAdminDrawer.propTypes = {
  user: PropTypes.object,
  center: PropTypes.object,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};

export { UserAdminDrawer };

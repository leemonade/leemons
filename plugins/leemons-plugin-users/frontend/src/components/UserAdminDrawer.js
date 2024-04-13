import React from 'react';
import PropTypes from 'prop-types';
import { Button, Drawer, ContextContainer } from '@bubbles-ui/components';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { searchUserAgentsRequest, addUsersBulkRequest } from '@users/request';
import { compact, groupBy, noop, pick } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { UploadingFileModal } from '@leebrary/components';
import { TagsAutocomplete, getRequestErrorMessage, randomString } from '@common';
import prefixPN from '@users/helpers/prefixPN';
import { MultiSelectProfile } from '@users/components/MultiSelectProfile';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { UserForm, USER_FIELDS } from './UserForm';

function UserAdminDrawer({ user: value, centerId, opened, onClose = noop, onSave = noop }) {
  const [user, setUser] = React.useState(value);
  const [uploadingFileInfo, setUploadingFileInfo] = React.useState(null);
  const [isAdminFirstTime, setIsAdminFirstTime] = React.useState(false);
  const [userAgents, setUserAgents] = React.useState([]);
  const [saving, setSaving] = React.useState(false);

  const [t] = useTranslateLoader(prefixPN('create_users'));
  const [tList] = useTranslateLoader(prefixPN('list_users'));
  const { t: tCommon } = useCommonTranslate('formWithTheme');
  const queryClient = useQueryClient();

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
    const { profiles, ...item } = data ?? {};
    const body = pick(item, [...USER_FIELDS, 'id', 'active', 'tags']);

    let profilesToSave = profiles;

    if (!item?.id) {
      const firstProfile = profiles[0];

      // Create User with the first profile
      const results = await addUsersBulkRequest({
        users: [body],
        center: centerId,
        profile: firstProfile,
      });
      const userData = results?.users?.[0];
      body.id = userData?.id;

      profilesToSave = profiles.slice(1);
    }

    // Save UserAgent for each additional profile
    const results = await profilesToSave.reduce(async (acc, profile) => {
      const accumulated = await acc;
      const result = await addUsersBulkRequest({
        users: [body],
        center: centerId,
        profile,
      });
      accumulated.push(result?.users?.[0]);
      return accumulated;
    }, Promise.resolve([]));

    return results?.find((val) => !!val?.id);
  }

  // ····················································
  // HELPERS

  async function checkEmail(email) {
    const userAgentsInfo = await getUserAgentsByEmail(email);
    const userData = { ...(userAgentsInfo[0]?.user ?? {}) };

    if (userData) {
      userData.userAgents = userAgentsInfo;
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

  async function refreshUserAgents() {
    if (user?.userAgents) {
      setUserAgents(user.userAgents);
    } else if (user?.email) {
      const userAgentsInfo = await getUserAgentsByEmail(user.email);
      setUserAgents(userAgentsInfo);
    }
  }

  React.useEffect(() => {
    if (opened) {
      refreshUserAgents();
      form.setValue('tags', user?.tags);
    }
  }, [user, opened]);

  React.useEffect(() => {
    if (userAgents?.length) {
      form.setValue('profiles', compact(userAgents.map((val) => val.profile?.id)));
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

  function handleOnSave() {
    handleSubmit(async (data) => {
      const payload = pick(data, [...USER_FIELDS, 'profiles', 'tags']);

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

  // ····················································
  // RENDER

  return (
    <Drawer opened={opened} onClose={handleOnClose}>
      <Drawer.Header title={tList(user?.id ? 'edit' : 'new')} />
      <Drawer.Content>
        <FormProvider {...form}>
          <ContextContainer title={t('profileLabel')}>
            <Controller name="profiles" render={({ field }) => <MultiSelectProfile {...field} />} />
          </ContextContainer>
          <UserForm user={user} onCheckEmail={checkEmail} isAdminFirstTime={isAdminFirstTime} />
          <ContextContainer title={t('tagsHeader')}>
            <Controller
              name="tags"
              render={({ field }) => (
                <TagsAutocomplete {...field} label={t('tagsHeader')} pluginName="users" />
              )}
            />
          </ContextContainer>
          <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
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
  centerId: PropTypes.string,
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};

export { UserAdminDrawer };

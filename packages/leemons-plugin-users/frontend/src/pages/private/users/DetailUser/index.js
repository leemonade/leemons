import {
  Box,
  Button,
  ContextContainer,
  Divider,
  PageContainer,
  Select,
  Stack,
  Title,
  useResizeObserver,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import { ZoneWidgets } from '@widgets';
import { find, forEach, forIn } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import getUserFullName from '../../../../helpers/getUserFullName';
import {
  getSystemDataFieldsConfigRequest,
  getUserDetailForPageRequest,
  updateUserAgentRequest,
  updateUserRequest,
} from '../../../../request';
import PersonalInformation from './PersonalInformation';
import UserAgentTags from './UserAgentTags';
import UserDataset from './UserDataset';
import UserImageAndPreferredGender from './UserImageAndPreferredGender';

function DetailUser({ session }) {
  const [t] = useTranslateLoader(prefixPN('detailUser'));
  const [store, render] = useStore({ params: {}, centers: [], profiles: [], isEditMode: false });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const history = useHistory();
  const { userId } = useParams();
  const query = new URLSearchParams(window.location.search);
  store.params.center = query.get('center');
  store.params.profile = query.get('profile');
  store.params.user = !userId || userId === 'me' ? session?.id : userId;

  const form = useForm();

  const [containerRef, containerRect] = useResizeObserver();
  const [childRef, childRect] = useResizeObserver();

  function getUserAgentsCenters() {
    const values = {};
    forEach(store.userAgents, (userAgent) => {
      if (!values[userAgent.center.id]) {
        values[userAgent.center.id] = {
          value: userAgent.center.id,
          label: userAgent.center.name,
          profiles: [],
        };
      }
      values[userAgent.center.id].profiles.push({
        value: userAgent.profile.id,
        label: userAgent.profile.name,
      });
    });
    const results = [];
    forIn(values, (value) => {
      results.push(value);
    });
    return results;
  }

  function selectCenter(centerId) {
    const center = find(store.centers, { value: centerId });
    store.profiles = center ? center.profiles : [];
    store.center = centerId;
    store.profile = null;
    store.userAgent = null;
    render();
  }

  function selectProfile(profileId) {
    store.profile = profileId;
    store.userAgent = find(
      store.userAgents,
      (userAgent) => userAgent.center.id === store.center && userAgent.profile.id === store.profile
    );
    render();
  }

  async function getPermissions() {
    const { permissions } = await getPermissionsWithActionsIfIHaveRequest(['plugins.users.users']);
    if (permissions[0]) {
      store.canUpdate =
        permissions[0].actionNames.includes('update') ||
        permissions[0].actionNames.includes('admin');
      render();
    }
  }

  async function init() {
    try {
      const [{ data }, { config }] = await Promise.all([
        getUserDetailForPageRequest(store.params.user),
        getSystemDataFieldsConfigRequest(),
      ]);
      store.config = {
        avatar: config.avatar,
        secondSurname: config.secondSurname,
      };
      store.dataset = data.dataset;
      store.user = data.user;
      store.isActived = !!store.user.active;
      store.userAgents = data.userAgents;
      store.centers = getUserAgentsCenters();
      store.formValues = {
        'preferences.gender': store.user.preferences?.gender,
        'preferences.pronoun': store.user.preferences?.pronoun,
        'preferences.pluralPronoun': store.user.preferences?.pluralPronoun,
        'user.name': store.user.name,
        'user.email': store.user.email,
        'user.surnames': store.user.surnames,
        'user.secondSurname': store.user.secondSurname,
        'user.birthdate': new Date(store.user.birthdate),
        'user.gender': store.user.gender,
        'user.avatar': store.user.avatar,
      };
      form.reset(store.formValues);
      /*
      form.setValue('preferences.gender', store.user.preferences?.gender);
      form.setValue('preferences.pronoun', store.user.preferences?.pronoun);
      form.setValue('preferences.pluralPronoun', store.user.preferences?.pluralPronoun);
      form.setValue('user.name', store.user.name);
      form.setValue('user.email', store.user.email);
      form.setValue('user.surnames', store.user.surnames);
      form.setValue('user.secondSurname', store.user.secondSurname);
      form.setValue('user.birthdate', new Date(store.user.birthdate));
      form.setValue('user.gender', store.user.gender);
      */
      if (store.centers[0]) selectCenter(store.centers[0].value);
      if (store.profiles[0]) selectProfile(store.profiles[0].value);
      render();
    } catch (error) {
      addErrorAlert(getErrorMessage(error));
    }
  }

  function setDatasetFormActions(e) {
    store.datasetFormActions = e;
  }

  function setCanEdit() {
    store.isEditMode = true;
    render();
  }

  function cancelEdit() {
    form.reset(store.formValues);
    if (store.centers[0]) selectCenter(store.centers[0].value);
    if (store.profiles[0]) selectProfile(store.profiles[0].value);
    store.isEditMode = false;
    render();
  }

  async function tryToSave() {
    form.handleSubmit(async (formData) => {
      try {
        const toSend = { ...formData };
        if (store.userAgent) {
          if (store.datasetFormActions && store.datasetFormActions.isLoaded()) {
            await store.datasetFormActions.submit();
            if (store.datasetFormActions.getErrors().length) return null;
            toSend.dataset = store.datasetFormActions.getValues();
            store.dataset.value = toSend.dataset;
          }
        }

        const promises = [
          updateUserRequest(store.user.id, {
            ...toSend.user,
            preferences: toSend.preferences,
            dataset: toSend.dataset,
          }),
        ];

        if (store.userAgent) {
          promises.push(
            updateUserAgentRequest(store.userAgent.id, {
              tags: toSend.tags,
            })
          );
        }

        await Promise.all(promises);

        store.isEditMode = false;
        render();
        addSuccessAlert(t(`saveSuccess`));
        return true;
      } catch (err) {
        addErrorAlert(getErrorMessage(err));
        return false;
      }
    })();
  }

  React.useEffect(() => {
    if (store.params.user) {
      init();
      getPermissions();
    }
  }, [store.params.user]);

  if (!store.user) return null;

  return (
    <Box ref={containerRef} sx={(theme) => ({ paddingBottom: theme.spacing[10] })}>
      <Box
        ref={childRef}
        style={{ width: containerRect.width, top: containerRect.top }}
        sx={(theme) => ({
          position: 'fixed',
          backgroundColor: theme.colors.uiBackground04,
          zIndex: 9,
        })}
      >
        <PageContainer>
          <Stack
            sx={(theme) => ({ paddingTop: theme.spacing[5], paddingBottom: theme.spacing[5] })}
            fullWidth
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={5}
          >
            <ContextContainer direction="row" alignItems="center" justifyContent="start">
              <Title>{getUserFullName(store.user)}</Title>
              <Select
                placeholder={t('selectCenter')}
                value={store.center}
                onChange={selectCenter}
                data={store.centers}
              />
              <Select
                placeholder={t('selectProfile')}
                disabled={!store.center}
                value={store.profile}
                onChange={selectProfile}
                data={store.profiles}
              />
            </ContextContainer>
            {store.canUpdate ? (
              <>
                {store.isEditMode ? (
                  <Stack direction="row" spacing={5} skipFlex>
                    <Button variant="light" onClick={cancelEdit}>
                      {t('cancel')}
                    </Button>
                    <Button onClick={tryToSave}>{t('save')}</Button>
                  </Stack>
                ) : (
                  <Button onClick={setCanEdit} sx={() => ({ justifySelf: 'end' })}>
                    {t('edit')}
                  </Button>
                )}
              </>
            ) : null}
          </Stack>
          <Divider />
        </PageContainer>
      </Box>
      <PageContainer
        sx={(theme) => ({ paddingTop: theme.spacing[5] })}
        style={{ marginTop: childRect.height }}
      >
        <ContextContainer direction="row">
          <ContextContainer divided>
            <UserImageAndPreferredGender
              t={t}
              user={store.user}
              session={session}
              form={form}
              isEditMode={store.isEditMode}
            />
            <PersonalInformation
              t={t}
              user={store.user}
              form={form}
              config={store.config}
              isEditMode={store.isEditMode}
              store={store}
              render={render}
            />
            {store.userAgent && store.dataset ? (
              <UserDataset
                t={t}
                dataset={store.dataset}
                user={store.user}
                isEditMode={store.isEditMode}
                formActions={setDatasetFormActions}
              />
            ) : null}
            {store.userAgent ? (
              <UserAgentTags
                t={t}
                form={form}
                user={store.user}
                userAgent={store.userAgent}
                isEditMode={store.isEditMode}
              />
            ) : null}
          </ContextContainer>
          <ContextContainer>
            <ZoneWidgets zone="plugins.users.user-detail">
              {({ Component, key }) => (
                <Box key={key}>
                  <Component
                    user={store.user}
                    userAgent={store.userAgent}
                    isEditMode={store.isEditMode}
                  />
                </Box>
              )}
            </ZoneWidgets>
          </ContextContainer>
        </ContextContainer>
      </PageContainer>
    </Box>
  );
}

DetailUser.propTypes = {
  session: PropTypes.object,
};

export default DetailUser;

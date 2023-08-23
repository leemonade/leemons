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
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import { getPermissionsWithActionsIfIHaveRequest } from '@users/request';
import activeUserAgent from '@users/request/activeUserAgent';
import disableUserAgent from '@users/request/disableUserAgent';
import { ZoneWidgets } from '@widgets';
import _, { find, forEach, forIn } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
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

function DetailUser({
  session,
  centerId,
  profileId,
  userId: _userId,
  onDisabled = () => {},
  onActive = () => {},
  isDrawer,
}) {
  const [t] = useTranslateLoader(prefixPN('detailUser'));
  const [store, render] = useStore({ params: {}, centers: [], profiles: [], isEditMode: false });
  const [, , , getErrorMessage] = useRequestErrorMessage();

  let userId = _userId;
  const { userId: _u } = useParams();

  if (!centerId && !profileId && !userId) {
    userId = _u;
    const query = new URLSearchParams(window.location.search);
    store.params.center = query.get('center');
    store.params.profile = query.get('profile');
  } else {
    store.params.center = centerId;
    store.params.profile = profileId;
  }
  store.params.user = !userId || userId === 'me' ? session?.id : userId;

  const form = useForm();
  const { openConfirmationModal } = useLayout();
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
    const [{ permissions: userPermissions }, { permissions: enadisPermissions }] =
      await Promise.all([
        getPermissionsWithActionsIfIHaveRequest(['plugins.users.users']),
        getPermissionsWithActionsIfIHaveRequest(['plugins.users.enabledisable']),
      ]);
    if (userPermissions[0]) {
      store.canUpdate =
        userPermissions[0].actionNames.includes('update') ||
        userPermissions[0].actionNames.includes('admin');
    }
    if (enadisPermissions[0]) {
      store.canDisable =
        enadisPermissions[0].actionNames.includes('delete') ||
        enadisPermissions[0].actionNames.includes('admin');
      store.canActive =
        enadisPermissions[0].actionNames.includes('create') ||
        enadisPermissions[0].actionNames.includes('admin');
    }
    render();
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

  function disable() {
    openConfirmationModal({
      title: t('disableTitle'),
      description: t('disableDescription'),
      labels: {
        confirm: t('disable'),
      },
      onConfirm: async () => {
        try {
          await disableUserAgent(store.userAgent.id);
          const index = _.findIndex(store.userAgents, { id: store.userAgent.id });
          store.userAgents[index].disabled = true;
          store.userAgent.disabled = true;
          onDisabled();
          addSuccessAlert(t('disableSucess'));
          render();
        } catch (error) {
          addErrorAlert(getErrorMessage(error));
        }
      },
    })();
  }

  async function active() {
    try {
      await activeUserAgent(store.userAgent.id);
      const index = _.findIndex(store.userAgents, { id: store.userAgent.id });
      store.userAgents[index].disabled = false;
      store.userAgent.disabled = false;
      onActive();
      addSuccessAlert(t('activeSucess'));
      render();
    } catch (error) {
      addErrorAlert(getErrorMessage(error));
    }
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

  const buttons = (
    <>
      {store.isEditMode ? (
        <Stack direction="row" spacing={5} skipFlex>
          {store.canDisable && !store.userAgent?.disabled ? (
            <Button variant="outline" onClick={disable} sx={() => ({ justifySelf: 'end' })}>
              {t('disableBtn')}
            </Button>
          ) : null}
          {store.canActive && store.userAgent?.disabled ? (
            <Button variant="outline" onClick={active} sx={() => ({ justifySelf: 'end' })}>
              {t('active')}
            </Button>
          ) : null}
          <Button variant="light" onClick={cancelEdit}>
            {t('cancel')}
          </Button>
          <Button onClick={tryToSave}>{t('save')}</Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={5} skipFlex>
          {store.canDisable && !store.userAgent?.disabled ? (
            <Button variant="outline" onClick={disable} sx={() => ({ justifySelf: 'end' })}>
              {t('disableBtn')}
            </Button>
          ) : null}
          {store.canActive && store.userAgent?.disabled ? (
            <Button variant="outline" onClick={active} sx={() => ({ justifySelf: 'end' })}>
              {t('active')}
            </Button>
          ) : null}
          {store.canUpdate ? (
            <Button onClick={setCanEdit} sx={() => ({ justifySelf: 'end' })}>
              {t('edit')}
            </Button>
          ) : null}
        </Stack>
      )}
    </>
  );

  return (
    <Box ref={containerRef} sx={(theme) => ({ paddingBottom: isDrawer ? 0 : theme.spacing[10] })}>
      <Box
        ref={childRef}
        style={{ width: containerRect.width, top: containerRect.top }}
        sx={(theme) => ({
          position: 'fixed',
          backgroundColor: theme.colors.uiBackground04,
          zIndex: 9,
        })}
      >
        <PageContainer sx={(theme) => (isDrawer ? { padding: 0 } : {})}>
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
              {isDrawer ? null : buttons}
            </ContextContainer>
          </Stack>
          <Divider />
        </PageContainer>
      </Box>
      <PageContainer
        sx={(theme) => (isDrawer ? { padding: 0 } : { paddingTop: theme.spacing[5] })}
        style={{ marginTop: isDrawer ? childRect.height - 65 : childRect.height }}
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
            {isDrawer ? (
              <>
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
                <Box style={{ textAlign: 'right' }}>{buttons}</Box>
              </>
            ) : null}
          </ContextContainer>
          {isDrawer ? null : (
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
          )}
        </ContextContainer>
      </PageContainer>
    </Box>
  );
}

DetailUser.propTypes = {
  session: PropTypes.object,
  centerId: PropTypes.string,
  profileId: PropTypes.string,
  userId: PropTypes.string,
  onDisabled: PropTypes.func,
  onActive: PropTypes.func,
  isDrawer: PropTypes.bool,
};

export default DetailUser;

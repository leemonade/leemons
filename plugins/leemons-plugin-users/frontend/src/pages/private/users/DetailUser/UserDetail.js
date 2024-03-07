import {
  Box,
  Button,
  ContextContainer,
  Select,
  Stack,
  Title,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
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
import { useParams, useHistory } from 'react-router-dom';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import getUserFullName from '../../../../helpers/getUserFullName';
import {
  getSystemDataFieldsConfigRequest,
  getUserDetailForPageRequest,
  updateUserAgentRequest,
  updateUserRequest,
} from '../../../../request';
import PersonalInformation from './PersonalInformation';
import UserAgentTags from './UserAgentTags';
import UserImage from './UserImage';
import UserPreferredGender from './UserPreferredGender';

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
  const scrollRef = React.useRef();
  const history = useHistory();

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

  function getUserAgentsCenters() {
    const values = {};

    forEach(store.userAgents, (userAgent) => {
      if (userAgent.center?.id) {
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
      }
    });

    const results = [];
    forIn(values, (value) => {
      results.push(value);
    });
    return results;
  }

  function selectCenter(id) {
    const center = find(store.centers, { value: id });
    store.profiles = center ? center.profiles : [];
    store.center = id;
    store.profile = null;
    store.userAgent = null;
    render();
  }

  function selectProfile(id) {
    store.profile = id;
    store.userAgent = find(
      store.userAgents,
      (userAgent) =>
        userAgent.center?.id === store.center && userAgent.profile?.id === store.profile
    );
    render();
  }

  async function getPermissions() {
    const [{ permissions: userPermissions }, { permissions: enadisPermissions }] =
      await Promise.all([
        getPermissionsWithActionsIfIHaveRequest(['users.users']),
        getPermissionsWithActionsIfIHaveRequest(['users.enabledisable']),
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
    history.goBack();
  }

  async function tryToSave() {
    form.handleSubmit(async (formData) => {
      try {
        const toSend = { ...formData };
        if (store.userAgent && store.datasetFormActions && store.datasetFormActions.isLoaded()) {
          await store.datasetFormActions.submit();
          if (store.datasetFormActions.getErrors().length) return null;
          toSend.dataset = store.datasetFormActions.getValues();
          store.dataset.value = toSend.dataset;
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
        <>
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
          <Button onClick={tryToSave}>{t('save')}</Button>
        </>
      ) : (
        <>
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
        </>
      )}
    </>
  );

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <Stack
          sx={(theme) => ({
            padding: `${theme.spacing[1]}px ${theme.spacing[5]}px`,
            height: 70,
            overflow: 'hidden',
            backgroundColor: theme.other.global.background.color.surface.default,
          })}
          fullWidth
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={5}
        >
          <ContextContainer direction="row" alignItems="center" justifyContent="start">
            <Box style={{ marginTop: 2 }}>
              <UserImage
                t={t}
                user={store.user}
                session={session}
                form={form}
                isEditMode={store.isEditMode}
              />
            </Box>
            <Title>{getUserFullName(store.user)}</Title>
            {store.centers?.length > 1 && (
              <Select
                placeholder={t('selectCenter')}
                value={store.center}
                onChange={selectCenter}
                data={store.centers}
              />
            )}
            {store.profiles?.length > 1 && (
              <Select
                placeholder={t('selectProfile')}
                disabled={!store.center}
                value={store.profile}
                onChange={selectProfile}
                data={store.profiles}
              />
            )}
          </ContextContainer>
          <Box>
            <Button variant="link" leftIcon={<RemoveIcon />} onClick={cancelEdit}>
              {t('cancel')}
            </Button>
          </Box>
        </Stack>
      }
    >
      <Stack
        ref={scrollRef}
        fullWidth
        fullHeight
        justifyContent="center"
        style={{ overflow: 'auto' }}
      >
        <TotalLayoutStepContainer
          Footer={
            store.isEditMode && (
              <TotalLayoutFooterContainer scrollRef={scrollRef} fixed rightZone={buttons} />
            )
          }
        >
          <ContextContainer>
            <ContextContainer divided>
              {/* 
              <UserPreferredGender
                t={t}
                user={store.user}
                session={session}
                form={form}
                isEditMode={store.isEditMode}
              />
              */}
              <PersonalInformation
                t={t}
                user={store.user}
                form={form}
                config={store.config}
                isEditMode={store.isEditMode}
                store={store}
                render={render}
              />
              {/* store.userAgent && store.dataset ? (
                <UserDataset
                  t={t}
                  dataset={store.dataset}
                  user={store.user}
                  isEditMode={store.isEditMode}
                  formActions={setDatasetFormActions}
                />
              ) : null */}
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
              <ZoneWidgets zone="users.user-detail">
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
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
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

import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import _, { find, isArray } from 'lodash';
import { useHistory } from 'react-router-dom';
import { LoadingOverlay } from '@bubbles-ui/components';
import { LoginProfileSelector } from '@users/components/LoginProfileSelector';
import { useStore } from '@common';
import { LayoutContext } from '@layout/context/layout';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import Cookies from 'js-cookie';
import hooks from 'leemons-hooks';
import {
  getRememberLoginRequest,
  getUserCenterProfileTokenRequest,
  getUserCentersRequest,
  getUserProfilesRequest,
  getUserProfileTokenRequest,
  removeRememberLoginRequest,
  setRememberLoginRequest,
} from '@users/request';
import { getCookieToken } from '@users/session';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';
import { AuthLayout } from '@users/layout/AuthLayout';
import { AuthContainer } from '@users/components/AuthContainer';

export default function SelectProfile({ session }) {
  const [store, render] = useStore({
    loading: false,
    initLoading: true,
    selectedProfile: null,
    selectedCenter: null,
    loginWithProfile: false,
    profiles: [],
  });

  const deploymentConfig = useDeploymentConfig({ pluginName: 'users', ignoreVersion: true });
  const history = useHistory();
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  const { t: tCommon } = useCommonTranslate('forms');
  const [t, , , tLoading] = useTranslateLoader(prefixPN('selectProfile'));

  // ····················································································
  // HANDLERS

  async function handleOnSubmit(data) {
    try {
      store.loading = true;
      render();
      const userProfiles = [];
      if (store.superProfile) {
        userProfiles.push(store.superProfile);
      }
      _.forEach(store.centers, (cen) => {
        _.forEach(cen.profiles, (pro) => {
          userProfiles.push({ ...pro, centerId: cen.id });
        });
      });

      const profiles = _.uniqBy(userProfiles, 'id');
      const profile = find(profiles, { id: data.profile });

      if (data.remember) {
        await setRememberLoginRequest({
          center: profile.centerId,
          profile: profile.id,
        });
      } else {
        await removeRememberLoginRequest();
      }

      if (profile.sysName === 'admin' || profile.sysName === 'super') {
        const { jwtToken } = await getUserProfileTokenRequest(profile.id);
        await hooks.fireEvent('user:change:profile', profile);
        const newToken = { ...jwtToken, profile: data.profile };
        Cookies.set('token', newToken);
        hooks.fireEvent('user:cookie:session:change');

        history.push(
          profile.sysName === 'super'
            ? deploymentConfig?.superRedirectUrl || '/private/admin/setup'
            : `/private/dashboard`
        );
      } else {
        const { jwtToken } = await getUserCenterProfileTokenRequest(data.center, data.profile);
        await hooks.fireEvent('user:change:profile', profile);
        const newToken = { ...jwtToken, profile: data.profile };
        Cookies.set('token', newToken);
        hooks.fireEvent('user:cookie:session:change');
        history.push(`/private/dashboard`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * This function initializes the profile selection process
   */
  async function init() {
    // Sets the layout state to not private and profile not checked
    setLayoutState({ ...layoutState, private: false, profileChecked: false });
    // Fetches centers, remembered login, and user token concurrently
    const [{ centers }, { profile, center }, userToken] = await Promise.all([
      getUserCentersRequest(),
      getRememberLoginRequest(getCookieToken()),
      leemons.api(`v1/users/users`),
    ]);

    // Filters out denied profiles from each center and removes centers with no allowed profiles
    const deniedProfiles = deploymentConfig?.deny?.profiles || [];
    const processedCenters = centers.map((centre) => ({
      ...centre,
      profiles: centre.profiles.filter(
        (userProfile) => !deniedProfiles.includes(userProfile.sysName)
      ),
    }));

    // Updates the store with the processed centers
    store.centers = processedCenters;

    // If the user is a super admin, fetch super profiles and add them to each center
    if (userToken?.user?.isSuperAdmin) {
      const { profiles } = await getUserProfilesRequest();
      store.superProfile = _.find(profiles, { sysName: 'super' });

      _.forEach(store.centers, (centre) => {
        centre.profiles.push(store.superProfile);
      });

      // Filters centers to only include those with profiles
      store.centers = store.centers.filter((centre) => centre.profiles.length > 0);
    }
    // Sets default values if a profile and center are remembered
    if (profile && center) {
      store.defaultValues = {
        profile: profile.id,
        center: center.id,
        remember: true,
      };
    }

    // Automatically submits the profile if there's only one option
    if (
      !store.centers.length ||
      (store.centers.length === 1 && store.centers[0].profiles.length === 1)
    ) {
      const profileToSubmit = store.centers[0]?.profiles[0].id || store.superProfile?.id;
      const centerToSubmit = store.centers[0]?.id;
      const payload = {
        profile: profileToSubmit,
      };

      // Only send the center if it's not the super profile
      if (!store.superProfile?.id) {
        payload.center = centerToSubmit;
      }
      await handleOnSubmit(payload);
    }

    // Marks initialization as complete and triggers a re-render
    store.initLoading = false;
    render();
  }

  React.useEffect(() => {
    if (!tLoading && deploymentConfig !== undefined) init();
  }, [tLoading, deploymentConfig]);

  // ····················································································
  // LITERALS

  const labels = useMemo(
    () => ({
      title: t('title', { name: session?.name }),
      description:
        store.centers?.length > 1
          ? t('several_centers')
          : t('number_of_profiles', { profiles: store.centers?.[0]?.profiles?.length }),
      remember: t('use_always_profile'),
      help: t('change_easy'),
      login: t('log_in'),
      centerPlaceholder: t('choose_center'),
    }),
    [t, session, store.centers]
  );

  const errorMessages = useMemo(
    () => ({
      profile: {
        required: tCommon('selectionRequired'),
      },
      center: {
        required: tCommon('selectionRequired'),
      },
    }),
    [tCommon]
  );

  // ····················································································
  // STYLES

  if (store.initLoading) {
    return <LoadingOverlay visible />;
  }
  return (
    <AuthLayout>
      <AuthContainer>
        {isArray(store.centers) && store.centers.length > 0 && (
          <LoginProfileSelector
            labels={labels}
            errorMessages={errorMessages}
            centers={store.centers}
            loading={store.loading}
            onSubmit={handleOnSubmit}
            defaultValues={store.defaultValues}
          />
        )}
      </AuthContainer>
    </AuthLayout>
  );
}

SelectProfile.propTypes = {
  session: PropTypes.object,
};

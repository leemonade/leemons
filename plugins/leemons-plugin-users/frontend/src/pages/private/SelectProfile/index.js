import { Box, createStyles, Stack } from '@bubbles-ui/components';
import { LoginProfileSelector } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import { LayoutContext } from '@layout/context/layout';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';
import HeroBgLayout from '@users/layout/heroBgLayout';
import Cookies from 'js-cookie';
import hooks from 'leemons-hooks';
import _, { find, isArray } from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getRememberLoginRequest,
  getUserCenterProfileTokenRequest,
  getUserCentersRequest,
  getUserProfileTokenRequest,
  removeRememberLoginRequest,
  setRememberLoginRequest,
} from '../../../request';
import { getCookieToken } from '../../../session';

const PageStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing[7],
  },
  content: {
    maxWidth: 330,
  },
}));

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
export default function SelectProfile({ session }) {
  const [store, render] = useStore({
    loading: false,
    selectedProfile: null,
    selectedCenter: null,
    loginWithProfile: false,
    profiles: [],
  });

  const history = useHistory();
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  const { t: tCommon } = useCommonTranslate('forms');
  const [t] = useTranslateLoader(prefixPN('selectProfile'));

  // ····················································································
  // HANDLERS

  async function init() {
    setLayoutState({ ...layoutState, private: false, profileChecked: false });
    const [{ centers }, { profile, center }] = await Promise.all([
      getUserCentersRequest(),
      getRememberLoginRequest(getCookieToken()),
    ]);
    store.centers = centers;
    if (profile && center) {
      store.defaultValues = {
        profile: profile.id,
        center: center.id,
        remember: true,
      };
    }
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  async function handleOnSubmit(data) {
    try {
      store.loading = true;
      render();
      const _pro = [];
      _.forEach(store.centers, (cen) => {
        _.forEach(cen.profiles, (pro) => {
          _pro.push({ ...pro, centerId: cen.id });
        });
      });

      const profiles = _.uniqBy(_pro, 'id');
      const profile = find(profiles, { id: data.profile });

      if (data.remember) {
        await setRememberLoginRequest({
          center: profile.centerId,
          profile: profile.id,
        });
      } else {
        await removeRememberLoginRequest();
      }
      if (profile.sysName === 'admin') {
        const { jwtToken } = await getUserProfileTokenRequest(profile.id);
        await hooks.fireEvent('user:change:profile', profile);
        const newToken = { ...jwtToken, profile: data.profile };
        Cookies.set('token', newToken);
        hooks.fireEvent('user:cookie:session:change');
        history.push(`/private/dashboard`);
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

  const { classes } = PageStyles();

  return (
    <HeroBgLayout>
      <Stack className={classes.root} direction="column" justifyContent="center" fullHeight>
        <Box className={classes.content}>
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
        </Box>
      </Stack>
    </HeroBgLayout>
  );
}

SelectProfile.propTypes = {
  session: PropTypes.object,
};

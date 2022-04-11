import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { find, isArray } from 'lodash';
import {
  getUserProfilesRequest,
  getUserProfileTokenRequest,
  setRememberProfileRequest,
} from '@users/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@users/helpers/prefixPN';
import HeroBgLayout from '@users/layout/heroBgLayout';
import hooks from 'leemons-hooks';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { LayoutContext } from '@layout/context/layout';
import { Box, createStyles, Stack } from '@bubbles-ui/components';
import { LoginProfileSelector } from '@bubbles-ui/leemons';

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
  const [loadingProfileToken, setLoadingProfileToken] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loginWithProfile, setLoginWithProfile] = useState(false);
  const [profiles, setProfiles] = useState([]);

  const history = useHistory();
  const { setPrivateLayout } = useContext(LayoutContext);

  const { t: tCommon } = useCommonTranslate('forms');
  const [t] = useTranslateLoader(prefixPN('selectProfile'));

  // ····················································································
  // HANDLERS

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (loginWithProfile && selectedProfile) {
        try {
          setLoadingProfileToken(true);
          const { jwtToken } = await getUserProfileTokenRequest(selectedProfile.id);
          await hooks.fireEvent('user:change:profile', selectedProfile);
          Cookies.set('token', jwtToken);
          hooks.fireEvent('user:cookie:session:change');
          history.push(`/private/dashboard`);
        } catch (e) {
          console.error(e);
          if (mounted) {
            setLoadingProfileToken(false);
            setLoginWithProfile(false);
          }
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loginWithProfile, selectedProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { profiles: userProfiles } = await getUserProfilesRequest();
        if (userProfiles.length === 1) {
          if (mounted) {
            setSelectedProfile(userProfiles[0]);
            setLoginWithProfile(true);
          }
        } else if (mounted) {
          setProfiles(userProfiles);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    setPrivateLayout(false);
    return () => {
      mounted = false;
    };
  }, []);

  const handleOnSubmit = async (data) => {
    const _selectedProfile = find(profiles, { id: data.profile });
    if (data.remember) {
      await setRememberProfileRequest(_selectedProfile.id);
    }
    setSelectedProfile(_selectedProfile);
    setLoginWithProfile(true);
  };

  // ····················································································
  // LITERALS

  const labels = useMemo(
    () => ({
      title: t('title', { name: session?.name }),
      description: t('number_of_profiles', { profiles: profiles?.length }),
      remember: t('use_always_profile'),
      help: t('change_easy'),
      login: t('log_in'),
    }),
    [t, session, profiles]
  );

  const errorMessages = useMemo(
    () => ({
      profile: {
        required: tCommon('selectionRequired'),
      },
    }),
    [tCommon]
  );

  const profilesData = useMemo(
    () =>
      isArray(profiles) && profiles.length
        ? profiles.map((profile) => ({
            value: profile.id,
            label: profile.name,
            // icon: null,
          }))
        : [],
    [profiles]
  );

  // ····················································································
  // STYLES

  const { classes } = PageStyles();

  return (
    <HeroBgLayout>
      <Stack className={classes.root} direction="column" justifyContent="center" fullHeight>
        <Box className={classes.content}>
          {isArray(profilesData) && profilesData.length > 0 && (
            <LoginProfileSelector
              labels={labels}
              errorMessages={errorMessages}
              profiles={profilesData}
              loading={loadingProfileToken}
              onSubmit={handleOnSubmit}
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

import React, { useEffect, useState } from 'react';
import { useSession } from '@users/session';
import {
  getUserProfilesRequest,
  getUserProfileTokenRequest,
  setRememberProfileRequest,
} from '@users/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { goLoginPage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
import { Button, Checkbox, FormControl, ImageLoader } from 'leemons-ui';
import HeroBgLayout from '@users/layout/heroBgLayout';
import constants from '@users/constants';
import hooks from 'leemons-hooks';
import Router from 'next/router';
import Cookies from 'js-cookie';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
export default function SelectProfile() {
  const session = useSession({ redirectTo: goLoginPage });

  const [t] = useTranslateLoader(prefixPN('selectProfile'));

  const [loadingProfileToken, setLoadingProfileToken] = useState(false);
  const [rememberProfile, setRememberProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);

  const getProfileToken = async (_profile) => {
    try {
      const profil = selectedProfile || _profile;
      if (profil) {
        setLoadingProfileToken(true);
        const { jwtToken } = await getUserProfileTokenRequest(profil.id);
        if (rememberProfile) {
          await setRememberProfileRequest(profil.id);
        }
        await hooks.fireEvent('user:change:profile', profil);
        Cookies.set('token', jwtToken);
        Router.push(`/${constants.base}`);
      }
    } catch (e) {}
    setLoadingProfileToken(false);
  };

  async function getProfiles() {
    try {
      const { profiles: _profiles } = await getUserProfilesRequest();
      if (_profiles.length === 1) {
        await getProfileToken(_profiles[0]);
      }
      setProfiles(_profiles);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <HeroBgLayout>
      <h1 className="text-2xl mb-12">{t('title', { name: session?.name })}</h1>

      <div className="text-base mb-12">
        {t('number_of_profiles', { profiles: profiles?.length })}
      </div>

      {/* Profiles list */}
      <div className="mb-12 grid grid-flow-col grid-cols-3 gap-2">
        {profiles.map((profile) => (
          <div
            className={`p-5 cursor-pointer text-sm text-center ${
              selectedProfile?.id === profile.id ? 'border rounded' : ''
            }`}
            key={profile.id}
            onClick={() => setSelectedProfile(profile)}
          >
            {profile.name}
          </div>
        ))}
      </div>

      {/* Remember profile */}
      <div className="mb-4">
        <FormControl label={t('use_always_profile')} labelPosition="right">
          <Checkbox
            color="secondary"
            checked={rememberProfile}
            onChange={(event) => setRememberProfile(event.target.checked)}
            className="text-base"
          />
        </FormControl>
      </div>

      <div className="text-base mb-12">{t('change_easy')}</div>

      {/* Send form */}
      <Button
        className="btn-block"
        color="primary"
        loading={loadingProfileToken}
        rounded={true}
        onClick={() => getProfileToken()}
      >
        <div className="flex-1 text-left">{t('log_in')}</div>
        <div className="relative" style={{ width: '8px', height: '14px' }}>
          <ImageLoader src="/assets/svgs/chevron-right.svg" />
        </div>
      </Button>
    </HeroBgLayout>
  );
}

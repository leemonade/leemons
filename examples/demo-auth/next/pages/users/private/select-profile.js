import React, { useEffect, useState } from 'react';
import constants from '@users/constants';
import { loginSession, useSession } from '@users/session';
import { getUserProfilesRequest, getUserProfileTokenRequest } from '@users/request';
import { goLoginPage } from '@users/navigate';
import hooks from 'leemons-hooks';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
export default function SelectProfile() {
  console.log('Justo en el select profile');
  useSession({ redirectTo: goLoginPage });

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);

  async function getProfileToken(profile) {
    const { jwtToken } = await getUserProfileTokenRequest(profile.id);
    await hooks.fireEvent('user:change:profile', profile);
    loginSession(jwtToken, constants.base);
  }

  async function getProfiles() {
    try {
      const { profiles: _profiles } = await getUserProfilesRequest();
      if (_profiles.length === 1) {
        await getProfileToken(_profiles[0]);
      }
      setProfiles(_profiles);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div>
          Perfiles a los que tiene acceso el usuario:
          <div className="flex">
            {profiles.map((profile) => (
              <div
                className="p-5 cursor-pointer"
                key={profile.id}
                onClick={() => getProfileToken(profile)}
              >
                {profile.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

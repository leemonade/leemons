import React, { useEffect, useState } from 'react';
import constants from '@users/constants';
import { loginSession } from '@users/session';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
export default function SelectProfile() {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState();

  async function getProfileToken(id) {
    const { jwtToken } = await leemons.api({
      url: constants.backend.users.profileToken,
      query: { id },
    });
    loginSession(jwtToken, constants.base);
  }

  async function getProfiles() {
    try {
      const { profiles: _profiles } = await leemons.api(constants.backend.users.profiles);
      if (_profiles.length === 1) {
        await getProfileToken(_profiles[0].id);
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
                onClick={() => getProfileToken(profile.id)}
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

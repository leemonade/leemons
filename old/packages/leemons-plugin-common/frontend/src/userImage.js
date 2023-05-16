import React from 'react';
import { useSession } from '@users/session';
import { ImageLoader } from '@bubbles-ui/components';

export function UserImage({ user: _user, size = 40, className }) {
  const user = _user || useSession();

  if (user) {
    if (user.image) {
      return (
        <ImageLoader
          width={size}
          height={size}
          src={user.image}
          className={`rounded-full ${className}`}
        />
      );
    }
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`rounded-full bg-primary-focus text-secondary-content font-lexend text-center flex flex-col align-items-center justify-center ${className}`}
      >
        {user.name[0].toUpperCase()}
      </div>
    );
  }

  return null;
}

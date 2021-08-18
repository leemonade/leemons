import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';

export default function WellcomeProfiles() {
  useSession({ redirectTo: goLoginPage });

  return (
    <>
      <div className="max-w-screen-xl mx-auto">
        <div className="text-secondary-300 text-sm max-w-2xl p-6">
          <p className="mb-4">
            Use the user profiles to manage permissions for applications. Each time you install a
            new Leemon (plugin) we will ask you to define permissions for each existing profile.
          </p>
          <p>
            Start by manually creating a profile or install the default profiles suggested here and
            save a lot of time (seriously)
          </p>
        </div>
        <h3 className="text-base-content">Suggested profiles</h3>
      </div>
    </>
  );
}

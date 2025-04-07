import React from "react";
import { Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { LoadingOverlay } from "@bubbles-ui/components";
import { useSession } from "@users/session";
import { goLoginPage } from "@users/navigate";

const AssignmentPage = loadable(() =>
  pMinDelay(import("./src/pages/private/assignment/AssignmentPage"), 500)
);
const Welcome = loadable(() => pMinDelay(import("./src/pages/private/welcome/WelcomePage"), 500));
const Library = loadable(() => pMinDelay(import("./src/pages/private/library/LibraryPage"), 500));
const SetupTask = loadable(() =>
  pMinDelay(import("./src/pages/private/library/TaskSetupPage"), 500)
);
const Profiles = loadable(() =>
  pMinDelay(import("./src/pages/private/profiles/ProfilesPage"), 500)
);
const UserDetails = loadable(() => pMinDelay(import("./src/pages/private/student/Details"), 500));
const Correction = loadable(() =>
  pMinDelay(import("./src/pages/private/assignment/Correction"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      {/* ADMIN VIEW */}
      <Route
        path="welcome"
        element={<Welcome session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="profiles"
        element={<Profiles session={session} fallback={<LoadingOverlay visible />} />}
      />

      {/* TEACHER VIEW */}
      <Route
        path="library/edit/:id"
        element={<SetupTask session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="library/create"
        element={<SetupTask session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="library/view/:id"
        element={<UserDetails session={session} fallback={<LoadingOverlay visible />} preview />}
      />
      <Route
        path="library/assign/:id"
        element={<AssignmentPage session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="library"
        element={<Library session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="correction/:instance/:student"
        element={<Correction session={session} fallback={<LoadingOverlay visible />} />}
      />

      {/* STUDENT VIEW */}
      <Route
        path="student-detail/:id/:user"
        element={<UserDetails session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}

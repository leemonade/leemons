import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Home = loadable(() => pMinDelay(import("./src/pages/private/Home"), 500));
const ListUsers = loadable(() => pMinDelay(import("./src/pages/private/ListUsers"), 500));
const CreateUsers = loadable(() => pMinDelay(import("./src/pages/private/CreateUsers"), 500));
const ImportUsers = loadable(() => pMinDelay(import("./src/pages/private/ImportUsers"), 500));
const ChangeLanguage = loadable(() => pMinDelay(import("./src/pages/private/ChangeLanguage"), 500));
const UserData = loadable(() => pMinDelay(import("./src/pages/private/UserData"), 500));
const Welcome = loadable(() => pMinDelay(import("./src/pages/private/Welcome"), 500));
const SocketTest = loadable(() => pMinDelay(import("./src/pages/private/SocketTest"), 500));
const ListProfiles = loadable(() => pMinDelay(import("./src/pages/private/profiles/ListProfiles"), 500));
const DetailProfile = loadable(() => pMinDelay(import("./src/pages/private/profiles/DetailProfile"), 500));
const ListRoles = loadable(() => pMinDelay(import("./src/pages/private/roles/ListRoles"), 500));
const DetailRoles = loadable(() => pMinDelay(import("./src/pages/private/roles/DetailRoles"), 500));
const DetailUser = loadable(() => pMinDelay(import("./src/pages/private/DetailUser"), 500));
const DetailInfo = loadable(() => pMinDelay(import("./src/pages/private/DetailInfo"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="home"
        element={<Home session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="list"
        element={<ListUsers session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="create"
        element={<CreateUsers session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="import"
        element={<ImportUsers session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="language"
        element={<ChangeLanguage session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="user-data"
        element={<UserData session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="welcome"
        element={<Welcome session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="socket-test"
        element={<SocketTest session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="profiles/list"
        element={<ListProfiles session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="profiles/detail/:uri"
        element={<DetailProfile session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="profiles/detail"
        element={<DetailProfile session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="roles/list"
        element={<ListRoles session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="roles/detail/:uri"
        element={<DetailRoles session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="roles/detail"
        element={<DetailRoles session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="detail/:userId"
        element={<DetailUser session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="detail"
        element={<DetailInfo session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}

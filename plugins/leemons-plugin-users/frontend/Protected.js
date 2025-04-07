import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Logout = loadable(() =>
  pMinDelay(import("./src/pages/protected/Logout"), 500)
);
const SelectProfile = loadable(() =>
  pMinDelay(import("./src/pages/protected/SelectProfile"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="logout"
        element={<Logout session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="select-profile"
        element={
          <SelectProfile
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
    </Routes>
  );
}

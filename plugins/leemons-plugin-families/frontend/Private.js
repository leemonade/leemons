import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const FamiliesList = loadable(() =>
  pMinDelay(import("./src/pages/private/FamiliesList"), 500)
);
const FamilyDetail = loadable(() =>
  pMinDelay(import("./src/pages/private/FamilyDetail"), 500)
);
const FamiliesConfig = loadable(() =>
  pMinDelay(import("./src/pages/private/FamiliesConfig"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="list"
        element={
          <FamiliesList
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="detail/:id"
        element={
          <FamilyDetail
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="detail"
        element={
          <FamilyDetail
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="config"
        element={
          <FamiliesConfig
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
    </Routes>
  );
}

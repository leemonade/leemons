import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Dashboard = loadable(() =>
  pMinDelay(import("./src/pages/private/Dashboard"), 500)
);
const ClassDashboard = loadable(() =>
  pMinDelay(import("./src/pages/private/ClassDashboard"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="class/:id"
        element={
          <ClassDashboard
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path=""
        element={
          <Dashboard session={session} fallback={<LoadingOverlay visible />} />
        }
      />
    </Routes>
  );
}

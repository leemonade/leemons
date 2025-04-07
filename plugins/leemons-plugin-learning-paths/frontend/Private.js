import { LoadingOverlay } from "@bubbles-ui/components";
import { useSearchParams } from "@common";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Library = loadable(() => pMinDelay(import("./src/pages/private/Library"), 500));
const ModuleSetupPage = loadable(() => pMinDelay(import("./src/pages/private/ModuleSetupPage"), 500));
const ModuleAssignPage = loadable(() => pMinDelay(import("./src/pages/private/ModuleAssignPage"), 500));
const ModuleDashboardPage = loadable(() => pMinDelay(import("./src/pages/private/ModuleDashboardPage"), 500));
const ModuleJourneyPage = loadable(() => pMinDelay(import("./src/pages/private/ModuleJourney/ModuleJourney"), 500));

function Fallback() {
  return <LoadingOverlay visible />;
}

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });
  const query = useSearchParams();

  return (
    <Routes>
      {/* MODULES */}
      <Route
        path="modules/library"
        element={<Library session={session} fallback={<Fallback />} />}
      />
      <Route
        path="modules/new"
        element={<ModuleSetupPage session={session} key="new" fallback={<Fallback />} />}
      />
      <Route
        path="modules/:id/view"
        element={<ModuleDashboardPage session={session} fallback={<Fallback />} preview />}
      />
      <Route
        path="modules/:id/edit"
        element={
          <ModuleSetupPage
            session={session}
            key={query.has("fromNew") ? "new" : "edit"}
            fallback={<Fallback />}
          />
        }
      />
      <Route
        path="modules/:id/assign"
        element={<ModuleAssignPage session={session} fallback={<Fallback />} />}
      />
      <Route
        path="modules/dashboard/:id"
        element={<ModuleDashboardPage session={session} fallback={<Fallback />} />}
      />
      <Route
        path="modules/journey/:id"
        element={<ModuleJourneyPage session={session} fallback={<Fallback />} />}
      />
    </Routes>
  );
}

import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Navigate, Route, Routes } from "react-router-dom";

const RegionalCalendars = loadable(() =>
  pMinDelay(import("./src/pages/private/regional/index"), 500)
);
const ProgramCalendars = loadable(() =>
  pMinDelay(import("./src/pages/private/program/index"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="config"
        element={<Navigate to="program-calendars" replace />}
      />
      <Route
        path="regional-calendars"
        element={
          <RegionalCalendars
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="program-calendars"
        element={
          <ProgramCalendars
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
    </Routes>
  );
}

// t

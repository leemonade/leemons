import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Calendar = loadable(() =>
  pMinDelay(import("./src/pages/private/Calendar"), 500)
);
const Kanban = loadable(() =>
  pMinDelay(import("./src/pages/private/Kanban"), 500)
);

const CalendarConfigList = loadable(() =>
  pMinDelay(import("./src/pages/private/config/CalendarConfigList"), 500)
);
const CalendarConfigDetail = loadable(() =>
  pMinDelay(import("./src/pages/private/config/CalendarConfigDetail"), 500)
);
const CalendarConfigCalendar = loadable(() =>
  pMinDelay(import("./src/pages/private/config/CalendarConfigCalendar"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="home"
        element={
          <Calendar session={session} fallback={<LoadingOverlay visible />} />
        }
      />
      <Route
        path="kanban"
        element={
          <Kanban session={session} fallback={<LoadingOverlay visible />} />
        }
      />
      <Route
        path="config/calendars/:id"
        element={
          <CalendarConfigCalendar
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="config/detail/:id"
        element={
          <CalendarConfigDetail
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="config"
        element={
          <CalendarConfigList
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
    </Routes>
  );
}

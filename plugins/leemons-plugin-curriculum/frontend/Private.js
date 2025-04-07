import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const AddCurriculum = loadable(() =>
  pMinDelay(import("./src/pages/private/AddCurriculum"), 500)
);
const CurriculumView = loadable(() =>
  pMinDelay(import("./src/pages/private/CurriculumView"), 500)
);
const ListCurriculum = loadable(() =>
  pMinDelay(import("./src/pages/private/ListCurriculum"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="new"
        element={
          <AddCurriculum
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="list"
        element={
          <ListCurriculum
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path=":id/view"
        element={
          <CurriculumView
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path=":id"
        element={
          <AddCurriculum
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
    </Routes>
  );
}

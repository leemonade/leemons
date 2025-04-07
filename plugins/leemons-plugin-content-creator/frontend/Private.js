import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const DocumentList = loadable(() => pMinDelay(import("./src/pages/List"), 500));
const DocumentDetail = loadable(() =>
  pMinDelay(import("./src/pages/Detail"), 500)
);
const DocumentAssign = loadable(() =>
  pMinDelay(import("./src/pages/Assign"), 500)
);
const DocumentView = loadable(() => pMinDelay(import("./src/pages/View"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path=":id/assign"
        element={
          <DocumentAssign
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="view/:id/:user"
        element={
          <DocumentView
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="view/:id"
        element={
          <DocumentView
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="new"
        element={
          <DocumentDetail
            session={session}
            fallback={<LoadingOverlay visible />}
            isNew
            key="new"
          />
        }
      />
      <Route
        path=":id/edit"
        element={
          <DocumentDetail
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path=":id/view"
        element={
          <DocumentDetail
            session={session}
            fallback={<LoadingOverlay visible />}
            readOnly
          />
        }
      />
      <Route
        path=""
        element={
          <DocumentList
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
    </Routes>
  );
}

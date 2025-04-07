import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Navigate, Route, Routes } from "react-router-dom";

const Library = loadable(() => pMinDelay(import("./src/pages/private/Library"), 500));
const Detail = loadable(() => pMinDelay(import("./src/pages/private/Detail"), 500));
const List = loadable(() => pMinDelay(import("./src/pages/private/List"), 500));
const New = loadable(() => pMinDelay(import("./src/pages/private/New"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path=":category/list"
        element={<List session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=":category/new"
        element={<New session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=":category/:id/edit"
        element={<Detail session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path=":category/:id/view"
        element={<Detail session={session} fallback={<LoadingOverlay visible />} readOnly />}
      />
      <Route
        path=""
        element={<Navigate to="leebrary-recent/list" replace />}
      />
    </Routes>
  );
}

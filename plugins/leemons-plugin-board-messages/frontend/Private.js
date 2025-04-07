import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const List = loadable(() => pMinDelay(import("./src/pages/private/List"), 500));
const Test = loadable(() => pMinDelay(import("./src/pages/private/test"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="list"
        element={
          <List session={session} fallback={<LoadingOverlay visible />} />
        }
      />
      <Route
        path="test"
        element={
          <Test session={session} fallback={<LoadingOverlay visible />} />
        }
      />
    </Routes>
  );
}

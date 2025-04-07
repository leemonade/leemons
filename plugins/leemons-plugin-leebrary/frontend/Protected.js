import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const PlayerPage = loadable(() =>
  pMinDelay(import("./src/pages/protected/player"), 500)
);

export default function Protected() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="play/:assetId"
        element={<PlayerPage session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}

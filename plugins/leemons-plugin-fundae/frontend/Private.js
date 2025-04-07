import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Reports = loadable(() => pMinDelay(import("./src/pages/private/reports"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="reports"
        element={<Reports session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}

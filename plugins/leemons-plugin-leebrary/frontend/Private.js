import { LoadingOverlay } from "@bubbles-ui/components";
import AssignAssetPage from "@leebrary/pages/private/assignables/AssignAssetPage";
import Correction from "@leebrary/pages/private/assignables/Correction";
import Execution from "@leebrary/pages/private/assignables/Execution";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const HomePage = loadable(() => pMinDelay(import("./src/pages/private/library/Library"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="assign/:id"
        element={<AssignAssetPage fallback={<LoadingOverlay visible />} />}
      />
      <Route path="activities/student-detail/:id/:user" element={<Execution />} />
      <Route path="activities/correction/:id/:user" element={<Correction />} />
      <Route
        path=""
        element={<HomePage session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}

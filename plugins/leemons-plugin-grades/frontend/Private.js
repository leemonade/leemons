import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Welcome = loadable(() => pMinDelay(import("./src/pages/private/WelcomePage"), 500));
const EvaluationList = loadable(() => pMinDelay(import("./src/pages/private/Evaluations/EvaluationList"), 500));
const PromotionsList = loadable(() => pMinDelay(import("./src/pages/private/Promotions/PromotionsList"), 500));
const DependenciesList = loadable(() => pMinDelay(import("./src/pages/private/Dependencies/DependenciesList"), 500));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="welcome"
        element={<Welcome session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="evaluations"
        element={<EvaluationList session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="promotions"
        element={<PromotionsList session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="dependencies"
        element={<DependenciesList session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}

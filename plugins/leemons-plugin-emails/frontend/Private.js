import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import { Route, Routes } from "react-router-dom";

const OnboarderForm = loadable(() => import("./src/onboarderForm"));
const Preferences = loadable(() => import("./src/pages/private/preferences"));

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route path="preference" element={<Preferences session={session} />} />
      <Route path="onboarder" element={<OnboarderForm session={session} />} />
    </Routes>
  );
}

import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import { Route, Routes } from "react-router-dom";

const AssistancePage = loadable(() => import("./src/pages/private/Assistance"));

export default function Private() {
  useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route path="attendance" element={<AssistancePage />} />
    </Routes>
  );
}

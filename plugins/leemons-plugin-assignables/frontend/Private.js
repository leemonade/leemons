import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Navigate, Route, Routes } from "react-router-dom";

const Details = loadable(() =>
  pMinDelay(import("./src/components/Details"), 500)
);
const Ongoing = loadable(() =>
  pMinDelay(import("./src/components/Ongoing"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="ongoing"
        element={
          <Ongoing
            key="ongoing"
            session={session}
            fallback={<LoadingOverlay visible />}
          />
        }
      />
      <Route
        path="details/:id"
        element={
          <Details session={session} fallback={<LoadingOverlay visible />} />
        }
      />
      <Route path="" element={<Navigate to="ongoing" replace />} />
    </Routes>
  );
}

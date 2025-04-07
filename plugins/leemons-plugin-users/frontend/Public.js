import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import useProvider from "@users/request/hooks/queries/useProvider";
import pMinDelay from "p-min-delay";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./src/pages/public/Login";

const RegisterPassword = loadable(() =>
  pMinDelay(import("./src/pages/public/RegisterPassword"), 500)
);
const Recover = loadable(() =>
  pMinDelay(import("./src/pages/public/Recover"), 500)
);
const Reset = loadable(() =>
  pMinDelay(import("./src/pages/public/Reset"), 500)
);
const Logout = loadable(() =>
  pMinDelay(import("./src/pages/protected/Logout"), 500)
);

export default function Public() {
  const { data: provider } = useProvider();

  if (provider?.supportedMethods?.users?.login) {
    return <Navigate to={provider.supportedMethods.users.login} replace />;
  }

  return (
    <Routes>
      <Route
        path="register-password"
        element={<RegisterPassword fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="logout"
        element={<Logout fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="login"
        element={<Login fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="recover"
        element={<Recover fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="reset"
        element={<Reset fallback={<LoadingOverlay visible />} />}
      />
      <Route path="" element={<Navigate to="/private/dashboard" replace />} />
    </Routes>
  );
}

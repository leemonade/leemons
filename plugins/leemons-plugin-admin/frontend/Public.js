import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";
import { LocaleContainer } from "./src/components/LocaleContainer";
import { UserRedirect } from "./src/components/UserRedirect";

const Welcome = loadable(() =>
  pMinDelay(import("./src/pages/public/Welcome"), 500)
);
const Signup = loadable(() =>
  pMinDelay(import("./src/pages/public/Signup"), 500)
);
const Login = loadable(() =>
  pMinDelay(import("./src/pages/public/Login"), 500)
);

// ----------------------------------------------------------------------------
// PUBLIC ROUTES

export default function Public() {
  return (
    <LocaleContainer>
      <Routes>
        <Route
          path="welcome"
          element={
            <UserRedirect
              to={<Welcome fallback={<LoadingOverlay visible />} />}
            />
          }
        />
        <Route
          path="signup"
          element={
            <UserRedirect
              to={<Signup fallback={<LoadingOverlay visible />} />}
            />
          }
        />
        <Route
          path="login"
          element={
            <UserRedirect
              to={<Login fallback={<LoadingOverlay visible />} />}
            />
          }
        />
        <Route path="" element={<UserRedirect />} />
      </Routes>
    </LocaleContainer>
  );
}

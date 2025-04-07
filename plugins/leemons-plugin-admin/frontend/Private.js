import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";
import { LocaleContainer } from "./src/components/LocaleContainer";
import { UserRedirect } from "./src/components/UserRedirect";

const Setup = loadable(() =>
  pMinDelay(import("./src/pages/private/Setup"), 500)
);

export default function Private() {
  return (
    <LocaleContainer>
      <Routes>
        <Route
          path="setup"
          element={
            <UserRedirect
              to={<Setup fallback={<LoadingOverlay visible />} />}
            />
          }
        />
      </Routes>
    </LocaleContainer>
  );
}

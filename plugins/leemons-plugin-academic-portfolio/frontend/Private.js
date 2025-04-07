import { LoadingOverlay } from "@bubbles-ui/components";
import loadable from "@loadable/component";
import { goLoginPage } from "@users/navigate";
import { useSession } from "@users/session";
import pMinDelay from "p-min-delay";
import { Route, Routes } from "react-router-dom";

const Welcome = loadable(() =>
  pMinDelay(import("./src/pages/private/WelcomePage"), 500)
);
const Profiles = loadable(() =>
  pMinDelay(import("./src/pages/private/ProfilesPage"), 500)
);
const AcademicTree = loadable(() =>
  pMinDelay(import("./src/pages/private/AcademicTreePage"), 500)
);
const SubjectTypes = loadable(() =>
  pMinDelay(import("./src/pages/private/SubjectTypesPage"))
);
const KnowledgeAreas = loadable(() =>
  pMinDelay(import("./src/pages/private/KnowledgeAreasPage"))
);
const ProgramsPage = loadable(() =>
  pMinDelay(import("./src/pages/private/programs/ProgramsPage"), 500)
);
const SubjectsPage = loadable(() =>
  pMinDelay(import("./src/pages/private/subjects/SubjectsPage"), 500)
);
const BlocksPage = loadable(() =>
  pMinDelay(import("./src/pages/private/Blocks"), 500)
);
const ReportsPage = loadable(() =>
  pMinDelay(import("./src/pages/private/Reports"), 500)
);

export default function Private() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <Routes>
      <Route
        path="welcome"
        element={<Welcome session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="profiles"
        element={<Profiles session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="programs"
        element={<ProgramsPage session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="subjects"
        element={<SubjectsPage session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="tree"
        element={<AcademicTree session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="subject-types"
        element={<SubjectTypes session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="knowledge-areas"
        element={<KnowledgeAreas session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="blocks"
        element={<BlocksPage session={session} fallback={<LoadingOverlay visible />} />}
      />
      <Route
        path="reports"
        element={<ReportsPage session={session} fallback={<LoadingOverlay visible />} />}
      />
    </Routes>
  );
}

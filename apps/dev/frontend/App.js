import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import "./global.css";

// Plugins imports
const AcademicCalendarFrontendReactPrivate = loadable(() => pMinDelay(import('@academic-calendar-frontend-react/../Private'), 1000));
const AcademicPortfolioFrontendReactPrivate = loadable(() => pMinDelay(import('@academic-portfolio-frontend-react/../Private'), 1000));
const AdminFrontendReactPublic = loadable(() => pMinDelay(import('@admin-frontend-react/../Public'), 1000));
const AdminFrontendReactPrivate = loadable(() => pMinDelay(import('@admin-frontend-react/../Private'), 1000));
const AttendanceControlFrontendReactPrivate = loadable(() => pMinDelay(import('@attendance-control-frontend-react/../Private'), 1000));
const BoardMessagesFrontendReactPrivate = loadable(() => pMinDelay(import('@board-messages-frontend-react/../Private'), 1000));
import { Provider as BoardMessagesFrontendReactGlobalProvider } from '@board-messages-frontend-react/../globalContext';
const CalendarFrontendReactPrivate = loadable(() => pMinDelay(import('@calendar-frontend-react/../Private'), 1000));
import { Provider as CommonFrontendReactGlobalProvider } from '@common-frontend-react/../globalContext';
const ComunicaFrontendReactPrivate = loadable(() => pMinDelay(import('@comunica-frontend-react/../Private'), 1000));
import { Provider as ComunicaFrontendReactGlobalProvider } from '@comunica-frontend-react/../globalContext';
const ContentCreatorFrontendReactPrivate = loadable(() => pMinDelay(import('@content-creator-frontend-react/../Private'), 1000));
const CurriculumFrontendReactPrivate = loadable(() => pMinDelay(import('@curriculum-frontend-react/../Private'), 1000));
const DashboardFrontendReactPrivate = loadable(() => pMinDelay(import('@dashboard-frontend-react/../Private'), 1000));
const EmailsFrontendReactPrivate = loadable(() => pMinDelay(import('@emails-frontend-react/../Private'), 1000));
const FamiliesFrontendReactPrivate = loadable(() => pMinDelay(import('@families-frontend-react/../Private'), 1000));
const FeedbackFrontendReactPrivate = loadable(() => pMinDelay(import('@feedback-frontend-react/../Private'), 1000));
const FundaeFrontendReactPrivate = loadable(() => pMinDelay(import('@fundae-frontend-react/../Private'), 1000));
import { Provider as FundaeFrontendReactGlobalProvider } from '@fundae-frontend-react/../globalContext';
const AssignablesFrontendReactPrivate = loadable(() => pMinDelay(import('@assignables-frontend-react/../Private'), 1000));
const GradesFrontendReactPrivate = loadable(() => pMinDelay(import('@grades-frontend-react/../Private'), 1000));
import { Provider as LayoutFrontendReactGlobalProvider } from '@layout-frontend-react/../globalContext';
const LearningPathsFrontendReactPrivate = loadable(() => pMinDelay(import('@learning-paths-frontend-react/../Private'), 1000));
const LeebraryFrontendReactPrivate = loadable(() => pMinDelay(import('@leebrary-frontend-react/../Private'), 1000));
import { Provider as LeebraryFrontendReactGlobalProvider } from '@leebrary-frontend-react/../globalContext';
import { Provider as MenuBuilderFrontendReactGlobalProvider } from '@menu-builder-frontend-react/../globalContext';
const MqttAwsIotFrontendReactPrivate = loadable(() => pMinDelay(import('@mqtt-aws-iot-frontend-react/../Private'), 1000));
import { Provider as MqttAwsIotFrontendReactGlobalProvider } from '@mqtt-aws-iot-frontend-react/../globalContext';
import { Provider as MqttSocketIoFrontendReactGlobalProvider } from '@mqtt-socket-io-frontend-react/../globalContext';
const ScoresFrontendReactPrivate = loadable(() => pMinDelay(import('@scores-frontend-react/../Private'), 1000));
const ScormFrontendReactPrivate = loadable(() => pMinDelay(import('@scorm-frontend-react/../Private'), 1000));
const TasksFrontendReactPrivate = loadable(() => pMinDelay(import('@tasks-frontend-react/../Private'), 1000));
const TestsFrontendReactPrivate = loadable(() => pMinDelay(import('@tests-frontend-react/../Private'), 1000));
const TimetableFrontendReactPublic = loadable(() => pMinDelay(import('@timetable-frontend-react/../Public'), 1000));
const UsersFrontendReactPublic = loadable(() => pMinDelay(import('@users-frontend-react/../Public'), 1000));
const UsersFrontendReactPrivate = loadable(() => pMinDelay(import('@users-frontend-react/../Private'), 1000));
import { Provider as UsersFrontendReactGlobalProvider } from '@users-frontend-react/../globalContext';
import { Provider as XapiFrontendReactGlobalProvider } from '@xapi-frontend-react/../globalContext';

function App() {
  // Plugins hooks
  return (
    <Router>
        <BoardMessagesFrontendReactGlobalProvider>
        <CommonFrontendReactGlobalProvider>
        <ComunicaFrontendReactGlobalProvider>
        <FundaeFrontendReactGlobalProvider>
        <LayoutFrontendReactGlobalProvider>
        <LeebraryFrontendReactGlobalProvider>
        <MenuBuilderFrontendReactGlobalProvider>
        <MqttAwsIotFrontendReactGlobalProvider>
        <MqttSocketIoFrontendReactGlobalProvider>
        <UsersFrontendReactGlobalProvider>
        <XapiFrontendReactGlobalProvider>
            <Switch>
              {/* Define each plugin route */}
                <Route path="/private/academic-calendar-frontend-react">
                  <AcademicCalendarFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/academic-portfolio-frontend-react">
                  <AcademicPortfolioFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/admin-frontend-react">
                  <AdminFrontendReactPublic fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/admin-frontend-react">
                  <AdminFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/attendance-control-frontend-react">
                  <AttendanceControlFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/board-messages-frontend-react">
                  <BoardMessagesFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/calendar-frontend-react">
                  <CalendarFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/comunica-frontend-react">
                  <ComunicaFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/content-creator-frontend-react">
                  <ContentCreatorFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/curriculum-frontend-react">
                  <CurriculumFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/dashboard-frontend-react">
                  <DashboardFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/emails-frontend-react">
                  <EmailsFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/families-frontend-react">
                  <FamiliesFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/feedback-frontend-react">
                  <FeedbackFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/fundae-frontend-react">
                  <FundaeFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/assignables-frontend-react">
                  <AssignablesFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/grades-frontend-react">
                  <GradesFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/learning-paths-frontend-react">
                  <LearningPathsFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/leebrary-frontend-react">
                  <LeebraryFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/mqtt-aws-iot-frontend-react">
                  <MqttAwsIotFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/scores-frontend-react">
                  <ScoresFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/scorm-frontend-react">
                  <ScormFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/tasks-frontend-react">
                  <TasksFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/tests-frontend-react">
                  <TestsFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/timetable-frontend-react">
                  <TimetableFrontendReactPublic fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/users-frontend-react">
                  <UsersFrontendReactPublic fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/users-frontend-react">
                  <UsersFrontendReactPrivate fallback={<LoadingOverlay visible />} />
                </Route>
              <Route path="/">
                   <Redirect to={`/admin`} />
              </Route>
            </Switch>
        </XapiFrontendReactGlobalProvider>
        </UsersFrontendReactGlobalProvider>
        </MqttSocketIoFrontendReactGlobalProvider>
        </MqttAwsIotFrontendReactGlobalProvider>
        </MenuBuilderFrontendReactGlobalProvider>
        </LeebraryFrontendReactGlobalProvider>
        </LayoutFrontendReactGlobalProvider>
        </FundaeFrontendReactGlobalProvider>
        </ComunicaFrontendReactGlobalProvider>
        </CommonFrontendReactGlobalProvider>
        </BoardMessagesFrontendReactGlobalProvider>
    </Router>
  );
}

export default App;

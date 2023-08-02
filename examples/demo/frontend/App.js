import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { LoadingOverlay } from '@bubbles-ui/components';
import "./global.css";

// Plugins imports
import { Provider as CommonGlobalProvider } from '@common/../globalContext';
import { Provider as LayoutGlobalProvider } from '@layout/../globalContext';
const AcademicCalendarPrivate = loadable(() => pMinDelay(import('@academic-calendar/../Private'), 1000));
const AcademicPortfolioPrivate = loadable(() => pMinDelay(import('@academic-portfolio/../Private'), 1000));
const AdminPublic = loadable(() => pMinDelay(import('@admin/../Public'), 1000));
const AdminPrivate = loadable(() => pMinDelay(import('@admin/../Private'), 1000));
const AssignablesPrivate = loadable(() => pMinDelay(import('@assignables/../Private'), 1000));
const AttendanceControlPrivate = loadable(() => pMinDelay(import('@attendance-control/../Private'), 1000));
const BoardMessagesPrivate = loadable(() => pMinDelay(import('@board-messages/../Private'), 1000));
import { Provider as BoardMessagesGlobalProvider } from '@board-messages/../globalContext';
const CalendarPrivate = loadable(() => pMinDelay(import('@calendar/../Private'), 1000));
const ComunicaPrivate = loadable(() => pMinDelay(import('@comunica/../Private'), 1000));
import { Provider as ComunicaGlobalProvider } from '@comunica/../globalContext';
const ContentCreatorPrivate = loadable(() => pMinDelay(import('@content-creator/../Private'), 1000));
const CurriculumPrivate = loadable(() => pMinDelay(import('@curriculum/../Private'), 1000));
const DashboardPrivate = loadable(() => pMinDelay(import('@dashboard/../Private'), 1000));
const EmailsPrivate = loadable(() => pMinDelay(import('@emails/../Private'), 1000));
const FamiliesPrivate = loadable(() => pMinDelay(import('@families/../Private'), 1000));
const FeedbackPrivate = loadable(() => pMinDelay(import('@feedback/../Private'), 1000));
const FundaePrivate = loadable(() => pMinDelay(import('@fundae/../Private'), 1000));
import { Provider as FundaeGlobalProvider } from '@fundae/../globalContext';
const GradesPrivate = loadable(() => pMinDelay(import('@grades/../Private'), 1000));
const LearningPathsPrivate = loadable(() => pMinDelay(import('@learning-paths/../Private'), 1000));
const LeebraryPrivate = loadable(() => pMinDelay(import('@leebrary/../Private'), 1000));
import { Provider as LeebraryGlobalProvider } from '@leebrary/../globalContext';
import { Provider as MenuBuilderGlobalProvider } from '@menu-builder/../globalContext';
const MqttAwsIotPrivate = loadable(() => pMinDelay(import('@mqtt-aws-iot/../Private'), 1000));
import { Provider as MqttAwsIotGlobalProvider } from '@mqtt-aws-iot/../globalContext';
import { Provider as MqttSocketIoGlobalProvider } from '@mqtt-socket-io/../globalContext';
const ScoresPrivate = loadable(() => pMinDelay(import('@scores/../Private'), 1000));
const TasksPrivate = loadable(() => pMinDelay(import('@tasks/../Private'), 1000));
const TestsPrivate = loadable(() => pMinDelay(import('@tests/../Private'), 1000));
const TimetablePublic = loadable(() => pMinDelay(import('@timetable/../Public'), 1000));
const UsersPublic = loadable(() => pMinDelay(import('@users/../Public'), 1000));
const UsersPrivate = loadable(() => pMinDelay(import('@users/../Private'), 1000));
import { Provider as UsersGlobalProvider } from '@users/../globalContext';
import { Provider as XapiGlobalProvider } from '@xapi/../globalContext';

function App() {
  // Plugins hooks
  return (
    <Router>
        <CommonGlobalProvider>
        <LayoutGlobalProvider>
        <BoardMessagesGlobalProvider>
        <ComunicaGlobalProvider>
        <FundaeGlobalProvider>
        <LeebraryGlobalProvider>
        <MenuBuilderGlobalProvider>
        <MqttAwsIotGlobalProvider>
        <MqttSocketIoGlobalProvider>
        <UsersGlobalProvider>
        <XapiGlobalProvider>
            <Switch>
              {/* Define each plugin route */}
                <Route path="/private/academic-calendar">
                  <AcademicCalendarPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/academic-portfolio">
                  <AcademicPortfolioPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/admin">
                  <AdminPublic fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/admin">
                  <AdminPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/assignables">
                  <AssignablesPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/attendance-control">
                  <AttendanceControlPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/board-messages">
                  <BoardMessagesPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/calendar">
                  <CalendarPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/comunica">
                  <ComunicaPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/content-creator">
                  <ContentCreatorPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/curriculum">
                  <CurriculumPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/dashboard">
                  <DashboardPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/emails">
                  <EmailsPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/families">
                  <FamiliesPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/feedback">
                  <FeedbackPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/fundae">
                  <FundaePrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/grades">
                  <GradesPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/learning-paths">
                  <LearningPathsPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/leebrary">
                  <LeebraryPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/mqtt-aws-iot">
                  <MqttAwsIotPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/scores">
                  <ScoresPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/tasks">
                  <TasksPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/tests">
                  <TestsPrivate fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/timetable">
                  <TimetablePublic fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/users">
                  <UsersPublic fallback={<LoadingOverlay visible />} />
                </Route>
                <Route path="/private/users">
                  <UsersPrivate fallback={<LoadingOverlay visible />} />
                </Route>
              <Route path="/">
                   <Redirect to={`/admin`} />
              </Route>
            </Switch>
        </XapiGlobalProvider>
        </UsersGlobalProvider>
        </MqttSocketIoGlobalProvider>
        </MqttAwsIotGlobalProvider>
        </MenuBuilderGlobalProvider>
        </LeebraryGlobalProvider>
        </FundaeGlobalProvider>
        </ComunicaGlobalProvider>
        </BoardMessagesGlobalProvider>
        </LayoutGlobalProvider>
        </CommonGlobalProvider>
    </Router>
  );
}

export default App;

import {
  Badge,
  Box,
  ChatMessage,
  ContextContainer,
  createStyles,
  ImageLoader,
  Logo,
  Stack,
  Title,
} from '@bubbles-ui/components';
import { useLayout } from '@layout/context';
import _ from 'lodash';
import React from 'react';

export const PdfStyles = createStyles((theme) => ({
  logoUrl: {
    width: '50mm',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  logo: {
    width: '24px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tableTitle: {
    padding: theme.spacing[2],
    backgroundColor: theme.colors.uiBackground03,
    color: theme.colors.mainWhite,
    textAlign: 'center',
    fontSize: theme.fontSizes[1],
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  tableSubTitle: {
    marginTop: '1px',
    padding: theme.spacing[2],
    backgroundColor: theme.colors.uiBackground03,
    color: theme.colors.mainWhite,
    textAlign: 'center',
    fontSize: theme.fontSizes[1],
    fontWeight: 600,
  },
  table: {
    width: '100%',
    borderSpacing: '1px',
    borderCollapse: 'separate',
    td: {
      background: theme.colors.ui04,
      padding: theme.spacing[1],
      textAlign: 'center',
      fontSize: theme.fontSizes[1],
      fontWeight: 500,
      verticalAlign: 'middle',
    },
    th: {
      padding: theme.spacing[1],
      backgroundColor: theme.colors.uiBackground03,
      color: theme.colors.mainWhite,
      textAlign: 'center',
      fontSize: theme.fontSizes[1],
      fontWeight: 500,
    },
  },
}));

export const Pdf = React.forwardRef(({ show, report, t }, ref) => {
  const { classes } = PdfStyles();
  const {
    theme: { squareLogoUrl },
  } = useLayout();

  let course = null;
  if (report.item.course) {
    course = _.find(report.courses, { id: report.item.course });
  } else if (report.courses) {
    [course] = report.courses;
  }
  let coursesDates = null;
  if (course) {
    if (course.startDate && course.endDate) {
      coursesDates = `${new Date(course.startDate).toLocaleString(undefined, {
        dateStyle: 'short',
      })} - ${new Date(course.endDate).toLocaleString(undefined, { dateStyle: 'short' })}`;
    }
  }

  return (
    <Box style={{ display: show ? 'block' : 'none' }}>
      <Box
        ref={ref}
        style={{
          border: '1px solid black',
          padding: '10mm',
          width: '300mm',
          minHeight: '297mm',
        }}
      >
        <ContextContainer divided>
          <Stack fullWidth justifyContent="space-between" alignItems="center">
            <Box>
              <Box
                sx={(theme) => ({
                  display: 'inline-block',
                  verticalAlign: 'middle',
                })}
              >
                {!_.isEmpty(squareLogoUrl) ? (
                  <ImageLoader
                    src={squareLogoUrl}
                    forceImage
                    className={classes.logoUrl}
                    height="auto"
                  />
                ) : (
                  <Logo isotype className={classes.logo} />
                )}
              </Box>
              <Box
                sx={(theme) => ({
                  marginLeft: theme.spacing[4],
                  display: 'inline-block',
                  verticalAlign: 'middle',
                })}
              >
                <Title order={3}>{report.centerName}</Title>
              </Box>
            </Box>
            <Box>
              <Title order={3}>{t('followUpReport')}</Title>
            </Box>
          </Stack>
          <ContextContainer>
            <Box>
              <Box style={{ textAlign: 'center' }}>
                <Box>
                  <Title order={6}>{report.programId}</Title>
                </Box>
                <Box>
                  <Title order={4}>
                    {report.programName} ({report.programAbbreviation})
                  </Title>
                </Box>
                <Box>{coursesDates}</Box>
              </Box>
              <Box sx={(theme) => ({ textAlign: 'center', marginTop: theme.spacing[4] })}>
                <Box>
                  <Title order={6}>
                    {t('student')}: {report.userAgentName} ({report.userAgentId})
                  </Title>
                </Box>
                <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                  <Title order={6}>
                    {t('emitDate')}: {new Date(report.created_at).toLocaleString()}
                  </Title>
                </Box>
              </Box>
            </Box>

            <Box>
              <Box className={classes.tableTitle}>{t('courseData')}</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>{t('fCourseInit')}</th>
                    <th>{t('fCourseEnd')}</th>
                    <th>{t('courseHours')}</th>
                    <th>{t('nStudents')}</th>
                    <th>{t('examsPlatform')}</th>
                    <th>{t('examsScorm')}</th>
                    <th>{t('totalExams')}</th>
                    <th>{t('nLessons')}</th>
                    <th>{t('nVideoconferences')}</th>
                    <th>{t('nTutors')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {course?.startDate
                        ? new Date(course.startDate).toLocaleString(undefined, {
                            dateStyle: 'short',
                          })
                        : ''}
                    </td>
                    <td>
                      {course?.startDate
                        ? new Date(course.endDate).toLocaleString(undefined, {
                            dateStyle: 'short',
                          })
                        : ''}
                    </td>
                    <td>{report.programHours}</td>
                    <td>{report.usersInProgram}</td>
                    <td>{report.examsPlatform}</td>
                    <td>Need def</td>
                    <td>{report.totalExams}</td>
                    <td>{report.lessonsPlatfom}</td>
                    <td>{report.classVideoN}</td>
                    <td>{report.nTeachers}</td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </ContextContainer>
          <ContextContainer>
            <Box>
              <Box>
                <Title order={6}>
                  {t('student')}: {report.userAgentName} ({report.userAgentId})
                </Title>
              </Box>
              <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                <Title order={6}>
                  {t('course')}: {report.programId} - {coursesDates ? `${coursesDates} - ` : ''}{' '}
                  {report.programName} ({report.programAbbreviation})
                </Title>
              </Box>
              <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                <Title order={6}>
                  {t('email')}: {report.userAgentEmail}
                </Title>
              </Box>
            </Box>
            <Box>
              <Box className={classes.tableTitle}>{t('resume')}</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>{t('firstCon')}</th>
                    <th>{t('lastCon')}</th>
                    <th>{t('totalTime')}</th>
                    <th>{t('nCon')}</th>
                    <th>{t('learningControls')}</th>
                    <th>{t('examsPerformed')}</th>
                    <th>{t('examsCompleted')}</th>
                    <th>{t('intForums')}</th>
                    <th>{t('intChats')}</th>
                    <th>{t('messagesSended')}</th>
                    <th>{t('receivedMessages')}</th>
                    <th>{t('intVideo')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {report.firstConnection
                        ? new Date(report.firstConnection).toLocaleString()
                        : ''}
                    </td>
                    <td>
                      {report.lastConnection
                        ? new Date(report.lastConnection).toLocaleString()
                        : ''}
                    </td>
                    <td>{report.totalHoursConnected}</td>
                    <td>{report.connections.length}</td>
                    <td>{report.totalPerformed}</td>
                    <td>{report.examsPerformed}</td>
                    <td>{report.lessonsPerformed}</td>
                    <td>Need def</td>
                    <td>Need def</td>
                    <td>{report.nMessagesSend}</td>
                    <td>{report.nMessagesReceived}</td>
                    <td>{report.virtualClassClicks.length}</td>
                  </tr>
                </tbody>
              </table>
            </Box>
            <Box>
              <Box className={classes.tableTitle}>{t('connections')}</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>{t('courseEntryDate')}</th>
                    <th>{t('courseDepartureDate')}</th>
                    <th>{t('timeInCourse')}</th>
                    <th>{t('ip')}</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(report.connections, (con) => (
                    <tr>
                      <td>{new Date(con.start).toLocaleString()}</td>
                      <td>{new Date(con.end).toLocaleString()}</td>
                      <td>{con.time}</td>
                      <td>{con.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Box>
              <Box className={classes.tableTitle}>{t('evaluations')}</Box>
              {_.map(report.exams, (subject) => (
                <Box>
                  <Box className={classes.tableSubTitle}>{subject.name}</Box>
                  <table className={classes.table}>
                    <thead>
                      <tr>
                        <th>{t('nEx')}</th>
                        <th>{t('exam')}</th>
                        <th>{t('tModule')}</th>
                        <th>{t('calification')}</th>
                        <th>{t('calificationLetter')}</th>
                        <th>{t('evaluationDate')}</th>
                        <th>{t('state')}</th>
                        <th>{t('stateDate')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {_.map(subject.items, (item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.type}</td>
                          <td>{item.note}</td>
                          <td>{item.noteLetter}</td>
                          <td>
                            {item.deliveredOn ? new Date(item.deliveredOn).toLocaleString() : ''}
                          </td>
                          <td>{item.status ? t('submitted') : t('noSubmitted')}</td>
                          <td>
                            {item.evaluatedOn ? new Date(item.evaluatedOn).toLocaleString() : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              ))}
            </Box>
            <Box>
              <Box className={classes.tableTitle}>{t('privateChats')}</Box>
              {_.map(report.privateChats, (chat) => {
                let lastDay = null;
                const userAgentsById = _.keyBy(chat.userAgents, 'id');
                return (
                  <Box sx={(theme) => ({ border: `1px solid ${theme.colors.uiBackground03}` })}>
                    <Box className={classes.tableSubTitle}>
                      {t('privateChat')} {chat.name || chat.key}
                    </Box>
                    <Box sx={(theme) => ({ padding: theme.spacing[4] })}>
                      {_.map(chat.messages, (message, index) => {
                        const comp = [];
                        let forceUserImage = false;
                        const day = new Date(message.created_at).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        });
                        if (index === 0 || lastDay !== day) {
                          lastDay = day;
                          forceUserImage = true;
                          comp.push(
                            <Box className={classes.date} key={`date-${index}`}>
                              <Badge label={day} closable={false} size="md" />
                            </Box>
                          );
                        }

                        comp.push(
                          <Box
                            key={message.id}
                            sx={(theme) => ({
                              marginTop:
                                index !== 0 &&
                                chat.messages[index - 1].userAgent !== message.userAgent
                                  ? theme.spacing[4]
                                  : 0,
                            })}
                          >
                            <ChatMessage
                              showUser={
                                forceUserImage || index === 0
                                  ? true
                                  : chat.messages[index - 1].userAgent !== message.userAgent
                              }
                              isOwn={message.userAgent === report.item.userAgent.id}
                              user={userAgentsById?.[message.userAgent].user}
                              message={{ ...message.message, date: new Date(message.created_at) }}
                            />
                          </Box>
                        );
                        return comp;
                      })}
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box>
              <Box className={classes.tableTitle}>{t('videoconferencing')}</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>{t('subject')}</th>
                    <th>{t('dateAccess')}</th>
                    <th>{t('url')}</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(report.virtualClassClicks, (item) => (
                    <tr>
                      <td>{item.name}</td>
                      <td>{new Date(item.date).toLocaleString()}</td>
                      <td>{item.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Box>
              <Box className={classes.tableTitle}>{t('didacticMaterial')}</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('firstAccess')}</th>
                    <th>{t('lastAccess')}</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(report.mediaFiles, (item) => (
                    <tr>
                      <td>{item.name}</td>
                      <td>{new Date(item.first).toLocaleString()}</td>
                      <td>{new Date(item.last).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </ContextContainer>
        </ContextContainer>
      </Box>
    </Box>
  );
});

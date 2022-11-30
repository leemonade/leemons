import React from 'react';
import _ from 'lodash';
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

export const Pdf = React.forwardRef(({ report }, ref) => {
  const { classes } = PdfStyles();
  const {
    theme: { squareLogoUrl },
  } = useLayout();

  let course = null;
  if (report.item.course) {
    course = _.find(report.courses, { id: report.item.course });
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
    <Box style={{ display: 'block' }}>
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
            <Box>
              <Title order={3}>Informe de seguimiento</Title>
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
                    Alumno/a: {report.userAgentName} ({report.userAgentId})
                  </Title>
                </Box>
                <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                  <Title order={6}>
                    Fecha emisión: {new Date(report.created_at).toLocaleString()}
                  </Title>
                </Box>
              </Box>
            </Box>

            <Box>
              <Box className={classes.tableTitle}>Datos del curso</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>F.inicio curso</th>
                    <th>F. fin curso</th>
                    <th>Horas curso</th>
                    <th>NºAlumnos</th>
                    <th>Ex. Plataf</th>
                    <th>Ex. Scorm</th>
                    <th>Tol. Ex.</th>
                    <th>Nº Lecciones</th>
                    <th>Nº Videoconferencias</th>
                    <th>Nº Tutores</th>
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
                    <td>Need def</td>
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
                  Alumno/a: {report.userAgentName} ({report.userAgentId})
                </Title>
              </Box>
              <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                <Title order={6}>
                  Curso: {report.programId} - {coursesDates ? `${coursesDates} - ` : ''}{' '}
                  {report.programName} ({report.programAbbreviation})
                </Title>
              </Box>
              <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                <Title order={6}>Email: {report.userAgentEmail}</Title>
              </Box>
            </Box>
            <Box>
              <Box className={classes.tableTitle}>Resumen</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>F. 1ª conexión</th>
                    <th>F. Última conexión</th>
                    <th>T. Total (Horas)</th>
                    <th>Nº Con.</th>
                    <th>% Controles aprendizaje</th>
                    <th>Exámenes realizados</th>
                    <th>Lecciones completadas</th>
                    <th>Int. foros</th>
                    <th>Int. chats</th>
                    <th>Mens. enviados</th>
                    <th>Mens. rec.</th>
                    <th>Int. videoconf.</th>
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
              <Box className={classes.tableTitle}>Conexiones</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>F. Entrada curso</th>
                    <th>F. Salida curso</th>
                    <th>Tiempo en el curso</th>
                    <th>IP</th>
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
              <Box className={classes.tableTitle}>Evaluaciones</Box>
              {_.map(report.exams, (subject) => (
                <Box>
                  <Box className={classes.tableSubTitle}>{subject.name}</Box>
                  <table className={classes.table}>
                    <thead>
                      <tr>
                        <th>Nº Ex.</th>
                        <th>Exámen</th>
                        <th>T. Módulo</th>
                        <th>Calificación</th>
                        <th>Calificación (Letra)</th>
                        <th>F. Evaluación</th>
                        <th>Estado</th>
                        <th>F. Estado</th>
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
                          <td>{item.status ? 'Presentado' : 'No'}</td>
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
              <Box className={classes.tableTitle}>Chats Privados</Box>
              {_.map(report.privateChats, (chat) => {
                let lastDay = null;
                const userAgentsById = _.keyBy(chat.userAgents, 'id');
                return (
                  <Box sx={(theme) => ({ border: `1px solid ${theme.colors.uiBackground03}` })}>
                    <Box className={classes.tableSubTitle}>{chat.key}</Box>
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
              <Box className={classes.tableTitle}>Videoconferencias</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>Asignatura</th>
                    <th>F. Acceso</th>
                    <th>Url</th>
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
              <Box className={classes.tableTitle}>Accesos a material didáctico</Box>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Primer Acceso</th>
                    <th>Último acceso</th>
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

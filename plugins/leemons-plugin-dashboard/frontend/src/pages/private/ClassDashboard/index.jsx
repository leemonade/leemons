import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { getClassImage } from '@academic-portfolio/helpers/getClassImage';
import getSubjectGroupCourseNamesFromClassData from '@academic-portfolio/helpers/getSubjectGroupCourseNamesFromClassData';
import { useIsStudent } from '@academic-portfolio/hooks';
import { classDetailForDashboardRequest } from '@academic-portfolio/request';
import { Box, LoadingOverlay, TabPanel, Tabs, TotalLayoutContainer } from '@bubbles-ui/components';
import { ClassroomHeaderBar, HeaderDropdown } from '@bubbles-ui/leemons';
import { getShare, useLocale, useStore } from '@common';
import { useComunica } from '@comunica/context';
import { LayoutContext } from '@layout/context/layout';
import { getLocalizations } from '@multilanguage/useTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ZoneWidgets } from '@widgets';
import { find, map, sortBy } from 'lodash';
import PropTypes from 'prop-types';

import { ClassDashboardStyles } from './ClassDashboard.styles';

import prefixPN from '@dashboard/helpers/prefixPN';

export default function ClassDashboard({ session }) {
  const { layoutState } = useContext(LayoutContext);
  const { openRoom, isChatEnabled } = useComunica();

  const locale = useLocale();
  const [store, render] = useStore({
    loading: true,
    tabNames: {},
    chatOpened: false,
    tabsProperties: {},
    hideRightSide: false,
    haveScrollBar: false,
  });
  const [classesData, setClassesData] = React.useState([]);

  const { classes: styles } = ClassDashboardStyles(
    {
      hideRightSide: true, // store.hideRightSide,
      haveScrollBar: store.haveScrollBar,
      hideStudents: store.hideStudents,
    },
    { name: 'ClassDashboard' }
  );
  const [t] = useTranslateLoader(prefixPN('classDashboard'));
  const { id } = useParams();
  const isStudent = useIsStudent();
  const history = useHistory();

  const tabsRef = React.useRef();
  const headerRef = React.useRef();

  function onResize() {
    // TODO Ver que pasa con el scroll en los distintos navegadores
    const haveScrollBar =
      layoutState.contentRef.current.clientHeight < layoutState.contentRef.current.scrollHeight;
    if (haveScrollBar !== store.haveScrollBar) {
      // store.haveScrollBar = haveScrollBar;
      // render();
    }
  }

  React.useEffect(() => {
    const observer = new ResizeObserver(onResize);
    observer.observe(layoutState.contentRef.current);
    return () => {
      observer.disconnect();
    };
  });

  async function init() {
    store.loading = true;
    render();
    store.idLoaded = id;
    const { classe, programClasses } = await classDetailForDashboardRequest(id, null);

    store.hideStudents = false;
    if (isStudent && classe.hideStudentsToStudents) {
      store.hideStudents = true;
    }

    store.class = classe;
    store.programClasses = programClasses;
    store.classesSelect = map(store.programClasses, (programClass) => {
      const dataLabels = getSubjectGroupCourseNamesFromClassData(programClass);
      return {
        id: programClass.id,
        color: programClass.color,
        image: getClassImage(programClass),
        icon: getClassIcon(programClass),
        label: dataLabels.subject,
        description: dataLabels.courseAndGroupParsed,
        createdAt: programClass.createdAt,
      };
    });

    setClassesData(sortBy(store.classesSelect, 'createdAt'));

    store.loading = false;
    render();

    setTimeout(() => {
      render();
    }, 4000);
  }
  function changeClass(classe) {
    history.push(`/private/dashboard/class/${classe.id}`);
  }

  async function onGetZone(zone) {
    const { items } = await getLocalizations({ keys: map(zone.widgetItems, 'properties.label') });
    store.widgetLabels = items;
    render();
  }

  React.useEffect(() => {
    if (id && (!store.idLoaded || id !== store.idLoaded) && isStudent !== null) init();
  }, [id, isStudent]);

  const headerProps = {};
  const classImage = store.class ? getClassImage(store.class) : null;
  if (classImage) {
    headerProps.blur = 10;
    headerProps.withBlur = true;
    headerProps.image = classImage;
    headerProps.backgroundPosition = 'center';
  } else {
    headerProps.withBlur = false;
    headerProps.withGradient = true;
    headerProps.color = store.class?.color;
  }

  const mainTeacher = store.class
    ? find(store.class.teachers, { type: 'main-teacher' })?.teacher
    : null;

  const classTabs = React.useCallback(
    ({ Component, key, properties }) => {
      store.tabsProperties[key] = properties;

      if (properties.label === 'academic-portfolio.tabDetail.label' && store.hideStudents) {
        return null;
      }

      return (
        <TabPanel
          key={key}
          label={store.widgetLabels ? store.widgetLabels[properties.label] || '-' : '-'}
          className={styles.widgetTab}
        >
          <Component {...properties} classe={store.class} session={session} />
        </TabPanel>
      );
    },
    [
      store.widgetLabels,
      store.class,
      session,
      headerRef?.current?.clientHeight,
      tabsRef?.current?.clientHeight,
    ]
  );

  const classHeader = React.useCallback(
    ({ Component, key, properties }) => (
      <Component {...properties} key={key} classe={store.class} session={session} />
    ),
    [store.class, session]
  );

  function onVirtualClassroomOpen() {
    const addLogStatement = getShare('xapi', 'addLogStatement');
    const verbs = getShare('xapi', 'verbs');
    if (addLogStatement) {
      addLogStatement({
        verb: verbs.INITIALIZED,
        object: {
          objectType: 'Activity',
          id: '{hostname}/api/open/virtual-classroom',
          definition: {
            extensions: {
              id: store.class.id,
              name: store.class.subject.name,
              url: store.class.virtualUrl,
            },
            description: {
              'en-US': 'Open virtual classroom',
            },
          },
        },
      });
    }
  }

  return (
    <>
      {store.loading ? <LoadingOverlay visible /> : null}
      <TotalLayoutContainer
        Header={
          <Box className={styles.classBar}>
            <ClassroomHeaderBar
              labels={{
                chat: t('chat'),
                schedule: t('schedule'),
                virtualClassroom: t('virtualClassroom'),
              }}
              onVirtualClassroomOpen={onVirtualClassroomOpen}
              classRoom={{
                schedule: store.class?.schedule,
                address: store.class?.address,
                virtual_classroom: store.class?.virtualUrl,
                teacher: mainTeacher?.user,
              }}
              showChat={isChatEnabled}
              onChat={() => {
                openRoom(`academic-portfolio.room.class.${store.idLoaded}`);
              }}
              locale={locale}
              leftSide={
                <Box>
                  <HeaderDropdown value={store.class} data={classesData} onChange={changeClass} />
                </Box>
              }
              rightSide={
                <>
                  {!store.loading ? (
                    <ZoneWidgets zone="dashboard.class.header-bar">{classHeader}</ZoneWidgets>
                  ) : null}
                </>
              }
            />
          </Box>
        }
      >
        {!store.loading ? (
          <Box className={styles.widgets}>
            <ZoneWidgets
              zone="dashboard.class.tabs"
              onGetZone={onGetZone}
              container={
                <Tabs
                  fullHeight
                  onChange={(key) => {
                    store.hideRightSide = !!store.tabsProperties?.[key]?.hideRightSide;
                    render();
                  }}
                />
              }
            >
              {classTabs}
            </ZoneWidgets>
          </Box>
        ) : null}
      </TotalLayoutContainer>
    </>
  );
}

ClassDashboard.propTypes = {
  session: PropTypes.object,
};

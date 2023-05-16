/* eslint-disable no-nested-ternary */
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { getClassImage } from '@academic-portfolio/helpers/getClassImage';
import { useIsStudent } from '@academic-portfolio/hooks';
import { classDetailForDashboardRequest } from '@academic-portfolio/request';
import { Box, createStyles, LoadingOverlay, TabPanel, Tabs } from '@bubbles-ui/components';
import { ClassroomHeaderBar, HeaderBackground, HeaderDropdown } from '@bubbles-ui/leemons';
import { getShare, useLocale, useStore } from '@common';
import prefixPN from '@dashboard/helpers/prefixPN';
import { LayoutContext } from '@layout/context/layout';
import { getLocalizations } from '@multilanguage/useTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ZoneWidgets } from '@widgets';
import { find, isArray, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const rightZoneWidth = '320px';

const Styles = createStyles((theme, { hideRightSide, hideStudents, haveScrollBar }) => ({
  leftSide: {
    width: hideRightSide || hideStudents ? '100%' : `calc(100% - ${rightZoneWidth})`,
    transition: '300ms',
  },
  rightSide: {
    width: rightZoneWidth,
    height: '100vh',
    position: 'fixed',
    right: hideRightSide || hideStudents ? `-${rightZoneWidth}` : haveScrollBar ? '14px' : 0,
    top: 0,
    backgroundColor: theme.colors.uiBackground02,
    padding: theme.spacing[4],
    transition: '300ms',
    zIndex: 3,
  },
  rightSidewidgetsContainer: {
    paddingTop: theme.spacing[4],
  },
  header: {
    position: 'relative',
    height: 224 - 56,
  },
  dropdown: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    zIndex: 5,
    alignItems: 'center',
    width: 'fit-content',
    maxWidth: 700,
    marginLeft: 30,
  },
  classBar: {},
  image: {
    position: 'relative',
    backgroundColor: theme.colors.uiBackground02,
    borderRadius: '50%',
    height: '80px',
    width: '80px',
  },
  imageColorIcon: {
    position: 'absolute',
    top: '50%',
    right: '0px',
    transform: 'translate(50%, -50%)',
    backgroundColor: theme.colors.uiBackground02,
    height: '32px',
    width: '32px',
    borderRadius: '50%',
  },
  imageIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    color: theme.colors.text07,
  },
  headerName: {
    marginLeft: theme.spacing[5],
    width: '300px',
  },
}));

export default function ClassDashboard({ session }) {
  const { layoutState } = useContext(LayoutContext);

  const locale = useLocale();
  const [store, render] = useStore({
    loading: true,
    tabNames: {},
    tabsProperties: {},
    hideRightSide: false,
    haveScrollBar: false,
  });

  const { classes: styles } = Styles({
    hideRightSide: store.hideRightSide,
    haveScrollBar: store.haveScrollBar,
    hideStudents: store.hideStudents,
  });
  const [t] = useTranslateLoader(prefixPN('classDashboard'));
  const { id } = useParams();
  const isStudent = useIsStudent();
  const history = useHistory();

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
    const { classe, programClasses } = await classDetailForDashboardRequest(id);

    store.hideStudents = false;
    if (isStudent && classe.hideStudentsToStudents) {
      store.hideStudents = true;
    }
    store.class = classe;
    store.programClasses = programClasses;
    store.classesSelect = map(store.programClasses, (programClass) => {
      const courseMultiple = isArray(programClass.courses);
      const group = programClass.groups.isAlone
        ? null
        : programClass.groups
        ? programClass.groups.abbreviation
        : null;
      return {
        id: programClass.id,
        color: programClass.color,
        image: getClassImage(programClass),
        icon: getClassIcon(programClass),
        label: programClass.subject.name,
        description: `${
          programClass.courses
            ? courseMultiple
              ? `${t('multipleCourses')} - ${programClass.subject.internalId}`
              : `${programClass.courses?.index}${programClass.subject.internalId}`
            : ''
        } ${group ? `- ${group}` : ''}`,
      };
    });

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

  async function onGetRightZone(zone) {
    store.rightZone = zone;
    if (zone.widgetItems && zone.widgetItems.length) {
      const { items } = await getLocalizations({ keys: map(zone.widgetItems, 'properties.label') });
      store.selectedRightTab = zone.widgetItems[0].id;
      store.rightWidgetSelect = map(zone.widgetItems, (item) => ({
        value: item.id,
        label: items[item.properties.label],
        icon: <></>,
      }));
      render();
    }
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
    ? find(store.class.teachers, { type: 'main-teacher' }).teacher
    : null;

  const classTabs = React.useCallback(
    ({ Component, key, properties }) => {
      store.tabsProperties[key] = properties;

      if (properties.label === 'plugins.academic-portfolio.tabDetail.label' && store.hideStudents) {
        return null;
      }

      return (
        <TabPanel
          label={store.widgetLabels ? store.widgetLabels[properties.label] || '-' : '-'}
          key={key}
        >
          <Component {...properties} classe={store.class} session={session} />
        </TabPanel>
      );
    },
    [store.widgetLabels, store.class, session]
  );

  const classHeader = React.useCallback(
    ({ Component, key, properties }) => (
      <Component {...properties} key={key} classe={store.class} session={session} />
    ),
    [store.selectedRightTab, store.class, session]
  );

  const classRightTabs = React.useCallback(
    ({ Component, key, properties }) =>
      store.selectedRightTab === key ? (
        <Component
          {...properties}
          widgetsLength={store.rightZone.widgetItems.length}
          key={key}
          classe={store.class}
          session={session}
        />
      ) : null,
    [store.selectedRightTab, store.class, session]
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
      <Box className={styles.leftSide}>
        <Box className={styles.header}>
          <HeaderBackground {...headerProps} withGradient styles={{ position: 'absolute' }} />
          <Box className={styles.dropdown}>
            <HeaderDropdown value={store.class} data={store.classesSelect} onChange={changeClass} />
          </Box>
        </Box>
        <Box className={styles.classBar}>
          <ClassroomHeaderBar
            labels={{ virtualClassroom: t('virtualClassroom') }}
            onVirtualClassroomOpen={onVirtualClassroomOpen}
            classRoom={{
              schedule: store.class?.schedule,
              address: store.class?.address,
              virtual_classroom: store.class?.virtualUrl,
              teacher: mainTeacher?.user,
            }}
            locale={locale}
            rightSide={
              <>
                {!store.loading ? (
                  <ZoneWidgets zone="plugins.dashboard.class.header-bar">{classHeader}</ZoneWidgets>
                ) : null}
              </>
            }
          />
        </Box>

        {/*
        <Stack alignItems="center" className={styles.header}>
          <Box
            className={styles.image}
            style={store.class.image ? { backgroundImage: `url("${store.class.image}")` } : {}}
          >
            {store.class.color || store.class.icon ? (
              <Box
                style={store.class.color ? { backgroundColor: store.class.color } : {}}
                className={styles.imageColorIcon}
              >
                {store.class.icon ? (
                  <Box className={styles.imageIcon}>
                    <ImageLoader src={store.class.icon} strokeCurrent fillCurrent />
                  </Box>
                ) : null}
              </Box>
            ) : null}
          </Box>
          <Box className={styles.headerName}>
            <Select data={store.classesSelect} value={store.class.id} onChange={changeClass} />
          </Box>
        </Stack>
        */}
        {!store.loading ? (
          <ZoneWidgets
            zone="plugins.dashboard.class.tabs"
            onGetZone={onGetZone}
            container={
              <Tabs
                onChange={(key) => {
                  store.hideRightSide = !!store.tabsProperties?.[key]?.hideRightSide;
                  render();
                }}
                style={{ width: '100%' }}
              />
            }
          >
            {classTabs}
          </ZoneWidgets>
        ) : null}
      </Box>
      {!store.hideStudents ? (
        <Box className={styles.rightSide}>
          {store.rightWidgetSelect ? (
            store.rightWidgetSelect.length > 1 ? (
              <Tabs
                onChange={(e) => {
                  store.selectedRightTab = store.rightWidgetSelect[e].value;
                  render();
                }}
              >
                {store.rightWidgetSelect.map(({ label, id: tabId }) => (
                  <TabPanel label={label} id={tabId} key={tabId} />
                ))}
              </Tabs>
            ) : null
          ) : null}
          {/* {store.rightWidgetSelect ? (
          <RadioGroup
            variant="icon"
            data={store.rightWidgetSelect || []}
            fullWidth
            onChange={(e) => {
              store.selectedRightTab = e;
              render();
            }}
            value={store.selectedRightTab}
          />
        ) : null} */}
          <Box className={styles.rightSidewidgetsContainer}>
            {!store.loading ? (
              <ZoneWidgets zone="plugins.dashboard.class.right-tabs" onGetZone={onGetRightZone}>
                {classRightTabs}
              </ZoneWidgets>
            ) : null}
          </Box>
        </Box>
      ) : null}
    </>
  );
}

ClassDashboard.propTypes = {
  session: PropTypes.object,
};

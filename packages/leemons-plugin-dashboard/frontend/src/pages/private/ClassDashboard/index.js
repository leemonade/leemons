/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { find, isArray, map } from 'lodash';
import { useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@dashboard/helpers/prefixPN';
import { Box, createStyles, RadioGroup, TabPanel, Tabs } from '@bubbles-ui/components';
import { ClassroomHeaderBar, HeaderBackground, HeaderDropdown } from '@bubbles-ui/leemons';
import { useHistory, useParams } from 'react-router-dom';
import { classDetailForDashboardRequest } from '@academic-portfolio/request';
import { ZoneWidgets } from '@widgets';
import { getLocalizations } from '@multilanguage/useTranslate';
import { getClassImage } from '@academic-portfolio/helpers/getClassImage';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';

const rightZoneWidth = '320px';

const Styles = createStyles((theme) => ({
  leftSide: {
    width: `calc(100% - ${rightZoneWidth})`,
  },
  rightSide: {
    width: rightZoneWidth,
    height: '100vh',
    position: 'fixed',
    right: 0,
    top: 0,
    backgroundColor: theme.colors.uiBackground02,
    padding: theme.spacing[4],
  },
  rightSidewidgetsContainer: {
    paddingTop: theme.spacing[4],
  },
  header: {
    position: 'relative',
    height: 224,
  },
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
  const [store, render] = useStore({
    loading: true,
    tabNames: {},
  });
  const { classes: styles } = Styles();
  const [t] = useTranslateLoader(prefixPN('classDashboard'));
  const { id } = useParams();
  const history = useHistory();

  async function init() {
    const { classe, programClasses } = await classDetailForDashboardRequest(id);

    store.class = classe;
    store.programClasses = programClasses;
    store.classesSelect = map(store.programClasses, (programClass) => {
      const courseMultiple = isArray(programClass.courses);
      const group = programClass.groups ? programClass.groups.abbreviation : null;
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
    init();
  }, [id]);

  if (store.loading) return null;

  const classImage = getClassImage(store.class);
  const headerProps = {};
  if (classImage) {
    headerProps.blur = 10;
    headerProps.withBlur = true;
    headerProps.image = classImage;
    headerProps.backgroundPosition = 'center';
  } else {
    headerProps.withBlur = false;
    headerProps.withGradient = true;
    headerProps.color = store.class.color;
  }

  const mainTeacher = find(store.class.teachers, { type: 'main-teacher' }).teacher;

  return (
    <>
      <Box className={styles.leftSide}>
        <Box className={styles.header}>
          <HeaderBackground {...headerProps} styles={{ position: 'absolute' }} />
          <Box style={{ position: 'absolute', bottom: 0, left: 0, right: '50%', zIndex: 5 }}>
            <HeaderDropdown value={store.class} data={store.classesSelect} onChange={changeClass} />
            <ClassroomHeaderBar
              labels={{ virtualClassroom: t('virtualClassroom') }}
              classRoom={{
                schedule: store.class.schedule,
                address: store.class.address,
                virtual_classroom: store.class.virtualUrl,
                teacher: mainTeacher?.user,
              }}
            />
          </Box>
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

        <ZoneWidgets zone="plugins.dashboard.class.tabs" onGetZone={onGetZone} container={<Tabs />}>
          {({ Component, key, properties }) => (
            <TabPanel
              label={store.widgetLabels ? store.widgetLabels[properties.label] || '-' : '-'}
              key={key}
            >
              <Component {...properties} classe={store.class} session={session} />
            </TabPanel>
          )}
        </ZoneWidgets>
      </Box>
      <Box className={styles.rightSide}>
        {store.rightWidgetSelect ? (
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
        ) : null}

        <Box className={styles.rightSidewidgetsContainer}>
          <ZoneWidgets zone="plugins.dashboard.class.right-tabs" onGetZone={onGetRightZone}>
            {({ Component, key, properties }) =>
              store.selectedRightTab === key ? (
                <Component {...properties} key={key} classe={store.class} session={session} />
              ) : null
            }
          </ZoneWidgets>
        </Box>
      </Box>
    </>
  );
}

ClassDashboard.propTypes = {
  session: PropTypes.object,
};

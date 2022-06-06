/* eslint-disable no-nested-ternary */
import React from 'react';
import { cloneDeep, forEach, map, times } from 'lodash';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  ActivityAnswersBar,
  Badge,
  Box,
  ContextContainer,
  createStyles,
  ImageLoader,
  PageContainer,
  Paper,
  Stack,
  Text,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@dashboard/helpers/prefixPN';
import { AnalyticsGraphBarIcon } from '@bubbles-ui/icons/solid';
import { getLocalizations } from '@multilanguage/useTranslate';
import { getAdminDashboardRequest } from '../../../../request';

const rightZoneWidth = '320px';
const Styles = createStyles((theme) => ({
  rightZone: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.colors.uiBackground02,
    width: rightZoneWidth,
  },
  title: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
  },
}));

function Icon({ className, src }) {
  return (
    <Box
      style={{
        position: 'relative',
        width: '23px',
        height: '23px',
      }}
    >
      <ImageLoader className={className} src={src} />
    </Box>
  );
}

Icon.propTypes = {
  src: PropTypes.string,
};

export default function AdminDashboard({ session }) {
  const [store, render] = useStore({
    loading: true,
    isAcademicMode: false,
  });
  const { classes: styles } = Styles();
  const [t, tl] = useTranslateLoader(prefixPN('adminDashboard'));

  async function init() {
    const {
      data: { academicPortfolio, instances },
    } = await getAdminDashboardRequest();

    console.log(instances);

    const { items: instancesTranslations } = await getLocalizations({
      keys: map(instances, 'roleName'),
    });

    console.log(instancesTranslations);

    const base = {
      data: [],
      selectables: [
        {
          value: 'number',
          label: 'number',
        },
      ],
      labels: {},
    };

    store.instances = cloneDeep(base);
    store.activeUsers = cloneDeep(base);

    forEach(instances, (instance, i) => {
      times(instance.instances, (z) => {
        store.instances.data.push({
          id: `${i}-${z}`,
          status: null,
          number: instancesTranslations[instance.roleName],
        });
      });
    });

    times(academicPortfolio.totalStudents, (i) => {
      store.activeUsers.data.push({
        id: `s-${i}`,
        status: null,
        number: t('students'),
      });
    });

    times(academicPortfolio.totalTeachers, (i) => {
      store.activeUsers.data.push({
        id: `t-${i}`,
        status: null,
        number: t('teachers'),
      });
    });

    store.loading = false;
    render();
  }

  React.useEffect(() => {
    if (tl) init();
  }, [tl]);

  if (store.loading) return null;

  return (
    <ContextContainer
      fullHeight
      fullWidth
      sx={(theme) => ({
        paddingRight: rightZoneWidth,
        backgroundColor: theme.colors.uiBackground02,
        paddingBottom: theme.spacing[12],
        overflow: 'auto',
      })}
    >
      <PageContainer
        sx={(theme) => ({
          paddingTop: theme.spacing[8],
          maxWidth: '100%',
        })}
      >
        <Box sx={(theme) => ({ marginBottom: theme.spacing[6] })}>
          <AnalyticsGraphBarIcon />
          <Text size="lg" color="primary" className={styles.title}>
            {t('activityInPlatform')}
          </Text>
        </Box>
        <Stack fullWidth>
          <Box>
            <ActivityAccordion>
              <ActivityAccordionPanel
                key={0}
                label={t('activeUsers')}
                icon={
                  <Icon className="fill-current" src={'/public/assets/svgs/user-male-female.svg'} />
                }
                rightSection={
                  <Box>
                    <Badge
                      label={`${t('total')} ${store.activeUsers?.data.length}`}
                      size="md"
                      color="stroke"
                      closable={false}
                    />
                  </Box>
                }
                color="solid"
              >
                <Box p={20}>
                  <ActivityAnswersBar
                    withSelect={false}
                    withLegend={false}
                    {...store.activeUsers}
                  />
                </Box>
              </ActivityAccordionPanel>
              <ActivityAccordionPanel
                key={0}
                label={t('createdTasks')}
                icon={<Icon className="stroke-current" src={'/public/assets/svgs/tasks.svg'} />}
                rightSection={
                  <Box>
                    <Badge
                      label={`${t('total')} ${store.instances?.data.length}`}
                      size="md"
                      color="stroke"
                      closable={false}
                    />
                  </Box>
                }
                color="solid"
              >
                <Box p={20}>
                  <ActivityAnswersBar withSelect={false} withLegend={false} {...store.instances} />
                </Box>
              </ActivityAccordionPanel>
            </ActivityAccordion>
          </Box>
        </Stack>
      </PageContainer>
      {/* -- RIGHT ZONE -- */}
      <Paper className={styles.rightZone}>Pepe</Paper>
    </ContextContainer>
  );
}

AdminDashboard.propTypes = {
  session: PropTypes.object,
};

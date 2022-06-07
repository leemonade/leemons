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
import { getAdminDashboardRealtimeRequest, getAdminDashboardRequest } from '../../../../request';

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}

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

function PCValue({ text, value }) {
  return (
    <Stack
      fullWidth
      justifyContent="space-between"
      sx={(theme) => ({ paddingTop: theme.spacing[1] })}
    >
      <Text strong color="primary" role="productive">
        {text}
      </Text>
      <Text color="secondary" role="productive">
        {value}
      </Text>
    </Stack>
  );
}

PCValue.propTypes = { text: PropTypes.string, value: PropTypes.any };

function Icon({ size = '23px', className, src }) {
  return (
    <Box
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      <ImageLoader className={className} src={src} />
    </Box>
  );
}

Icon.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
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
      data: { academicPortfolio, instances, pc },
    } = await getAdminDashboardRequest();

    const { items: instancesTranslations } = await getLocalizations({
      keys: map(instances, 'roleName'),
    });

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

    store.pc = pc;
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

  async function realtime() {
    const { data } = await getAdminDashboardRealtimeRequest();
    if (store.pc) {
      store.pc.currentLoad = data.currentLoad;
      store.pc.mem = data.mem;
      store.pc.networkInterface = data.networkInterface;
      render();
    }
  }

  React.useEffect(() => {
    if (tl) init();
  }, [tl]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      realtime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (store.loading) return null;

  let ram = null;
  let ramUsed = null;
  let diskUsed = null;
  forEach(store.pc?.memLayout, (r) => {
    if (!ram || r.clockSpeed < ram.clockSpeed) {
      ram = r;
    }
  });

  forEach(store.pc?.fsSize, (fs) => {
    diskUsed += fs.used;
  });

  if (store.pc.mem.total && store.pc.mem.available) {
    ramUsed = store.pc.mem.total - store.pc.mem.available;
    ramUsed = (ramUsed / store.pc.mem.total) * 100;
  }

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
      <Paper className={styles.rightZone}>
        {/* --- SYSTEM --- */}
        {/* --- CPU --- */}
        <Stack>
          <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
            <Icon size="18px" src={'/public/assets/svgs/cpu.svg'} />
          </Box>
          <Box sx={() => ({ width: '100%' })}>
            <Box>
              <Text color="primary" strong>
                {t('cpu')}
              </Text>
            </Box>
            <Box>
              <PCValue
                text={t('name')}
                value={`${store.pc.cpu.brand} (${store.pc.cpu.manufacturer})`}
              />
            </Box>
            {store.pc.cpu.cores ? <PCValue text={t('cores')} value={store.pc.cpu.cores} /> : null}
            {store.pc.cpu.speedMin ? (
              <PCValue text={t('feqMin')} value={`${store.pc.cpu.speedMin}GHz`} />
            ) : null}
            {store.pc.cpu.speedMax ? (
              <PCValue text={t('feqMax')} value={`${store.pc.cpu.speedMax}GHz`} />
            ) : null}
            {store.pc.cpu.cores ? (
              <PCValue text={t('load')} value={`${store.pc.currentLoad.currentLoad.toFixed(2)}%`} />
            ) : null}
          </Box>
        </Stack>
        {/* --- RAM --- */}
        <Stack sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
            <Icon size="18px" src={'/public/assets/svgs/ram.svg'} />
          </Box>
          <Box sx={() => ({ width: '100%' })}>
            <Box>
              <Text color="primary" strong>
                {t('ram')}
              </Text>
            </Box>
            {ram && ram.clockSpeed ? <PCValue text={t('type')} value={ram.type} /> : null}
            {ram && ram.clockSpeed ? (
              <PCValue text={t('clockSpeed')} value={`${ram.clockSpeed}MHz`} />
            ) : null}
            {store.pc.mem.total ? (
              <PCValue text={t('total')} value={bytesToSize(store.pc.mem.total)} />
            ) : null}
            {store.pc.mem.available ? (
              <PCValue text={t('available')} value={bytesToSize(store.pc.mem.available)} />
            ) : null}
            {ramUsed ? <PCValue text={t('used')} value={`${ramUsed.toFixed(2)}%`} /> : null}
          </Box>
        </Stack>

        {/* --- DISCO --- */}
        {store.pc.diskLayout
          ? store.pc.diskLayout.map((disk, i) => (
              <Stack key={i} sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
                  <Icon size="18px" src={'/public/assets/svgs/disk.svg'} />
                </Box>
                <Box sx={() => ({ width: '100%' })}>
                  <Box>
                    <Text color="primary" strong>
                      {t('disk')} {store.pc.diskLayout.length > 1 ? i : ''}
                    </Text>
                  </Box>
                  {disk.name ? <PCValue text={t('name')} value={disk.name} /> : null}
                  {disk.type ? <PCValue text={t('type')} value={disk.type} /> : null}
                  {disk.size ? <PCValue text={t('space')} value={bytesToSize(disk.size)} /> : null}
                  {store.pc.fsSize ? (
                    <PCValue
                      text={t('used')}
                      value={`${((diskUsed / disk.size) * 100).toFixed(2)}%`}
                    />
                  ) : null}
                </Box>
              </Stack>
            ))
          : null}

        {/* --- INTERNET --- */}
        <Stack sx={(theme) => ({ marginTop: theme.spacing[4] })}>
          <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
            <Icon size="18px" src={'/public/assets/svgs/internet-speed.svg'} />
          </Box>
          <Box sx={() => ({ width: '100%' })}>
            <Box>
              <Text color="primary" strong>
                {t('network')}
              </Text>
            </Box>
            {store.pc.networkInterface ? (
              <PCValue text={t('type')} value={store.pc.networkInterface.type} />
            ) : null}
            {store.pc.networkInterface ? (
              <PCValue text={t('speed')} value={`${store.pc.networkInterface.speed}Mb/s`} />
            ) : null}
          </Box>
        </Stack>
      </Paper>
    </ContextContainer>
  );
}

AdminDashboard.propTypes = {
  session: PropTypes.object,
};

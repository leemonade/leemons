import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { cloneDeep, forEach, map, times } from 'lodash';
import {
  Box,
  Text,
  Badge,
  Paper,
  Stack,
  Title,
  createStyles,
  PageContainer,
  ContextContainer,
  ActivityAccordion,
  ActivityAnswersBar,
  ActivityAccordionPanel,
} from '@bubbles-ui/components';
import { Swiper } from '@bubbles-ui/extras';
import { SchoolTeacherMaleIcon, SingleActionsGraduateIcon } from '@bubbles-ui/icons/outline';
import { AnalyticsGraphBarIcon } from '@bubbles-ui/icons/solid';
import { LibraryCardBasic } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import prefixPN from '@dashboard/helpers/prefixPN';
import { getLocalizations } from '@multilanguage/useTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components';
import { getAdminDashboardRealtimeRequest, getAdminDashboardRequest } from '@dashboard/request';
import { bytesToSize } from '@dashboard/helpers';
import { SkeletonDashboardLoader } from './SkeletonDashboardLoader';
import { Icon } from './Icon';
import { PcValue } from './PcValue';

const RIGHT_ZONE_WIDTH = '320px';
const useStyles = createStyles((theme) => ({
  rightZone: {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.colors.uiBackground02,
    width: RIGHT_ZONE_WIDTH,
  },
  title: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
  },
}));

function Dashboard({ session }) {
  const [store, render] = useStore({
    loading: true,
    isAcademicMode: false,
  });
  const history = useHistory();
  const { classes: styles } = useStyles({}, { name: 'AdminDashboard' });
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
    store.loadingRealtime = true;
    const { data } = await getAdminDashboardRealtimeRequest();
    store.loadingRealtime = false;
    if (store.pc) {
      store.pc.currentLoad = data.currentLoad;
      store.pc.mem = data.mem;
      store.pc.networkInterface = data.networkInterface;
      render();
    }
  }

  async function handleOnSelectCenter(center) {
    store.center = center;
    store.loadingCenter = true;
    render();
    try {
      const {
        data: { academicPortfolio },
      } = await getAdminDashboardRequest({ center });
      store.academicPortfolio = academicPortfolio;
    } catch (e) {
      // Nothing
    }
    store.loadingCenter = false;
    render();
  }

  React.useEffect(() => {
    if (tl) init();
  }, [tl]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!store.loadingRealtime) realtime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  if (!store.loading && store.pc.mem.total && store.pc.mem.available) {
    ramUsed = store.pc.mem.total - store.pc.mem.available;
    ramUsed = (ramUsed / store.pc.mem.total) * 100;
  }

  function goProgram(program) {
    history.push(`/private/academic-portfolio/tree?center=${store.center}&program=${program.id}`);
  }

  return (
    <ContextContainer
      fullHeight
      fullWidth
      sx={(theme) => ({
        paddingRight: RIGHT_ZONE_WIDTH,
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
          {store.loading ? (
            <SkeletonDashboardLoader height="40">
              <rect x="0" y="0" width="420" height="40" rx="3" />
            </SkeletonDashboardLoader>
          ) : (
            <Text size="lg" color="primary" className={styles.title}>
              {t('programs')}
            </Text>
          )}
        </Box>
        <Box>
          {store.loading ? (
            <SkeletonDashboardLoader height="350">
              <rect x="0" y="0" width="350" height="350" rx="3" />
              <rect x="366" y="0" width="350" height="350" rx="3" />
              <rect x="732" y="0" width="350" height="350" rx="3" />
            </SkeletonDashboardLoader>
          ) : (
            <>
              <Box sx={(theme) => ({ marginBottom: theme.spacing[2], maxWidth: 300 })}>
                <SelectCenter
                  label={t('selectCenter')}
                  onChange={handleOnSelectCenter}
                  firstSelected
                />
              </Box>
              {store.loadingCenter ? (
                <SkeletonDashboardLoader height="350">
                  <rect x="0" y="0" width="350" height="350" rx="3" />
                  <rect x="366" y="0" width="350" height="350" rx="3" />
                  <rect x="732" y="0" width="350" height="350" rx="3" />
                </SkeletonDashboardLoader>
              ) : null}
              {!store.loadingCenter && store.academicPortfolio?.programs.length ? (
                <Swiper
                  className={styles.cardContainer}
                  breakAt={{
                    1800: { slidesPerView: 4, spaceBetween: 2 },
                    1600: { slidesPerView: 3, spaceBetween: 2 },
                    1200: { slidesPerView: 3, spaceBetween: 2 },
                    940: { slidesPerView: 2, spaceBetween: 2 },
                    520: { slidesPerView: 1, spaceBetween: 2 },
                    360: { slidesPerView: 1, spaceBetween: 2 },
                  }}
                >
                  {store.academicPortfolio?.programs.map((program) => (
                    <LibraryCardBasic
                      key={program.program.id}
                      blur={20}
                      onClick={() => goProgram(program.program)}
                      style={{ cursor: 'pointer' }}
                      asset={{
                        name: program.program.name,
                        color: program.program.color,
                        cover: program.program.imageUrl,
                      }}
                    >
                      <Box
                        style={{
                          display: 'flex',
                          height: '100%',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: 12,
                        }}
                      >
                        <Box
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                          }}
                        >
                          {/* <Box style={{ display: 'flex', gap: 4, alignItems: 'center', padding: 2 }}>
                          <FamilyChildIcon width={16} height={16} />
                          <Text role="productive" color="primary">
                            Familias:
                          </Text>
                          <Text role="productive" color="primary" strong>
                            320
                          </Text>
                        </Box>  */}
                          <Box
                            style={{ display: 'flex', gap: 4, alignItems: 'center', padding: 2 }}
                          >
                            <SingleActionsGraduateIcon width={16} height={16} />
                            <Text role="productive" color="primary">
                              {t('students')}:
                            </Text>
                            <Text role="productive" color="primary" strong>
                              {program.students}
                            </Text>
                          </Box>
                          <Box
                            style={{ display: 'flex', gap: 4, alignItems: 'center', padding: 2 }}
                          >
                            <SchoolTeacherMaleIcon width={16} height={16} />
                            <Text role="productive" color="primary">
                              {t('teachers')}:
                            </Text>
                            <Text role="productive" color="primary" strong>
                              {program.teachers}
                            </Text>
                          </Box>
                        </Box>
                        <Box style={{ display: 'flex' }}>
                          <Box style={{ flex: 1 }}>
                            <Title order={3}>{program.courses}</Title>
                            <Text role="productive" color="primary">
                              {t('courses')}
                            </Text>
                          </Box>
                          <Box style={{ flex: 1 }}>
                            <Title order={3}>{program.subjects}</Title>
                            <Text role="productive" color="primary">
                              {t('subjects')}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </LibraryCardBasic>
                  ))}
                </Swiper>
              ) : null}
            </>
          )}
        </Box>

        <Box sx={(theme) => ({ marginTop: theme.spacing[10], marginBottom: theme.spacing[6] })}>
          {store.loading ? (
            <SkeletonDashboardLoader width="100%" height="40">
              <circle cx="14" cy="14" r="14" />
              <rect x="40" y="2" width="360" height="24" rx="3" />
            </SkeletonDashboardLoader>
          ) : (
            <>
              <AnalyticsGraphBarIcon />
              <Text size="lg" color="primary" className={styles.title}>
                {t('activityInPlatform')}
              </Text>
            </>
          )}
        </Box>
        <Stack direction="column" spacing={3} fullWidth>
          {store.loading ? (
            <SkeletonDashboardLoader height="416">
              <rect x="0" y="0" width="100%" height="200" rx="3" />
              <rect x="0" y="216" width="100%" height="200" rx="3" />
            </SkeletonDashboardLoader>
          ) : (
            <>
              <Box>
                <ActivityAccordion initialItem={0}>
                  <ActivityAccordionPanel
                    key={0}
                    label={t('activeUsers')}
                    icon={
                      <Icon
                        className="fill-current"
                        src={'/public/assets/svgs/user-male-female.svg'}
                      />
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
                </ActivityAccordion>
              </Box>
              <Box>
                <ActivityAccordion initialItem={0}>
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
                      <ActivityAnswersBar
                        withSelect={false}
                        withLegend={false}
                        {...store.instances}
                      />
                    </Box>
                  </ActivityAccordionPanel>
                </ActivityAccordion>
              </Box>
            </>
          )}
        </Stack>
      </PageContainer>
      {/* -- RIGHT ZONE -- */}
      <Paper className={styles.rightZone} padding={store.loading ? 0 : undefined}>
        {/* --- SYSTEM --- */}
        {/* --- CPU --- */}
        {store.loading ? (
          <SkeletonDashboardLoader height="100%">
            <rect x="0" width="100%" height="100%" />
          </SkeletonDashboardLoader>
        ) : (
          <>
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
                  <PcValue
                    text={t('name')}
                    value={`${store.pc.cpu.brand} (${store.pc.cpu.manufacturer})`}
                  />
                </Box>
                {store.pc.cpu.cores ? (
                  <PcValue text={t('cores')} value={store.pc.cpu.cores} />
                ) : null}
                {store.pc.cpu.speed ? (
                  <PcValue text={t('feq')} value={`${store.pc.cpu.speed}GHz`} />
                ) : null}
                {store.pc.cpu.speedMin ? (
                  <PcValue text={t('feqMin')} value={`${store.pc.cpu.speedMin}GHz`} />
                ) : null}
                {store.pc.cpu.speedMax ? (
                  <PcValue text={t('feqMax')} value={`${store.pc.cpu.speedMax}GHz`} />
                ) : null}
                {store.pc.cpu.cores ? (
                  <PcValue
                    text={t('load')}
                    value={`${store.pc.currentLoad.currentLoad.toFixed(2)}%`}
                  />
                ) : null}
              </Box>
            </Stack>
            {/* --- RAM --- */}
            <Stack sx={(theme) => ({ marginTop: theme.spacing[6] })}>
              <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
                <Icon size="18px" src={'/public/assets/svgs/ram.svg'} />
              </Box>
              <Box sx={() => ({ width: '100%' })}>
                <Box>
                  <Text color="primary" strong>
                    {t('ram')}
                  </Text>
                </Box>
                {ram?.clockSpeed ? <PcValue text={t('type')} value={ram.type} /> : null}
                {ram?.clockSpeed ? (
                  <PcValue text={t('clockSpeed')} value={`${ram.clockSpeed}MHz`} />
                ) : null}
                {store.pc.mem.total ? (
                  <PcValue text={t('total')} value={bytesToSize(store.pc.mem.total)} />
                ) : null}
                {store.pc.mem.available ? (
                  <PcValue text={t('available')} value={bytesToSize(store.pc.mem.available)} />
                ) : null}
                {ramUsed ? <PcValue text={t('used')} value={`${ramUsed.toFixed(2)}%`} /> : null}
              </Box>
            </Stack>

            {/* --- DISCO --- */}
            {store.pc?.diskLayout
              ? store.pc.diskLayout.map((disk, i) => (
                  <Stack key={i} sx={(theme) => ({ marginTop: theme.spacing[6] })}>
                    <Box sx={(theme) => ({ paddingRight: theme.spacing[4] })}>
                      <Icon size="18px" src={'/public/assets/svgs/disk.svg'} />
                    </Box>
                    <Box sx={() => ({ width: '100%' })}>
                      <Box>
                        <Text color="primary" strong>
                          {t('disk')} {store.pc.diskLayout.length > 1 ? i : ''}
                        </Text>
                      </Box>
                      {disk.name ? <PcValue text={t('name')} value={disk.name} /> : null}
                      {disk.type ? <PcValue text={t('type')} value={disk.type} /> : null}
                      {disk.size ? (
                        <PcValue text={t('space')} value={bytesToSize(disk.size)} />
                      ) : null}
                      {store.pc.fsSize ? (
                        <PcValue
                          text={t('used')}
                          value={`${((diskUsed / disk.size) * 100).toFixed(2)}%`}
                        />
                      ) : null}
                    </Box>
                  </Stack>
                ))
              : null}

            {/* --- INTERNET --- */}
            <Stack sx={(theme) => ({ marginTop: theme.spacing[6] })}>
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
                  <PcValue text={t('type')} value={store.pc.networkInterface.type} />
                ) : null}
                {store.pc.networkInterface ? (
                  <PcValue
                    text={t('speed')}
                    value={`${store.pc.networkInterface.speed || 0}Mb/s`}
                  />
                ) : null}
              </Box>
            </Stack>
          </>
        )}
      </Paper>
    </ContextContainer>
  );
}

Dashboard.propTypes = {
  session: PropTypes.object,
};

export { Dashboard };

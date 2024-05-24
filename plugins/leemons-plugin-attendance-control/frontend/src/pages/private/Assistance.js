import Assistances from '@attendance-control/components/AssistancePage/Assistances';
import {
  Box,
  Button,
  createStyles,
  Stack,
  TotalLayoutContainer,
  TotalLayoutFooterContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import React from 'react';
import { TestIcon } from '@tests/components/Icons/TestIcon';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@attendance-control/helpers/prefixPN';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { onScoresDownload } from '@scores/components/__DEPRECATED__/Notebook/components/Header/Header';
import Filters from '@scores/components/__DEPRECATED__/ScoresPage/Filters/Filters';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
    height: '100%',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
  },
  headerFilters: {
    paddingLeft: theme.spacing[5],
  },
}));

export default function AssistancePage() {
  const scrollRef = React.useRef();
  const [t] = useTranslateLoader(prefixPN('assistancePage'));

  const { classes } = useStyles();
  const [filters, setFilters] = React.useState({});

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          scrollRef={scrollRef}
          icon={<TestIcon width={23} height={23} />}
          cancelable={false}
          title={t('header.teacher.title')}
        />
      }
    >
      <Stack justifyContent="center">
        <TotalLayoutStepContainer
          Footer={
            <TotalLayoutFooterContainer
              scrollRef={scrollRef}
              rightZone={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    position="center"
                    leftIcon={<DownloadIcon />}
                    onClick={() => onScoresDownload('xlsx')}
                  >
                    {t('excelFile')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    position="center"
                    leftIcon={<DownloadIcon />}
                    onClick={() => onScoresDownload('csv')}
                  >
                    {t('csvFile')}
                  </Button>
                </>
              }
            />
          }
        >
          <Box className={classes.root}>
            <Box className={classes.headerContainer}>
              <Box className={classes.headerFilters}>
                <Filters onChange={setFilters} showProgramSelect hideTitle />
              </Box>
            </Box>
            <Assistances filters={filters} hideHeader />
          </Box>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}

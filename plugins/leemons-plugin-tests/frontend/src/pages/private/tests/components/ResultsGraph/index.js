import { useState } from 'react';

import { Box, ContextContainer, RadioGroup, Stack, Loader, Title } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import GraphView from './GraphView';
import useResultsGraphStyles from './ResultsGraph.styles';

import prefixPN from '@tests/helpers/prefixPN';

const GRAPH_TYPES = {
  level: 'level',
  category: 'category',
  type: 'type',
};
const DEFAULT_GRAPH_HEIGHT = 374;

const Index = (props) => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('testResult.resultsGraph'));
  const [graphType, setGraphType] = useState(GRAPH_TYPES.level);
  const { classes } = useResultsGraphStyles();

  if (tLoading)
    return (
      <Stack fullWidth sx={{ height: props.graphHeight || DEFAULT_GRAPH_HEIGHT }}>
        <Loader padded />
      </Stack>
    );

  return (
    <ContextContainer className={classes.container}>
      <Box noFlex>
        <Stack className={classes.headerContainer}>
          <Title order={4}>{t('title')}</Title>
          <RadioGroup
            size="sm"
            variant="icon"
            data={[
              { value: GRAPH_TYPES.level, label: t('views.level') },
              { value: GRAPH_TYPES.category, label: t('views.category') },
              { value: GRAPH_TYPES.type, label: t('views.type') },
            ]}
            onChange={setGraphType}
            value={graphType}
          />
        </Stack>
      </Box>
      <Box noFlex>
        <GraphView
          {...props}
          graphType={graphType}
          t={t}
          height={props.graphHeight || DEFAULT_GRAPH_HEIGHT}
        />
      </Box>
    </ContextContainer>
  );
};

Index.propTypes = {
  graphHeight: PropTypes.number,
};

export default Index;
export { GRAPH_TYPES };

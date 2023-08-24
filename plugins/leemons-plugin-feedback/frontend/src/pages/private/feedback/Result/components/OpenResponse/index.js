import React from 'react';
import PropTypes from 'prop-types';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { useStore } from '@common';
import { Box, Pager, Stack, Text } from '@bubbles-ui/components';

const VISIBLE_ELEMENTS = 8;

export default function OpenResponse(props) {
  const { responses } = props;
  const [t] = useTranslateLoader(prefixPN('feedbackResult'));
  const [store, render] = useStore({
    visibleResponses: responses.value?.slice(0, VISIBLE_ELEMENTS) || [],
  });

  const totalPages = Math.ceil(responses.value ? responses.value.length / VISIBLE_ELEMENTS : 0);

  const handlePageChange = (page) => {
    store.visibleResponses =
      responses.value?.slice((page - 1) * VISIBLE_ELEMENTS, VISIBLE_ELEMENTS * page) || [];
    render();
  };

  return (
    <Stack spacing={2} direction="column" fullWidth>
      <Box style={{ padding: 24, paddingBottom: 0 }}>
        <Text role="productive" size="xs" color="primary" stronger>
          {t('responses', { n: responses.totalValues || 0 })}
        </Text>
      </Box>
      <Stack fullWidth direction="column">
        {store.visibleResponses.map((value, index) => (
          <Box
            key={index}
            style={{
              backgroundColor: 'white',
              paddingBlock: 20,
              paddingInline: 24,
              overflowX: 'hidden',
              borderBottom: '1px solid #F2F2F2',
              borderBottomRightRadius:
                totalPages === 1 && index === store.visibleResponses.length - 1 && 8,
              borderBottomLeftRadius:
                totalPages === 1 && index === store.visibleResponses.length - 1 && 8,
            }}
          >
            <Text role="productive" color="primary">
              {value}
            </Text>
          </Box>
        ))}
      </Stack>
      {totalPages > 1 && (
        <Stack justifyContent="center" style={{ marginBottom: 8 }}>
          <Pager onChange={handlePageChange} totalPages={totalPages} />
        </Stack>
      )}
    </Stack>
  );
}

OpenResponse.propTypes = {
  responses: PropTypes.any,
};

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import getFakeImage from '../../helpers/getFakeImage';

export default function Card({ refresh, ...task }) {
  return (
    <>
      <Box style={{ width: 322 }}>
        <LibraryCard
          dashboard={false}
          asset={{
            ...task,
            // TODO: Remove image
            cover: getFakeImage(task?.cover),
            subtitle: task.tagline,
            description: task.summary,
            type: 'task',
          }}
          showImage
          variant="task"
        />
      </Box>
    </>
  );
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
};

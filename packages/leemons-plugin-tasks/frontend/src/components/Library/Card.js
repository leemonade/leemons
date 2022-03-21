import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import { useClickOutside } from '@mantine/hooks';
import ContextMenu from './ContextMenu';

export default function Card({ refresh, ...task }) {
  const [contextMenu, setContextMenu] = React.useState({ opened: false, posX: 0, posY: 0 });
  const ref = useClickOutside(() => setContextMenu({ opened: false }));
  const handleContextMenu = (e) => {
    e.preventDefault();

    setContextMenu({
      opened: true,
      posX: e.clientX,
      posY: e.clientY,
    });
  };

  return (
    <>
      {contextMenu.opened && (
        <ContextMenu
          ref={ref}
          id={task.id}
          posX={contextMenu.posX}
          posY={contextMenu.posY}
          refresh={refresh}
        />
      )}
      <Box onContextMenu={handleContextMenu} style={{ width: 322 }}>
        <LibraryCard
          asset={{ ...task, subtitle: task.tagline, description: task.summary }}
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

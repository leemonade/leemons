import React from 'react';
import PropTypes from 'prop-types';
import { Paper, ImageLoader, Title, Paragraph, Box } from '@bubbles-ui/components';
import { useClickOutside } from '@mantine/hooks';
import ContextMenu from './ContextMenu';

export default function Card({ cover, name, color, tagline, summary, id }) {
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
        <ContextMenu ref={ref} id={id} posX={contextMenu.posX} posY={contextMenu.posY} />
      )}
      <Paper color="solid" shadow="level100" onContextMenu={handleContextMenu}>
        <ImageLoader src={cover || ''} alt={name} />
        <Box style={{ backgroundColor: color }}>
          <Title padding={1}>{name}</Title>
        </Box>
        <Paragraph size="md">{tagline}</Paragraph>
        <Paragraph>{summary}</Paragraph>
      </Paper>
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
};

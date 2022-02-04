import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Stack, Button } from '@bubbles-ui/components';
import { Portal } from '@mantine/core';

const ContextMenu = forwardRef(({ posX, posY, id }, ref) => {
  const history = useHistory();
  const handleClick =
    (url, target = 'self') =>
    () => {
      if (target === 'self') {
        history.push(url);
      }
    };
  return (
    <Portal zIndex={1000}>
      <Stack
        ref={ref}
        sx={() => ({
          position: 'fixed',
          top: posY,
          left: posX,
        })}
        direction="column"
      >
        <Button onClick={handleClick(`private/tasks/library/edit/${id}`)}>Edit</Button>
        <Button onClick={handleClick(`private/tasks/library/edit/${id}`)}>Duplicate</Button>
        <Button>Assign</Button>
        <Button>Delete</Button>
      </Stack>
    </Portal>
  );
});

ContextMenu.displayName = 'ContextMenu';

ContextMenu.propTypes = {
  posX: PropTypes.number.isRequired,
  posY: PropTypes.number.isRequired,
};

export default ContextMenu;

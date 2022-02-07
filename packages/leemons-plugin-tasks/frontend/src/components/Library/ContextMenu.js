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
        <Button onClick={handleClick(`library/edit/${id}`)}>Edit</Button>
        <Button disabled onClick={handleClick(`library/edit/${id}`)}>
          Duplicate
        </Button>
        <Button disabled>Assign</Button>
        <Button disabled>Delete</Button>
      </Stack>
    </Portal>
  );
});

ContextMenu.displayName = 'ContextMenu';

ContextMenu.propTypes = {
  id: PropTypes.string.isRequired,
  posX: PropTypes.number.isRequired,
  posY: PropTypes.number.isRequired,
};

export default ContextMenu;

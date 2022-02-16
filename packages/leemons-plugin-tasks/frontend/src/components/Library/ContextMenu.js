import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Stack, Button } from '@bubbles-ui/components';
import { Portal } from '@mantine/core';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

const ContextMenu = forwardRef(({ posX, posY, id, refresh }, ref) => {
  const [state, setState] = useState({});

  const history = useHistory();
  const handleClick =
    (url, target = 'self', callback) =>
    () => {
      if (target === 'self') {
        history.push(url);
        return typeof callback === 'function' && callback('redirected', url);
      }

      if (target === 'api') {
        const [method, uri] = url.split('://');
        return leemons
          .api(uri, {
            method,
            allAgents: true,
          })
          .then((v) => typeof callback === 'function' && callback(v));
      }

      return null;
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
        <Button onClick={handleClick(`/private/tasks/library/edit/${id}`)}>Edit</Button>
        <Button disabled onClick={handleClick(`/private/tasks/library/edit/${id}`)}>
          Duplicate
        </Button>
        <Button onClick={handleClick(`/private/tasks/library/assign/${id}`)}>Assign</Button>
        <Button
          loading={state.loadingDelete}
          onClick={() => {
            setState((s) => ({ ...s, loadingDelete: true }));
            handleClick(`DELETE://tasks/tasks/${id}`, 'api', () => {
              addSuccessAlert('Task deleted');
              setState((s) => ({ ...s, loadingDelete: false, deleted: true }));
              refresh();
            })();
          }}
        >
          Delete
        </Button>
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

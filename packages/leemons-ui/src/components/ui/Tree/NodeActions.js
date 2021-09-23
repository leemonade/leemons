import React from 'react';
import PropTypes from 'prop-types';
import { TrashIcon, PencilIcon } from '@heroicons/react/solid';
import Button from '../Button';

const defaultActions = {
  edit: {
    icon: PencilIcon,
    handler: 'onEdit',
    render: null,
  },
  delete: {
    icon: TrashIcon,
    handler: 'onDelete',
    render: null,
  },
};

export default function NodeActions({ node, ...props }) {
  if (node.actions) {
    return node.actions.map((_action, i) => {
      if (typeof _action === 'string') {
        _action = {
          name: _action,
        };
      }

      const action = {
        handler: `on${_action.name.charAt(0).toUpperCase()}${_action.name.substr(1)}`,
        ...defaultActions[_action.name],
        ..._action,
      };
      if (typeof action.render === 'function') {
        return action.render(node, action);
      }
      const Icon = action.icon;
      return (
        <Button
          color="secondary"
          circle
          text
          className={`opacity-20 group-hover:opacity-100 btn-xs ml-${i === 0 ? 4 : 1}`}
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            // Call the given handler
            if (typeof action.handler === 'function') {
              action.handler(node, e);
            } else if (typeof action.handler === 'string') {
              const handler = props[action.handler];
              if (typeof handler === 'function') {
                handler(node, e);
              }
            }
          }}
        >
          {Icon && <Icon className="w-4 h-4" />}
        </Button>
      );
    });
  }
  return <></>;
}

NodeActions.propTypes = {
  node: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.oneOf([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          tooltip: PropTypes.string,
          icon: PropTypes.element,
          handler: PropTypes.func,
          render: PropTypes.element,
        }),
      ])
    ),
  }),
};

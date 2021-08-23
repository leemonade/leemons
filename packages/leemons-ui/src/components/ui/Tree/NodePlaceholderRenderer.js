import React from 'react';
import { NodeModel } from '@leemonade/react-dnd-treeview';

export const NodePlaceholderRenderer = ({ node, depth }) => {
  const left = depth * 24;

  // return (
  //   <div>{props.node.text}</div>
  // );

  return (
    <div
      className="absolute top-0 right-0 bg-primary transform z-40"
      style={{ left, height: 1, transform: 'translateY(0px)' }}
    >
      <div
        className="absolute top-0 left-0 rounded-full bg-primary"
        style={{ transform: 'translateY(-1px)', height: 3, width: 3 }}
      />
    </div>
  );
};

import React, { useEffect } from 'react';
import { DragLayerMonitorProps } from '@leemonade/react-dnd-treeview';

export const NodeDragPreview = ({ monitorProps, ...otherProps }) => {
  const item = monitorProps.item;

  return (
    <div className="flex transform -translate-x-4 -translate-y-4">
      <div className="flex items-center h-8 pl-2 pr-4 rounded border border-primary bg-white shadow-sm">
        <div className="py-2 mr-2 text-primary">
          <svg
            width="14"
            height="6"
            viewBox="0 0 14 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.333332 4.33301H13.3333" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0.333332 1.6665H13.3333" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="text-sm text-gray-300">
          <span>{`${item.text}`}</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

export const DatasetItemSeparator = ({ text }) => {
  return (
    <div className="relative py-12">
      <div className="absolute left-0 top-2/4 h-px w-full bg-base-300"></div>
      <span className="text-sm uppercase text-neutral-content font-semibold bg-primary-content relative z-10 pr-6">
        {text}
      </span>
    </div>
  );
};

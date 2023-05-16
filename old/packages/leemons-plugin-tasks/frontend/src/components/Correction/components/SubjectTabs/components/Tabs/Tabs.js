import React from 'react';
import _ from 'lodash';

export default function Tabs({ children, tabToShow, context }) {
  if (_.isNil(tabToShow)) {
    return null;
  }

  const tab = children.find((child) => child.key === tabToShow);

  if (_.isNil(tab)) {
    return null;
  }

  return React.cloneElement(tab, {
    active: true,
    context,
  });
}

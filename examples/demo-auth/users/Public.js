import React, { useState, useEffect } from 'react';

const loadComponent = ({ pluginName, component } = {}) =>
  import(`@leemons/plugins${pluginName}/src/widgets/calendar/${component}.js`);
export default function Public() {
  const [Component, setComponent] = useState(null);
  const [url, setUrl] = useState({ pluginName: '/users_demo', component: 'test/index' });

  useEffect(() => {
    loadComponent(url)
      .then((module) => module.default)
      .then(setComponent);
  }, [url]);
  return (
    <div>
      {Component !== null && Component}
      <p>This is users Public!</p>
    </div>
  );
}

import React, { useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSubjects, useClassesSubjects } from '@academic-portfolio/hooks';
import { Loader } from '@bubbles-ui/components';
import { Tabs, SubjectSelector } from './components';
import tabContext, { TabProvider } from './context/tabsContext';

export default function SubjectTabs({ assignation, instance, children, loading }) {
  const [activeTab, setActiveTab] = useState(null);
  const instanceSubjects = useClassesSubjects(instance?.classes);
  const subjectsIds = useMemo(() => _.map(instanceSubjects, 'id'), [instanceSubjects]);
  const subjects = useSubjects(subjectsIds);

  const tabs = useMemo(() => {
    if (!subjects?.length) {
      return null;
    }

    return subjects.map((subject) =>
      React.cloneElement(children, {
        key: subject.id,
        assignation,
        subject: subject.id,
      })
    );
  }, [subjects, assignation, children]);

  if (!subjects?.length) {
    return <Loader />;
  }

  return (
    <TabProvider>
      <SubjectSelector
        subjects={subjects}
        assignation={assignation}
        currentSubject={activeTab}
        setCurrentSubject={setActiveTab}
      />
      {loading ? (
        <Loader />
      ) : (
        <Tabs tabToShow={activeTab} context={tabContext}>
          {tabs}
        </Tabs>
      )}
    </TabProvider>
  );
}

SubjectTabs.propTypes = {
  assignation: PropTypes.object,
  children: PropTypes.node,
};

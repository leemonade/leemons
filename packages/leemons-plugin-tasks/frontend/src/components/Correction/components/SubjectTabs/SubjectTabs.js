import { useClassesSubjects, useSubjects } from '@academic-portfolio/hooks';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import { Loader } from '@bubbles-ui/components';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { SubjectSelector, Tabs } from './components';
import tabContext, { TabProvider } from './context/tabsContext';

export default function SubjectTabs({ assignation, instance, children, loading, onChange }) {
  const [activeTab, setActiveTab] = useState(null);
  const instanceSubjects = useClassesSubjects(instance?.classes);
  const { data: classes } = useSessionClasses();

  const subjectsIds = useMemo(() => {
    if (!classes?.length) {
      return [];
    }

    return instanceSubjects
      .filter((subject) =>
        classes.find(
          (klass) => klass.subject.subject === subject.id || klass.subject.id === subject.id
        )
      )
      .map((s) => s.id);
  }, [classes, instanceSubjects]);
  const subjects = useSubjects(subjectsIds);

  useEffect(() => {
    if (_.isFunction(onChange)) {
      onChange(activeTab);
    }
  }, [activeTab, onChange]);

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

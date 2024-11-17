import React from 'react';
import PropTypes from 'prop-types';

import { unflatten } from '@common';
import _ from 'lodash';

import { SelectSubject } from '@academic-portfolio/components/SelectSubject';
import { useSessionClasses } from '@academic-portfolio/hooks';
import { getMultiClassData } from '@assignables/helpers/getClassData';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

function useSubjectGroupsLocalizations() {
  const [, translations] = useTranslateLoader(prefixPN('assetListFilters.subjectGroups'));

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return _.get(res, prefixPN('assetListFilters.subjectGroups'));
    }

    return {};
  }, [translations]);
}

function useSubjects({ labels, program }) {
  const localizations = useSubjectGroupsLocalizations();

  const selectedProgram = program ?? 'all';

  const { data: classesData } = useSessionClasses({
    showType: true,
    program: selectedProgram === 'all' ? undefined : selectedProgram,
  });
  const multiClassData = getMultiClassData();

  return React.useMemo(() => {
    if (!classesData?.length) {
      return [];
    }

    const subjects = {};

    classesData.forEach((klass) => {
      if (!subjects[klass.subject.id]) {
        subjects[klass.subject.id] = {
          label: klass.subject.name,
          value: klass.subject.id,
          color: klass.color,
          icon: klass.subject.icon,
          type: klass.type,
        };
      } else if (
        subjects[klass.subject.id].type !== 'main-teacher' &&
        klass.type === 'main-teacher'
      ) {
        subjects[klass.subject.id].type = 'main-teacher';
      }
    });

    return [
      {
        label: labels?.all,
        value: 'all',
        group: labels?.all,
        icon: multiClassData.icon,
        color: multiClassData.color,
      },
      ...Object.values(subjects).map((subject) => ({
        ...subject,
        group:
          subject.type === 'main-teacher'
            ? localizations?.mySubjects
            : localizations?.collaborations,
      })),
    ];
  }, [classesData, selectedProgram, labels?.all, localizations, multiClassData]);
}

function Subject({ labels, value, onChange, program }) {
  const subjects = useSubjects({ labels: { all: labels?.seeAll }, program });

  return (
    <SelectSubject label={labels?.subject} data={subjects} value={value} onChange={onChange} />
  );
}

Subject.propTypes = {
  labels: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  program: PropTypes.string,
};

export default Subject;

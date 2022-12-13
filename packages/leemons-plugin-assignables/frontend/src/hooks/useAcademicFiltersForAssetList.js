import React from 'react';
import { Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useCenterPrograms, useSessionClasses } from '@academic-portfolio/hooks';
import { useUserCenters } from '@users/hooks';
import { getMultiClassData } from '@assignables/helpers/getClassData';
import _ from 'lodash';
import { unflatten } from '@common';
import { getSessionConfig } from '@users/session';
import { SelectSubject } from '@academic-portfolio/components/SelectSubject';

export function useAssignablesAssetListLocalizations() {
  const [, translations] = useTranslateLoader('plugins.assignables.assetListFilters');

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, 'plugins.assignables.assetListFilters');

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);
}

function usePrograms({ labels }) {
  const { data: centers } = useUserCenters();
  const centersIds = React.useMemo(() => centers?.map((center) => center.id) || [], [centers]);
  const programsQueries = useCenterPrograms(centersIds, { enabled: !!centersIds?.length });

  const programsAreLoading = React.useMemo(
    () => programsQueries.every((queryInfo) => queryInfo.isLoading),
    [programsQueries]
  );

  return React.useMemo(
    () =>
      programsAreLoading
        ? []
        : [
            {
              value: 'all',
              label: labels?.allPrograms,
            },
            ...programsQueries?.flatMap((queryInfo) => {
              const centerPrograms = queryInfo.data;
              return centerPrograms.map((program) => ({
                value: program.id,
                label: program.name,
              }));
            }),
          ],
    [programsQueries, labels?.allPrograms]
  );
}

function useSubjects({ labels, control }) {
  const selectedProgram = useWatch({ control, name: 'program' });
  const { data: classesData } = useSessionClasses({ showType: true });
  const multiClassData = getMultiClassData();

  return React.useMemo(() => {
    if (selectedProgram === 'all' || !classesData?.length) {
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
        label: labels?.allSubjects,
        value: 'all',
        group: labels?.allSubjects,
        icon: multiClassData.icon,
        color: multiClassData.color,
      },
      ...Object.values(subjects).map((subject) => ({
        ...subject,
        group:
          subject.type === 'main-teacher'
            ? labels?.subjectGroups?.mySubjects
            : labels?.subjectGroups?.collaborations,
      })),
    ];
  }, [classesData, selectedProgram, labels?.allSubjects, labels?.subjectGroups, multiClassData]);
}

function useOnChange({ onChange, watch, getValues }) {
  const onSubmit = React.useCallback(
    (values) => {
      if (typeof onChange === 'function') {
        onChange({
          program: values.program === 'all' ? null : values.program,
          subjects:
            values.subject && values.subject !== 'all' && values.program !== 'all'
              ? [values.subject]
              : undefined,
        });
      }
    },
    [onChange]
  );

  React.useEffect(() => {
    const subscription = watch(onSubmit);
    onSubmit(getValues());

    return subscription.unsubscribe;
  }, [watch, onSubmit]);
}

function SubjectFilters({ onChange, loading }) {
  const sessionConfig = getSessionConfig();
  const selectedProgram = sessionConfig?.program || 'all';
  const { control, watch, getValues } = useForm({
    defaultValues: {
      program: selectedProgram,
      subject: null,
    },
  });

  useOnChange({ watch, onChange, getValues });
  const labels = useAssignablesAssetListLocalizations();

  const programs = usePrograms({ labels });
  const subjects = useSubjects({ labels, control });

  const inputRootStyle = {
    width: 260,
    minWidth: 260,
  };

  return (
    <>
      <Controller
        control={control}
        name={'program'}
        render={({ field }) => (
          <Select
            {...field}
            placeholder={labels?.program}
            data={programs}
            searchable
            disabled={!!loading}
            style={inputRootStyle}
          />
        )}
      />
      <Controller
        control={control}
        name={'subject'}
        render={({ field }) => (
          <SelectSubject
            {...field}
            data={subjects}
            placeholder={labels?.subject}
            searchable
            disabled={!subjects.length || !!loading}
            style={inputRootStyle}
          />
        )}
      />
    </>
  );
}

export function useAcademicFiltersForAssetList() {
  const [filters, setFilters] = React.useState(undefined);
  const onChange = React.useCallback(setFilters);

  return {
    filterComponents: ({ loading }) => <SubjectFilters onChange={onChange} loading={loading} />,
    filters,
    searchInProvider: !!filters?.program || !!filters?.subjects?.length,
  };
}

export default useAcademicFiltersForAssetList;

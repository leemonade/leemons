import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { SelectSubject, SubjectItem } from '@academic-portfolio/components/SelectSubject';
import { useCenterPrograms, useSessionClasses } from '@academic-portfolio/hooks';
import useUserAgentSubjects from '@academic-portfolio/hooks/queries/useUserAgentSubjects';
import { Select } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useUserCenters } from '@users/hooks';
import useIsAdmin from '@users/hooks/useIsAdmin';
import _ from 'lodash';

import { getMultiClassData } from '@assignables/helpers/getClassData';

export function useAssignablesAssetListLocalizations() {
  const [, translations] = useTranslateLoader('assignables.assetListFilters');

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return _.get(res, 'assignables.assetListFilters');
    }

    return {};
  }, [translations]);
}

function usePrograms({ labels }) {
  const { data: centers } = useUserCenters();
  const centersIds = React.useMemo(() => centers?.map((center) => center.id) || [], [centers]);
  const programsQueries = useCenterPrograms(centersIds, { enabled: !!centersIds?.length });

  const programsAreLoading = React.useMemo(
    () => programsQueries.some((queryInfo) => queryInfo.isLoading),
    [programsQueries]
  );

  return React.useMemo(
    () =>
      programsAreLoading
        ? []
        : [
            {
              value: 'all',
              label: labels?.allPrograms || '',
            },
            ...programsQueries.flatMap((queryInfo) => {
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

export function useSubjects({ labels, control, selectedProgram, useAll = true }) {
  if (!selectedProgram) {
    // eslint-disable-next-line no-param-reassign
    selectedProgram = useWatch({ control, name: 'program' });
  }
  const isAdmin = useIsAdmin();
  const { data: classesData } = useSessionClasses({ showType: true }, { enabled: !isAdmin });
  const { data: userAgentSubjects } = useUserAgentSubjects({
    options: { enabled: isAdmin },
  });
  const data = isAdmin ? userAgentSubjects : classesData;
  const multiClassData = getMultiClassData();

  return React.useMemo(() => {
    if (selectedProgram === 'all' || !data?.length) {
      return [];
    }

    const subjects = {};
    let goodItems = data;
    if (selectedProgram && selectedProgram !== 'all') {
      goodItems = _.filter(goodItems, { program: selectedProgram });
    }

    if (!isAdmin) {
      goodItems.forEach((klass) => {
        if (!subjects[klass.subject.id]) {
          subjects[klass.subject.id] = {
            label: klass.subject.name,
            value: klass.subject.id,
            color: klass.subject.color,
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
    } else {
      goodItems.forEach((subject) => {
        subjects[subject.id] = {
          label: subject.name,
          value: subject.id,
          color: subject.color,
          icon: subject.icon,
        };
      });
    }

    const result = [];

    if (useAll) {
      result.push({
        label: labels?.allSubjects || '',
        value: 'all',
        group: labels?.allSubjects || '',
        icon: multiClassData.icon,
        color: multiClassData.color,
      });
    }

    return [
      ...result,
      ...Object.values(subjects).map((subject) => ({
        ...subject,
        group:
          subject.type === 'main-teacher'
            ? labels?.subjectGroups?.mySubjects
            : labels?.subjectGroups?.collaborations,
      })),
    ];
  }, [
    data,
    selectedProgram,
    labels?.allSubjects,
    labels?.subjectGroups,
    multiClassData,
    useAll,
    isAdmin,
  ]);
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

export function SelectAutoClearable({ data, value, onChange, ...props }) {
  React.useEffect(() => {
    if (typeof onChange === 'function') {
      if (value && !data.find((item) => item.value === value)) {
        onChange(null);
      } else if (!value && data?.length && data[0].value === 'all') {
        onChange('all');
      }
    }
  }, [data]);

  return (
    <Select
      {...props}
      data={data}
      value={[value]}
      onChange={(v) => onChange(v[0])}
      valueComponent={(item) => (
        <SubjectItem
          {...item}
          isValueComponent
          subject={data.find((d) => d.value === item.value)}
        />
      )}
      itemComponent={(item) => (
        <SubjectItem {...item} subject={data.find((d) => d.value === item.value)} />
      )}
      dropdownPosition="flip"
    />
  );
}

function SubjectFilters({ onChange, loading, hideProgramSelect, useLabels }) {
  const { control, watch, getValues } = useForm({
    defaultValues: {
      program: 'all',
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
      {!hideProgramSelect ? (
        <Controller
          control={control}
          name={'program'}
          render={({ field }) => (
            <Select
              {...field}
              label={useLabels ? labels?.programLabel : null}
              placeholder={labels?.program}
              data={programs}
              searchable
              disabled={!!loading}
              style={inputRootStyle}
            />
          )}
        />
      ) : null}
      <Controller
        control={control}
        name={'subject'}
        render={({ field }) => (
          <SelectSubject
            {...field}
            data={subjects}
            label={useLabels ? labels?.subjectLabel : null}
            placeholder={labels?.subject}
            disabled={!subjects.length || !!loading}
            style={inputRootStyle}
          />
        )}
      />
    </>
  );
}

export function useAcademicFiltersForAssetList({ hideProgramSelect, useLabels } = {}) {
  const [filters, setFilters] = React.useState(undefined);
  const onChange = React.useCallback(setFilters);

  return {
    filterComponents: ({ loading }) => (
      <SubjectFilters
        hideProgramSelect={hideProgramSelect}
        useLabels={useLabels}
        onChange={onChange}
        loading={loading}
      />
    ),
    filters,
    searchInProvider: !!filters?.program || !!filters?.subjects?.length,
  };
}

export default useAcademicFiltersForAssetList;

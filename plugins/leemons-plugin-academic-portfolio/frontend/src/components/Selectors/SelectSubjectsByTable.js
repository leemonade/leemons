import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, Select, Table, TextInput } from '@bubbles-ui/components';
import { SearchIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { Controller, useForm } from 'react-hook-form';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { filter, findIndex, forEach, isObject, keyBy, map } from 'lodash';
import { cloneDeep } from 'lodash/lang';
import {
  detailProgramRequest,
  listClassesRequest,
  listSubjectCreditsForProgramRequest,
} from '../../request';

export default function SelectSubjectsByTable({ program, value, onChange }) {
  const [t] = useTranslateLoader(prefixPN('selectSubjectsByTable'));
  const [store, render] = useStore({
    loading: true,
  });

  const { control, getValues, watch } = useForm();

  function filterSubjects() {
    const values = getValues();
    store.filteredSubjects = cloneDeep(store.subjects);
    if (values.subjectType) {
      store.filteredSubjects = filter(
        store.filteredSubjects,
        (s) => s.subjectType?.id === values.subjectType
      );
    }
    if (values.knowledge) {
      store.filteredSubjects = filter(
        store.filteredSubjects,
        (s) => s.knowledge?.id === values.knowledge
      );
    }
    if (values.name) {
      store.filteredSubjects = filter(
        store.filteredSubjects,
        (s) =>
          s.name?.toLowerCase().includes(values.name.toLowerCase()) ||
          s.internalId?.toLowerCase().includes(values.name.toLowerCase())
      );
    }

    store.filteredSubjects = map(store.filteredSubjects, (s) => ({
      ...s,
      selected: { type: 'checkbox', checked: value ? value.indexOf(s.id) !== -1 : false },
    }));

    render();
  }

  async function init() {
    store.loading = true;
    render();
    if (isObject(program)) {
      store.program = program;
    } else {
      const { program: p } = await detailProgramRequest(store.programId);
      store.program = p;
    }
    const [
      {
        data: { items: classes },
      },
      { subjectCredits },
    ] = await Promise.all([
      listClassesRequest({
        page: 0,
        size: 999999,
        program: store.program.id,
      }),
      listSubjectCreditsForProgramRequest(store.program.id),
    ]);

    const subjectCreditsBySubject = keyBy(subjectCredits, 'subject');

    store.classes = classes;
    store.subjects = map(store.program.subjects, (subject) => {
      let subjectType = null;
      let knowledge = null;
      forEach(store.classes, (classe) => {
        if (classe.subject && classe.subject.id === subject.id) {
          subjectType = classe.subjectType;
          knowledge = classe.knowledges;
        }
      });
      return {
        ...subject,
        subjectType,
        knowledge,
        internalId: subjectCreditsBySubject[subject.id]?.internalId,
      };
    });

    store.knowledges = map(
      filter(
        store.program.knowledges,
        (knowledge) =>
          findIndex(store.subjects, (subject) => subject.knowledge?.id === knowledge.id) !== -1
      ),
      ({ id, name }) => ({ label: name, value: id })
    );
    store.subjectTypes = map(
      filter(
        store.program.subjectTypes,
        (subjectType) =>
          findIndex(store.subjects, (subject) => subject.subjectType?.id === subjectType.id) !== -1
      ),
      ({ id, name }) => ({ label: name, value: id })
    );
    filterSubjects();
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    if (program) init();
  }, [program]);

  React.useEffect(() => {
    filterSubjects();
  }, [value]);

  React.useEffect(() => {
    const subscription = watch(filterSubjects);
    return () => subscription.unsubscribe();
  });

  const tableHeaders = useMemo(
    () => [
      {
        Header: ' ',
        accessor: 'selected',
      },
      {
        Header: t('tableId'),
        accessor: 'internalId',
      },
      {
        Header: t('tableName'),
        accessor: 'name',
      },
      {
        Header: t('tableKnowledge'),
        accessor: 'knowledge.name',
      },
      {
        Header: t('tableType'),
        accessor: 'subjectType.name',
      },
    ],
    [t]
  );

  function onChangeData({ newData }) {
    const ids = [];
    forEach(newData, ({ id, selected }) => {
      if (selected.checked) {
        ids.push(id);
      }
    });
    onChange(ids);
  }

  if (store.loading) return null;

  return (
    <Box>
      <ContextContainer>
        <ContextContainer direction="row">
          {store.subjectTypes.length ? (
            <Box>
              <Controller
                control={control}
                name="subjectType"
                render={({ field }) => (
                  <Select data={store.subjectTypes} label={t('subjectTypeLabel')} {...field} />
                )}
              />
            </Box>
          ) : null}
          {store.knowledges.length ? (
            <Box>
              <Controller
                control={control}
                name="knowledge"
                render={({ field }) => (
                  <Select data={store.knowledges} label={t('knowledgeLabel')} {...field} />
                )}
              />
            </Box>
          ) : null}
          <Box>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput label={t('subjectLabel')} {...field} rightSection={<SearchIcon />} />
              )}
            />
          </Box>
        </ContextContainer>
        <Box>
          <Table columns={tableHeaders} data={store.filteredSubjects} onChangeData={onChangeData} />
        </Box>
      </ContextContainer>
    </Box>
  );
}

SelectSubjectsByTable.propTypes = {
  program: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

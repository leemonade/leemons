import React from 'react';
import useCurriculum from '@curriculum/request/hooks/queries/useCurriculum';
import useListCurriculumsByProgram from '@curriculum/request/hooks/queries/useListCurriculumsByProgram';
import { cloneDeep, get, intersection, isArray, last, set, uniqBy } from 'lodash';
import { unflatten, useStore } from '@common';
import prefixPN from '@assignables/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

function parseCurriculumValue(id) {
  return { ...Object.fromEntries(id?.split('|').map((pair) => pair.split('.'))), original: id };
}

function flatCurriculumNodes(curriculumNodes) {
  return (
    curriculumNodes?.flatMap((node) => {
      const parsedNode = {
        id: node.id,
        nodeLevel: node.nodeLevel,
        nodeLevelPropertyByPropertyId: Object.fromEntries(
          Object.entries(node.formValues || {}).flatMap(([nodeLevelProperty, props]) => {
            const properties = isArray(props) ? props : [props];
            return properties.map((property) => [property.id, nodeLevelProperty]);
          })
        ),
      };

      if (node.childrens?.length) {
        return [parsedNode, ...flatCurriculumNodes(node.childrens)];
      }

      return parsedNode;
    }) || []
  );
}

export function useCurriculumNodes({ curriculum }) {
  const curriculumNodes = React.useMemo(() => {
    const nodesByIds = {};

    flatCurriculumNodes(curriculum?.nodes)?.forEach((node) => {
      nodesByIds[node.id] = node;
    });

    return nodesByIds;
  }, [curriculum?.nodes]);

  return curriculumNodes;
}

export function useSelectedCurriculumValues({ assignable }) {
  const selectedCurriculumValues = React.useMemo(
    () =>
      assignable?.subjects?.flatMap((subject) => {
        let hasCustomObjectives = false;
        const values = [];

        if (subject?.curriculum?.curriculum?.length) {
          values.push(...subject.curriculum.curriculum.map(parseCurriculumValue));
        }
        if (subject?.curriculum?.objectives?.length) {
          hasCustomObjectives = true;
        }

        return { subject: subject.subject, hasCustomObjectives, values };
      }) ?? [],
    [assignable]
  );

  return selectedCurriculumValues;
}

export function useCustomObjectivesLocalizations() {
  const key = prefixPN('customObjectives');
  const [, translations] = useTranslateLoader(key);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return get(res, key, '');
    }

    return '';
  });
}

export function useSelectedCurriculumProperties({
  curriculum,
  curriculumNodes,
  nodeLevels,
  selectedCurriculumValues,
}) {
  const customObjectiveLocalization = useCustomObjectivesLocalizations();
  const customObjectives = React.useMemo(
    () => !!selectedCurriculumValues?.some((value) => value.hasCustomObjectives),
    [selectedCurriculumValues]
  );
  const flattenSelectedValues = React.useMemo(
    () => selectedCurriculumValues?.flatMap((value) => value.values),
    [selectedCurriculumValues]
  );

  const usedProperties = React.useMemo(() => {
    if (!curriculum) {
      return [];
    }

    return uniqBy(
      flattenSelectedValues.map((selectedValue) => {
        const nodeLevelProperty =
          curriculumNodes[selectedValue.node]?.nodeLevelPropertyByPropertyId?.[
          selectedValue.property
          ];

        const nodeLevel = nodeLevels.find(
          (level) => level?.schema?.jsonSchema?.properties?.[nodeLevelProperty]
        );

        const property = nodeLevel?.schema?.jsonSchema?.properties?.[nodeLevelProperty];

        return {
          id: property?.id,
          name: property?.frontConfig?.name,
        };
      }),
      'id'
    );
  }, [curriculumNodes, flattenSelectedValues]);

  React.useEffect(() => {
    if (customObjectives) {
      if (!usedProperties?.length || last(usedProperties)?.id !== 'custom') {
        usedProperties.push({
          id: 'custom',
          name: customObjectiveLocalization,
        });
      } else {
        usedProperties[usedProperties.length - 1].name = customObjectiveLocalization;
      }
    }
  }, [usedProperties, customObjectives, customObjectiveLocalization]);

  return usedProperties;
}

export function useInstanceCurriculum({ instance }) {
  const program = instance?.subjects?.[0]?.program;

  const { data: curriculumsList } = useListCurriculumsByProgram(program, { enabled: !!program });

  const { data: curriculum } = useCurriculum(curriculumsList?.items?.[0]?.id, {
    enabled: curriculumsList?.count > 0,
  });

  return curriculum;
}

export function useCurriculumVisibleValues({ assignation }) {
  const { instance } = assignation;
  const { assignable, curriculum: visibleCategories } = instance;

  const curriculum = useInstanceCurriculum({ instance });
  const curriculumNodes = useCurriculumNodes({ curriculum });
  const selectedCurriculumValues = useSelectedCurriculumValues({ assignable });

  const [store, render] = useStore({
    flatValuesCopy: [],
  });

  const flatValues = React.useMemo(
    () => selectedCurriculumValues.flatMap((value) => value.values) || [],
    [selectedCurriculumValues]
  );

  React.useEffect(() => {
    store.flatValuesCopy = cloneDeep(flatValues);

    flatValues.forEach((value, i) => {
      const { node, property } = value;
      const nodeLevel = curriculumNodes[node]?.nodeLevelPropertyByPropertyId[property];

      set(store.flatValuesCopy, `${i}.visible`, !!visibleCategories[nodeLevel]);
    });
    render();
  }, [flatValues, curriculumNodes, visibleCategories]);

  return React.useMemo(() => {
    const includedIds = store.flatValuesCopy
      ?.filter((value) => !!value.visible)
      .map((value) => value.original);

    return assignable.subjects?.map((subject, i) => ({
      ...subject,
      curriculum: {
        curriculum: intersection(subject.curriculum.curriculum, includedIds),
        objectives: selectedCurriculumValues[i].hasCustomObjectives
          ? subject.curriculum.objectives
          : [],
      },
    }));
  }, [store.flatValuesCopy]);
}

export function useCurriculumFields({ assignable }) {
  const curriculum = useInstanceCurriculum({ assignable });
  const curriculumNodes = useCurriculumNodes({ curriculum });
  const selectedCurriculumValues = useSelectedCurriculumValues({ assignable });

  const usedProperties = useSelectedCurriculumProperties({
    curriculum,
    curriculumNodes,
    nodeLevels: curriculum?.nodeLevels,
    selectedCurriculumValues,
  });

  return usedProperties;
}

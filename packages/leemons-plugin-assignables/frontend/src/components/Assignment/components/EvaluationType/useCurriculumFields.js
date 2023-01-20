import React from 'react';
import useCurriculum from '@curriculum/request/hooks/queries/useCurriculum';
import useListCurriculumsByProgram from '@curriculum/request/hooks/queries/useListCurriculumsByProgram';
import { uniqBy } from 'lodash';

function parseCurriculumValue(id) {
  return Object.fromEntries(id.split('|').map((pair) => pair.split('.')));
}

function flatCurriculumNodes(curriculumNodes) {
  return (
    curriculumNodes?.flatMap((node) => {
      const parsedNode = {
        id: node.id,
        nodeLevel: node.nodeLevel,
        nodeLevelPropertyByPropertyId: Object.fromEntries(
          Object.entries(node.formValues || {}).map(([nodeLevelProperty, { id }]) => [
            id,
            nodeLevelProperty,
          ])
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
      }),
    [assignable]
  );

  return selectedCurriculumValues;
}

export function useSelectedCurriculumProperties({
  curriculum,
  curriculumNodes,
  nodeLevels,
  selectedCurriculumValues,
}) {
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

  return usedProperties;
}

export function useCurriculumFields({ assignable }) {
  const program = assignable?.program ?? assignable?.subjects?.[0]?.program;

  const { data: curriculumsList } = useListCurriculumsByProgram(program, { enabled: !!program });

  const { data: curriculum } = useCurriculum(curriculumsList?.items?.[0]?.id, {
    enabled: curriculumsList?.count > 0,
  });

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

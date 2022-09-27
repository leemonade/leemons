import React from 'react';
import _ from 'lodash';
import { useProgramTree } from '@academic-portfolio/hooks';

function getChildrenManagers({ tree, managers }) {
  const _managers = Array.isArray(managers) ? _.cloneDeep(managers) : [];
  const isCourseManager = (t) => ['program', 'courses', 'cycles'].includes(t.nodeType);

  if (Array.isArray(tree.value.managers)) {
    _managers.push(
      ...tree.value.managers.map((manager) => ({
        id: manager,
        type: isCourseManager(tree) ? 'course' : 'class',
      }))
    );
  }

  if (tree.nodeType === 'class') {
    return {
      id: tree.value.id,
      managers: [
        ..._.uniqBy(
          _.filter(_managers, ({ type }) => type === 'course'),
          'id'
        ),
        ..._.uniqBy(
          _.filter(_managers, ({ type }) => type === 'class'),
          'id'
        ),
      ],
    };
  }

  return tree.childrens.flatMap((child) =>
    getChildrenManagers({ tree: child, managers: _managers })
  );
}
export function useClassesManagers({ filters }) {
  const { data: tree } = useProgramTree(filters?.program, { enabled: !!filters?.program });

  return React.useMemo(() => {
    if (!tree) {
      return [];
    }

    return getChildrenManagers({ tree });
  }, [tree]);
}

export default useClassesManagers;

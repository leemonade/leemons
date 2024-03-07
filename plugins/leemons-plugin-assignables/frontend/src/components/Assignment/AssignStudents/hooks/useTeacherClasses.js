import { useEffect, useState } from 'react';
import _ from 'lodash';

import { listTeacherClassesRequest } from '@academic-portfolio/request';
import getCourseName from '@academic-portfolio/helpers/getCourseName';
import useUserAgents from './useUserAgents';

// EN: Gets all the classes of the teacher
// ES: Obtiene todas las clases del profesor
export default function useTeacherClasses() {
  const [data, setData] = useState([]);
  const userAgents = useUserAgents();

  const getClasses = async () => {
    if (!userAgents?.length) {
      setData([]);
      return;
    }

    // EN: Get the classes the teacher has
    // ES: Obtener las clases que tiene el profesor
    const classes = _.flatten(
      await Promise.all(
        userAgents.map(
          async (agent) =>
            (
              await listTeacherClassesRequest({
                page: 0,
                size: 100,
                teacher: agent,
              })
            ).data.items
        )
      )
    ).map((_class) => ({
      id: _class.id,
      // TODO: Update to standard class name
      label: [
        _class.courses && getCourseName(_class.courses),
        _class.subject.name,
        !_class.groups?.isAlone &&
          (_class.groups?.name ? _class.groups.name : _class.groups?.abbreviation),
      ]
        .filter(Boolean)
        .join(' - '),
      subject: _class.subject.id,
      teachers: _class.teachers,
      c: _class,
    }));

    setData(classes);
  };

  useEffect(() => {
    getClasses();
  }, [userAgents]);

  return data;
}

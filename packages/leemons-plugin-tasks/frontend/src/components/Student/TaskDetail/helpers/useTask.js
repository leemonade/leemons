import { useEffect, useState } from 'react';
import getTaskRequest from '../../../../request/task/getTask';

export default function useTask(id, columns) {
  const cols = Array.isArray(columns) ? columns : [];
  const [task, setTask] = useState(null);

  useEffect(() => {
    (async () => {
      if (!id) {
        return;
      }

      try {
        // TODO: Handle task error
        const t = await getTaskRequest({ id, columns: JSON.stringify(cols) });
        setTask(t);
      } catch (e) {
        // TRANSLATE: Student not assigned to the task
        if (e.message === "Student or instance doesn't exist") {
          setTask({ error: 'Student not assigned to the task' });
        }
      }
    })();
  }, [id, ...cols]);

  return task;
}

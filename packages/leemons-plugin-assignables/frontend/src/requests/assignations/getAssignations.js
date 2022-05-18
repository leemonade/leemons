import getAssignation from './getAssignation';

export default function getAssignations({ ids, user, details = true }) {
  return Promise.all(ids.map((id) => getAssignation({ id, user, details })));
}

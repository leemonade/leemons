export default function deleteInstance({ id }) {
  return leemons.api(`v1/assignables/assignableInstances/${id}`, {
    method: 'DELETE',
  });
}

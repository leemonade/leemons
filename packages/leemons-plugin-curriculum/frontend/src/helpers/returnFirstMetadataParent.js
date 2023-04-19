export function returnFirstMetadataParent(values) {
  let id = null;
  if (_.isArray(values)) {
    _.forEach(values, (value) => {
      if (value?.metadata?.parentRelated) {
        id = value?.metadata?.parentRelated;
        return false;
      }
    });
  } else {
    id = values?.metadata?.parentRelated;
  }
  return id;
}

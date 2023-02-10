async function getOverlapsWithOtherConfigurations(item) {
  const query = {
    zone: item.zone,
  };
  if (item.id) {
    query.id_$nin = [item.id];
  }
  if () {
    
  }

  return ['miau'];
}

module.exports = { getOverlapsWithOtherConfigurations };

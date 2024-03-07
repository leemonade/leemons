const unfitSearch = require('./unfitSearch');

module.exports = async function search(
  filters,
  query,
  offset = 0,
  size = 10,
  { verifyNextPage = true, transacting } = {}
) {
  let results;
  let i = 0;

  // EN: While the results are less than the size and a new page exists, keep searching, so we always return the queried size
  // ES: Mientras los resultados sean menores que el tamaño y exista una nueva página, seguimos buscando, así que siempre devolvemos el tamaño solicitado
  do {
    // eslint-disable-next-line no-await-in-loop
    results = await unfitSearch(
      filters,
      {
        query,
        offset: results?.nextOffset || offset,
        size,
      },
      {
        previouseResults: results,
        transacting,
      }
    );

    i++;
  } while (results.count < size && results.canGoNext);

  results.iterations = i;

  // EN: As the results are searched across multiple tables, we need to check that the existance of a next page is real, so we can search the next value to be sure that the next page exists, also, we can adjust the nextOffset to be the offset of the returned item.
  // ES: Como los resultados se buscan en múltiples tablas, necesitamos comprobar que existe una siguiente página, así que podemos buscar el siguiente valor para asegurarnos de que existe la siguiente página, también, podemos ajustar el nextOffset para ser el offset del elemento devuelto.
  if (verifyNextPage && results.canGoNext && !results.canGoNextCertainity) {
    const nextItem = await search(filters, query, results.nextOffset, 1, {
      verifyNextPage: false,
      details: false,
      transacting,
    });
    results.canGoNext = nextItem.count > 0;
    results.nextOffset = nextItem.items[0]?.offset;
  }

  if (results.canGoNextCertainity) {
    results.canGoNextCertainity = undefined;
  }

  return results;
};

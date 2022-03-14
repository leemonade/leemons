module.exports = async function unfitSearch(
  filters,
  { query, offset, size } = {},
  { previousResults, transacting } = {}
) {
  if (!Array.isArray(filters) || !filters.length) {
    if (previousResults) {
      return previousResults;
    }

    throw new Error('Error in search: No filters provided');
  }

  if (filters.some((filter) => typeof filter !== 'function')) {
    throw new Error(
      `Error in search: Invalid filter provided, expected function, got: ${typeof filter}`
    );
  }

  // EN: The initial results are the previous results if they exist
  // ES: Los resultados iniciales son los resultados anteriores si existen
  let results = previousResults;

  const filtersLength = filters.length;
  for (let i = 0; i < filtersLength; i++) {
    const filter = filters[i];

    /**
     * EN:
     * The filters are called in sequence, the first filter is called with the previous results and the next filter is called with the results of the previous filter.
     * All the filters must accept the same arguments:
     *  - results: Object with the results and search properties (the object returned by the search function)
     *  - query: The query provided in the search function (offset and size included)
     *  - transacting: The transaction provided in the search function
     *
     * The returned object must have the following properties:
     *  - items: The items of the results
     *  - count: The count of the results
     *  - size: The size searched
     *  - offset: The offset searched
     *  - nextOffset: The next offset which will be searched on the next search
     *  - canGoNext: If the next search will return results
     *  - canGoNextCertainity?: Boolean indicating if the next search can be done with certainity (if not, it will be ensured by the search function)
     *  - previousResultsIncluded?: Boolean indicating if the previous results are included in the results (if not, it will be included by the search function). This is only relevant in the first filter (the next ones must include the results because they are the results of the previous filter)
     *
     * Each item must have the position of the element in the database for the given query (offset + i). This must be setted on the first filter.
     */

    /**
     * ES:
     * Los filtros se ejecutan en secuencia, el primer filtro se ejecuta con los resultados anteriores y el siguiente con los resultados del anterior.
     * Todos los filtros deben aceptar los mismos argumentos:
     *  - results: Objeto con los resultados y las propiedades de búsqueda (el objeto devuelto por la función de búsqueda)
     *  - query: La consulta proporcionada en la función de búsqueda (offset y size incluidos)
     *  - transacting: La transacción proporcionada en la función de búsqueda
     *
     * El objeto devuelto debe tener las siguientes propiedades:
     *  - items: Los elementos de los resultados
     *  - count: El conteo de los resultados
     *  - size: El tamaño buscado
     *  - offset: El offset buscado
     *  - nextOffset: El siguiente offset que será buscado en la siguiente búsqueda
     *  - canGoNext: Si la siguiente búsqueda devolverá resultados
     *  - canGoNextCertainity?: Booleano indicando si la siguiente búsqueda se puede hacer con certeza (si no, se asegura por la función de búsqueda)
     *  - previousResultsIncluded?: Booleano indicando si los resultados anteriores están incluidos en los resultados (si no, se incluyen por la función de búsqueda). Esto es relevante solo en el primer filtro (los siguientes deben incluir los resultados porque son los resultados del anterior filtro)
     *
     * Cada item debe tener la posición del elemento en la base de datos para la consulta dada (offset + i). Esto se debe establecer en el primer filtro.
     */

    try {
      // eslint-disable-next-line no-await-in-loop
      results = await filter(
        results,
        {
          ...query,
          offset,
          size: size > 10 ? size : 10,
        },
        { transacting }
      );
    } catch (e) {
      throw new Error(
        `Error in search: The filter ${i} failed with the following error: ${e.message}`
      );
    }
  }

  if (results.size !== size) {
    results.size = size;
  }

  if (previousResults) {
    // EN: The offset must be always tweaked to be the first offset searched
    // ES: El offset debe siempre ser ajustado para que sea el primer offset buscado
    results.offset = previousResults.offset !== undefined ? previousResults.offset : results.offset;

    // EN: Add the previous results to the results if they are not included yet
    // ES: Añade los resultados anteriores al resultado si no están incluidos aún
    if (!results.previouseResultsIncluded) {
      results.items = [...previousResults.items, ...results.items];
      results.count = previousResults.count + results.count;
    }
  }

  // EN: Ensure that no more than the size searched is returned
  // ES: Asegura que no se devuelve más de el tamaño buscado
  if (results.count > size) {
    // EN: Get the items that exceed the size searched
    // ES: Obtiene los elementos que exceden el tamaño buscado
    const unusedItems = results.items.splice(size);
    // EN: Limit the items to the size searched
    // ES: Limita los elementos al tamaño buscado
    results.items.length = size;
    results.count = size;

    // EN: We can go to the next page for sure, because in the next page there will be the items that exceed the size searched.
    // ES: Podemos ir a la siguiente página porque en la siguiente página habrá los elementos que exceden el tamaño buscado.
    results.canGoNext = true;
    // EN: Add a check of the certainty of the next page, so we don't need the security query.
    // ES: Añadir una verificación de la certeza de una siguiente página, para así no necesitar la consulta de seguridad.
    results.canGoNextCertainity = true;

    // EN: The next offset is the position in the database of the first item that exceeds the size searched, we can be sure that there won't be more results before that offset.
    // ES: El siguiente offset es la posición en la base de datos del primer elemento que excede el tamaño buscado, podemos asegurar que no habrá más resultados antes de ese offset.
    results.nextOffset = unusedItems[0].offset;
  }

  return results;
};

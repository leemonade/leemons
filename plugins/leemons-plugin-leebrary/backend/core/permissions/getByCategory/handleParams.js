/* eslint-disable no-param-reassign */

/**
 * handleParams is a function that handles the parameters for getting permissions by category.
 * It checks if the programs and subjects are provided, if not, it assigns them from the providerQuery.
 * It also assigns the program and subjects to the providerQuery if they are not already present.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.programs - The programs for which permissions are to be fetched.
 * @param {Array} params.subjects - The subjects for which permissions are to be fetched.
 * @param {Object} params.providerQuery - The query object from the provider.
 * @returns {Array} - Returns an array containing the programs, subjects, and the providerQuery.
 */
function handleParams({ programs, subjects, providerQuery = {} }) {
  if (!programs && providerQuery?.program) {
    programs = [providerQuery.program];
  }
  if (!subjects && providerQuery?.subjects) {
    subjects = providerQuery.subjects;
  }

  if (!providerQuery?.program && programs) {
    [providerQuery.program] = programs;
  }
  if (!providerQuery?.subjects && subjects) {
    providerQuery.subjects = subjects;
  }

  return [programs, subjects, providerQuery];
}

module.exports = { handleParams };

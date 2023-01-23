/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const locale = 'ru';
  const sortParams = { caseFirst: 'upper'};
  return [...arr].sort((a, b) => {
    switch (param) {
    case 'desc':
      return b.localeCompare(a, locale, sortParams);
    default:
      return a.localeCompare(b, locale, sortParams);
    }
  });
}

/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  const result = [];
  let prevSymbol = '';
  let counter = 0;
  for (const symbol of string) {
    if (symbol === prevSymbol) {
      counter++;
    } else {
      counter = 1;
      prevSymbol = symbol;
    }

    if (counter <= size) {
      result.push(symbol);
    }
  }

  return result.join('');
}

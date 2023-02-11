export function stringComparator (direction) {
  const locale = ['ru', 'en'];
  const sortParams = { caseFirst: 'upper'};

  switch (direction) {
  case 'desc':
    return (a, b) => b.toString().localeCompare(a.toString(), locale, sortParams);
  case 'asc':
    return (a, b) => a.toString().localeCompare(b.toString(), locale, sortParams);
  }
}

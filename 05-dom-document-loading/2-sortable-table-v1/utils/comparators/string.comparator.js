export function stringComparator (direction) {
  const locale = ['ru', 'en'];
  const sortParams = { caseFirst: 'upper'};

  switch (direction) {
  case 'desc':
    return (a, b) => b.localeCompare(a, locale, sortParams);
  case 'asc':
    return (a, b) => a.localeCompare(b, locale, sortParams);
  }
}

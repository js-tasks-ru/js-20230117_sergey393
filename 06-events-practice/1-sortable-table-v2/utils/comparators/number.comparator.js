export function numberComparator (direction) {
  switch (direction) {
  case 'desc':
    return (a, b) => b - a;
  case 'asc':
    return (a, b) => a - b;
  }
}

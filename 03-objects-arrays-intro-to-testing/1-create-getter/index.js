/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const parsedPath = path.split('.');
  return (obj) => {
    let currObj = obj;
    parsedPath.forEach((currPath) => {
      if (!currObj) {
        return;
      }
      currObj = currObj[currPath];
    });
    return currObj;
  };
}

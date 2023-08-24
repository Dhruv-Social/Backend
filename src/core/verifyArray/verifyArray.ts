/**
 * Function to verify user data
 * @param items A string of items to check if they are null, or "", or undefined
 * @returns boolean
 */
const verifyArray = (items: string[]): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === undefined || items[i] === null || items[i] === "") {
      return false;
    }
  }

  return true;
};

export { verifyArray };

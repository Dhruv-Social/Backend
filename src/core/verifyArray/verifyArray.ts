const verifyArray = (items: string[]): boolean => {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === undefined || items[i] === null || items[i] === "") {
      return false;
    }
  }

  return true;
};

export { verifyArray };

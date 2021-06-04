const compareOrderIndex = (a, b) => {
  if (!a || !b) {
    return 0;
  }
  if (a.orderIndex < b.orderIndex) {
    return -1;
  }
  if (a.orderIndex > b.orderIndex) {
    return 1;
  }
  return 0;
};

export default compareOrderIndex;

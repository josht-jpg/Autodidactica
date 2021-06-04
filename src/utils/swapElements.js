const swapElements = (arr, index1, index2) => {
  if (index1 > index2) {
    return [
      ...arr.slice(0, index2),
      arr[index1],
      ...arr.slice(index2, index1),
      ...arr.slice(index1 + 1),
    ];
  } else {
    return [
      ...arr.slice(0, index1),
      ...arr.slice(index1 + 1, index2 + 1),
      arr[index1],
      ...arr.slice(index2 + 1),
    ];
  }
};

export default swapElements;

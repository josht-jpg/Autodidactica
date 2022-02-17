const removeElementFromArray = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];

export default removeElementFromArray;

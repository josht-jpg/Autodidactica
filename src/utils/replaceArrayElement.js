const replaceArrayElement = (arr, value, index) => [
  ...arr.slice(0, index),
  value,
  ...arr.slice(index + 1),
];

export default replaceArrayElement;

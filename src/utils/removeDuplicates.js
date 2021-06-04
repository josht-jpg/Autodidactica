const removeDuplicates = (items) => {
  return (
    items &&
    items.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i)
  );
};

export default removeDuplicates;

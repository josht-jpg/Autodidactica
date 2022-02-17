const handleMouseEvent = (setIsHoverArray, index, val) =>
  setIsHoverArray &&
  setIsHoverArray((prev) => [
    ...prev.slice(0, index),
    val,
    ...prev.slice(index + 1),
  ]);

export default handleMouseEvent;

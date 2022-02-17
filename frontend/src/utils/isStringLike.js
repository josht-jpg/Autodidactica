const isStringLike = (x) => {
  try {
    return JSON.stringify(JSON.parse(x)) === x;
  } catch (e) {
    console.log("not string-like");
  }
};

export default isStringLike;

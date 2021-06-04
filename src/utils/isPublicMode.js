const isPublicMode = () => {
  return window.location.href.includes("public");
};

export default isPublicMode;

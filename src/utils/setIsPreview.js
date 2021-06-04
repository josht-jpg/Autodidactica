const setIsPreview = () => {
  const isPreview = JSON.parse(sessionStorage.getItem("isPreview"));
  const hideEditMode =
    isPreview || JSON.parse(sessionStorage.getItem("hideEditMode"));
  return { isPreview, hideEditMode };
};

export default setIsPreview;

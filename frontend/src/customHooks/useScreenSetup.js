import useSidebarSetup from "./useSidebarSetup";

const useScreenSetup = (isTranscript = false) => {
  !isTranscript && sessionStorage.setItem("isPreview", false);
  return useSidebarSetup();
};

export default useScreenSetup;

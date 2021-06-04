import { useState } from "react";
import { minWidth } from "../utils/sidebarUtils";

const DEFAULT_WIDTH = 200;

const useSidebarSetup = () => {
  let positionInit = sessionStorage.getItem("navbar-position");
  if (!positionInit) {
    positionInit = DEFAULT_WIDTH;
  }

  const sidebarWidthState = useState(positionInit);
  const isMinSidebarWidthState = useState(positionInit <= minWidth);

  return { sidebarWidthState, isMinSidebarWidthState };
};

export default useSidebarSetup;

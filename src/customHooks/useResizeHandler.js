import { useState, useEffect, useCallback } from "react";
import dashboardWidth from "../utils/dashboardWidth";
import getSelectedItemWidth from "../utils/getSelectedItemWidth";
import { handleMousemove, handleMouseup } from "../utils/sidebarUtils";

const useResizeHandler = (setIsMinSidebarWidth, sidebarWidthState) => {
  const [sidebarWidth, setSidebarWidth] = sidebarWidthState;

  const [width, setWidth] = useState(dashboardWidth(sidebarWidth));
  const [selectedItemWidth, setSelectedItemWidth] = useState(
    getSelectedItemWidth(window.innerWidth, sidebarWidth)
  );

  const handleWindowResize = useCallback(() => {
    setSelectedItemWidth(getSelectedItemWidth(window.innerWidth, sidebarWidth));
    setWidth(dashboardWidth(sidebarWidth));
  }, [sidebarWidth]);

  const mouseUp = (e) => handleMouseup(e);

  useEffect(() => {
    const mouseMove = (e) =>
      handleMousemove(e, setIsMinSidebarWidth, setSidebarWidth, { once: true });

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [handleWindowResize, setIsMinSidebarWidth, setSidebarWidth]);

  useEffect(() => {
    setWidth(dashboardWidth(sidebarWidth));
    setSelectedItemWidth(getSelectedItemWidth(window.innerWidth, sidebarWidth));
  }, [sidebarWidth, handleWindowResize]);

  return { width, selectedItemWidth };
};

export default useResizeHandler;

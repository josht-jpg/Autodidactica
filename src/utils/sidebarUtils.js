export const minWidth = 108;
export const maxWidth = 300; /*225 */

function disableSelect(event) {
  event.preventDefault();
}

export const handleMouseDown = (e) => {
  sessionStorage.setItem("isResizing", true);
  window.addEventListener("selectstart", disableSelect);
};

export const handleMouseup = (e) => {
  sessionStorage.setItem("isResizing", false);
  window.removeEventListener("selectstart", disableSelect);
  window.removeEventListener("mousemove", handleMousemove);
  window.removeEventListener("mouseup", handleMouseup);
};

export const handleMousemove = (e, setIsMinSidebarWidth, setPosition) => {
  if (sessionStorage.getItem("isResizing") === "true") {
    if (e.pageX > minWidth && e.pageX < maxWidth) {
      setIsMinSidebarWidth(false);
      setPosition(e.pageX);
      sessionStorage.setItem("navbar-position", e.pageX);
    } else if (e.pageX <= minWidth) {
      setIsMinSidebarWidth(true);
    }
  }
};

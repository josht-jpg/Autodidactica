import React, { useEffect } from "react";
import User from "./user/User";
import CurriculemTranscriptToggle from "./curriculumTranscriptToggle/CurriculumTranscriptToggle";
import SidebarTimeline from "./dropDowns/SidebarTimeline";
import SidebarMaterials from "./dropDowns/SidebarMaterials";
import TrashOption from "./trashOption/TrashOption";
import { handleMouseDown } from "../../utils/sidebarUtils";
import styles from "./Sidebar.module.scss";

const SideBar = ({
  viewResolution,
  itemSelected,
  position,
  isMinWidth,
  isTranscript,
  scrollTo,
  timeline,
  setIsAddSubjectScreen,
  userInfo,
}) => {
  const isPreview = JSON.parse(sessionStorage.getItem("isPreview"));

  useEffect(() => {
    let position = sessionStorage.getItem("navbar-position");
    if (!position) {
      sessionStorage.setItem("navbar-position", 225);
    }
  }, []);

  return (
    <div
      className={styles.sidebar}
      style={{ width: position && position + "px" }}
    >
      <span className={styles.expand} onMouseDown={(e) => handleMouseDown(e)} />

      <User
        setIsAddSubjectScreen={setIsAddSubjectScreen}
        userInfo={userInfo}
        position={position}
      />

      {!isPreview && <hr style={{ margin: "5px" }} />}
      <CurriculemTranscriptToggle
        position={position}
        isTranscript={isTranscript}
        isPreview={isPreview}
      />

      <hr
        style={
          isPreview
            ? { opacity: "0", marginBottom: "-2rem" }
            : { opacity: "1", margin: "5px" }
        }
      />
      <SidebarTimeline
        currentOption={viewResolution}
        isTranscript={isTranscript}
        timeline={timeline}
        scrollTo={scrollTo}
      />

      <SidebarMaterials
        currentOption={itemSelected}
        isTranscript={isTranscript}
        isMinWidth={isMinWidth}
        scrollTo={scrollTo}
      />

      <TrashOption isPreview={isPreview} position={position} />
    </div>
  );
};

export default SideBar;

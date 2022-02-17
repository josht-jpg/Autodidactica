import { useState } from "react";
import { Link } from "react-router-dom";
import { BiCaretDown, BiCaretRight } from "react-icons/bi";
import {
  FaStickyNote,
  FaSignal,
  FaBook,
  FaTools,
  FaDumbbell,
} from "react-icons/fa";
import dropDownStyles from "./sidebarDropDown.module.scss";

export const sideBarMaterials = [
  {
    title: "Goals",
    icon: <FaSignal />,
    path: "/goals",
    cName: "nav-text",
  },
  {
    title: "Projects",
    icon: <FaTools />,
    path: "/projects",
    cName: "nav-text",
  },
  {
    title: "Resources",
    icon: <FaBook />,
    path: "/resources",
    cName: "nav-text",
  },
  {
    title: "Exercises",
    icon: <FaDumbbell />,
    path: "/exercises",
    cName: "nav-text",
  },
  {
    title: "Notes",
    icon: <FaStickyNote />,
    path: "/notes",
    cName: "nav-text",
  },
];

const formatScrollType = (type) =>
  type === "Goals" ? "accomplishmentsRef" : type.toLowerCase() + "Ref";

const SidebarMaterials = ({
  currentOption,
  isTranscript,
  isMinWidth,
  scrollTo,
}) => {
  const [isSelected, setIsSelected] = useState(
    sessionStorage.getItem("isMaterialsSelected")
      ? JSON.parse(sessionStorage.getItem("isMaterialsSelected"))
      : true
  );

  const toggle = () => {
    sessionStorage.setItem("isMaterialsSelected", !isSelected);
    setIsSelected((prev) => !prev);
  };

  return (
    <div style={{ fontWeight: "bold" }}>
      <p className={dropDownStyles.header} onClick={toggle}>
        {isSelected ? <BiCaretDown /> : <BiCaretRight />} Materials{" "}
      </p>

      <div
        className={dropDownStyles.optionsContainer}
        style={{
          maxHeight: isSelected ? "200px" : "0px",
        }}
      >
        {sideBarMaterials.map((material, index) => {
          return (
            <li
              key={`${material.title}-${index}`}
              className={
                material.title === currentOption && !isTranscript
                  ? dropDownStyles.selectedOption
                  : dropDownStyles.option
              }
            >
              {!isTranscript ? (
                <Link to={material.path}>
                  {material.icon}
                  {!isMinWidth && (
                    <span style={{ marginLeft: "8%" }}>{material.title}</span>
                  )}
                </Link>
              ) : (
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => scrollTo(formatScrollType(material.title))}
                >
                  <>
                    {material.icon}
                    {!isMinWidth && (
                      <span style={{ marginLeft: "16px" }}>
                        {material.title === "Goals"
                          ? "Accomplishments"
                          : material.title}
                      </span>
                    )}
                  </>
                </a>
              )}
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarMaterials;

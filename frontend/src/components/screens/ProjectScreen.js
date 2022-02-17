import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProjects } from "../../actions/projectActions";
import AddScreen from "./addScreens/addScreen/AddScreen";
import SideBar from "../sidebar/SideBar";
import AddButton from "../button/AddButton";
import Loader from "../Loader";
import SelectedMaterial from "../selectedMaterial/SelectedMaterial";
import handleNewMaterialResponse from "../../utils/handleNewMaterialResponse";
import styles from "./screen.module.scss";
import CardContainer from "../cards/cardContainer/CardContainer";
import useResizeHandler from "../../customHooks/useResizeHandler";
import useScreenSetup from "../../customHooks/useScreenSetup";

const ProjectScreen = () => {
  const { sidebarWidthState, isMinSidebarWidthState } = useScreenSetup();
  const [sidebarWidth] = sidebarWidthState;
  const [isMinSidebarWidth, setIsMinSidebarWidth] = isMinSidebarWidthState;

  const dispatch = useDispatch();

  const [showAddScreen, setShowAddScreen] = useState(false);

  const projectsList = useSelector((state) => state.projectList);
  const { loading, projects } = projectsList;

  const addProject = useSelector((state) => state.addProject);
  addProject && handleNewMaterialResponse(projects, addProject.project);

  useEffect(() => {
    dispatch(listProjects());
  }, [dispatch]);

  const [selectedProject, setSelectedProject] = useState(false);

  const handleSelect = (project) => {
    setSelectedProject(project);
  };

  const handleUnselect = () => {
    setSelectedProject(false);
  };

  const handleCloseAddScreen = async () => {
    setShowAddScreen(false);
  };

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  return (
    <div className={styles.container}>
      <div style={{ width: `${sidebarWidth}px` }}>
        <SideBar
          itemSelected={"Projects"}
          position={sidebarWidth}
          isMinWidth={isMinSidebarWidth}
        />
      </div>
      {loading || addProject.loading ? (
        <Loader style={{ justifySelf: "center", marginTop: "43vh" }} />
      ) : (
        <div style={{ width }}>
          {showAddScreen && (
            <AddScreen
              type={"project"}
              width={selectedItemWidth}
              handleCloseAddScreen={handleCloseAddScreen}
            />
          )}
          {selectedProject && (
            <SelectedMaterial
              type={"project"}
              unit={selectedProject}
              handleUnselect={handleUnselect}
              dashboardWidth={selectedItemWidth}
            />
          )}

          <h2 className={styles.header}>Projects</h2>

          <div className={styles.materialsContainer}>
            {projects &&
              projects.map((project) => (
                <CardContainer
                  key={project && project._id}
                  material={project}
                  materialType={"project"}
                  handleSelect={handleSelect}
                />
              ))}
          </div>
          <AddButton type="Project" action={() => setShowAddScreen(true)} />
        </div>
      )}
    </div>
  );
};

export default ProjectScreen;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listBooks } from "../../actions/resourceActions";
import Loader from "../Loader";
import SelectedMaterial from "../selectedMaterial/SelectedMaterial";
import AddScreen from "./addScreens/addScreen/AddScreen";
import SideBar from "../sidebar/SideBar";
import AddButton from "../button/AddButton";
import handleNewMaterialResponse from "../../utils/handleNewMaterialResponse";
import styles from "./screen.module.scss";
import CardContainer from "../cards/cardContainer/CardContainer";
import useResizeHandler from "../../customHooks/useResizeHandler";
import useScreenSetup from "../../customHooks/useScreenSetup";
import HoverMessage from "../hoverMessage/HoverMessage";

const RescourceScreen = () => {
  const { sidebarWidthState, isMinSidebarWidthState } = useScreenSetup();
  const [sidebarWidth] = sidebarWidthState;
  const [isMinSidebarWidth, setIsMinSidebarWidth] = isMinSidebarWidthState;

  const dispatch = useDispatch();

  const bookList = useSelector((state) => state.bookList);
  const { loading, books } = bookList;

  const addResource = useSelector((state) => state.addResource);
  addResource && handleNewMaterialResponse(books, addResource.resource);

  useEffect(() => {
    dispatch(listBooks());
  }, [dispatch]);

  const [, setType] = useState("");
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isResourceSelected, setIsResourceSelected] = useState(false);

  const handleAdd = (type) => {
    setType(type);
    setShowAddScreen(true);
  };

  const handleCloseAddScreen = () => {
    setShowAddScreen(false);
  };

  const handleSelect = (resource) => {
    setSelectedResource(resource);
    setIsResourceSelected(true);
  };

  const handleUnselect = () => {
    setIsResourceSelected(false);
  };

  const [isCourseHover, setIsCourseHover] = useState(false);

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  return (
    <div className={styles.container}>
      <div style={{ width: `${sidebarWidth}px` }}>
        <SideBar
          itemSelected={"Resources"}
          position={sidebarWidth}
          isMinWidth={isMinSidebarWidth}
        />
      </div>

      {loading || addResource.loading ? (
        <Loader style={{ justifySelf: "center", marginTop: "43vh" }} />
      ) : (
        <div style={{ width }}>
          {showAddScreen && (
            <AddScreen
              type={"book"}
              width={selectedItemWidth}
              handleCloseAddScreen={handleCloseAddScreen}
            />
          )}

          {isResourceSelected && (
            <SelectedMaterial
              type="resource"
              unit={selectedResource}
              handleUnselect={handleUnselect}
              dashboardWidth={selectedItemWidth} ////////////////////////////////////dashboardWidth ???
            />
          )}

          <h2 className={styles.header}>Books</h2>

          <div className={styles.materialsContainer}>
            {books &&
              books.map((book) => (
                <CardContainer
                  key={book && book._id}
                  material={book}
                  materialType={"resource"}
                  handleSelect={handleSelect}
                />
              ))}
          </div>

          <AddButton type="Book" action={() => handleAdd("book")} />

          <h2 className={styles.header} style={{ marginTop: "10rem" }}>
            Courses
          </h2>

          <div
            style={{ width: "180px", margin: "auto" }}
            onMouseEnter={() => setIsCourseHover(true)}
            onMouseLeave={() => setIsCourseHover(false)}
          >
            <AddButton type="Course" />
          </div>
          {isCourseHover && <HoverMessage message="Coming Soon!" />}
        </div>
      )}
    </div>
  );
};

export default RescourceScreen;

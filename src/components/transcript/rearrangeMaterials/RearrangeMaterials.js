import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Loader";
import {
  rearrangeMaterials,
  hideMaterialOnServer,
  exposeMaterialOnServer,
  getHiddenMaterials,
} from "../../../actions/transcriptActions";
import DraggableMaterial from "../draggables/DraggableMaterial";
import removeElementFromArray from "../../../utils/removeElement";
import swapElements from "../../../utils/swapElements";
import HiddenMaterial from "../draggables/HiddenMaterial";
import styles from "./RearrangeMaterials.module.scss";
import BackButton from "../../backButton/BackButton";
import { EXPANDED_WINDOW_HEIGHT } from "../../../constants/styleConstants";

const RearrangeMaterials = ({
  materials,
  materialsType,
  setMaterialsOrdered,
  handleCloseRearrangeScreen,
  width,
}) => {
  const hiddenMaterialsData = useSelector((state) => state.hiddenMaterialsData);
  const { hiddenMaterialsLoading, hiddenMaterials } = hiddenMaterialsData;

  const [materialPositions, setMaterialPositions] = useState(materials);

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingHidden, setIsDraggingHidden] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(0);

  const [isDisableTransition, setIsDisableTransition] = useState(false);

  const [newIndex, setNewIndex] = useState(false);

  const handleMouseEnter = (possibleNewIndex) => {
    setNewIndex(possibleNewIndex);
  };

  const handleMouseLeave = () => {
    setNewIndex(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHiddenMaterials(materialsType));
  }, [dispatch, materialsType]);

  const [isInHiddenArea, setIsInHiddenArea] = useState(false);
  const [hiddenMaterialsState, setHiddenMaterialsState] = useState([]);

  useEffect(() => {
    setHiddenMaterialsState(hiddenMaterials);
  }, [hiddenMaterials]);

  const hideMaterial = () => {
    dispatch(hideMaterialOnServer(draggingIndex, materialsType));
    setHiddenMaterialsState((prev) => [...prev, materials[draggingIndex]]);
    setMaterialPositions((prev) => removeElementFromArray(prev, draggingIndex));
    setMaterialsOrdered((prev) => removeElementFromArray(prev, draggingIndex));
  };

  const exposeMaterial = () => {
    dispatch(exposeMaterialOnServer(draggingIndex, materialsType));
    setMaterialPositions((prev) => [
      ...prev,
      hiddenMaterialsState[draggingIndex],
    ]);
    setMaterialsOrdered((prev) => [
      ...prev,
      hiddenMaterialsState[draggingIndex],
    ]);
    setHiddenMaterialsState((prev) =>
      removeElementFromArray(prev, draggingIndex)
    );
  };

  const swapMaterials = () => {
    setMaterialPositions((prev) => swapElements(prev, draggingIndex, newIndex));
    setMaterialsOrdered((prev) => swapElements(prev, draggingIndex, newIndex));
  };

  const animateRearrange = async () => {
    await setIsDisableTransition(true);
    swapMaterials();
    setIsDisableTransition(false);
  };

  const droppedOnMaterial = () => draggingIndex !== false && newIndex !== false;
  const validNewIndex = () => newIndex || newIndex === 0;

  const rearrange = () => {
    droppedOnMaterial() &&
      dispatch(rearrangeMaterials(draggingIndex, newIndex, materialsType));

    validNewIndex() && animateRearrange();
  };

  const handleEnd = () => {
    if (isInHiddenArea) {
      !isDraggingHidden && hideMaterial();
    } else if (isDraggingHidden) {
      !newIndex && exposeMaterial();
    } else {
      rearrange();
    }
  };

  const handleMouseLeaveHiddenArea = () => {
    setIsInHiddenArea(false);
  };

  const globalDraggingState = () => ({
    isDragging,
    setIsDragging,
    draggingIndex,
    setDraggingIndex,
    handleMouseEnter,
    handleMouseLeave,
    setIsDraggingHidden,
  });

  const visiableMaterialsHeight = () =>
    document.getElementById("visiableMaterialsContainer") &&
    document.getElementById("visiableMaterialsContainer").offsetHeight;

  const HEADERS_HEIGHT = "13.5rem";

  const minHeight = () =>
    `max(calc(${EXPANDED_WINDOW_HEIGHT} - ${visiableMaterialsHeight()}px - ${HEADERS_HEIGHT}), 220px)`;

  const noHiddenMaterials = () =>
    hiddenMaterialsState && hiddenMaterialsState.length === 0;

  return (
    <div className={styles.rearrangeMaterials} style={{ width }}>
      <BackButton action={handleCloseRearrangeScreen} />

      <h2 className={styles.mainHeader}>Drag and drop to rearrange</h2>
      <hr />

      <div
        id={"visiableMaterialsContainer"}
        className={styles.visiableMaterialsContainer}
      >
        {materialPositions.map((material, index) => (
          <DraggableMaterial
            key={`[${material && material._id}]-rearrange-material`}
            material={material}
            materialType={materialsType}
            index={index}
            isDisableTransition={isDisableTransition}
            globalDraggingState={globalDraggingState()}
            handleEndGlobal={handleEnd}
          />
        ))}
      </div>

      <h2 className={styles.hiddenMaterialsHeader}>Hidden Materials</h2>
      <hr style={{ marginBottom: "0px" }} />

      <div
        className={styles.hiddenMaterialsArea}
        style={{
          minHeight: minHeight(),
        }}
      >
        <div
          className={styles.hiddenMaterialsHoverArea}
          style={{
            cursor: isDragging && "grabbing",
          }}
          onMouseEnter={() => setIsInHiddenArea(true)}
          onMouseLeave={() => handleMouseLeaveHiddenArea()}
        />

        {noHiddenMaterials() ? (
          <h3 className={styles.hiddenAreaMeassge}>
            {`Place here to hide ${materialsType} from transcript`}
          </h3>
        ) : hiddenMaterialsLoading ? (
          <div className={styles.loaderContainer}>
            <Loader style={{ justifySelf: "center" }} />
          </div>
        ) : (
          <div className={styles.hiddenMaterialsContainer}>
            {hiddenMaterialsState &&
              hiddenMaterialsState.map((material, index) => (
                <HiddenMaterial
                  key={`[${material._id}]-rearrange-material`}
                  material={material}
                  materialType={materialsType}
                  index={index}
                  globalDraggingState={globalDraggingState()}
                  handleEndGlobal={handleEnd}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RearrangeMaterials;

import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ShowMoreButton from "../showMoreButton/ShowMoreButton";
import compareOrderIndex from "../../../utils/compareOrderIndex";
import SelectedMaterial from "../../selectedMaterial/SelectedMaterial";
import { ELEMENT_MARGIN } from "../../../constants/styleConstants";
import styles from "./TranscriptMaterials.module.scss";
import RearrangeMaterials from "../rearrangeMaterials/RearrangeMaterials";
import Notepad from "../../notepad/Notepad";
import CardContainer from "../../cards/cardContainer/CardContainer";
import SelectedGoal from "../../selectedGoal/SelectedGoal";

const MAX_ROW_LENGTH = 3;
const MAX_CARD_HEIGHT = 335; //more for goals

const TranscriptMaterials = ({
  header,
  materials,
  materialsType,
  isEditMode,
  materialsRef,
  selectedItemWidth,
  setDisplayHeader,
}) => {
  const [showRearrangeScreen, setShowRearrangeScreen] = useState(false);

  const handleOpenRearrangeScreen = () => {
    setDisplayHeader(false);
    setShowRearrangeScreen(true);
  };

  const handleCloseRearrangeScreen = () => {
    setDisplayHeader(true);
    setShowRearrangeScreen(false);
  };

  const [materialsOrdered, setMaterialsOrdered] = useState(
    materials.sort(compareOrderIndex)
  );

  const [selectedMaterial, setSelectedMaterial] = useState(false);

  const handleSelect = (newSelectedMaterial) => {
    setDisplayHeader(false);
    setSelectedMaterial(newSelectedMaterial);
  };

  const handleUnselect = () => {
    setDisplayHeader(true);
    setSelectedMaterial(false);
  };

  const [isShowMore, setIsShowMore] = useState(false);

  const previewLimit = materialsType === "resources" ? 9 : 6;

  const maxHeight = () =>
    Math.ceil((materials.length - previewLimit) / MAX_ROW_LENGTH) *
    MAX_CARD_HEIGHT;

  const materialsExist = () => materials && materials.length > 0;
  const showMaterials = () => materialsExist() || isEditMode;
  const showEditButton = () => !showRearrangeScreen && isEditMode;

  return (
    showMaterials() && (
      <>
        {showRearrangeScreen && (
          <RearrangeMaterials
            materials={materialsOrdered}
            materialsType={materialsType.slice(0, -1)}
            setMaterialsOrdered={setMaterialsOrdered}
            handleCloseRearrangeScreen={handleCloseRearrangeScreen}
            width={selectedItemWidth}
          />
        )}

        {selectedMaterial &&
          (materialsType === "notepads" ? (
            <Notepad
              notepad={selectedMaterial}
              handleClose={handleUnselect}
              notepadWidth={selectedItemWidth}
            />
          ) : materialsType === "accomplishments" ? (
            <SelectedGoal
              goal={selectedMaterial}
              handleClose={handleUnselect}
              goalWidth={selectedItemWidth}
            />
          ) : (
            <SelectedMaterial
              unit={selectedMaterial}
              type={materialsType.slice(0, -1)}
              handleUnselect={handleUnselect}
              dashboardWidth={selectedItemWidth}
            />
          ))}

        <div
          ref={materialsRef}
          style={{
            marginBottom:
              materials.length > previewLimit ? "15px" : ELEMENT_MARGIN,
          }}
        >
          <h1 className={styles.header}>{header}</h1>
          <hr
            style={{
              width: `${header && header.length * 15}px`,
              marginTop: "3px",
            }}
          />
          {showEditButton() && (
            <p
              className={styles.editButton}
              onClick={handleOpenRearrangeScreen}
            >
              <FaRegEdit /> Edit Appearence
            </p>
          )}
          <div className={styles.cardsContainer}>
            {materialsOrdered.slice(0, previewLimit).map((material) => (
              <CardContainer
                material={material}
                materialType={materialsType.slice(0, -1)}
                handleSelect={handleSelect}
              />
            ))}

            <div
              className={styles.showMoreCardsContainer}
              style={{
                maxHeight: isShowMore ? maxHeight() : "0px",
              }}
            >
              {materials.slice(previewLimit).map((material) => (
                <CardContainer
                  material={material}
                  materialType={materialsType.slice(0, -1)}
                  handleSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        </div>
        {materials.length > previewLimit &&
          (isShowMore ? (
            <ShowMoreButton type="less" action={() => setIsShowMore(false)} />
          ) : (
            <ShowMoreButton
              type={`${materials.length - previewLimit} more`}
              isArrowDown={true}
              action={() => setIsShowMore(true)}
            />
          ))}
      </>
    )
  );
};

export default TranscriptMaterials;

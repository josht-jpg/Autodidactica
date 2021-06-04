import { useDispatch } from "react-redux";
import { FaLevelUpAlt } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import {
  permanentlyDeleteItem,
  restoreItem,
} from "../../../actions/trashActions";
import capitalizeFirstLetter from "../../../utils/capitalizeFirstLetter";
import CardContainer from "../../cards/cardContainer/CardContainer";
import { useState } from "react";
import styles from "./TrashItems.module.scss";

const trashItemTypes = [
  "projects",
  "resources",
  "exercises",
  "notepads",
  "goals",
];

const TrashItems = ({ items, isSelected }) => {
  const [restoreHoverId, setRestoreHoverId] = useState(false);
  const isRestoreHover = (itemId) => itemId === restoreHoverId;

  const [deleteHoverId, setDeleteHoverId] = useState(false);
  const isDeleteHover = (itemId) => itemId === deleteHoverId;

  const dispatch = useDispatch();

  const handleRestore = (index, type, id) => {
    dispatch(restoreItem(type.slice(0, -1), id));
    items[type].splice(index, 1);
    setRestoreHoverId(false);
  };

  const handlePermanentDelete = (index, type, id) => {
    dispatch(permanentlyDeleteItem(type.slice(0, -1), id));
    items[type].splice(index, 1);
    setDeleteHoverId(false);
  };

  const showItems = (trashItemType) =>
    (isSelected("All") || isSelected(capitalizeFirstLetter(trashItemType))) &&
    items[trashItemType];

  const noItems = (trashItemType) =>
    items[trashItemType].length === 0 &&
    isSelected(capitalizeFirstLetter(trashItemType));

  return trashItemTypes.map(
    (trashItemType) =>
      showItems(trashItemType) &&
      (noItems(trashItemType) ? (
        <div className={styles.emptyMessageContainer}>
          <h3 className={styles.emptyMessage}>
            {`No removed ${trashItemType}`}
          </h3>
        </div>
      ) : (
        <div className={styles.itemsContainer}>
          {items[trashItemType].map((item, index) => (
            <div key={`trashbin-${item._id}`} style={{ position: "relative" }}>
              <CardContainer
                material={item}
                materialType={trashItemType.slice(0, -1)}
              />

              <span className={styles.buttonsContainer}>
                {isRestoreHover(item._id) && (
                  <div className={styles.hoverMessage}>Restore</div>
                )}
                <FaLevelUpAlt
                  className={styles.button}
                  style={{
                    marginBottom: "25px",
                  }}
                  onMouseEnter={() => setRestoreHoverId(item._id)}
                  onMouseLeave={() => setRestoreHoverId(false)}
                  onClick={() => handleRestore(index, trashItemType, item._id)}
                />
                {isDeleteHover(item._id) && (
                  <div className={styles.hoverMessage}>Delete</div>
                )}
                <FiTrash
                  className={styles.button}
                  onMouseEnter={() => setDeleteHoverId(item._id)}
                  onMouseLeave={() => setDeleteHoverId(false)}
                  onClick={() =>
                    handlePermanentDelete(index, trashItemType, item._id)
                  }
                />
              </span>
            </div>
          ))}
        </div>
      ))
  );
};

export default TrashItems;

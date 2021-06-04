import React, { useEffect, useState, useRef } from "react";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { getRemovedItems } from "../../actions/trashActions";
import useOutsideAlerter from "../../customHooks/useOutsideAlerter";
import TrashButtons from "./trashButtons/TrashButtons";
import TrashItems from "./trashItems/TrashItems";
import styles from "./TrashBin.module.scss";

const TrashBin = ({ sideBarWidth, handleClose }) => {
  const removedItems = useSelector((state) => state.removedItems);
  const { loading, items } = removedItems;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRemovedItems());
  }, [dispatch]);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, handleClose);

  const selectedTypeState = useState("All");
  const [selectedType] = selectedTypeState;

  const isSelected = (type) => selectedType === type;

  return (
    <div
      className={styles.trashBin}
      style={{ left: `${sideBarWidth + 10}px` }}
      ref={wrapperRef}
    >
      <TrashButtons selectedTypeState={selectedTypeState} />
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader
            type="Oval"
            color="#1a1aff"
            height={38}
            width={38}
            timeout={15000}
          />
        </div>
      ) : items.isEmpty ? (
        <div className={styles.emptyMessageContainer}>
          <h3 className="timeline-header" style={{ fontSize: "1rem" }}>
            Trash bin is empty
          </h3>
        </div>
      ) : (
        <TrashItems items={items} isSelected={isSelected} />
      )}
    </div>
  );
};

export default TrashBin;

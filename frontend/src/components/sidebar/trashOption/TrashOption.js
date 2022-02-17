import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import TrashBin from "../../trash/TrashBin";
import styles from "./TrashOption.module.scss";

const TrashOption = ({ isPreview, position }) => {
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  return (
    !isPreview && (
      <div style={{ alignSelf: "end" }}>
        {" "}
        <li key={`trash`} className={styles.trashOption}>
          <div className={styles.container}>
            <p onClick={() => setIsTrashOpen((prev) => !prev)}>
              <FiTrash /> Trash
            </p>
          </div>
        </li>
        {isTrashOpen && (
          <TrashBin
            sideBarWidth={parseInt(position)}
            handleClose={() => setIsTrashOpen(false)}
          />
        )}
      </div>
    )
  );
};

export default TrashOption;

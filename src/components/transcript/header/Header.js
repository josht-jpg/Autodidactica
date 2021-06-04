import React, { useState } from "react";
import styles from "./Header.module.scss";
import { MAIN_BLUE } from "../../../constants/styleConstants";
import ShareOptions from "../ShareOptions/ShareOptions";

const Header = ({
  width,
  isPreviewInit,
  handleEditPreviewSwitch,
  displayHeader,
  transcriptState,
}) => {
  const [isPreview, setIsPreview] = useState(isPreviewInit);

  const toggleButtons = [
    { button: "Edit", isSelected: !isPreview, isPreviewToggle: false },
    { button: "Preview", isSelected: isPreview, isPreviewToggle: true },
  ];

  const handleToggle = (isPreviewToggle) => {
    sessionStorage.setItem("isPreview", isPreviewToggle);
    setIsPreview(isPreviewToggle);
    handleEditPreviewSwitch(isPreviewToggle);
  };

  const showShareOptionsState = useState(false);
  const [showShareOptions, setShowShareOptions] = showShareOptionsState;

  const toggleStyles = (isSelected) => {
    return {
      color: isSelected && MAIN_BLUE,
      textDecoration: isSelected && "underline",
      opacity: !displayHeader && "0",
    };
  };

  return (
    <div
      className={styles.header}
      style={{
        width,
        height: !displayHeader && "0",
      }}
    >
      <div style={{ margin: "auto" }}>
        <h1
          className={styles.logo}
          style={{
            opacity: !displayHeader && "0",
          }}
        >
          <i>Autodidactica.</i>
        </h1>
      </div>

      <div className={styles.optionsContainer}>
        {toggleButtons.map((toggleButton) => (
          <div>
            <h3
              className={styles.headerItem}
              style={toggleStyles(toggleButton.isSelected)}
              onClick={() => handleToggle(toggleButton.isPreviewToggle)}
            >
              {toggleButton.button}
            </h3>
          </div>
        ))}

        <div>
          <h3
            className={styles.headerItem}
            style={{
              opacity: !displayHeader && "0",
            }}
          >
            {" "}
            |{" "}
          </h3>
        </div>

        <div>
          {showShareOptions && displayHeader && (
            <ShareOptions
              handleOptionsClose={() => setShowShareOptions(false)}
              transcriptState={transcriptState}
            />
          )}

          <h3
            className={styles.shareTranscript}
            style={{
              opacity: !displayHeader && "0",
            }}
            onClick={() => setShowShareOptions((prev) => !prev)}
          >
            Share Transcript
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Header;

import { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "./CurriculumTranscriptToggle.module.scss";

const CurriculumTranscriptToggle = ({ position, isTranscript, isPreview }) => {
  const [isCurriculum, setIsCurriculum] = useState(!isTranscript);
  const [isCurriculumHover, setIsCurriculumHover] = useState(false);
  const [isTranscriptHover, setIsTranscriptHover] = useState(false);

  const isCurriculumHighlight = () =>
    (isCurriculum || isCurriculumHover) && !isTranscriptHover;

  const handleCurriculumClick = () => {
    if (!isPreview && isTranscript) {
      history.push("/dashboard/days");
    }
    setIsCurriculum(!isPreview);
  };

  const handleTranscriptClick = () => {
    if (!isPreview) {
      history.push("/transcript");
    }
  };

  const history = useHistory();

  return position < 195 ? (
    <div className={styles.smallContainer} style={{ height: isPreview && "0" }}>
      <div
        className={isCurriculumHighlight() && styles.highlight}
        style={{
          opacity: isPreview ? "0" : "1",
          display: "block",
          flexBasis: "100%",
        }}
        onMouseEnter={() => setIsCurriculumHover(true)}
        onMouseLeave={() => setIsCurriculumHover(false)}
        onClick={() => handleCurriculumClick(!isPreview)}
      >
        <h3>Curriculum</h3>
      </div>
      <hr
        style={
          isPreview
            ? { opacity: "0" }
            : { opacity: "1", margin: "auto", width: "75px" }
        }
      />
      <div
        className={!isCurriculumHighlight() && styles.highlight}
        style={{
          opacity: isPreview ? "0" : "1",
          display: "block",
        }}
        onMouseEnter={() => setIsTranscriptHover(true)}
        onMouseLeave={() => setIsTranscriptHover(false)}
        onClick={() => handleTranscriptClick()}
      >
        <h3>Transcript</h3>
      </div>
    </div>
  ) : (
    <div
      className={styles.largeContainer}
      style={{ height: isPreview && "0px" }}
    >
      <span
        className={isCurriculumHighlight() && styles.highlight}
        style={
          isPreview
            ? {
                opacity: "0",
                cursor: "default",
              }
            : { borderRight: "1px solid gray" }
        }
        onMouseEnter={() => setIsCurriculumHover(true)}
        onMouseLeave={() => setIsCurriculumHover(false)}
        onClick={() => handleCurriculumClick(!isPreview)}
      >
        <h3>Curriculum</h3>
      </span>
      <span
        className={!isCurriculumHighlight() && styles.highlight}
        style={
          isPreview
            ? { opacity: "0", cursor: "default" }
            : {
                order: "2",
                marginLeft: "auto",
                borderLeft: "1px solid gray",
              }
        }
        onMouseEnter={() => setIsTranscriptHover(true)}
        onMouseLeave={() => setIsTranscriptHover(false)}
        onClick={() => handleTranscriptClick()}
      >
        <h3>Transcript</h3>
      </span>
    </div>
  );
};

export default CurriculumTranscriptToggle;

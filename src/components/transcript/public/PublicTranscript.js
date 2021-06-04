import React, { useState, useEffect, useRef } from "react";
import Loader from "../../Loader";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../sidebar/SideBar";
import TranscriptTimeline from "../transcriptTimeline/TranscriptTimeline";
import CoreEditables from "../../editables/CoreEditables";
import TranscriptTitle from "../trasncriptTitle/TranscriptTitle";
import TranscriptMaterials from "../transcriptMaterials/TranscriptMaterials";
import styles from "../Transcript.module.scss";
import { getPublicTranscript } from "../../../actions/transcriptActions";
import PublicHeader from "./PublicHeader";
import getTranscriptId from "../../../utils/getTranscriptId";
import useResizeHandler from "../../../customHooks/useResizeHandler";
import useScreenSetup from "../../../customHooks/useScreenSetup";

const materialTypes = [
  "ACCOMPLISHMENTS",
  "PROJECTS",
  "RESOURCES",
  "EXERCISES",
  "NOTEPADS",
];

const Transcript = () => {
  const { sidebarWidthState, isMinSidebarWidthState } = useScreenSetup(true);
  const [sidebarWidth] = sidebarWidthState;
  const [isMinSidebarWidth, setIsMinSidebarWidth] = isMinSidebarWidthState;

  const publicTranscriptData = useSelector(
    (state) => state.publicTranscriptData
  );
  const { loading, error, transcript } = publicTranscriptData;

  const transcriptId = getTranscriptId();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPublicTranscript(transcriptId));
  }, [dispatch, transcriptId]);

  const [displayHeader, setDisplayHeader] = useState(true);

  sessionStorage.setItem("isPreview", true);

  const editableElementState = useState(
    transcript && transcript.transcriptElements
  );

  const accomplishmentsRef = useRef(null);
  const projectsRef = useRef(null);
  const resourcesRef = useRef(null);
  const exercisesRef = useRef(null);
  const notesRef = useRef(null);
  const timelineRef = useRef(null);
  const scrollRefs = {
    accomplishmentsRef,
    projectsRef,
    resourcesRef,
    exercisesRef,
    notesRef,
    timelineRef,
  };

  const scrollTo = (type) =>
    scrollRefs[type] &&
    scrollRefs[type].current &&
    scrollRefs[type].current.scrollIntoView();

  const [selectedTimelineType, setSelectedTimelineType] = useState("days");

  const handleTimelineSelect = (timelineType) => {
    setSelectedTimelineType(timelineType);
  };

  const headerKey = (headerType) => headerType.toLowerCase() + "Header";
  const refKey = (refType) => refType.toLowerCase() + "Ref";

  const [transcriptElementsState, setTranscriptElementsState] = useState([]);

  useEffect(() => {
    setTranscriptElementsState(transcript && transcript.transcriptElements);
  }, [publicTranscriptData, transcript]);

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  return (
    <div className={styles.gridContainer}>
      {loading ? (
        <Loader
          style={{
            justifySelf: "center",
            marginTop: "43vh",
            marginLeft: "calc(50vw - 30px)",
          }}
        />
      ) : error ? (
        error
      ) : transcript && transcript.isPublic ? (
        <>
          <PublicHeader width={width} displayHeader={displayHeader} />

          <div style={{ width: `${sidebarWidth}px` }}>
            <SideBar
              position={sidebarWidth}
              isPreviewMode={true}
              isMinWidth={isMinSidebarWidth}
              isTranscript={true}
              scrollTo={scrollTo}
              timeline={{
                handleTimelineSelect,
                timelineTypes: transcript && transcript.timeline.types,
              }}
              userInfo={transcript.userInfo}
            />
          </div>

          <div
            className={styles.transcript}
            style={{
              width,
              paddingTop: "45px",
            }}
          >
            {transcriptElementsState &&
              transcriptElementsState.map((element, index) => (
                <React.Fragment key={element._id}>
                  {element.type === "TITLE" ? (
                    <div style={{ marginTop: "1.25rem" }}>
                      <TranscriptTitle
                        title={transcript.userInfo.subject.title}
                        userName={transcript.userInfo.name}
                      />
                    </div>
                  ) : materialTypes.includes(element.type) ? (
                    transcript[element.type.toLowerCase()] &&
                    transcript[element.type.toLowerCase()].length > 0 && (
                      <TranscriptMaterials
                        header={transcript[headerKey(element.type)]}
                        materials={transcript[element.type.toLowerCase()]}
                        materialsType={element.type.toLowerCase()}
                        materialsRef={scrollRefs[refKey(element.type)]}
                        selectedItemWidth={selectedItemWidth}
                        setDisplayHeader={setDisplayHeader}
                      />
                    )
                  ) : element.type === "TIMELINE" ? (
                    <TranscriptTimeline
                      header={transcript.timelineHeader}
                      timelineRef={timelineRef}
                      timeline={transcript.timeline}
                      changeSelectedTimeline={handleTimelineSelect}
                      selectedTimelineType={selectedTimelineType}
                      widthStyles={{ selectedItemWidth, sidebarWidth }}
                      setDisplayHeader={setDisplayHeader}
                    />
                  ) : (
                    <CoreEditables
                      element={{
                        ...element,
                        unit: { ...transcript, type: "transcript" },
                        index,
                      }}
                      editableElements={editableElementState}
                    />
                  )}
                </React.Fragment>
              ))}
          </div>
        </>
      ) : (
        "This page is private for now. So sorry!"
      )}
    </div>
  );
};

export default Transcript;

import React, { useState, useEffect, useRef } from "react";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../sidebar/SideBar";
import { getTranscript } from "../../actions/transcriptActions";
import TranscriptTimeline from "./transcriptTimeline/TranscriptTimeline";
import Header from "./header/Header";
import AddElement from "../editables/addElement/AddElement";
import CoreEditables from "../editables/CoreEditables";
import TranscriptTitle from "./trasncriptTitle/TranscriptTitle";
import TranscriptMaterials from "./transcriptMaterials/TranscriptMaterials";
import { ELEMENT_MARGIN } from "../../constants/styleConstants";
import styles from "./Transcript.module.scss";
import useScreenSetup from "../../customHooks/useScreenSetup";
import useResizeHandler from "../../customHooks/useResizeHandler";
import replaceArrayElement from "../../utils/replaceArrayElement";

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

  const { title } = JSON.parse(localStorage.getItem("subject"));

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const transcriptData = useSelector((state) => state.transcriptData);
  const { loading, error, transcript } = transcriptData;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTranscript());
  }, [dispatch]);

  const [displayHeader, setDisplayHeader] = useState(true);

  const [isEditMode, setIsEditMode] = useState(
    !JSON.parse(sessionStorage.getItem("isPreview"))
  );

  const [isEditArray, setIsEditArray] = useState(false);
  const [isImageArray, setIsImageArray] = useState([]);
  const [isHoverArray, setIsHoverArray] = useState(false);
  const [editableElementsState, setEditableElementsState] = useState([]);
  const handleAddElement = (newElement, index) => {
    const result = [
      ...editableElementsState.slice(0, index),
      newElement,
      ...editableElementsState.slice(index),
    ];
    setEditableElementsState(result);
    transcript.transcriptElements = result;
  };
  const handleUpdateElement = (element, index) => {
    const result = replaceArrayElement(editableElementsState, element, index);
    transcript.transcriptElements = result;
  };
  const removeElementFromState = (index) => {
    let result = [...editableElementsState];
    result.splice(index, 1);
    transcript.transcriptElements = result;
    setEditableElementsState(result);
  };

  useEffect(() => {
    const falseArray = Array(
      transcript && transcript.transcriptElements.length
    ).fill(false);
    setIsEditArray(falseArray);
    setIsImageArray(falseArray);
    setIsHoverArray(falseArray);

    setEditableElementsState(transcript && transcript.transcriptElements);
  }, [transcriptData, transcript]);

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

  const [isAddSubjectScreen, setIsAddSubjectScreen] = useState(false);

  const handleEditPreviewSwitch = (isPreview) => {
    setIsEditMode(!isPreview);
    if (isPreview) {
      setIsEditArray(new Array(isEditArray.length).fill(false));
    }
  };

  const { width, selectedItemWidth } = useResizeHandler(
    setIsMinSidebarWidth,
    sidebarWidthState
  );

  const addElementContainerStyles = (index) => {
    return {
      height:
        isImageArray[index] && isEditMode
          ? isImageArray[index]
          : index < isEditArray.length && isEditArray[index]
          ? "60px"
          : isEditMode
          ? "35px"
          : "0",
      marginTop: isEditMode && (index === 0 ? "80px" : ELEMENT_MARGIN),
      marginBottom: isEditMode && ELEMENT_MARGIN,
      transition: "375ms",
    };
  };

  const headerKey = (headerType) => headerType.toLowerCase() + "Header";
  const refKey = (refType) => refType.toLowerCase() + "Ref";

  return (
    <div className={styles.gridContainer}>
      {!loading && (
        <Header
          width={width}
          isPreviewInit={!isEditMode}
          displayHeader={displayHeader}
          handleEditPreviewSwitch={handleEditPreviewSwitch}
          transcriptState={{
            isPublic: transcript && transcript.isPublic,
            toggle: () => (transcript.isPublic = !transcript.isPublic),
            _id: transcript && transcript._id,
          }}
        />
      )}
      <div style={{ width: `${sidebarWidth}px` }}>
        <SideBar
          position={sidebarWidth}
          isPreviewMode={!isEditMode}
          isMinWidth={isMinSidebarWidth}
          isTranscript={true}
          scrollTo={scrollTo}
          timeline={{
            handleTimelineSelect,
            timelineTypes: transcript && transcript.timeline.types,
          }}
          setIsAddSubjectScreen={setIsAddSubjectScreen}
        />
      </div>

      <div
        className={styles.transcript}
        style={{
          width,
          paddingTop: !isEditMode && "45px",
        }}
      >
        {loading ? (
          <Loader
            style={{
              textAlign: "center",
              marginTop: "38vh",
            }}
          />
        ) : error ? (
          error
        ) : (
          <>
            <div style={addElementContainerStyles(0)}>
              {isEditMode && (
                <AddElement
                  handleAddElement={handleAddElement}
                  setIsEditArray={setIsEditArray}
                  setIsImageArray={setIsImageArray}
                  index={0}
                  materialId={transcript && transcript._id}
                  isAddSubjectScreen={isAddSubjectScreen}
                  type="transcript"
                />
              )}
            </div>

            {editableElementsState &&
              editableElementsState.map((element, index) => (
                <React.Fragment key={element._id}>
                  {element.type === "TITLE" ? (
                    <TranscriptTitle title={title} userName={userInfo.name} />
                  ) : materialTypes.includes(element.type) ? (
                    <TranscriptMaterials
                      header={transcript[headerKey(element.type)]}
                      materials={transcript[element.type.toLowerCase()]}
                      materialsType={element.type.toLowerCase()}
                      isEditMode={isEditMode}
                      materialsRef={scrollRefs[refKey(element.type)]}
                      selectedItemWidth={selectedItemWidth}
                      setDisplayHeader={setDisplayHeader}
                    />
                  ) : element.type === "TIMELINE" ? (
                    <TranscriptTimeline
                      header={transcript.timelineHeader}
                      timelineRef={timelineRef}
                      timeline={transcript.timeline}
                      isEditMode={isEditMode}
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
                      isEditMode={isEditMode}
                      isHoverArrayState={{ isHoverArray, setIsHoverArray }}
                      editableElements={{
                        editableElementsState,
                        setEditableElementsState,
                        handleUpdateElement,
                        removeElementFromState,
                      }}
                      isAddSubjectScreen={isAddSubjectScreen}
                    />
                  )}

                  <div style={addElementContainerStyles(index + 1)}>
                    {isEditMode && (
                      <AddElement
                        handleAddElement={handleAddElement}
                        setIsEditArray={setIsEditArray}
                        setIsImageArray={setIsImageArray}
                        index={index + 1}
                        materialId={transcript && transcript._id}
                        isAddSubjectScreen={isAddSubjectScreen}
                        type="transcript"
                      />
                    )}
                  </div>
                </React.Fragment>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Transcript;

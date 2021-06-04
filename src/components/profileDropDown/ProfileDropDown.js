import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Loader from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  subjectsList,
  updateCurrentSubject,
} from "../../actions/subjectActions";
import useOutsideAlerter from "../../customHooks/useOutsideAlerter";
import { logout } from "../../actions/userActions";
import AddButton from "../button/AddButton";
import NewSubject from "../newSubject/NewSubject";
import isPublicMode from "../../utils/isPublicMode";
import { MAIN_BLUE } from "../../constants/styleConstants";
import styles from "./ProfileDropDown.module.scss";
import getSelectedItemWidth from "../../utils/getSelectedItemWidth";
import Option from "./Option";
import DeleteAccountPrompt from "./deleteAccountPrompt/DeleteAccountPrompt";
import MessagePrompt from "./messagePrompt/MessagePrompt";

const ProfileDropDown = ({
  handleClose,
  userInfo,
  setIsAddSubjectScreen,
  position,
}) => {
  const isPreview = JSON.parse(sessionStorage.getItem("isPreview"));

  const listSubjects = useSelector((state) => state.listSubjects);
  let { loading, subjects } = listSubjects;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subjectsList());
  }, [dispatch]);

  const [isAddSubject, setIsAddSubject] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, handleClose, isAddSubject);

  const [selectedSubject, setSelectedSubject] = useState(
    isPublicMode()
      ? userInfo.subject
      : JSON.parse(localStorage.getItem("subject"))
  );

  const showSubject = (subject) =>
    !isPreview || subject.isPublic || subject._id === selectedSubject._id;

  if (subjects) {
    subjects = subjects.filter((subject) => showSubject(subject));
  }

  const [isSubjectsSelected, setIsSubjectsSelected] = useState(isPreview);

  const handleAddSubjectSelect = () => {
    setIsAddSubject(true);
    setIsAddSubjectScreen && setIsAddSubjectScreen(true);
  };

  const history = useHistory();

  const handleSubjectChange = async (subject) => {
    if (isPublicMode()) {
      history.push(`/public/${subject.transcript}`);
    } else {
      localStorage.setItem("subject", JSON.stringify(subject));
      dispatch(updateCurrentSubject(subject));
      await setSelectedSubject(subject);
    }
    window.location.reload();
  };

  const handleLogout = () => {
    dispatch(logout());
    history.push("/");
    window.location.reload();
  };

  const [messageType, setMessageType] = useState(false);

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  const [newSubjectScreenWidth, setNewSubjectScreenWidth] = useState(
    getSelectedItemWidth(window.innerWidth, position)
  );

  const handleWindowResize = () => {
    setNewSubjectScreenWidth(getSelectedItemWidth(window.innerWidth, position));
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const newSubjectContainerStyles = {
    width: newSubjectScreenWidth,
    position: "fixed",
    right: "calc(1.6% - 6px)",
    justifySelf: "center",
    height: "50vh",
    marginTop: "12vh",
    boxShadow: "gray 0 0 18px",
    alignItems: "center",
    overflow: "auto",
  };

  const options = [
    { text: "Log out", action: handleLogout },
    { text: "Delete account", action: () => setShowDeletePrompt(true) },
    {
      text: "Suggest improvements",
      action: () => setMessageType("improvement"),
    },
    {
      text: "Chat with us about what your learning",
      action: () => setMessageType("chat"),
    },
  ];

  return (
    <div
      className={styles.profileDropDown}
      style={{
        background: isAddSubject && "transparent",
        boxShadow: isAddSubject && "none",
        minWidth: `${position}px`,
      }}
      ref={wrapperRef}
    >
      {showDeletePrompt && (
        <DeleteAccountPrompt handleClose={() => setShowDeletePrompt(false)} />
      )}
      {messageType && (
        <MessagePrompt
          messageType={messageType}
          handleClose={() => setMessageType(false)}
        />
      )}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader
            type="Oval"
            color="#0062e3"
            height={38}
            width={38}
            timeout={15000}
          />
        </div>
      ) : (
        <>
          {isAddSubject ? (
            <div style={{ position: "absolute" }}>
              <NewSubject
                containerStyles={newSubjectContainerStyles}
                handleClose={handleClose}
              />
            </div>
          ) : (
            <>
              <h1 className={styles.logo}>
                <i>Autodidactica.</i>
              </h1>
              <hr style={{ width: "17ch", marginBottom: "4px" }} />
              <p className={styles.nameContainer}>
                <span className={styles.nameIcon}>{userInfo.name[0]}</span>{" "}
                {userInfo.name}
              </p>
              <h3
                className={styles.option}
                onClick={() => setIsSubjectsSelected((prev) => !prev)}
              >
                {isPreview ? `${userInfo.name}'s Subjects ` : "My Subjects "}
                {isSubjectsSelected ? (
                  <FaAngleUp className={styles.arrow} />
                ) : (
                  <FaAngleDown s className={styles.arrow} />
                )}
              </h3>

              <hr style={{ marginBottom: "0px" }} />

              <div
                style={{
                  maxHeight: isSubjectsSelected
                    ? subjects && `${subjects.length * 66}px`
                    : "0px",
                  minHeight: isSubjectsSelected ? "150px" : "0px",
                  transition: "315ms",
                  overflow: isSubjectsSelected ? "auto" : "hidden",
                }}
              >
                {subjects &&
                  subjects.map((subject, index) => (
                    <React.Fragment key={subject._id}>
                      <h3
                        className={styles.option}
                        style={{
                          color:
                            subject._id === selectedSubject._id && MAIN_BLUE,
                        }}
                        onClick={() => handleSubjectChange(subject)}
                      >
                        {subject.title}
                      </h3>
                      {(!isPreview || index !== subjects.length - 1) && <hr />}
                    </React.Fragment>
                  ))}
                {!isPreview && (
                  <AddButton type={"Subject"} action={handleAddSubjectSelect} />
                )}
                <hr />
              </div>

              {options.map(
                (option) => !isPreview && <Option option={option} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileDropDown;

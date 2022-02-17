import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import isPublicMode from "../../../utils/isPublicMode";
import ProfileDropDown from "../../profileDropDown/ProfileDropDown";
import styles from "./User.module.scss";

const User = ({ setIsAddSubjectScreen, userInfo, position }) => {
  const userLogin = useSelector((state) => state.userLogin);
  if (!userInfo) {
    userInfo = userLogin.userInfo;
  }

  const subjectTitle = isPublicMode()
    ? userInfo.subject.title
    : JSON.parse(localStorage.getItem("subject")) &&
      JSON.parse(localStorage.getItem("subject")).title;

  const [isProfileSelected, setIsProfileSelected] = useState(false);
  const handleProfileClose = () => {
    setIsProfileSelected(false);
    setIsAddSubjectScreen && setIsAddSubjectScreen(false);
  };
  return (
    <>
      <p className={styles.name} onClick={() => setIsProfileSelected(true)}>
        <span className={styles.userIcon}>{userInfo && userInfo.name[0]}</span>{" "}
        {userInfo && userInfo.name}
        <FaChevronDown className={styles.dropDownIcon} />
      </p>

      {isProfileSelected && (
        <ProfileDropDown
          handleClose={handleProfileClose}
          setIsAddSubjectScreen={setIsAddSubjectScreen}
          userInfo={userInfo}
          position={position}
        />
      )}

      <hr className={styles.divider} />
      <p className={styles.subject}>{subjectTitle}</p>
    </>
  );
};

export default User;

import styles from "./ProfileDropDown.module.scss";

const Option = ({ option }) => {
  return (
    <>
      <h3 className={styles.option} onClick={option.action}>
        {option.text}
      </h3>
      <hr />
    </>
  );
};

export default Option;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotepad } from "../../../../actions/notepadActions";
import Select from "react-select";
import ProjectOption from "../../../select/selectOptions/projectOption/ProjectOption";
import {
  MultiValueContainer,
  MultiValueRemove,
} from "../../../select/MultiValue";
import { FaStickyNote } from "react-icons/fa";
import { listProjects } from "../../../../actions/projectActions";
import { listBooks } from "../../../../actions/resourceActions";
import { listExercises } from "../../../../actions/exerciseActions";
import BookOption from "../../../select/selectOptions/bookOption/BookOption";
import ExerciseOption from "../../../select/selectOptions/exerciseOption/ExerciseOption";
import capitalizeFirstLetter from "../../../../utils/capitalizeFirstLetter";
import styles from "./AddNotepadScreen.module.scss";
import BackButton from "../backButton/BackButton";

const AddNotepadScreen = ({
  type,
  handleAdd,
  handleClose,
  dashboardWidth,
  selectedMaterial,
}) => {
  const projectList = useSelector((state) => state.projectList);
  const { projects } = projectList;

  const bookList = useSelector((state) => state.bookList);
  const { books } = bookList;

  const exerciseList = useSelector((state) => state.exerciseList);
  const { exercises } = exerciseList;

  const options = { projects, resources: books, exercises };

  const [name, setName] = useState("");

  const [material, setMaterial] = useState(selectedMaterial);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedMaterial) {
      if (type === "resource") {
        dispatch(listBooks());
      } else if (type === "project") {
        dispatch(listProjects());
      } else if (type === "exercise") {
        dispatch(listExercises());
      }
    }
  }, [dispatch, selectedMaterial, type]);

  const submitHandler = () => {
    dispatch(
      addNotepad(name ? name : `${material[0].title} Notepad`, material, type)
    );
    handleAdd && handleAdd();
    handleClose();
  };

  return (
    <div className={styles.addNotepadScreen} style={{ width: dashboardWidth }}>
      <BackButton action={handleClose} />

      <form
        className={styles.form}
        noValidate
        action="/upload"
        encType="multipart/form-data"
      >
        <h1>
          <FaStickyNote />
        </h1>

        <div
          className={`${styles.inputContainer} new-book-search`}
          style={{ marginBottom: material && "4rem" }}
        >
          <label className={styles.label}>{capitalizeFirstLetter(type)}</label>
          <Select
            isMulti
            value={material}
            className="basic-multi-select"
            placeholder=""
            options={
              !material &&
              options[type + "s"] &&
              options[type + "s"].slice().reverse()
            }
            isSearchable={!material}
            getOptionLabel={(option) =>
              type === "project" ? (
                <ProjectOption option={option} />
              ) : type === "resource" ? (
                <BookOption option={option} />
              ) : (
                type === "exercise" && <ExerciseOption option={option} />
              )
            }
            getOptionValue={(option) => option.title}
            components={{ MultiValueRemove, MultiValueContainer }}
            styles={{
              multiValue: (base) => ({
                ...base,
                backgroundColor: "transparent",
              }),
            }}
            onChange={(val) => setMaterial(val)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label}>Notepad Name (optional)</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder={""}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button className={styles.submit} onClick={submitHandler}>
          Create Notepad
        </button>
      </form>
    </div>
  );
};

export default AddNotepadScreen;

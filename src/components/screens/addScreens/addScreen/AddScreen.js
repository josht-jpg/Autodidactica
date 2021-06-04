import AddBookScreen from "../addBookScreen/AddBookScreen";
import AddProjectScreen from "../addProjectScreen/AddProjectScreen";
import AddExerciseScreen from "../addExerciseScreen/AddExerciseScreen";
import styles from "./AddScreen.module.scss";
import BackButton from "../backButton/BackButton";

const DEFAULT_Z_INDEX = 1007;

const AddScreen = ({
  type,
  width,
  handleAdd,
  handleCloseAddScreen,
  nestLevel,
}) => {
  return (
    <div
      className={styles.addScreen}
      style={{
        width,
        zIndex: nestLevel ? DEFAULT_Z_INDEX + nestLevel : DEFAULT_Z_INDEX,
      }}
    >
      <BackButton action={handleCloseAddScreen} />

      {type === "project" ? (
        <AddProjectScreen
          handleAddProject={handleAdd}
          handleCloseAddScreen={handleCloseAddScreen}
        />
      ) : type === "book" ? (
        <AddBookScreen
          handleAddBook={handleAdd}
          handleCloseAddScreen={handleCloseAddScreen}
        />
      ) : (
        type === "exercise" && (
          <AddExerciseScreen
            handleAddExercise={handleAdd}
            handleCloseAddScreen={handleCloseAddScreen}
          />
        )
      )}
    </div>
  );
};

export default AddScreen;

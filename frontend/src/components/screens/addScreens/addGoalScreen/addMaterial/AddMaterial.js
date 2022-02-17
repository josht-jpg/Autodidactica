import { FaPlusCircle } from "react-icons/fa";
import Select from "react-select";
import BookOption from "../../../../select/selectOptions/bookOption/BookOption";
import ExerciseOption from "../../../../select/selectOptions/exerciseOption/ExerciseOption";
import ProjectOption from "../../../../select/selectOptions/projectOption/ProjectOption";
import GoalOption from "../../../../select/selectOptions/goalOption/GoalOption";
import {
  MultiValueContainer,
  MultiValueRemove,
} from "../../../../select/MultiValue";
import styles from "./AddMaterial.module.scss";

const addNullToArray = (arr) => {
  return [...arr, null];
};

const reverseIndex = (arrayLength, index) => arrayLength - 1 - index;

const replaceElement = (arr, val, index) => {
  const result = [...arr];
  result[index] = val;
  return result;
};

const AddMaterial = ({
  type,
  newMaterialsState,
  materials,
  handleAddMaterial,
  showSelect,
}) => {
  const [newMaterials, setNewMaterials] = newMaterialsState;

  const handleMaterialChange = (val, index) => {
    val &&
      setNewMaterials((prev) =>
        replaceElement(prev, val[0], reverseIndex(prev.length, index))
      );
  };

  const handleMaterialClose = (index, e) => {
    e.preventDefault();

    setNewMaterials((prev) => [
      ...prev.slice(0, reverseIndex(prev.length, index)),
      ...prev.slice(reverseIndex(prev.length, index) + 1),
    ]);
  };

  const isSelected = (material) => (material ? true : false);

  return (
    <>
      <div>
        <h3 className={styles.header}>
          {type !== "Subgoal" ? `${type}s related to your goal` : "Subgoals"}
        </h3>

        <FaPlusCircle
          className={styles.addButton}
          onClick={() => setNewMaterials((prev) => addNullToArray(prev))}
        />
      </div>

      {newMaterials.length > 0 && <hr className={styles.divider} />}

      {newMaterials
        .slice()
        .reverse()
        .map((material, index) => {
          return (
            <>
              <div
                key={`add-goal-${material && material._id}`}
                className={styles.fadeIn}
                style={{ marginBottom: "1.25rem" }}
              >
                <div className={styles.inputContainer}>
                  <div style={{ marginBottom: "8px", paddingBottom: "20px" }}>
                    <button
                      className={styles.closeInputButton}
                      onClick={(e) => handleMaterialClose(index, e)}
                    >
                      x
                    </button>
                  </div>

                  <div onClick={handleAddMaterial}>
                    <h3
                      className={`${styles.addMaterialButton} ${
                        material ? styles.disabled : styles.clickable
                      }`}
                    >
                      {`${type === "Book" ? "Add" : "Create"} new ${
                        type !== "Subgoal" ? type : "Goal"
                      }`}
                    </h3>
                  </div>
                  <p className={styles.or}>or</p>

                  <label className={styles.selectLabel}>
                    {`Pick from your ${type !== "Subgoal" ? type : "Goal"}s`}
                  </label>
                  {showSelect && (
                    <Select
                      isMulti
                      value={material}
                      name={type}
                      className={`basic-multi-select ${
                        type === "Exercise" && "exercise-select"
                      }`}
                      placeholder=""
                      options={!material && materials.slice().reverse()}
                      isSearchable={!material}
                      getOptionLabel={(option) =>
                        type === "Project" ? (
                          <ProjectOption
                            option={option}
                            isSelected={isSelected(material)}
                          />
                        ) : type === "Book" ? (
                          <BookOption option={option} />
                        ) : type === "Exercise" ? (
                          <ExerciseOption
                            option={option}
                            isSelected={isSelected(material)}
                          />
                        ) : (
                          type === "Subgoal" && (
                            <GoalOption
                              option={option}
                              isSelected={isSelected(material)}
                            />
                          )
                        )
                      }
                      getOptionValue={(option) =>
                        option.title ? option.title : option.plan
                      }
                      components={{ MultiValueRemove, MultiValueContainer }}
                      styles={{
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: "transparent",
                        }),
                      }}
                      onChange={(val) => handleMaterialChange(val, index)}
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}

      <hr className={styles.divider} />
    </>
  );
};

export default AddMaterial;

import styles from "./ProjectCard.module.scss";

const ProjectCard = ({ project }) => {
  return (
    project && (
      <div style={{ paddingTop: !project.description && "12px" }}>
        {project.imageSrc && (
          <img
            className={styles.projectThumbnail}
            src={project.imageSrc}
            style={{ marginLeft: !project.description && "10px" }}
            alt={project.title}
          />
        )}
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{project.title}</h3>
        </div>
        {project.description && (
          <>
            {" "}
            <hr className={styles.divider} />
            <div className={styles.descriptionContainer}>
              <p className={styles.description}>{project.description}</p>
            </div>
          </>
        )}
      </div>
    )
  );
};

export default ProjectCard;

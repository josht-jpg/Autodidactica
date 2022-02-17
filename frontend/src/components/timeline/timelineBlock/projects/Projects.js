import styles from "./Projects.module.scss";

const Projects = ({ projects }) => {
  return projects.map((project) => (
    <div
      key={`project-display-${project._id}`}
      style={{ margin: "17px auto 17px auto" }}
    >
      {project && (
        <div className={styles.container}>
          <p className={styles.title}>{project.title}</p>

          <img
            src={project.imageSrc}
            className={styles.thumbnail}
            alt={`Cover of ${project.title}`}
          />
        </div>
      )}
    </div>
  ));
};

export default Projects;

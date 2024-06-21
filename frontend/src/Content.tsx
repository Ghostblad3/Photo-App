import Databases from "./databases-view/Databases";
import ImagesView from "./images-view/ImagesView";
import styles from "./content.module.css";

function Content({ currentComponent }: { currentComponent: number }) {
  return (
    <div className={styles.content}>
      {currentComponent === 0 ? <Databases /> : null}
      {currentComponent === 2 ? <ImagesView /> : null}
    </div>
  );
}

export default Content;

import { useState } from "react";
import Content from "./Content";
import Menu from "./Menu";
import styles from "./layout.module.css";

function Layout() {
  const [currentComponent, setCurrentComponent] = useState(0);

  return (
    <div className={styles.body}>
      <div className={styles.layout}>
        <Menu
          currentComponent={currentComponent}
          setCurrentComponent={setCurrentComponent}
        />
        <Content currentComponent={currentComponent} />
      </div>
    </div>
  );
}

export default Layout;

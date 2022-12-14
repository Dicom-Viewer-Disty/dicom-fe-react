import React from "react";
import DashboardNav from "../../components/navbars/dashboard-nav/DashboardNav";
import DashboardSidebar from "../../components/sidebars/dashboard-sidebar/DashboardSidebar";
import styles from "./DashboardLayout.module.css";
function DashboardLayout(props) {
  return (
    <>
      <div className={styles.wrapper}>
        <DashboardNav />
        <div className={styles.main}>
          <DashboardSidebar />
          <div className={styles.content}>{props.children}</div>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;

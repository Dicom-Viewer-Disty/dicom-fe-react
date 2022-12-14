import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Setting.module.css";
import Bank from "../bank/Bank";
import City from "../kota/City";
import { Typography, Breadcrumbs } from "@mui/material";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
function Setting() {
  const location = useLocation();
  return (
    <DashboardLayout>
      <div className={styles.wrapper}>
        <div className={styles.topWrapper}>
          <h2 className={styles.pageTitle}>Pengaturan</h2>
          <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
            <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
              Home
            </Link>
            <Typography className={styles.breadUnactive}>Pengaturan</Typography>
          </Breadcrumbs>
        </div>
        <div className={styles.content}>
          <div className={styles.contentSidebar}>
            {location.search === "" ? (
              <Link
                to={{
                  pathname: "/setting",
                }}
                className={styles.navLinkColor}
              >
                Bank Admin
              </Link>
            ) : (
              <Link
                to={{
                  pathname: "/setting",
                }}
                className={styles.navLink}
              >
                Bank Admin
              </Link>
            )}
            {location.search === "?type=city" ? (
              <Link
                to={{
                  pathname: "/setting",
                  search: "?type=city",
                }}
                className={styles.navLinkColor}
              >
                Kota
              </Link>
            ) : (
              <Link
                to={{
                  pathname: "/setting",
                  search: "?type=city",
                }}
                className={styles.navLink}
              >
                Kota
              </Link>
            )}
          </div>
          <div className={styles.addAdmin}>
            {location.search === "" && (
              <div className={styles.addAdminContainer}>
                <Bank />
              </div>
            )}
            {location.search === "?type=city" && (
              <div className={styles.addAdminContainer}>
                <City />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Setting;

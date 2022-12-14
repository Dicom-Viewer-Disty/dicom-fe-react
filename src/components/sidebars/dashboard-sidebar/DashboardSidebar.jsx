import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./DashboardSidebar.module.css";
import {
  DashboardDark,
  DashboardColor,
  MoneyDark,
  MoneyColor,
  StatistikDark,
  StatistikColor,
  TransaksiDark,
  TransaksiColor,
  UserDark,
  UserColor,
  splashscreen,
  SettingLight,
  SettingDark,
  UserDark1,
  UserColor1,
} from "../../../assets/assets";
function DashboardSidebar() {
  let location = useLocation();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {location.pathname.slice(0, 10) === "/dashboard" ? (
          <Link to="/dashboard" className={styles.linkSidebarActive}>
            <img src={DashboardColor} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.textColor}>Dashboard</h5>
          </Link>
        ) : (
          <Link to="/dashboard" className={styles.linkSidebar}>
            <img src={DashboardDark} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.text}>Dashboard</h5>
          </Link>
        )}
        {location.pathname.slice(0, 13) === "/lihat-dicom" ? (
          <Link to="/lihat-dicom" className={styles.linkSidebarActive}>
            <img src={StatistikColor} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.textColor}>Dicom Viewer</h5>
          </Link>
        ) : (
          <Link to="/lihat-dicom" className={styles.linkSidebar}>
            <img src={StatistikDark} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.text}>Dicom Viewer</h5>
          </Link>
        )}
        {location.pathname.slice(0, 7) === "/dokter" ? (
          <Link to="/dokter" className={styles.linkSidebarActive}>
            <img src={UserColor} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.textColor}>Dokter</h5>
          </Link>
        ) : (
          <Link to="/dokter" className={styles.linkSidebar}>
            <img src={UserDark} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.text}>Dokter</h5>
          </Link>
        )}
        {location.pathname.slice(0, 7) === "/pasien" ? (
          <Link to="/pasien" className={styles.linkSidebarActive}>
            <img src={UserColor1} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.textColor}>Pasien</h5>
          </Link>
        ) : (
          <Link to="/pasien" className={styles.linkSidebar}>
            <img src={UserDark1} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.text}>Pasien</h5>
          </Link>
        )}
        {location.pathname.slice(0, 9) === "/setting" ? (
          <Link to="/setting" className={styles.linkSidebarActive}>
            <img src={SettingLight} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.textColor}>Pengaturan</h5>
          </Link>
        ) : (
          <Link to="/setting" className={styles.linkSidebar}>
            <img src={SettingDark} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.text}>Pengaturan</h5>
          </Link>
        )}
      </div>
      {/* <div className={styles.footerSidebar}>
        <img src={splashscreen} className={styles.splash} alt="splash screen" />
      </div> */}
    </div>
  );
}

export default DashboardSidebar;

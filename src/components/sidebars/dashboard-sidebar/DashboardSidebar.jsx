import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Skeleton, message } from "antd";
import { logout } from "../../../utils/auth";
import { BASE_API_URL } from "../../../helper/url";
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
  // const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user)
  const history = useHistory();
  let location = useLocation();
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    var config = {
      method: 'get',
      url: `${BASE_API_URL}/me`,
    };

    axios(config)
      .then(function (response) {
        setData(response.data)
        localStorage.setItem("user", JSON.stringify(response.data));
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.status === 401) {
          logout();
          message.error("Sesi telah habis, silahkan login kembali");
          history.replace("/");
        }
        console.log(error);
      });
  }, []);
  return (
    <div className={styles.wrapper}>
      {
        loading ? <Skeleton /> : (

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
            {data.role.role === "admin" &&
              <>
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
              </>
            }
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
            {/* {location.pathname.slice(0, 9) === "/setting" ? (
          <Link to="/setting" className={styles.linkSidebarActive}>
            <img src={SettingLight} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.textColor}>Pengaturan</h5>
          </Link>
        ) : (
          <Link to="/setting" className={styles.linkSidebar}>
            <img src={SettingDark} alt="icon sidebar" className={styles.iconSidebar} />
            <h5 className={styles.text}>Pengaturan</h5>
          </Link>
        )} */}
          </div>
        )
      }
      {/* <div className={styles.footerSidebar}>
        <img src={splashscreen} className={styles.splash} alt="splash screen" />
      </div> */}
    </div>
  );
}

export default DashboardSidebar;

import React, { useState, useEffect } from "react";
//dependency component
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../../utils/auth";
import { BASE_API_URL } from "../../../helper/url";
import axios from "axios";
//my own components
import styles from "./DashboardNav.module.css";
//framework components
import { NavDropdown } from "react-bootstrap";
import { message, Tooltip, Skeleton } from "antd";
//images
import { LogoVector, MdNotificationsNone, FaUserCircle } from "../../../assets/assets";
import { MdNotifications } from "react-icons/md";
function DashboardNav() {
  //state/variable
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user-detail"));
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



  //handle logout
  const _onLogout = () => {
    logout();
    message.error("Logout berhasil");
    history.replace("/");
  };
  return (
    <div className={styles.wrapper}>
      {
        loading ? <Skeleton /> : (
          <div className={styles.container}>
            <div className={styles.left}>
              {/* <img src={LogoVector} alt="logo bantubantuin" className={styles.logo} /> */}
              <h4 className={styles.leftTitle}>{data.role.role === "admin" ? "Super Administrator" : "Dokter"}</h4>
            </div>
            <div className={styles.right}>
              {/* <Link className={styles.iconUserBox} to={{ pathname: "/profile", search: "?type=notifikasi" }}>
                <Tooltip placement="bottom" title={"Notifikasi"}>
                  <MdNotifications className={styles.iconUser} />
                </Tooltip>
              </Link> */}
              <div className={styles.user}>
                {/* <FaUserCircle className={styles.navbarAvatar} /> */}
                <img className={styles.navbarAvatar} src={`http://localhost:3000/${data.profileImage}`} />
                <NavDropdown className={styles.dropdownContainer} title={<span className={styles.userName}>{data.name}</span>}>
                  <NavDropdown.Item href="/profile">Lihat akun</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={_onLogout}>Keluar</NavDropdown.Item>
                </NavDropdown>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default DashboardNav;

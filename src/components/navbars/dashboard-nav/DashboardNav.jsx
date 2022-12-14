import React from "react";
//dependency component
import { Link, useHistory } from "react-router-dom";
//my own components
import styles from "./DashboardNav.module.css";
import { logout } from "../../../utils/auth";
//framework components
import { NavDropdown } from "react-bootstrap";
import { message, Tooltip } from "antd";
//images
import { LogoVector, MdNotificationsNone, FaUserCircle } from "../../../assets/assets";
import { MdNotifications } from "react-icons/md";
function DashboardNav() {
  //state/variable
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user-detail"));
  //handle logout
  const _onLogout = () => {
    logout();
    message.error("Logout berhasil");
    history.replace("/");
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <img src={LogoVector} alt="logo bantubantuin" className={styles.logo} />
          <h4 className={styles.leftTitle}>Super Administrator</h4>
        </div>
        <div className={styles.right}>
          <Link className={styles.iconUserBox} to={{ pathname: "/profile", search: "?type=notifikasi" }}>
            <Tooltip placement="bottom" title={"Notifikasi"}>
              <MdNotifications className={styles.iconUser} />
            </Tooltip>
          </Link>
          <div className={styles.user}>
            <FaUserCircle className={styles.navbarAvatar} />
            <NavDropdown className={styles.dropdownContainer} title={<span className={styles.userName}>maskurnia shidi</span>}>
              <NavDropdown.Item href="/profile">Lihat akun</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={_onLogout}>Keluar</NavDropdown.Item>
            </NavDropdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;

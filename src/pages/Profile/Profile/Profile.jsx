import React from "react";
import styles from "./Profile.module.css";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import { DefaultAvatar, UserDark } from "../../../assets/assets";
import { RiUserFill, RiNotification3Fill, RiLockPasswordFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import AllNotifications from "../Notifications/AllNotification/AllNotifications";
import MyAccount from "../MyAccount/MyAccount";
import ResetPassword from "../ResetPassword/ResetPassword";
function Profile(props) {
  const location = useLocation();
  // var user = JSON.parse(localStorage.getItem("user-detail"));
  // console.log(user.data);
  return (
    <DashboardLayout className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          {/* <div className={styles.profileDetailLeft}>
            {user.photo_profile === null ? (
              <div className={styles.profilePictureContainerLeft}>
                <img src={DefaultAvatar} alt="avatar" className={styles.profilePictureItemLeft} />
              </div>
            ) : (
              <div className={styles.profilePictureContainerLeft}>
                <img src={user.photo_profile} alt="avatar" className={styles.profilePictureItemLeft} />
              </div>
            )}
            <p className={styles.profileNameLeft}>{user.data.name}</p>
          </div> */}
          <div className={styles.menuProfile}>
            <Link to="/profile" className={styles.menuItem}>
              <RiUserFill className={styles.menuIcon} />
              <p className={styles.menuText}>Akun Saya</p>
            </Link>
            {/* Reset password */}
            <Link to={{ pathname: "/profile", search: "?type=reset-password" }} className={styles.menuItem}>
              <RiLockPasswordFill className={styles.menuIcon} />
              <p className={styles.menuText}>Ubah Password</p>
            </Link>
            {/* <Link to="/profile" className={styles.menuItem}>
              <p className={styles.menuText}>ubah Profil</p>
            </Link>
            <Link to="/profile" className={styles.menuItem}>
              <p className={styles.menuText}>ubah Kata sandi</p>
            </Link> */}
            <Link to={{ pathname: "/profile", search: "?type=notifikasi" }} className={styles.menuItem}>
              <RiNotification3Fill className={styles.menuIconNotification} />
              <p className={styles.menuText}>Notifikasi</p>
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          {location.search === "" && (
            <>
              <MyAccount />
            </>
          )}
          {location.search === "?type=notifikasi" && (
            <>
              <AllNotifications />
            </>
          )}
          {location.search === "?type=reset-password" && (
            <>
              <ResetPassword />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;

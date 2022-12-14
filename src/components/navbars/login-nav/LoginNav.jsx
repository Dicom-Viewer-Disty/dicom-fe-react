import React from "react";
import { Link } from "react-router-dom";
import styles from "./LoginNav.module.css";
import { LogoText, AiFillFacebook, AiFillTwitterCircle, AiFillInstagram } from "../../../assets/assets";
import DistyLogo from "../../../assets/images/disty-logo.png";

function LoginNav() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link to="/">
          <img src={DistyLogo} alt="logo bantubantuin" className={styles.logonav} />
        </Link>
        <div className={styles.infoNav}>
          <a target="_blank" href="https://google.com" className={styles.linkNav}>
            Distyindonesia.com
          </a>
          <a target="_blank" href="https://www.google.com" className={styles.linkNav}>
            <AiFillFacebook className={styles.iconSosmed} />
          </a>
          <a target="_blank" href="https://www.instagram.com" to="/" className={styles.linkNav}>
            <AiFillInstagram className={styles.iconSosmed} />
          </a>
          <a target="_blank" href="https://facebook.com" to="/" className={styles.linkNav}>
            <AiFillTwitterCircle className={styles.iconSosmed} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginNav;

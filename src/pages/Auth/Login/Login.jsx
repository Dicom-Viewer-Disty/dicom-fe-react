//react component
import React, { useState } from "react";
import { Link } from "react-router-dom";
//dependency component
import axios from "axios";
//my own component
import styles from "./Login.module.css";
import LoginNav from "../../../components/navbars/login-nav/LoginNav";
import { login } from "../../../utils/auth";
import { EyeInvisibleOutlined, EyeTwoTone } from "../../../assets/assets";
import LoginLogo from "../../../assets/images/login-logo.png";
//framework component
import ReactLoading from "react-loading";
import { Input, message, Alert } from "antd";
function Login(props) {
  //state
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageVal, setMessageVal] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //handle change
  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  //handle submit login
  const handleLogin = () => {
    setLoading(true);
    let dataBody = JSON.stringify({
      email: user.email,
      password: user.password,
    });

    let config = {
      method: "post",
      url: "http://localhost:3000/api/v1/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: dataBody,
    };

    axios(config)
      .then(function (response) {
        login({
          email: user.email,
          token: Math.random(),
        });
        console.log(response);
        message.success("Login berhasil");
        setLoading(false);
        props.history.push("/dashboard");
      })
      .catch(function (error) {
        setLoading(false);
        setOpenAlert(true);
        if (error.response.status === 404) {
          setMessageVal("Pengguna tidak terdaftar");
        } else if (error.response.status === 400) {
          setMessageVal("Password anda salah");
        } else if (error.response.status === 500) {
          setMessageVal("error server");
        } else {
          setMessageVal("error tidak diketahui");
        }
      });
  };
  return (
    <div className={styles.wrapper}>
      <LoginNav />
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <h1 className={styles.title}>Dicom Viewer</h1>
          <p className={styles.description}>Lihat hasil file dicom dan kelola semua dalam aplikasi digital anda hanya di dicom viewer by Disty Teknologi Indonesia</p>
          <img src={LoginLogo} alt="maskot kurir" className={styles.maskotImage} />
        </div>
        <div className={styles.rightContent}>
          <div className={styles.formGroup}>
            <h3 className={styles.formTitle}>Masuk ke akun anda</h3>
            {/* alert */}
            <div className={styles.alertLogin}>
              {openAlert && (
                <Alert
                  className={styles.alertText}
                  message={messageVal}
                  type="error"
                  showIcon
                  closable
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                />
              )}
            </div>
            <div className={styles.formField}>
              <label htmlFor="whatsapp" className={styles.label}>
                Email
              </label>
              <Input required type="email" className={styles.input} name="email" value={user.email} onChange={handleChange} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="password" className={styles.label}>
                Kata Sandi
              </label>
              <Input.Password required name="password" className={styles.input} value={user.password} onChange={handleChange} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </div>
            <div className={styles.infoLogin}>
              <Link className={styles.linkForgetPw} to="/reset-password">
                Lupa kata sandi ?
              </Link>
            </div>
            <div className={styles.infoLogin}></div>
            {loading ? (
              <button disabled className={styles.btnLogin}>
                <ReactLoading className={styles.loadingLogin} type={props.balls} color={props.color} height={20} width={30} />
              </button>
            ) : (
              <button onClick={handleLogin} className={styles.btnLogin}>
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { Input, message } from "antd";
import axios from "axios";
import ReactLoading from "react-loading";
import { BASE_API_URL } from "../../../constant/url";
import { EyeInvisibleOutlined, EyeTwoTone } from "../../../assets/assets";
import styles from "./ResetPassword.module.css";
function ResetPassword(props) {
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
  });
  const [editable, setEditable] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [next, setNext] = useState(false);
  const [strongPassword, setStrongPassword] = useState(false);
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
  const handleChange = (event) => {
    setPassword({
      ...password,
      [event.target.name]: event.target.value,
    });
    setEditable(true);
    if (password.current_password !== "") {
      setNext(true);
    } else {
      setNext(false);
      setPassword({
        new_password: "",
      });
    }

    //check regex
    if (strongRegex.test(password.new_password)) {
      setStrongPassword(true);
    } else {
      setStrongPassword(false);
    }
    // console.log(password);
  };

  const changePassword = () => {
    setLoadingSubmit(true);
    const dataBody = new FormData();
    dataBody.append("current_password", password.current_password);
    dataBody.append("new_password", password.new_password);

    var config = {
      method: "post",
      url: `${BASE_API_URL}/api/v1/profile/update-password`,
      headers: {
        Accept: "application/json",
        "content-type": "multipart/form-data",
        Authorization: `${localStorage.getItem("TOKEN")}`,
      },
      data: dataBody,
    };

    axios(config)
      .then(function (response) {
        message.success("Kata sandi berhasil diubah");
        setLoadingSubmit(false);
        window.location.reload();
      })
      .catch(function (error) {
        // console.log(error.response);
        setLoadingSubmit(false);
        if (error.response.data === undefined) {
          message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
        } else if (!strongRegex.test(password.new_password)) {
          message.error("Kata sandi baru harus terdiri dari minimal 8 karakter. Kombinasi antara huruf kecil, kapital, dan angka");
        } else if (error.response.data.statusCode === 4001) {
          message.error("Kata sandi lama salah");
        } else if (error.response.data === 500 || error.response.status === 500) {
          message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
        } else {
          message.error(`Error tidak diketahui, kesalahan pada server`);
        }
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topWrapper}>
          <h3 className={styles.title}>Ubah Kata Sandi</h3>
          <p className={styles.titleDesc}>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.detailContainer}>
          <div className={styles.leftDetail}>
            <div className={styles.detailGroup}>
              <p className={styles.detailTitle}>Kata Sandi Lama</p>
              <Input.Password required onChange={handleChange} name="current_password" value={password.current_password} className={styles.formControl} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </div>
            {next ? (
              <>
                <div className={styles.detailGroup}>
                  <p className={styles.detailTitle}>Kata Sandi Baru</p>
                  <Input.Password required onChange={handleChange} name="new_password" value={password.new_password} className={styles.formControl} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                </div>
              </>
            ) : (
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Kata Sandi Baru</p>
                <Input.Password disabled onChange={handleChange} name="new_password" value={password.new_password} className={styles.formControl} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
              </div>
            )}
            <div className={styles.detailGroup}>
              <div className={styles.detailTitle}></div>
              {password.new_password !== "" && (
                <>
                  {!strongPassword && (
                    <p className={styles.formControl} style={{ fontSize: "14px" }}>
                      Kata sandi harus terdiri dari minimal 8 karakter. Kombinasi antara huruf kecil, kapital, dan angka
                    </p>
                  )}
                </>
              )}
            </div>

            {/* <Input type="text" className={styles.formControl} name="name" value={user.name} onChange={handleChange} /> */}
            <div className={styles.btnContainer}>
              {editable === true ? (
                <>
                  {loadingSubmit ? (
                    <button disabled className={styles.btnSave}>
                      <ReactLoading className={styles.loadingLogin} type={props.balls} color={props.color} height={20} width={30} />
                    </button>
                  ) : (
                    <button className={styles.btnSave} onClick={changePassword}>
                      Ubah
                    </button>
                  )}
                </>
              ) : (
                <button disabled className={styles.btnSaveDisabled}>
                  Ubah
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

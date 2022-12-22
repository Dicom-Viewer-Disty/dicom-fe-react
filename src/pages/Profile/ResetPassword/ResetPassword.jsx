import React, { useState } from "react";
import { Input, message } from "antd";
import axios from "axios";
import ReactLoading from "react-loading";
import { BASE_API_URL } from "../../../helper/url";
import { EyeInvisibleOutlined, EyeTwoTone } from "../../../assets/assets";
import styles from "./ResetPassword.module.css";
import { ToastContainer, toast } from 'react-toastify';
function ResetPassword(props) {
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));
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
    if(event.target.value !== ""){
      setEditable(true);
    }else{
      setEditable(false);
    }
    //check regex
    // if (strongRegex.test(password.current_password)) {
    //   setStrongPassword(true);
    // } else {
    //   setStrongPassword(false);
    // }
    // console.log(password);
  };

  const changePassword = () => {
    setLoadingSubmit(true);
    var dataBody = JSON.stringify({
      "password": password.current_password,
      "confirmPassword": password.new_password
    });

    var config = {
      method: 'patch',
      url: `${BASE_API_URL}/password/${user.id}`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : dataBody
    };

    axios(config)
    .then(function (response) {
       toast.success('Ubah Kata Sandi Berhasil', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      setLoadingSubmit(false);
    })
    .catch(function (error) {
      console.log(error);
      toast.error('Konfirmasi Password Tidak Cocok', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
      setLoadingSubmit(false);
    });

  };

  return (
    <div className={styles.wrapper}>
      <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
      <div className={styles.container}>
        <div className={styles.topWrapper}>
          <h3 className={styles.title}>Ubah Kata Sandi</h3>
          <p className={styles.titleDesc}>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.detailContainer}>
          <div className={styles.leftDetail}>
            <div className={styles.detailGroup}>
              <p className={styles.detailTitle}>Kata Sandi Baru</p>
              <Input.Password required onChange={handleChange} name="current_password" value={password.current_password} className={styles.formControl} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </div>
            <div className={styles.detailGroup}>
              <p className={styles.detailTitle}>Konfirmasi Kata Sandi</p>
              <Input.Password required onChange={handleChange} name="new_password" value={password.new_password} className={styles.formControl} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </div>
            <div className={styles.detailGroup}>
              <div className={styles.detailTitle}></div>
              {/* {password.current_password !== "" && (
                <>
                  {!strongPassword && (
                    <p className={styles.formControl} style={{ fontSize: "14px" }}>
                      Kata sandi harus terdiri dari minimal 8 karakter. Kombinasi antara huruf kecil, kapital, dan angka
                    </p>
                  )}
                </>
              )} */}
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

import React, { useState } from "react";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import styles from "./AddDoctor.module.css";
import { Link, useLocation } from "react-router-dom";
//components mui
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
//framework component
import ReactLoading from "react-loading";
import Modal from "react-bootstrap/esm/Modal";
import axios from "axios";
import { Input, Select, Skeleton, message, Button, Steps } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
//image/icon
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "../../../assets/assets";
const { Option } = Select;

function AddDoctor(props) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    password: "",
    confirmPassword: "",
    role: "",
    strNumber: "",
  });

  //handle change
  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeGender = (event) => {
    setUser({
      ...user,
      ["gender"]: event,
    });
  };

  const addDoctor = () => {
    setLoading(true);
    var dataBody = JSON.stringify({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber.toString(),
      gender: user.gender,
      password: user.password,
      confirmPassword: user.confirmPassword,
      role: 2,
    });
    console.log(dataBody);

    var config = {
      method: "post",
      url: "http://localhost:3000/api/v1/user",
      headers: {
        "Content-Type": "application/json",
      },
      data: dataBody,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        // post doctor
        var dataBody2 = JSON.stringify({
          strNumber: user.strNumber,
          birthDate: null,
          address: null,
          specialization: null,
          practicePlace: null,
          note: null,
          userId: response.data.user.id,
        });

        var config2 = {
          method: "post",
          url: "http://localhost:3000/api/v1/doctor",
          headers: {
            "Content-Type": "application/json",
          },
          data: dataBody2,
        };

        axios(config2)
          .then(function (response) {
            alert("tambah dokter berhasil");
            setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
            alert("tambah dokter gagal");
          });
        // end post doctor
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <DashboardLayout>
      <div className={styles.wrapper}>
        <div className={styles.topWrapper}>
          <h2 className={styles.pageTitle}>Tambah Dokter</h2>
          <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
            <Link className={styles.breadActive} to="/dashboard">
              Home
            </Link>
            <Link className={styles.breadActive} to="/pengguna">
              Dokter
            </Link>
            <Typography className={styles.breadUnactive} color="text.primary">
              Tambah Dokter
            </Typography>
          </Breadcrumbs>
        </div>
        <div className={styles.content}>
          <h4 className={styles.addAdminTitle}>Tambahkan Dokter Baru</h4>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Nama
              </label>
              <Input required type="text" name="name" value={user.name} onChange={handleChange} className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                No STR
              </label>
              <Input required type="text" name="strNumber" value={user.strNumber} onChange={handleChange} className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <Input required type="email" name="email" value={user.email} onChange={handleChange} className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="whatsapp" className={styles.formLabel}>
                No Whatsapp
              </label>
              <Input required type="number" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.formLabel}>
                Jenis Kelamin
              </label>
              <Select required defaultValue="" onChange={handleChangeGender} className={styles.formControl}>
                <Option value="L">Laki-laki</Option>
                <Option value="P">Perempuan</Option>
              </Select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <Input.Password required name="password" value={user.password} onChange={handleChange} className={styles.formControl} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Konfirmasi Password
              </label>
              <Input.Password required name="confirmPassword" value={user.confirmPassword} onChange={handleChange} className={styles.formControl} iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </div>
            {/* <div className={styles.msgPwError}>halo</div> */}
            <div className={styles.btnBox}>
              {loading ? (
                <button className={styles.btnAdd}>
                  <ReactLoading className={styles.loadingConfirm} type={props.balls} color={props.color} height={20} width={30} />
                </button>
              ) : (
                <button className={styles.btnAdd} onClick={addDoctor}>
                  Tambah Dokter
                </button>
              )}
            </div>
          </div>

          {/* succes modal */}
          {/* <Modal size="sm" show={modalSuccesShow}>
              <div className={styles.modalSucces}>
                <div className={styles.ModalImageSucces}>
                  <AiOutlineCheckCircle className={styles.iconSucces} />
                </div>
                <div className={styles.ModalTextSucces}>
                  <h5 className={styles.modalTitleSucces}>Pendaftaran Berhasil!</h5>
                  <p className={styles.modaldescSucces}>Akun super admin telah berhasil dibuat</p>
                </div>
                <button onClick={() => window.location.reload()} className={styles.btnCloseModalSucces}>
                  Kembali
                </button>
              </div>
            </Modal> */}

          {/* failed modal */}
          {/* <Modal size="sm" show={modalFailedShow}>
              <div className={styles.modalFailed}>
                <div className={styles.ModalImageFailed}>
                  <AiOutlineCloseCircle className={styles.iconFailed} />
                </div>
                <div className={styles.ModalTextFailed}>
                  <h5 className={styles.modalTitleFailed}>Pendaftaran Gagal!</h5>
                  <p className={styles.modaldescFailed}>{messageError}</p>
                </div>
                <button onClick={() => setModalFailedShow(false)} className={styles.btnCloseModalFailed}>
                  Kembali
                </button>
              </div>
            </Modal> */}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddDoctor;

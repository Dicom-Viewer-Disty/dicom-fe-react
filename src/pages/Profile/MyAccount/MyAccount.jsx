import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { BASE_API_URL } from "../../../constant/url";
import { logout } from "../../../utils/auth";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import { DefaultAvatar, UserDark } from "../../../assets/assets";
import styles from "./MyAccount.module.css";
import ReactLoading from "react-loading";
import { Timeline, message, Skeleton, Modal, Button, Space, Input, Tooltip, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
//var
const { Option } = Select;
function MyAccount(props) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [image, setImage] = useState(null);
  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "L",
    whatsapp: 1,
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const imageChange = (event) => {
    setEditable(true);
    setImage(URL.createObjectURL(event.target.files[0]));
    setProfilePic(event.target.files[0]);
    // console.log(event.target.files[0]);
    // console.log("testing");
    // setImageTitle("testing");
  };

  //handle change input
  const handleChange = (event) => {
    setEditable(true);
    // console.log(event);
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeGender = (event) => {
    setEditable(true);
    setUser({
      ...user,
      ["gender"]: event,
    });
  };

  useEffect(() => {
    var config = {
      method: "get",
      url: `${BASE_API_URL}/api/v1/profile/get-profile`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")}`,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response);
        setData(response.data.data);
        setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          gender: response.data.data.gender,
          whatsapp: response.data.data.whatsapp,
          photo_profile: response.data.data.photo_profile,
        });
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data === undefined) {
          message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
        } else if (error.response.status === 401) {
          logout();
          message.error("Sesi telah berakhir, silahkan login kembali!");
          history.push("/");
        } else {
          message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
        }
      });
  }, []);

  const updateProfile = () => {
    // console.log(user.whatsapp);
    setLoadingLogin(true);
    const dataBody = new FormData();
    dataBody.append("name", user.name);
    dataBody.append("email", user.email);
    dataBody.append("gender", user.gender);
    // dataBody.append("whatsapp", user.whatsapp);
    dataBody.append("photo_profile", profilePic);
    // console.log(profilePic);
    // console.log(user.gender);
    var config = {
      method: "post",
      url: `${BASE_API_URL}/api/v1/profile/update-account-data`,
      headers: {
        Accept: "application/json",
        "content-type": "multipart/form-data",
        Authorization: `${localStorage.getItem("TOKEN")}`,
      },
      data: dataBody,
    };

    axios(config)
      .then(function (response) {
        message.success("Update Profile berhasil");
        localStorage.setItem("user-detail", JSON.stringify(response.data));
        window.location.reload();
      })
      .catch(function (error) {
        setLoadingLogin(false);
        if (error.response.data === undefined) {
          message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
        } else if (error.response.data === 500 || error.response.status === 500) {
          message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
        } else {
          message.error(`Error tidak diketahui, kesalahan pada server`);
        }
      });
  };
  return (
    <div className={styles.wrapper}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className={styles.container}>
          <div className={styles.topWrapper}>
            <h3 className={styles.title}>Profil Saya</h3>
            <p className={styles.titleDesc}>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.detailContainer}>
            <div className={styles.leftDetail}>
              <div className={styles.detailGroupPicture}>
                <div className={styles.profileContainer}>
                  {profilePic === null ? (
                    <>{data.photo_profile === null ? <img src={DefaultAvatar} alt="avatar" className={styles.profilePicItem} /> : <img src={data.photo_profile} alt="avatar" className={styles.profilePicItem} />}</>
                  ) : (
                    <>
                      <img src={image} alt="avatar" className={styles.profilePicItem} />
                    </>
                  )}
                </div>
                <input className={styles.fileInput} type="file" accept="image/*" name="photo_profile" onChange={imageChange} />
                {/* <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Ubah gambar</Button>
                </Upload> */}
              </div>
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Nama</p>
                <Input type="text" className={styles.formControlWithMargin} name="name" value={user.name} onChange={handleChange} />
              </div>
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Email</p>
                <Input type="email" className={styles.formControlWithMargin} name="email" value={user.email} onChange={handleChange} />
              </div>
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Jenis Kelamin</p>
                <Select required defaultValue={user.gender === "L" ? "Laki-Laki" : "Perempuan"} className={styles.formControl} onChange={handleChangeGender}>
                  <Option value="L">Laki-laki</Option>
                  <Option value="P">Perempuan</Option>
                </Select>
              </div>
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Whatsapp</p>
                <Input addonBefore="+62" value={user.whatsapp} name="whatsapp" type="number" className={styles.formControl} />
              </div>
              {/* <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Whatsapp</p>
                <p className={styles.detailValue}>0{data.whatsapp}</p>
              </div> */}
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Role</p>
                <p className={styles.detailValue}>Super Admin</p>
              </div>
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Waktu Pembuatan Akun</p>
                <p className={styles.detailValue}>
                  {data.created_at.slice(8, 10)}-{data.created_at.slice(5, 7)}-{data.created_at.slice(0, 4)} {data.created_at.slice(11, 14)}
                  {data.created_at.slice(14, 17)}
                  {data.created_at.slice(17, 19)}
                </p>
              </div>
              <div className={styles.detailGroup}>
                <p className={styles.detailTitle}>Terakhir Ubah Akun</p>
                <p className={styles.detailValue}>
                  {data.updated_at.slice(8, 10)}-{data.updated_at.slice(5, 7)}-{data.updated_at.slice(0, 4)} {data.updated_at.slice(11, 14)}
                  {data.updated_at.slice(14, 17)}
                  {data.updated_at.slice(17, 19)}
                </p>
              </div>
              <div className={styles.btnContainer}>
                {editable === true ? (
                  <>
                    {loadingLogin ? (
                      <button disabled className={styles.btnSave}>
                        <ReactLoading className={styles.loadingLogin} type={props.balls} color={props.color} height={20} width={30} />
                      </button>
                    ) : (
                      <button className={styles.btnSave} onClick={updateProfile}>
                        Simpan
                      </button>
                    )}
                  </>
                ) : (
                  <button disabled className={styles.btnSaveDisabled}>
                    Simpan
                  </button>
                )}
              </div>
            </div>

            {/* <div className={styles.rightDetail}></div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAccount;

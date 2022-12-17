import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { BASE_API_URL } from "../../../helper/url";
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
    phoneNumber: 1,
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  // const imageChange = (event) => {
  //   setEditable(true);
  //   setImage(URL.createObjectURL(event.target.files[0]));
  //   setProfilePic(event.target.files[0]);
  // };

  //handle change input
  const handleChange = (event) => {
    setEditable(true);
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
      url: `${BASE_API_URL}/me`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")}`,
      },
    };

    axios(config)
      .then(function (response) {
        setData(response.data);
        setUser({
          name: response.data.name,
          email: response.data.email,
          gender: response.data.gender,
          phoneNumber: response.data.phoneNumber.slice(2),
        });
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  }, []);

  const updateProfile = () => {
    var dataBody = JSON.stringify({
      "name": user.name,
      "email": user.email,
      "gender": user.gender,
      "phoneNumber": "62" + user.phoneNumber,
    });

    var config = {
      method: 'patch',
      url: `${BASE_API_URL}/user/${data.id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataBody
    };

    axios(config)
      .then(function (response) {
        alert("berhasil")
      })
      .catch(function (error) {
        console.log(error);
        alert("gagal")
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
                {/* <div className={styles.profileContainer}>
                  {profilePic === null ? (
                    <>{data.profileImage === null ? <img src={DefaultAvatar} alt="avatar" className={styles.profilePicItem} /> : <img src={data.profileImage} alt="avatar" className={styles.profilePicItem} />}</>
                  ) : (
                    <>
                      <img src={image} alt="avatar" className={styles.profilePicItem} />
                    </>
                  )}
                </div> */}
                {/* <input className={styles.fileInput} type="file" accept="image/*" name="photo_profile" onChange={imageChange} /> */}
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
                <p className={styles.detailTitle}>No Telepon</p>
                <Input addonBefore="+62" value={user.phoneNumber} name="phoneNumber" type="number" className={styles.formControl} />
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

import React, { useState, useEffect } from "react";
import axios from "axios";
//dependency component
import { Link, useLocation, useHistory, useParams } from "react-router-dom";
//my own component
import styles from "./EditPatient.module.css";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import { BASE_API_URL } from "../../../helper/url";
import { logout } from "../../../utils/auth";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';
//framework component
import ReactLoading from "react-loading";
import { Typography, Breadcrumbs } from "@mui/material";
import { Select, Image, Timeline, Input, Tooltip, Skeleton, message } from "antd";
import { FaUserAlt, FaImage } from "react-icons/fa";
import { RiEBikeFill, RiBankCard2Fill } from "react-icons/ri";
import { DefaultAvatar } from "../../../assets/assets";
//var
const { TextArea } = Input;
const { Option } = Select;
function EditPatient(props) {
    const [status, setStatus] = useState("");
    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [reject, setReject] = useState(false);
    const [note, setNote] = useState("");
    const location = useLocation();
    const history = useHistory;
    const [profileImage, setProfileImage] = useState(null);
    const { id } = useParams();

    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        birthDate: "",
        profileImage: "",
        note: "",
        medicalRecordNumber: "",
        disease: "",
        address: "",
    });
    const [doctor, setDoctor] = useState({
        strNumber: "",
        address: "",
        practicePlace: "",
        specialization: "",
        birthDate: "",
    })

    const [patient, setPatient] = useState({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
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


    useEffect(() => {
        var config = {
            method: "get",
            url: `${BASE_API_URL}/patient/${id}`,
        };

        axios(config)
            .then(function (response) {
                setDetail(response.data);
                setUser(response.data);
                setUser({
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    phoneNumber: response.data.phoneNumber,
                    gender: response.data.gender,
                    birthDate: response.data.birthDate,
                    profileImage: response.data.profileImage,
                    note: response.data.note,
                    medicalRecordNumber: response.data.medicalRecordNumber,
                    disease: response.data.disease,
                    address: response.data.address
                });
                setDoctor({
                    strNumber: response.data.strNumber,
                    address: response.data.address,
                    practicePlace: response.data.practicePlace,
                    specialization: response.data.specialization,
                    birthDate: response.data.birthDate,
                });
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleChangeImage = (event) => {
        setProfileImage(event.target.files[0]);

    }


    const updateUser = () => {
        var dataBody = new FormData();
        dataBody.append('name', user.name);
        dataBody.append('profileImage', user.profileImage);
        dataBody.append('medicalRecordNumber', user.medicalRecordNumber);
        dataBody.append('birthDate', user.birthDate);
        dataBody.append('gender', user.gender);
        dataBody.append('phoneNumber', user.phoneNumber);
        dataBody.append('email', user.email);
        dataBody.append('address', user.address);
        dataBody.append('disease', user.disease);
        dataBody.append('note', user.note);
        if (profileImage !== null) {
            dataBody.append('profileImage', profileImage);
        }
        var config = {
            method: 'patch',
            url: `${BASE_API_URL}/patient/${id}`,
            "content-type": "multipart/form-data",
            data: dataBody
        };

        axios(config)
            .then(function (response) {
                toast.success('Mengedit Pasien Berhasil', {
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
            })
            .catch(function (error) {
                console.log(error);
                toast.error('Edit Pasien Gagal', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
    }

    return (
        <DashboardLayout>
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
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <h2 className={styles.pageTitle}>Edit Pasien</h2>
                    <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
                        <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
                            Home
                        </Link>
                        <Link className={styles.breadActive} underline="hover" color="inherit" to="/pasien">
                            Pasien
                        </Link>
                        <Typography className={styles.breadUnactive}>Edit Pasien</Typography>
                    </Breadcrumbs>
                </div>
            </div>
            {loading ? (
                <Skeleton />
            ) : (
                <div className={styles.detailContainer}>
                    <div className={styles.container}>
                        <div className={styles.leftContainer}>
                            <div className={styles.profile}>
                                <div className={styles.imageBoxProfile}>
                                    <Image src={`http://localhost:3000/${user.profileImage}`} className={styles.imageItemProfile} />
                                </div>
                                <div className={styles.topProfileText}>
                                    <h5 className={styles.name}>{detail.name}</h5>
                                    <p className={styles.type}>Pasien</p>
                                </div>
                            </div>
                            <div className={styles.mainDetail}>
                                <div className={styles.mainUserDetail}>
                                    <div className={styles.mainTitle}>
                                        <FaUserAlt className={styles.mainTitleIcon} />
                                        <h4 className={styles.mainTitleText}>Data Diri Pasien</h4>
                                    </div>
                                    <div className={styles.mainDetailData}>
                                        <div className={styles.mainLeftData}>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Foto Profile</p>
                                                <div className={styles.imageUpdate}>
                                                    {
                                                        profileImage !== null ?
                                                            <div className={styles.imageBox}>
                                                                {
                                                                    profileImage !== null && <Image src={URL.createObjectURL(profileImage)} alt="" className={styles.profileImagePic} />
                                                                }
                                                            </div> : <div className={styles.imageBox}>
                                                                <Image src={`http://localhost:3000/${user.profileImage}`} alt="" className={styles.profileImagePic} />
                                                            </div>
                                                    }
                                                    <input type="file" className={styles.imgUpdate} onChange={handleChangeImage} />
                                                </div>
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Nama</p>
                                                <Input value={user.name} name="name" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>No Medis</p>
                                                <Input type="number" value={user.medicalRecordNumber} name="medicalRecordNumber" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Jenis Kelamin</p>
                                                {/* <Input value={detail.user.gender} /> */}
                                                <Select value={user.gender} onChange={handleChangeGender} className={styles.formControl}>
                                                    <Option value="L">Laki-laki</Option>
                                                    <Option value="P">Perempuan</Option>
                                                </Select>
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Tanggal Lahir</p>
                                                <Input type="date" value={user.birthDate} name="birthDate" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Email</p>
                                                <Input type="email" value={user.email} name="email" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>No Whatsapp</p>
                                                <Input type="number" value={user.phoneNumber} name="phoneNumber" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Alamat</p>
                                                <Input value={user.address} name="address" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Penyakit</p>
                                                <Input value={user.disease} name="disease" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Catatan</p>
                                                <Input value={user.note} name="note" onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={updateUser} className={styles.btnSave}>Simpan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </DashboardLayout >
    );
}

export default EditPatient;

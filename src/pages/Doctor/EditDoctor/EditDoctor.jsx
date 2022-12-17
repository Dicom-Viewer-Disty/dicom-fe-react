import React, { useState, useEffect } from "react";
import axios from "axios";
//dependency component
import { Link, useLocation, useHistory, useParams } from "react-router-dom";
//my own component
import styles from "./EditDoctor.module.css";
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
function EditDoctor(props) {
    const [status, setStatus] = useState("");
    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [reject, setReject] = useState(false);
    const [note, setNote] = useState("");
    const location = useLocation();
    const history = useHistory;
    const { id } = useParams();

    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
    });
    const [doctor, setDoctor] = useState({
        strNumber: "",
        address: "",
        practicePlace: "",
        specialization: "",
        birthDate: "",
    })

    //handle change
    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value,
        });
        setDoctor({
            ...doctor,
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
            url: `${BASE_API_URL}/doctor/${id}`,
        };

        axios(config)
            .then(function (response) {
                setDetail(response.data);
                setUser(response.data);
                setUser({
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    phoneNumber: response.data.user.phoneNumber,
                    gender: response.data.user.gender
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


    const updateUser = () => {
        var dataUser = JSON.stringify({
            "name": user.name,
            "email": user.email,
            "gender": user.gender,
            "phoneNumber": user.phoneNumber,
        });

        var dataDoctor = JSON.stringify({
            "strNumber": doctor.strNumber,
            "birthDate": doctor.birthDate,
            "address": doctor.address,
            "specialization": doctor.specialization,
            "practicePlace": doctor.practicePlace,
        });

        var config = {
            method: 'patch',
            url: `${BASE_API_URL}/user/${detail.userId}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: dataUser
        };

        var config2 = {
            method: 'patch',
            url: `${BASE_API_URL}/doctor/${detail.userId}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: dataDoctor
        };

        axios(config)
            .then(function (response) {
                axios(config2)
                    .then(function (response) {
                        toast.success('Mengedit Dokter Berhasil', {
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
                        toast.error('Edit Dokter Gagal', {
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
                    });
            })
            .catch(function (error) {
                console.log(error);
                toast.error('Edit Dokter Gagal', {
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
                    <h2 className={styles.pageTitle}>Detail Partner Bantar</h2>
                    <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
                        <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
                            Home
                        </Link>
                        <Link className={styles.breadActive} underline="hover" color="inherit" to="/dokter">
                            Dokter
                        </Link>
                        <Typography className={styles.breadUnactive}>Edit Dokter</Typography>
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
                                    <Image src={DefaultAvatar} className={styles.imageItemProfile} />
                                </div>
                                <div className={styles.topProfileText}>
                                    <h5 className={styles.name}>{detail.user.name}</h5>
                                    <p className={styles.type}>Dokter</p>
                                </div>
                            </div>
                            <div className={styles.mainDetail}>
                                <div className={styles.mainUserDetail}>
                                    <div className={styles.mainTitle}>
                                        <FaUserAlt className={styles.mainTitleIcon} />
                                        <h4 className={styles.mainTitleText}>Data Diri Dokter</h4>
                                    </div>
                                    <div className={styles.mainDetailData}>
                                        <div className={styles.mainLeftData}>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Nama</p>
                                                <Input value={user.name} name="name" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>No STR</p>
                                                <Input type="number" value={doctor.strNumber} name="strNumber" onChange={handleChange} />
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
                                                <Input type="date" value={doctor.birthDate} name="birthDate" onChange={handleChange} />
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
                                                <Input value={doctor.address} name="address" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Tempat Praktek</p>
                                                <Input value={doctor.practicePlace} name="practicePlace" onChange={handleChange} />
                                            </div>
                                            <div className={styles.formField}>
                                                <p className={styles.titleDetail}>Spesialisasi</p>
                                                <Input value={doctor.specialization} name="specialization" onChange={handleChange} />
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

export default EditDoctor;

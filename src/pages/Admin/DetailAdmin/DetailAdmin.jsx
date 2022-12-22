import React, { useState, useEffect } from "react";
import axios from "axios";
//dependency component
import { Link, useLocation, useHistory, useParams } from "react-router-dom";
//my own component
import styles from "./DetailAdmin.module.css";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import { BASE_API_URL } from "../../../helper/url";
import { logout } from "../../../utils/auth";
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
function DetailAdmin(props) {
    const [status, setStatus] = useState("");
    const [detail, setDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [reject, setReject] = useState(false);
    const [note, setNote] = useState("");
    const location = useLocation();
    const history = useHistory;
    const { id } = useParams();

    useEffect(() => {
        var config = {
            method: "get",
            url: `${BASE_API_URL}/user/${id}`,
        };

        axios(config)
            .then(function (response) {
                setDetail(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    }, []);

    return (
        <DashboardLayout>
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <h2 className={styles.pageTitle}>Detail Dokter</h2>
                    <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
                        <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
                            Home
                        </Link>
                        <Link className={styles.breadActive} underline="hover" color="inherit" to="/admin">
                            Admin
                        </Link>
                        <Typography className={styles.breadUnactive}>Detail Admin</Typography>
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
                                    <h5 className={styles.name}>{detail.name}</h5>
                                    <p className={styles.type}>Admin</p>
                                </div>
                            </div>
                            <div className={styles.mainDetail}>
                                <div className={styles.mainUserDetail}>
                                    <div className={styles.mainTitle}>
                                        <FaUserAlt className={styles.mainTitleIcon} />
                                        <h4 className={styles.mainTitleText}>Data Diri Admin</h4>
                                    </div>
                                    <div className={styles.mainDetailData}>
                                        <div className={styles.mainLeftData}>
                                            <p className={styles.titleDetail}>Id</p>
                                            <p className={styles.titleDetail}>Nama</p>
                                            <p className={styles.titleDetail}>Jenis Kelamin</p>
                                            <p className={styles.titleDetail}>Email</p>
                                            <p className={styles.titleDetail}>No Whatsapp</p>
                                        </div>
                                        <div className={styles.mainRightData}>
                                            <p className={styles.textDetail}>: {detail.id}</p>
                                            <p className={styles.textDetail}>: {detail.name}</p>
                                            <p className={styles.textDetail}>: {detail.gender}</p>
                                            <p className={styles.textDetail}>: {detail.email}</p>
                                            <p className={styles.textDetail}>: 0{detail.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={styles.mainUserDetail}>
                  <div className={styles.mainTitle}>
                    <RiEBikeFill className={styles.mainTitleIcon} />
                    <h4 className={styles.mainTitleText}>Data Kendaraan</h4>
                  </div>
                  <div className={styles.mainDetailData}>
                    <div className={styles.mainLeftData}>
                      <p className={styles.titleDetail}>Plat Nomor</p>
                      <p className={styles.titleDetail}>Tipe Kendaraan</p>
                    </div>
                    <div className={styles.mainRightData}>
                      <p className={styles.textDetail}>: afjafo</p>
                    </div>
                  </div>
                </div> */}
                                {/* <div className={styles.mainUserDetail}>
                  <div className={styles.mainTitle}>
                    <RiBankCard2Fill className={styles.mainTitleIcon} />
                    <h4 className={styles.mainTitleText}>Data Rekening</h4>
                  </div>
                  <div className={styles.mainDetailData}>
                    <div className={styles.mainLeftData}>
                      <p className={styles.titleDetail}>Nama Rekening</p>
                      <p className={styles.titleDetail}>Nama Bank</p>
                      <p className={styles.titleDetail}>No Rekening</p>
                      <p className={styles.titleDetail}>Total Saldo</p>
                    </div>
                    <div className={styles.mainRightData}>
                      <p className={styles.textDetail}>: wpfjwpejf</p>
                    </div>
                  </div>
                </div> */}
                                {/* <div className={styles.mainUserDetail}>
                  <div className={styles.mainTitle}>
                    <FaImage className={styles.mainTitleIcon} />
                    <h4 className={styles.mainTitleText}>Data Penunjang</h4>
                  </div> */}
                                {/* <div className={styles.mainDetailDataImage}>
                    <div className={styles.fotoDetailCContainer}>
                      <div className={styles.imageBoxProfile}>
                        <Image src={detail.photo_selfie_ktp} alt="nama" className={styles.imageItemProfile} />
                      </div>
                      <h2 className={styles.fotoDetailInfo}>Selfie KTP</h2>
                    </div>
                    <div className={styles.fotoDetailCContainer}>
                      <div className={styles.imageBoxProfile}>
                        <Image src={detail.photo_ktp} alt="nama" className={styles.imageItemProfile} />
                      </div>
                      <h2 className={styles.fotoDetailInfo}>KTP</h2>
                    </div>
                    <div className={styles.fotoDetailCContainer}>
                      <div className={styles.imageBoxProfile}>
                        <Image src={detail.photo_sim} alt="sim" className={styles.imageItemProfile} />
                      </div>
                      <h2 className={styles.fotoDetailInfo}>SIM</h2>
                    </div>
                    <div className={styles.fotoDetailCContainer}>
                      <div className={styles.imageBoxProfile}>
                        <Image src={detail.photo_vehicle} alt="kendaraan" className={styles.imageItemProfile} />
                      </div>
                      <h2 className={styles.fotoDetailInfo}>Kendaraan</h2>
                    </div>
                  </div> */}
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default DetailAdmin;

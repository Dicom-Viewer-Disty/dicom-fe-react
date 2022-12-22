import React, { useState, useEffect } from "react";
import axios from "axios";
//dependency component
import { Link, useLocation } from "react-router-dom";
//my own component
import styles from "./Admin.module.css";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
//framework component
import { Typography, Breadcrumbs } from "@mui/material";
import { Skeleton, Space, Table, Tag, Button, Input, Modal } from "antd";
import { AiFillEye, AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BASE_API_URL } from "../../../helper/url"
import { ToastContainer, toast } from 'react-toastify';
const { Search } = Input;
function Admin() {
    const [data, setData] = useState();
    const [dataForSearch, setDataForSearch] = useState();
    const [dataDoctor, setDataDoctor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputSearch, setInputSearch] = useState("");
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        // get doctor
        var config = {
            method: "get",
            url: `${BASE_API_URL}/user`,
        };

        axios(config)
            .then(function (response) {
                var dataTemp = [];
                var dataFind = response.data.filter((e) => e.roleId === 1);
                dataFind.map((item) => {
                    dataTemp = [...dataTemp, { userId: item.id, key: item.id, name: item.name, gender: item.gender, phoneNumber: item.phoneNumber, tags: ["Admin"] }]
                })
                setData(dataTemp);
                setDataForSearch(dataTemp)
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
        // end doctor
    }, []);

    // delete doctor
    const deleteDoctor = (val) => {
        var config = {
            method: 'delete',
            url: `${BASE_API_URL}/user/${val}`,
        };

        axios(config)
            .then(function (response) {
                toast.success('Menghapus Admin Berhasil', {
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
                toast.error('Menghapus Admin Gagal', {
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

    // table init
    const columns2 = [

        {
            title: "Nama",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "No Telepon",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? "geekblue" : "green";
                        if (tag === "loser") {
                            color = "volcano";
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/detail-admin/${record.key}`}>
                        <AiFillEye className={styles.iconActionView} />
                    </Link>
                    <Link to={`/admin/edit-admin/${record.key}`}>
                        <AiFillEdit className={styles.iconActionEdit} />
                    </Link>
                    <button onClick={() => deleteDoctor(record.userId)}>
                        <AiFillDelete className={styles.iconActionDelete} />
                    </button>
                </Space>
            ),
        },
    ];


    const handleInput = (e) => {
        setInputSearch(e.target.value);
        var dataSearch = dataForSearch.filter((item) => {
            return (
                item
                    .name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            )
        });
        setData(dataSearch)
        if (e.target.value === "") {
            setData(dataForSearch)
        }
    }

    return (
        <DashboardLayout>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {loading ? (
                <Skeleton />
            ) : (
                <div className={styles.wrapper}>
                    <div className={styles.topWrapper}>
                        <h2 className={styles.pageTitle}>Pengguna</h2>
                        <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
                            <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
                                Home
                            </Link>
                            <Typography className={styles.breadUnactive}>Admin</Typography>
                        </Breadcrumbs>
                    </div>
                    <div className={styles.UserListContent}>
                        <div className={styles.titleListUser}>
                            <div className={styles.titleText}>
                                <h3 className={styles.titleTextMain}>Daftar Admin</h3>
                                <p className={styles.titleDesc}>List daftar Admin yang terdaftar dalam aplikasi dicom viewer</p>
                            </div>
                            <Link to="/admin/tambah-admin" className={styles.btnAddUser}>
                                Tambah Admin
                            </Link>
                        </div>
                    </div>

                    <div className={styles.statistikContainer}>
                        <div className={styles.topInfo}>
                            <div className={styles.filterBox}>
                                <div className={styles.searchContainer}>
                                    <Input placeholder="cari berdasar nama" onChange={handleInput} style={{ width: 400 }} />
                                    <button className={styles.searchBtn} onClick={handleInput} >
                                        Cari
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.tableContainerDoctor}>
                        <Table columns={columns2} dataSource={data} />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Admin;

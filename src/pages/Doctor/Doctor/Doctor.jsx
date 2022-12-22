import React, { useState, useEffect } from "react";
import axios from "axios";
//dependency component
import { Link, useLocation } from "react-router-dom";
//my own component
import styles from "./Doctor.module.css";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
//framework component
import { Typography, Breadcrumbs } from "@mui/material";
import { Skeleton, Space, Table, Tag, Button, Modal, Input } from "antd";
import { AiFillEye, AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BASE_API_URL } from "../../../helper/url"
import { ToastContainer, toast } from 'react-toastify';
function Doctor() {
  const [dataDoctor, setDataDoctor] = useState([]);
  const [dataForSearch, setDataForSearch] = useState();
  const [inputSearch, setInputSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      url: `${BASE_API_URL}/doctor`,
    };

    axios(config)
      .then(function (response) {
        var dataDoctorTemp = [];
        response.data.map((item) => {
          dataDoctorTemp = [...dataDoctorTemp, { userId: item.user.id, key: item.id, name: item.user.name, strNumber: item.strNumber, gender: item.user.gender, phoneNumber: item.user.phoneNumber, tags: ["Dokter"] }];
        });
        setDataDoctor(dataDoctorTemp.reverse());
        setDataForSearch(dataDoctorTemp.reverse())
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
        toast.success('Menghapus Dokter Berhasil', {
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
        toast.error('Menghapus Dokter Gagal', {
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
      title: "No STR",
      dataIndex: "strNumber",
      key: "strNumber",
      render: (text) => <Link>{text}</Link>,
    },
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
          <Link to={`/dokter/detail-dokter/${record.key}`}>
            <AiFillEye className={styles.iconActionView} />
          </Link>
          <Link to={`/dokter/edit-dokter/${record.key}`}>
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
    setDataDoctor(dataSearch)
    if (e.target.value === "") {
      setDataDoctor(dataForSearch)
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
              <Typography className={styles.breadUnactive}>Dokter</Typography>
            </Breadcrumbs>
          </div>
          <div className={styles.UserListContent}>
            <div className={styles.titleListUser}>
              <div className={styles.titleText}>
                <h3 className={styles.titleTextMain}>Daftar Dokter</h3>
                <p className={styles.titleDesc}>List daftar dokter yang terdaftar dalam aplikasi dicom viewer</p>
              </div>
              <Link to="/dokter/tambah-dokter" className={styles.btnAddUser}>
                Tambah Dokter
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
            <Table columns={columns2} dataSource={dataDoctor} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Doctor;

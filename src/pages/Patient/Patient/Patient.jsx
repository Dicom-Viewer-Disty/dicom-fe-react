import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { logout } from "../../../utils/auth";
import { Link } from "react-router-dom";
import styles from "./Patient.module.css";
import { Input } from "antd";
import { BASE_API_URL } from "../../../helper/url";
import { AiFillEye, AiFillDelete, AiFillEdit } from "react-icons/ai";
import { message, Skeleton, Tooltip, Select, Space, Table, Tag } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import { Typography, Breadcrumbs } from "@mui/material";

function Patient() {
  //state
  const [dataForSearch, setDataForSearch] = useState();
  const [inputSearch, setInputSearch] = useState("");
  const history = useHistory();
  const [dataPatient, setDataPatient] = useState([]);
  const [loading, setLoading] = useState(false);

  //get all data
  useEffect(() => {
    // get patient
    var config = {
      method: "get",
      url: `${BASE_API_URL}/patient`,
    };

    axios(config)
      .then(function (response) {
        var newDataTemp = [];
        response.data.map((item) => {
          newDataTemp = [...newDataTemp, { key: item.id, name: item.name, medicNumber: item.medicalRecordNumber, gender: item.gender, phoneNumber: item.phoneNumber, tags: ["Pasien"] }];
        });
        setDataPatient(newDataTemp.reverse());
        setDataForSearch(newDataTemp.reverse())
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          logout();
          message.error("Sesi telah habis, silahkan login kembali");
          history.replace("/");
        }
        setLoading(false);
      });
  }, []);


  const deletePasien = (val) => {
    var config = {
      method: 'delete',
      url: `${BASE_API_URL}/patient/${val}`,
    };

    axios(config)
      .then(function (response) {
        toast.success('Menghapus Pasien Berhasil', {
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
        toast.error('Menghapus Pasien Gagal', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log(error);
      });
  }

  // table
  const columns = [
    {
      title: "No Medis",
      dataIndex: "medicNumber",
      key: "medicNumber",
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
          <Link to={`/pasien/detail-pasien/${record.key}`}>
            <AiFillEye className={styles.iconActionView} />
          </Link>
          <Link to={`/pasien/edit-pasien/${record.key}`}>
            <AiFillEdit className={styles.iconActionEdit} />
          </Link>
          <button onClick={() => deletePasien(record.key)}>
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
    setDataPatient(dataSearch)
    if (e.target.value === "") {
      setDataPatient(dataForSearch)
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
      <div className={styles.wrapper}>
        <div className={styles.topWrapper}>
          <h2 className={styles.pageTitle}>Pasien</h2>
          <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
            <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
              Home
            </Link>
            <Typography className={styles.breadUnactive}>Pasien</Typography>
          </Breadcrumbs>
        </div>
        <div className={styles.UserListContent}>
          <div className={styles.titleListUser}>
            <div className={styles.titleText}>
              <h3 className={styles.titleTextMain}>Daftar Pasien</h3>
              <p className={styles.titleDesc}>List daftar pasien yang terdaftar dalam aplikasi dicom viewer</p>
            </div>
            <Link to="/pasien/tambah-pasien" className={styles.btnAddUser}>
              Tambah Pasien
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
        <div className={styles.UserListContent}>
          {/* <div className={styles.statistikContainer}>
            <div className={styles.topInfo}>
              <div className={styles.filterBox}>
                <div className={styles.searchContainer}>
                  <Input placeholder="cari berdasar nama" style={{ width: 400 }} />
                  <button className={styles.searchBtn}>Cari</button>
                </div>
              </div>
            </div>
          </div> */}

          {loading ? (
            <Skeleton />
          ) : (
            <div className={styles.tableContainerDoctor}>
              <Table columns={columns} dataSource={dataPatient} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Patient;

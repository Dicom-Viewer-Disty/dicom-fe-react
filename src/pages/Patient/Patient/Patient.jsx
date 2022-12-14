import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { logout } from "../../../utils/auth";
import { Link } from "react-router-dom";
import styles from "./Patient.module.css";
import { Input } from "antd";
import { message, Skeleton, Tooltip, Select, Space, Table, Tag } from "antd";

import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
import { Typography, Breadcrumbs } from "@mui/material";

function Patient() {
  //state
  const history = useHistory();
  const [dataPatient, setDataPatient] = useState([]);
  const [loading, setLoading] = useState(false);

  //get all data
  useEffect(() => {
    // get patient
    var config = {
      method: "get",
      url: "http://localhost:3000/api/v1/patient",
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        var newDataTemp = [];
        response.data.slice(0, 5).map((item) => {
          newDataTemp = [...newDataTemp, { key: item.id, name: item.name, medicNumber: item.medicalRecordNumber, gender: item.gender, phoneNumber: item.phoneNumber, tags: ["Pasien"] }];
          console.log(item.name);
        });
        console.log(newDataTemp);
        setDataPatient(newDataTemp);
      })
      .catch(function (error) {
        console.log(error.response.status);
        if (error.response.status === 401) {
          logout();
          message.error("Sesi telah habis, silahkan login kembali");
          history.replace("/");
        }
        setLoading(false);
      });
  }, []);

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
          <Link to={`/pasien/detail-pasien/${record.key}`}>Lihat {record.key}</Link>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
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

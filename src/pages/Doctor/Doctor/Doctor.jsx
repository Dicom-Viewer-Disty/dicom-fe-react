import React, { useState, useEffect } from "react";
import axios from "axios";
//dependency component
import { Link, useLocation } from "react-router-dom";
//my own component
import styles from "./Doctor.module.css";
import DashboardLayout from "../../../layouts/dashboard-layout/DashboardLayout";
//framework component
import { Typography, Breadcrumbs } from "@mui/material";
import { Skeleton, Space, Table, Tag } from "antd";

function Doctor() {
  const [dataDoctor, setDataDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // get doctor
    var config = {
      method: "get",
      url: "http://localhost:3000/api/v1/doctor",
    };

    axios(config)
      .then(function (response) {
        var dataDoctorTemp = [];
        response.data.slice(0, 5).map((item) => {
          dataDoctorTemp = [...dataDoctorTemp, { key: item.id, name: item.user.name, strNumber: item.strNumber, gender: item.user.gender, phoneNumber: item.user.phoneNumber, tags: ["Dokter"] }];
          console.log(item.name);
        });
        setDataDoctor(dataDoctorTemp);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
    // end doctor
  }, []);

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
          <Link to={`/dokter/detail-dokter/${record.key}`}>Lihat {record.key}</Link>
        </Space>
      ),
    },
  ];
  return (
    <DashboardLayout>
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
              <Typography className={styles.breadUnactive}>Pengguna</Typography>
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
          <div className={styles.tableContainerDoctor}>
            <Table columns={columns2} dataSource={dataDoctor} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Doctor;

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { logout } from "../../utils/auth";
import { message, Skeleton, Tooltip, Select, Space, Table, Tag } from "antd";
import { BASE_API_URL } from "../../helper/url";
//dependency component
import { Link } from "react-router-dom";
//my own component
import styles from "./Dashboard.module.css";
import DashboardLayout from "../../layouts/dashboard-layout/DashboardLayout";
import { CarouselDashboard1, CarouselDashboard2 } from "../../assets/assets";
//framework component
import { Carousel } from "react-bootstrap";
import { Typography, Breadcrumbs } from "@mui/material";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { DatasetController } from "chart.js";

const { Option } = Select;

function Dashboard() {
  //state
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [totalPatient, setTotalPatient] = useState(0);
  const [totalDoctor, setTotalDoctor] = useState(0);
  const [newData, setNewdata] = useState([]);
  const [dataPatient, setDataPatient] = useState([]);
  const [dataDoctor, setDataDoctor] = useState([]);
  const [data, setData] = useState()
  //get all data
  useEffect(() => {
    // get patient
    var config = {
      method: "get",
      url: `${BASE_API_URL}/patient`,
    };

    axios(config)
      .then(function (response) {

        setTotalPatient(response.data.length);

        var newDataTemp = [];
        response.data.slice(0, 5).map((item) => {
          newDataTemp = [...newDataTemp, { key: item.id, name: item.name, medicNumber: item.medicalRecordNumber, gender: item.gender, phoneNumber: item.phoneNumber, tags: ["Pasien"] }];

        });
        setDataPatient(newDataTemp);

        // get doctor

        var config = {
          method: "get",
          url: `${BASE_API_URL}/doctor`,
        };

        axios(config)
          .then(function (response) {
            setTotalDoctor(response.data.length);
            var dataDoctorTemp = [];
            response.data.slice(0, 5).map((item) => {
              dataDoctorTemp = [...dataDoctorTemp, { key: item.id, name: item.user.name, strNumber: item.strNumber, gender: item.user.gender, phoneNumber: item.user.phoneNumber, tags: ["Dokter"] }];
            });
            setDataDoctor(dataDoctorTemp);
            var config = {
              method: 'get',
              url: `${BASE_API_URL}/me`,
            };

            axios(config)
              .then(function (response) {
                setData(response.data)
                setLoading(false);
              })
              .catch(function (error) {
                setLoading(false);
                if (error.response.status === 401) {
                  logout();
                  message.error("Sesi telah habis, silahkan login kembali");
                  history.replace("/");
                }
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
          });
        // end doctor
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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Link>Lihat</Link>
    //     </Space>
    //   ),
    // },
  ];

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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Link>Lihat</Link>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <DashboardLayout>
      {loading ? (
        <Skeleton />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.topWrapper}>
            <h2 className={styles.pageTitle}>Dashboard</h2>
            <Breadcrumbs aria-label="breadcrumb" className={styles.breadcumbs}>
              <Link className={styles.breadActive} underline="hover" color="inherit" to="/dashboard">
                Home
              </Link>
              <Typography className={styles.breadUnactive}>Dashbord</Typography>
            </Breadcrumbs>
          </div>
          <div className={styles.main}>
            <Carousel className={styles.carouselWrapper}>
              <Carousel.Item interval={2000} className={styles.carouselItem}>
                <img className={styles.imageCarousel} src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" alt="First slide" />
              </Carousel.Item>
              <Carousel.Item interval={1000} className={styles.carouselItem}>
                <img className={styles.imageCarousel} src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80" alt="Second slide" />
              </Carousel.Item>
            </Carousel>
            {/* Kriteria Keuangan */}
            <div className={styles.dashboardKeuanganContainer}>
              <h3 className={styles.dashboardKeuanganTitle}>Statistik</h3>
              <p className={styles.dashboardKeuanganDesc}>Rutin pantau perkembangan aplikasi anda</p>
              <div className={styles.divider}></div>
              <div className={styles.dashboardKeuanganBoxs}>
                {/* card */}
                <div className={styles.dashboardKeuanganCard}>
                  <div className={styles.cardColor}></div>
                  <div className={styles.dashboardKeuanganCardTop}>
                    <h3 className={styles.dashboardKeuanganCardTopTitle}>Total Dokter</h3>
                    <Tooltip placement="bottom" title="Total dokter yang dimiliki oleh anda">
                      <AiOutlineQuestionCircle className={styles.excIcon} />
                    </Tooltip>
                  </div>
                  <p className={styles.dashboardKeuanganCardValue}>
                    <span className={styles.dashboardKeuanganCardValueSpan}>{totalDoctor}</span>
                  </p>
                </div>
                <div className={styles.dashboardKeuanganCard}>
                  <div className={styles.cardColor}></div>
                  <div className={styles.dashboardKeuanganCardTop}>
                    <h3 className={styles.dashboardKeuanganCardTopTitle}>Total Pasien</h3>
                    <Tooltip placement="bottom" title="Total pasien yang dimiliki oleh anda">
                      <AiOutlineQuestionCircle className={styles.excIcon} />
                    </Tooltip>
                  </div>
                  <p className={styles.dashboardKeuanganCardValue}>
                    <span className={styles.dashboardKeuanganCardValueSpan}>{totalPatient}</span>
                  </p>
                </div>
                {/* card */}
              </div>
            </div>

            {/* kriteria berdasarkan kota */}
            <div className={styles.dashboardCityContainer}></div>

            <div className={styles.tableDashboardContainer}>
              {
                data.role.role === "admin" &&
                <div className={styles.tableDashboardCard}>
                  <h3 className={styles.dashboardTableTitle}>Dokter Terbaru</h3>
                  <Table columns={columns2} dataSource={dataDoctor} />
                </div>
              }
              <div className={styles.tableDashboardCard}>
                <h3 className={styles.dashboardTableTitle}>Pasien Terbaru</h3>
                <Table columns={columns} dataSource={dataPatient} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;

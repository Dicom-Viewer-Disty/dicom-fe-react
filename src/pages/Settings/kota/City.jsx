import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styles from "./City.module.css";
import axios from "axios";
import { logout } from "../../../utils/auth";
import { BASE_API_URL } from "../../../constant/url";
import { Modal, message, Skeleton, Button } from "antd";
import { MdOutlineLocationOn } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;
function City() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [zeroResult, setZeroResult] = useState(false);
  const [dataResult, setDataResult] = useState([]);
  const history = useHistory();

  useEffect(() => {
    var config = {
      method: "get",
      url: `${BASE_API_URL}/api/v1/admin/admin-list-city?register=registered`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")} `,
      },
    };

    axios(config)
      .then(function (response) {
        setLoading(false);
        setData(response.data.data);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data === undefined) {
          message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
        } else if (error.response.status === 401) {
          logout();
          message.error("Sesi telah berakhir, silahkan login kembali!");
          history.push("/");
        } else {
          message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
        }
      });
  }, []);

  const btnSearch = () => {
    setLoadingSearch(true);
    var config2 = {
      method: "get",
      url: `${BASE_API_URL}/api/v1/admin/admin-list-city?kota=${searchText}`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")} `,
      },
    };

    axios(config2)
      .then(function (response) {
        setLoadingSearch(false);
        if (response.data.data.length === 0) {
          setZeroResult(true);
        } else {
          setZeroResult(false);
          setDataResult(response.data.data);
        }
      })
      .catch(function (error) {
        setLoadingSearch(false);
        if (error.response.data === undefined) {
          message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
        } else if (error.response.status === 401) {
          logout();
          message.error("Sesi telah berakhir, silahkan login kembali!");
          history.push("/");
        } else {
          message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
        }
      });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const showConfirm = (value) => {
    confirm({
      title: "Apakah anda yakin ingin menambahkan kota ?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const dataBody = JSON.stringify({
          register: "registered",
        });
        var config3 = {
          method: "post",
          url: `${BASE_API_URL}/api/v1/admin/admin-list-city/${value}`,
          headers: {
            Authorization: `${localStorage.getItem("TOKEN")} `,
            "Content-Type": "application/json",
          },
          data: dataBody,
        };
        axios(config3)
          .then(function (response) {
            setVisible(false);
            message.success("Menambahkan kota berhasil");
            window.location.reload();
          })
          .catch(function (error) {
            message.error("Menambahkan kota gagal");
            if (error.response.data === undefined) {
              message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
            } else if (error.response.status === 401) {
              logout();
              message.error("Sesi telah berakhir, silahkan login kembali!");
              history.push("/");
            } else {
              message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
            }
          });
      },

      onCancel() {},
    });
  };

  const showDeleteConfirm = (value) => {
    confirm({
      title: "Apakah anda yakin ingin menghapus kota ?",
      icon: <ExclamationCircleOutlined />,
      okText: "Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk() {
        const dataBody = JSON.stringify({
          register: "unregistered",
        });
        var config4 = {
          method: "post",
          url: `${BASE_API_URL}/api/v1/admin/admin-list-city/${value}`,
          headers: {
            Authorization: `${localStorage.getItem("TOKEN")} `,
            "Content-Type": "application/json",
          },
          data: dataBody,
        };
        axios(config4)
          .then(function (response) {
            setVisible(false);
            message.success("Menghapus kota berhasil");
            window.location.reload();
          })
          .catch(function (error) {
            message.error("menghapus kota gagal");
            if (error.response.data === undefined) {
              message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
            } else if (error.response.status === 401) {
              logout();
              message.error("Sesi telah berakhir, silahkan login kembali!");
              history.push("/");
            } else {
              message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
            }
          });
      },
      onCancel() {},
    });
  };

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className={styles.top}>
            <div className={styles.title}>
              <h3 className={styles.titleText}>List Kota Terdaftar</h3>
              <p className={styles.titleDesc}>List kota terdaftar yang didukung oleh bantubantuin</p>
            </div>
            {/* <button onClick={showModal} className={styles.addCity}>
              Tambah Kota
            </button> */}
          </div>
          <div className={styles.listCity}>
            {data.map((item) => (
              <div className={styles.city}>
                <MdOutlineLocationOn className={styles.LocIcon} />
                <div className={styles.cityText}>
                  <div className={styles.cityTextLeft}>
                    <p className={styles.cityTitle}>Id</p>
                    <p className={styles.cityTitle}>Nama Kota</p>
                    <p className={styles.cityTitle}>Kabupaten Kota</p>
                    <p className={styles.cityTitle}>Status</p>
                  </div>
                  <div className={styles.cityTextRight}>
                    <p className={styles.cityTitleCity}>{item.id}</p>
                    <p className={styles.cityTitleCity}>{item.ibukota}</p>
                    <p className={styles.cityTitle}>{item.kabupaten_ibukota}</p>
                    <p className={styles.cityTitleStatus}>Aktif</p>
                  </div>
                </div>
                {item.ibukota !== "Balikpapan" && item.ibukota !== "Samarinda" && (
                  <button onClick={() => showDeleteConfirm(item.id)} className={styles.deleteCity}>
                    Hapus
                  </button>
                )}
              </div>
            ))}
            <button onClick={showModal} className={styles.cardAddCity}>
              <BiPlus className={styles.addCityIcon} />
              <div className={styles.addCityText}>Tambah Kota</div>
            </button>
          </div>
          {/* modal */}
          <Modal
            visible={visible}
            title="Tambah Kota Baru"
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Kembali
              </Button>,
            ]}
          >
            <h5 className={styles.searchTitle}>Cari Berdasarkan Nama Kota</h5>
            <div className={styles.formGroup}>
              <input type="text" onChange={handleSearch} placeholder="nama kota" className={styles.inputSearch} />
              <button onClick={btnSearch} className={styles.btnSearch}>
                Cari Kota
              </button>
            </div>
            {loadingSearch ? (
              <div className={styles.zeroResult}>Loading...</div>
            ) : (
              <>
                {zeroResult === true ? (
                  <div className={styles.zeroResult}>Kota tidak ditemukan/telah aktif</div>
                ) : (
                  <div className={styles.resultList}>
                    {dataResult.map((result) => (
                      <div key={result.id} className={styles.result}>
                        <div className={styles.textResult}>
                          <p className={styles.cityResult}>{result.ibukota}</p>
                          <p className={styles.regionResult}>{result.kabupaten_ibukota}</p>
                        </div>
                        <button onClick={() => showConfirm(result.id)} className={styles.btnAddCity}>
                          Tambah
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}

export default City;

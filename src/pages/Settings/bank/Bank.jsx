import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { logout } from "../../../utils/auth";
import { BASE_API_URL } from "../../../constant/url";
import styles from "./Bank.module.css";
import { BiPlus } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { Button, Modal, message, Skeleton, Input, Select } from "antd";
const { Option } = Select;
function Bank(props) {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [confirmLoading2, setConfirmLoading2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listBank, setListBank] = useState([]);
  const [bank, setBank] = useState({
    id_bank: null,
    account_number: null,
    register: "registered",
    name_account: "",
  });
  const [detailBank, setDetailBank] = useState({
    account_number: "",
    code: "",
    id: null,
    name: "",
    registered: "",
  });
  const location = useLocation();
  const history = useHistory();

  //handle change
  const handleChange = (event) => {
    setBank({
      ...bank,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeBank = (event) => {
    setBank({
      ...bank,
      ["id_bank"]: event,
    });
  };

  useEffect(() => {
    var config = {
      method: "get",
      url: `${BASE_API_URL}/api/v1/admin/admin-list-bank?register=registered`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")} `,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response);
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

    var config2 = {
      method: "get",
      url: `${BASE_API_URL}/api/v1/admin/admin-list-bank?register=unregistered`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")} `,
      },
    };
    axios(config2)
      .then(function (response) {
        setLoading(false);
        setListBank(response.data.data);
      })
      .catch(function (error) {
        setLoading(false);
        // console.log(error);
      });
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const showModal2 = (item) => {
    setVisible2(true);
    setDetailBank({
      account_number: item.account_number,
      code: item.code,
      id: item.id,
      name: item.name,
      registered: item.registered,
    });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (bank.account_number !== "" && bank.register !== "" && bank.name_account !== "") {
      const dataBody = JSON.stringify({
        account_number: bank.account_number,
        register: bank.register,
        name_account: bank.name_account,
      });
      var config3 = {
        method: "post",
        url: `${BASE_API_URL}/api/v1/admin/admin-list-bank/${bank.id_bank}`,
        headers: {
          Authorization: `${localStorage.getItem("TOKEN")} `,
          "Content-Type": "application/json",
        },
        data: dataBody,
      };
      axios(config3)
        .then(function (response) {
          setVisible(false);
          setConfirmLoading(false);
          message.success("Menambahkan akun bank berhasil");
          window.location.reload();
        })
        .catch(function (error) {
          setVisible(false);
          setConfirmLoading(false);
          message.error("Menambahkan akun bank gagal");
        });
    } else {
      setConfirmLoading(false);
      message.error("semua data wajib!");
    }
  };

  const handleOk2 = () => {
    setConfirmLoading2(true);
    setConfirmLoading2(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCancel2 = () => {
    setVisible2(false);
  };

  const DeletBank = () => {
    setConfirmLoading(true);
    const dataBody = JSON.stringify({
      account_number: detailBank.account_number,
      register: "unregistered",
    });
    var config3 = {
      method: "post",
      url: `${BASE_API_URL}/api/v1/admin/admin-list-bank/${detailBank.id}`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")} `,
        "Content-Type": "application/json",
      },
      data: dataBody,
    };
    axios(config3)
      .then(function (response) {
        setVisible(false);
        setConfirmLoading(false);
        message.success("Menghapus akun bank berhasil");
        window.location.reload();
      })
      .catch(function (error) {
        setVisible(false);
        setConfirmLoading(false);
        message.error("Menghapus akun bank gagal");
      });
  };
  return (
    <div className={styles.wrapper}>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div className={styles.titleContainer}>
            <h3 className={styles.titleText}>Rekening Bank</h3>
            <p className={styles.titleDesc}>List rekening bank bantubantuin</p>
          </div>
          <div className={styles.main}>
            <div className={styles.bankCards}>
              <button onClick={showModal} className={styles.bankCardAdd}>
                <BiPlus className={styles.plusIcon} />
                <h4 className={styles.plusText}>Tambah Rekening Bank</h4>
              </button>
              {data.map((item) => (
                <div onClick={() => showModal2(item)} key={item.id} className={styles.bankCard}>
                  <div className={styles.bankTop}>
                    <h3 className={styles.bankName}>
                      {item.name} ({item.code})
                    </h3>
                  </div>
                  <div className={styles.bankBottom}>
                    <div className={styles.bankDetailTop}>
                      <FaCheckCircle className={styles.iconCheck} />
                      <div className={styles.checkText}>Telah ditambahkan</div>
                    </div>
                    <div className={styles.bankNumber}>**** {item.account_number.slice(-4)}</div>
                    <div className={styles.bankUsername}>Bantubantuin Indonesia Jaya</div>
                  </div>
                </div>
              ))}
            </div>
            {/* modal */}
            <Modal title="Tambah Rekening Baru" visible={visible} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel} okText="Simpan" cancelText="Batal">
              <div className={styles.formGroup}>
                <div className={styles.formField}>
                  <label htmlFor="gender" className={styles.label}>
                    Bank
                  </label>
                  <Select required defaultValue="" className={styles.input} onChange={handleChangeBank}>
                    {listBank.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name} ({item.code})
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className={styles.formField}>
                  <label htmlFor="account_number" className={styles.label}>
                    Nomor Rekening
                  </label>
                  <Input required type="number" className={styles.input} name="account_number" value={bank.account_number} onChange={handleChange} />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="name_account" className={styles.label}>
                    Nama pemilik rekening
                  </label>
                  <Input required type="text" className={styles.input} name="name_account" value={bank.name_account} onChange={handleChange} />
                </div>
              </div>
            </Modal>
            {/* modal */}
            <Modal title="Rekening" visible={visible2} onOk={handleOk2} confirmLoading={confirmLoading2} onCancel={handleCancel2} okText="OK" cancelText="Kembali">
              <div className={styles.formGroup}>
                <div className={styles.formField}>
                  <label htmlFor="account_number" className={styles.label}>
                    Nama Bank
                  </label>
                  <Input required type="text" className={styles.input} name="name" value={detailBank.name} />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="account_number" className={styles.label}>
                    Nomor Rekening
                  </label>
                  <Input required type="number" className={styles.input} name="account_number" value={detailBank.account_number} />
                </div>
                <div className={styles.formField}>
                  <button onClick={DeletBank} className={styles.btnDelBank}>
                    Hapus rekening bank
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}

export default Bank;

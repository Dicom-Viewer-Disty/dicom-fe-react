import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { BASE_API_URL } from "../../../../constant/url";
import { logout } from "../../../../utils/auth";
import styles from "./AllNotifications.module.css";
import { Timeline, message, Skeleton, Modal, Button, Space, Input, Tooltip } from "antd";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
function AllNotifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagesSum, setPagesSum] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [zeroData, setZeroData] = useState(false);
  const history = useHistory();

  const handlePage = (event) => {
    setPageNumber(parseInt(event.target.textContent));
    var config = {
      method: "get",
      url: `${BASE_API_URL}/api/v1/notification/get-notification?page=${pageNumber}`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")}`,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response);
        setData(response.data.data.data);
        setPagesSum(response.data.data.last_page);
        setLoading(false);
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
  };

  useEffect(() => {
    var config = {
      method: "get",
      url: `${BASE_API_URL}/api/v1/notification/get-notification`,
      headers: {
        Authorization: `${localStorage.getItem("TOKEN")}`,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response);
        setData(response.data.data.data);
        setPagesSum(response.data.data.last_page);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data === undefined) {
          message.error(`Error 500: Ada masalah pada server, "masalah tidak diketahui"`);
        } else if (error.response.status === 401) {
          logout();
          message.error("Sesi telah berakhir, silahkan login kembali!");
          history.push("/");
        } else if (error.response.status === 404) {
          setZeroData(true);
        } else {
          message.error(`Error ${error.response.status}: Ada masalah pada server, "${error.response.data.message}"`, 3);
        }
      });
  }, []);
  return (
    <div className={styles.wrapper}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className={styles.notifContainer}>
          {data.map((item) => (
            <div key={item.id} className={styles.notifItem}>
              <div className={styles.iconBox}>
                <img src="https://cf.shopee.co.id/file/f6a41f587fb94f53a29285eebfb4b607_tn" alt="notif item" className={styles.iconItem} />
              </div>
              <div className={styles.textNotif}>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.body}>{item.body}</p>
                <p className={styles.date}>
                  {item.created_at.slice(8, 10)}-{item.created_at.slice(5, 7)}-{item.created_at.slice(0, 4)} {item.created_at.slice(11, 14)}
                  {item.created_at.slice(14, 17)}
                  {item.created_at.slice(17, 19)}
                </p>
              </div>
            </div>
          ))}
          {zeroData && <div className={styles.zeroData}>Belum ada notifikasi</div>}
          <div className={styles.paginationContainer}>
            <div className={styles.helperPag}></div>
            <Stack spacing={2}>
              <Pagination className={styles.pagination} defaultPage={pageNumber} count={pagesSum} shape="rounded" onClick={handlePage} />
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllNotifications;
